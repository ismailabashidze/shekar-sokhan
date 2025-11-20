import { type H3Event } from "h3";

const RUNPOD_API_URL = "https://api.runpod.ai/v2";

export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig();
	const jobId = getRouterParam(event, "jobId");

	if (!config.runpodApiKey) {
		throw createError({
			statusCode: 500,
			message: "RunPod API key not configured",
		});
	}

	if (!jobId) {
		throw createError({
			statusCode: 400,
			message: "jobId is required",
		});
	}

	try {
		// Extract endpointId from jobId or use a default approach
		// This assumes jobId format includes endpointId, adjust as needed
		const parts = jobId.split("/");
		const endpointId = parts[0];
		const actualJobId = parts[1] || jobId;

		if (!endpointId) {
			throw createError({
				statusCode: 400,
				message: "Could not extract endpointId from jobId",
			});
		}

		const statusUrl = `${RUNPOD_API_URL}/${endpointId}/status/${actualJobId}`;

		const response = await fetch(statusUrl, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${config.runpodApiKey}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			let errorMessage: string;
			try {
				const errorData = JSON.parse(errorText);
				errorMessage =
					errorData?.error?.message || errorData?.message || errorText;
			} catch {
				errorMessage = errorText;
			}

			throw createError({
				statusCode: response.status,
				message: `RunPod API error: ${errorMessage}`,
			});
		}

		const data = await response.json();
		return data;
	} catch (error: any) {
		console.error("RunPod status API error:", error);
		throw createError({
			statusCode: error.statusCode || 500,
			message: error.message || "Internal server error",
		});
	}
});
