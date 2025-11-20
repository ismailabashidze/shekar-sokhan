<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4">RunPod Integration Test</h1>
      <p class="text-gray-600 mb-4">
        Test your RunPod.io integration with streaming support.
      </p>
    </div>

    <!-- Configuration Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Configuration</h2>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          RunPod Endpoint ID
        </label>
        <input
          v-model="endpointId"
          type="text"
          placeholder="e.g., your-endpoint-id"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Test Input (JSON)
        </label>
        <textarea
          v-model="testInput"
          rows="6"
          placeholder='{"prompt": "Hello, how are you?"}'
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      <div class="flex items-center space-x-4">
        <label class="flex items-center">
          <input
            v-model="useStreaming"
            type="checkbox"
            class="mr-2"
          />
          <span class="text-sm">Enable Streaming (Experimental)</span>
        </label>

        <button
          @click="healthCheck"
          :disabled="!endpointId || healthChecking"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ healthChecking ? 'Checking...' : 'Health Check' }}
        </button>
      </div>
    </div>

    <!-- Test Controls -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Test Controls</h2>
      
      <div class="flex space-x-4">
        <button
          @click="runTest"
          :disabled="!endpointId || !testInput || processing"
          class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ processing ? 'Processing...' : 'Run Test' }}
        </button>

        <button
          @click="clearResults"
          class="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Clear Results
        </button>

        <button
          @click="abortTest"
          :disabled="!processing && !isPolling"
          class="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isPolling ? 'Stop Polling' : 'Abort' }}
        </button>

        <button
          v-if="isPolling"
          @click="stopPolling"
          class="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Stop Polling
        </button>
      </div>

      <div v-if="error" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        <strong>Error:</strong> {{ error }}
      </div>

      <div v-if="healthStatus !== null" class="mt-4 p-4 rounded-md" :class="healthStatus ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'">
        <strong>Health Status:</strong> {{ healthStatus ? 'Endpoint is healthy' : 'Endpoint is not responding' }}
      </div>
    </div>

    <!-- Results Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Results</h2>
      
      <div v-if="streamingOutput.length > 0" class="mb-4">
        <h3 class="text-lg font-medium mb-2">Streaming Output:</h3>
        <div class="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-96 overflow-y-auto">
          <div v-for="(chunk, index) in streamingOutput" :key="index" class="mb-2 p-2 bg-white rounded border border-gray-100">
            <span class="text-xs text-gray-500">Chunk {{ index + 1 }}:</span>
            <pre class="text-sm mt-1 whitespace-pre-wrap">{{ JSON.stringify(chunk, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <div v-if="finalResult" class="mb-4">
        <h3 class="text-lg font-medium mb-2">Final Result:</h3>
        <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
          <pre class="text-sm whitespace-pre-wrap">{{ JSON.stringify(finalResult, null, 2) }}</pre>
        </div>
      </div>

      <!-- Job Status -->
      <div v-if="currentJob" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 class="text-lg font-medium mb-2">Job Status</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Job ID:</strong> {{ currentJob.id }}
          </div>
          <div>
            <strong>Status:</strong> 
            <span :class="{
              'text-green-600': isCompleted,
              'text-red-600': isFailed,
              'text-yellow-600': isPending,
              'text-blue-600': isPolling
            }">
              {{ currentJob.status }}
            </span>
          </div>
          <div v-if="pollAttempts > 0">
            <strong>Poll Attempts:</strong> {{ pollAttempts }}
          </div>
          <div v-if="isPolling" class="col-span-2">
            <span class="inline-flex items-center">
              <Icon name="ph:spinner" class="animate-spin mr-2" />
              Polling for completion...
            </span>
          </div>
        </div>
      </div>

      <div v-if="!streamingOutput.length && !finalResult && !currentJob" class="text-gray-500 text-center py-8">
        No results yet. Run a test to see output here.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRunpod } from "~/composables/useRunpod";

// Page metadata
definePageMeta({
	title: "RunPod Test",
	description: "Test RunPod.io integration",
});

// Composable
const {
	processing,
	error,
	endpointId,
	submitJobWithPolling,
	isPolling,
	isCompleted,
	isFailed,
	isPending,
	currentJob,
	pollAttempts,
	stopPolling,
	reset: resetRunpod,
	healthCheck: checkHealth,
} = useRunpod({
	pollInterval: 2000, // Normal polling interval (2 seconds)
	maxPollAttempts: 60, // Normal max attempts
	queuePollInterval: 15000, // Queue polling interval (15 seconds)
	queueMaxAttempts: 10, // Queue max attempts (10 times = 2.5 minutes)
});

// Local state
const testInput = ref('{"prompt": "Hello, how are you?"}');
const useStreaming = ref(false);
const streamingOutput = ref<any[]>([]);
const finalResult = ref<any>(null);
const healthStatus = ref<boolean | null>(null);
const healthChecking = ref(false);
const abortController = ref<AbortController | null>(null);

// Set default endpoint ID
onMounted(() => {
	endpointId.value = "fgzcdkl3k68v64";
});

// Watch for job completion to display result
watch([isCompleted, currentJob], ([completed, job]) => {
	if (completed && job?.output) {
		finalResult.value = job.output;
	} else if (job?.status === "FAILED") {
		finalResult.value = { error: job.error || "Job failed" };
	}
}, { immediate: true });

// Methods
const runTest = async () => {
	try {
		clearResults();

		// Create abort controller for this request
		abortController.value = new AbortController();

		let parsedInput;
		try {
			parsedInput = JSON.parse(testInput.value);
		} catch (e) {
			throw new Error("Invalid JSON in test input");
		}

		// Submit job with polling
		await submitJobWithPolling(
			parsedInput,
			{
				endpointId: endpointId.value,
			},
			(status) => {
				console.log("Status change:", status);
				// Add status change to output for debugging
				streamingOutput.value.push({
					type: "status_change",
					timestamp: new Date().toISOString(),
					data: status,
				});

				// When status changes from IN_QUEUE to IN_PROGRESS or COMPLETED, update display
				if (status.status === "COMPLETED" && status.output) {
					finalResult.value = status.output;
				} else if (status.status === "FAILED") {
					finalResult.value = { error: status.error || "Job failed" };
				}
			},
		);

		// When completed, show final result (also check after submission)
		if (isCompleted.value && currentJob.value?.output) {
			finalResult.value = currentJob.value.output;
		}
	} catch (e: any) {
		console.error("Test failed:", e);
		// Error is already set in the composable
	} finally {
		abortController.value = null;
	}
};

const abortTest = () => {
	if (abortController.value) {
		abortController.value.abort();
		abortController.value = null;
	}
	// Also stop polling if active
	if (isPolling.value) {
		stopPolling();
	}
};

const clearResults = () => {
	streamingOutput.value = [];
	finalResult.value = null;
	error.value = null;
	// Also reset the composable state
	resetRunpod();
};

const healthCheck = async () => {
	if (!endpointId.value) return;

	healthChecking.value = true;
	try {
		healthStatus.value = await checkHealth();
	} catch (e) {
		healthStatus.value = false;
	} finally {
		healthChecking.value = false;
	}
};

// Cleanup on unmount
onUnmounted(() => {
	abortTest();
});
</script>