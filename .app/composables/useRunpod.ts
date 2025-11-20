interface RunPodMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

interface RunPodOptions {
	endpointId?: string;
	input?: any;
	stream?: boolean;
	signal?: AbortSignal;
	timeout?: number;
}

interface RunPodStatus {
	id: string;
	status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
	output?: any;
	error?: string;
	delayTime?: number;
	executeTime?: number;
}

interface UseRunPodPollingOptions {
	pollInterval?: number;
	maxPollAttempts?: number;
	queuePollInterval?: number; // Interval when job is in queue (default: 15000ms = 15 seconds)
	queueMaxAttempts?: number; // Max attempts when job is in queue (default: 10)
}

const DEFAULT_TIMEOUT_MS = 30000;

export function useRunpod(pollingOptions: UseRunPodPollingOptions = {}) {
	// State
	const processing = ref(false);
	const error = ref<string | null>(null);
	const endpointId = ref<string>("");
	const isPolling = ref(false);
	const pollAttempts = ref(0);
	const currentJob = ref<RunPodStatus | null>(null);

	const {
		pollInterval = 2000,
		maxPollAttempts = 60, // 2 minutes with 2s intervals
		queuePollInterval = 15000, // 15 seconds when in queue
		queueMaxAttempts = 10, // 10 attempts = 2.5 minutes total
	} = pollingOptions;

	let pollTimer: NodeJS.Timeout | null = null;
	let queuePollAttempts = 0;
	let pollingStartTime: number | null = null;

	/**
	 * Run a job on RunPod with streaming support
	 */
	const runJob = async (
		input: any,
		options: RunPodOptions = {},
		onChunk?: (chunk: any) => void,
	): Promise<any> => {
		processing.value = true;
		error.value = null;

		const targetEndpointId = options.endpointId || endpointId.value;
		const shouldStream = options.stream !== false; // default to true

		if (!targetEndpointId) {
			const err = new Error(
				"Endpoint ID is required. Set it via options or endpointId ref.",
			);
			error.value = err.message;
			processing.value = false;
			throw err;
		}

		try {
			// For now, let's use a simple POST request approach
			const response = await $fetch("/api/runpod/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: {
					endpointId: targetEndpointId,
					input,
					stream: shouldStream,
				},
			});

			// If we got a streaming response back, handle it
			if (shouldStream && onChunk && typeof response === "object") {
				// For now, just call the onChunk with the response
				onChunk(response);
				return response;
			}

			return response;
		} catch (e: any) {
			error.value = e.message || "Request failed";
			throw e;
		} finally {
			processing.value = false;
		}
	};

	/**
	 * Get the status of a RunPod job
	 */
	const getJobStatus = async (
		jobId: string,
		targetEndpointId?: string,
	): Promise<RunPodStatus> => {
		try {
			const response = await $fetch<RunPodStatus>("/api/runpod/status", {
				method: "POST",
				body: {
					endpointId: targetEndpointId || endpointId.value,
					jobId,
				},
			});
			return response;
		} catch (e: any) {
			error.value = e.message || "Failed to get job status";
			throw e;
		}
	};

	/**
	 * Submit a job and start polling for completion
	 */
	const submitJobWithPolling = async (
		input: any,
		options: RunPodOptions = {},
		onStatusChange?: (status: RunPodStatus) => void,
	): Promise<RunPodStatus> => {
		try {
			processing.value = true;
			error.value = null;
			pollAttempts.value = 0;
			currentJob.value = null;

			const targetEndpointId = options.endpointId || endpointId.value;

			if (!targetEndpointId) {
				throw new Error("Endpoint ID is required");
			}

			// Submit the job
			const response = await $fetch("/api/runpod/chat", {
				method: "POST",
				body: {
					endpointId: targetEndpointId,
					input,
					stream: false,
				},
			});

			currentJob.value = response;

			if (onStatusChange) {
				onStatusChange(response);
			}

			// Extract the job ID from response
			const jobId = response.id;
			if (!jobId) {
				throw new Error("No job ID received from RunPod");
			}

			console.log("Job submitted with ID:", jobId);

			// If job is already completed or failed, return immediately
			if (response.status === "COMPLETED" || response.status === "FAILED") {
				return response;
			}

			// Start polling for IN_QUEUE or IN_PROGRESS jobs
			startPolling(targetEndpointId, jobId, onStatusChange);

			return response;
		} catch (e: any) {
			error.value = e.message || "Failed to submit job";
			processing.value = false;
			throw e;
		}
	};

	/**
	 * Get the appropriate polling interval based on elapsed time and job status
	 * Strategy:
	 * - If IN_QUEUE: Use queue interval (15 seconds)
	 * - If IN_PROGRESS:
	 *   - 0-5 seconds: Fast polling (1 second) for cold start scenarios
	 *   - 5-90 seconds: Medium polling (10 seconds) for normal processing
	 *   - After 90 seconds: Default interval (2 seconds) for long processing
	 */
	const getPollingInterval = (elapsedTimeMs: number, isInQueue: boolean): number => {
		// If in queue, always use queue interval
		if (isInQueue) {
			return queuePollInterval; // 15 seconds
		}

		// For IN_PROGRESS, use time-based intervals
		const elapsedSeconds = elapsedTimeMs / 1000;

		// Fast polling for first 5 seconds (cold start scenario - usually responds in ~1 second)
		if (elapsedSeconds <= 5) {
			return 1000; // 1 second - very fast for cold start
		}

		// Medium polling for 5-90 seconds (normal processing - average 1.5 minutes)
		if (elapsedSeconds <= 90) {
			return 10000; // 10 seconds - medium for normal processing
		}

		// Default polling after 90 seconds (long processing scenario)
		return pollInterval; // 2 seconds - default interval
	};

	/**
	 * Start polling for job completion with dynamic intervals based on status and elapsed time
	 */
	const startPolling = (
		targetEndpointId: string,
		jobId: string,
		onStatusChange?: (status: RunPodStatus) => void,
	) => {
		if (pollTimer) {
			clearTimeout(pollTimer);
		}

		isPolling.value = true;
		pollAttempts.value = 0;
		queuePollAttempts = 0;
		pollingStartTime = Date.now();

		const poll = async () => {
			try {
				const status = await getJobStatus(jobId, targetEndpointId);
				const previousStatus = currentJob.value?.status;
				currentJob.value = status;

				if (onStatusChange) {
					onStatusChange(status);
				}

				// Stop polling if job is completed or failed
				if (status.status === "COMPLETED" || status.status === "FAILED") {
					stopPolling();
					processing.value = false;
					return;
				}

				// Determine which counter to use based on current status
				const isInQueue = status.status === "IN_QUEUE";

				// If status changed from IN_QUEUE to something else, reset queue attempts
				if (previousStatus === "IN_QUEUE" && !isInQueue) {
					queuePollAttempts = 0;
					console.log("Job moved out of queue, switching to normal polling");
				}

				// Increment appropriate counter and check limits
				if (isInQueue) {
					queuePollAttempts++;
					if (queuePollAttempts >= queueMaxAttempts) {
						stopPolling();
						error.value = "Job timed out in queue";
						processing.value = false;
						return;
					}
				} else {
					pollAttempts.value++;
					if (pollAttempts.value >= maxPollAttempts) {
						stopPolling();
						error.value = "Job timed out";
						processing.value = false;
						return;
					}
				}

				// Calculate elapsed time and get appropriate interval
				const elapsedTime = pollingStartTime ? Date.now() - pollingStartTime : 0;
				const nextInterval = getPollingInterval(elapsedTime, isInQueue);
				
				pollTimer = setTimeout(poll, nextInterval);
			} catch (err: any) {
				console.error("Polling error:", err);
				const isInQueueNow = currentJob.value?.status === "IN_QUEUE";
				const maxAttemptsReached = isInQueueNow 
					? queuePollAttempts >= queueMaxAttempts
					: pollAttempts.value >= maxPollAttempts;
				
				if (maxAttemptsReached) {
					error.value = "Failed to check job status";
					stopPolling();
					processing.value = false;
				} else {
					// Calculate elapsed time for retry interval
					const elapsedTime = pollingStartTime ? Date.now() - pollingStartTime : 0;
					const nextInterval = getPollingInterval(elapsedTime, isInQueueNow);
					pollTimer = setTimeout(poll, nextInterval);
				}
			}
		};

		// Start first poll immediately
		poll();
	};

	/**
	 * Stop polling
	 */
	const stopPolling = () => {
		if (pollTimer) {
			clearTimeout(pollTimer);
			pollTimer = null;
		}
		isPolling.value = false;
		processing.value = false;
		queuePollAttempts = 0;
		pollingStartTime = null;
	};

	/**
	 * Reset all state
	 */
	const reset = () => {
		stopPolling();
		currentJob.value = null;
		processing.value = false;
		isPolling.value = false;
		error.value = null;
		pollAttempts.value = 0;
		queuePollAttempts = 0;
		pollingStartTime = null;
	};

	/**
	 * Simple chat interface for RunPod endpoints that expect message format
	 */
	const chat = async (
		messages: RunPodMessage[],
		options: RunPodOptions = {},
		onChunk?: (chunk: any) => void,
	): Promise<string> => {
		const input = {
			messages,
			...options.input,
		};

		let fullResponse = "";

		await runJob(input, options, (chunk) => {
			if (typeof chunk === "string") {
				fullResponse += chunk;
			} else {
				fullResponse += JSON.stringify(chunk);
			}

			if (onChunk) {
				onChunk(chunk);
			}
		});

		return fullResponse;
	};

	/**
	 * Health check for RunPod endpoint
	 */
	const healthCheck = async (targetEndpointId?: string): Promise<boolean> => {
		try {
			const testEndpointId = targetEndpointId || endpointId.value;
			if (!testEndpointId) {
				return false;
			}

			await runJob(
				{ test: true },
				{
					endpointId: testEndpointId,
					stream: false,
					timeout: 5000,
				},
			);

			return true;
		} catch {
			return false;
		}
	};

	// Cleanup on unmount
	onUnmounted(() => {
		stopPolling();
	});

	return {
		// State
		processing: readonly(processing),
		error: readonly(error),
		endpointId,
		isPolling: readonly(isPolling),
		pollAttempts: readonly(pollAttempts),
		currentJob: readonly(currentJob),

		// Computed
		isCompleted: computed(() => currentJob.value?.status === "COMPLETED"),
		isFailed: computed(() => currentJob.value?.status === "FAILED"),
		isPending: computed(
			() =>
				currentJob.value &&
				(currentJob.value.status === "IN_QUEUE" ||
					currentJob.value.status === "IN_PROGRESS"),
		),

		// Methods
		runJob,
		submitJobWithPolling,
		chat,
		getJobStatus,
		healthCheck,
		stopPolling,
		reset,
	};
}
