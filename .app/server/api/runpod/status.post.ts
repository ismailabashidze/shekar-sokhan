import { type H3Event } from "h3";

const RUNPOD_API_URL = "https://api.runpod.ai/v2";

export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig();

	console.log("RunPod status API called");
	console.log("Has token:", !!config.runpodApiKey);

	if (!config.runpodApiKey) {
		console.error("RunPod API key not configured");
		throw createError({
			statusCode: 500,
			message: "RunPod API key not configured",
		});
	}

	const body = await readBody(event);
	console.log("Status request body:", JSON.stringify(body, null, 2));

	const { endpointId, jobId } = body;

	if (!endpointId || !jobId) {
		console.error("Missing endpointId or jobId");
		throw createError({
			statusCode: 400,
			message: "endpointId and jobId are required",
		});
	}

	try {
		const statusUrl = `${RUNPOD_API_URL}/${endpointId}/status/${jobId}`;
		console.log("Checking status URL:", statusUrl);

		const response = await fetch(statusUrl, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${config.runpodApiKey}`,
				"Content-Type": "application/json",
			},
		});

		console.log("Status response status:", response.status);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Status check failed:", errorText);
			throw createError({
				statusCode: response.status,
				message: `Status check failed: ${errorText}`,
			});
		}

		const statusData = await response.json();
		console.log("Status response data:", statusData);

		return statusData;
	} catch (error: any) {
		console.error("RunPod status API error:", error);
		throw createError({
			statusCode: error.statusCode || 500,
			message: error.message || "Internal server error",
		});
	}
});
