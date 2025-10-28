import { ref } from 'vue';

export function useTimeoutTest() {
  const processing = ref(false);
  const error = ref<string | null>(null);

  const testTimeoutWithRetry = async () => {
    processing.value = true;
    error.value = null;

    try {
      console.log('🔍 Starting timeout test with retry mechanism');

      // Implement timeout mechanism with retry
      let response: Response | null = null;
      let attempts = 0;
      const maxAttempts = 2; // Initial attempt + 1 retry

      while (attempts < maxAttempts) {
        attempts++;
        console.log(`⏳ Attempt ${attempts}/${maxAttempts} to test timeout mechanism`);

        try {
          response = await Promise.race([
            // This is a test endpoint that will always timeout to simulate the issue
            fetch('https://httpbin.org/delay/35', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }),
            new Promise((_, reject) =>
              setTimeout(() => {
                console.log('⏰ Request timeout after 30 seconds');
                reject(new Error('Request timeout after 30 seconds'));
              }, 30000),
            ),
          ]) as Response;

          console.log(`✅ Request successful on attempt ${attempts}`);
          // If we get here, the request was successful
          // Check if response is valid before breaking
          if (response && response.ok) {
            break;
          }
          else if (response) {
            // If response exists but is not ok, throw error to trigger retry
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }
        }
        catch (e) {
          console.log(`❌ Attempt ${attempts} failed:`, e);
          if (attempts >= maxAttempts) {
            // Last attempt failed, re-throw the error
            throw e;
          }
          // Retry after 1 second
          console.log('🔄 Retrying in 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Additional check to ensure we have a valid response
      if (!response) {
        throw new Error('No response received after all attempts');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API error response:', errorText);
        throw new Error(errorText);
      }

      console.log('✅ Timeout test completed successfully');
      return { success: true, message: 'Test completed successfully' };
    }
    catch (e: any) {
      console.error('💥 Error in timeout test:', e);
      error.value = e.message;
      throw e;
    }
    finally {
      processing.value = false;
      console.log('🏁 Timeout test function completed');
    }
  };

  return {
    processing,
    error,
    testTimeoutWithRetry,
  };
}
