import { type H3Event } from "h3";

const RUNPOD_API_URL = "https://api.runpod.ai/v2";

export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig();

	console.log("RunPod API called");
	console.log("Has token:", !!config.runpodApiKey);

	if (!config.runpodApiKey) {
		console.error("RunPod API key not configured");
		throw createError({
			statusCode: 500,
			message: "RunPod API key not configured",
		});
	}

	const body = await readBody(event);
	console.log("Request body:", JSON.stringify(body, null, 2));

	const { endpointId, input, stream = true } = body;

	if (!endpointId) {
		console.error("Missing endpointId");
		throw createError({
			statusCode: 400,
			message: "endpointId is required",
		});
	}

	try {
		// Try different endpoint URL formats
		const runpodEndpointUrl = `${RUNPOD_API_URL}/${endpointId}/run${stream ? "s" : ""}`;
		console.log("Calling RunPod URL:", runpodEndpointUrl);

		const response = await fetch(runpodEndpointUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${config.runpodApiKey}`,
			},
			body: JSON.stringify({
				input: input || {},
			}),
		});

		console.log("RunPod response status:", response.status);
		console.log(
			"RunPod response headers:",
			Object.fromEntries(response.headers.entries()),
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("RunPod API error response:", errorText);

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

		// For now, handle both streaming and non-streaming the same way
		const data = await response.json();
		console.log("RunPod response data:", data);

		return data;
	} catch (error: any) {
		console.error("RunPod API error:", error);
		throw createError({
			statusCode: error.statusCode || 500,
			message: error.message || "Internal server error",
		});
	}
});
