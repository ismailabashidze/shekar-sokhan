export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	return {
		message: "Debug info",
		hasRunpodToken: !!config.runpodApiKey,
		tokenLength: config.runpodApiKey?.length || 0,
		envVars: {
			RUNPOD_API_TOKEN: !!process.env.RUNPOD_API_TOKEN,
			RUNPOD_API_KEY: !!process.env.RUNPOD_API_KEY,
		},
	};
});
