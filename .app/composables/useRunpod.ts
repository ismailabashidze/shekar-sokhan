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
	} = pollingOptions;

	let pollTimer: NodeJS.Timeout | null = null;

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
	 * Start polling for job completion
	 */
	const startPolling = (
		targetEndpointId: string,
		jobId: string,
		onStatusChange?: (status: RunPodStatus) => void,
	) => {
		if (pollTimer) {
			clearInterval(pollTimer);
		}

		isPolling.value = true;
		pollAttempts.value = 0;

		pollTimer = setInterval(async () => {
			if (pollAttempts.value >= maxPollAttempts) {
				stopPolling();
				error.value = "Job timed out";
				processing.value = false;
				return;
			}

			pollAttempts.value++;

			try {
				const status = await getJobStatus(jobId, targetEndpointId);
				currentJob.value = status;

				if (onStatusChange) {
					onStatusChange(status);
				}

				if (status.status === "COMPLETED" || status.status === "FAILED") {
					stopPolling();
					processing.value = false;
				}
			} catch (err: any) {
				console.error("Polling error:", err);
				if (pollAttempts.value >= maxPollAttempts) {
					error.value = "Failed to check job status";
					stopPolling();
					processing.value = false;
				}
			}
		}, pollInterval);
	};

	/**
	 * Stop polling
	 */
	const stopPolling = () => {
		if (pollTimer) {
			clearInterval(pollTimer);
			pollTimer = null;
		}
		isPolling.value = false;
		processing.value = false;
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
