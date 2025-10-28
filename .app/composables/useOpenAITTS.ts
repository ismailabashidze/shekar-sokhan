interface TTSOptions {
  text: string;
  model?: 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts';
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  response_format?: 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm';
  speed?: number;
  instructions?: string;
}

interface TTSState {
  isPlaying: boolean;
  isLoading: boolean;
  audio: HTMLAudioElement | null;
  error: string | null;
}

export const useOpenAITTS = () => {
  const config = useRuntimeConfig();
  const state = reactive<TTSState>({
    isPlaying: false,
    isLoading: false,
    audio: null,
    error: null,
  });

  const generateSpeech = async (options: TTSOptions): Promise<string> => {
    const {
      text,
      model = 'tts-1',
      voice = 'alloy',
      response_format = 'mp3',
      speed = 1.0,
      instructions,
    } = options;

    if (!config.public.openaiApiKey && !config.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const requestBody: any = {
        model,
        input: text,
        voice,
        response_format,
        speed,
      };

      // Add instructions parameter for gpt-4o-mini-tts model
      if (instructions && model === 'gpt-4o-mini-tts') {
        requestBody.instructions = instructions;
      }

      const response = await $fetch<ArrayBuffer>('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.public.openaiApiKey || config.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: requestBody,
        responseType: 'arrayBuffer',
      });

      // Create blob URL for the audio
      const audioBlob = new Blob([response], { type: `audio/${response_format}` });
      return URL.createObjectURL(audioBlob);
    }
    catch (error) {
      console.error('Error generating speech:', error);
      throw new Error('Failed to generate speech audio');
    }
  };

  const play = async (text: string, options?: Partial<TTSOptions>) => {
    if (state.isPlaying) {
      await stop();
    }

    state.isLoading = true;
    state.error = null;

    try {
      const audioUrl = await generateSpeech({
        text,
        ...options,
      });

      state.audio = new Audio(audioUrl);

      state.audio.addEventListener('ended', () => {
        state.isPlaying = false;
      });

      state.audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        state.error = 'Failed to play audio';
        state.isPlaying = false;
      });

      await state.audio.play();
      state.isPlaying = true;
    }
    catch (error) {
      state.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error playing audio:', error);
    }
    finally {
      state.isLoading = false;
    }
  };

  const stop = async () => {
    if (state.audio) {
      state.audio.pause();
      state.audio.currentTime = 0;
      state.isPlaying = false;
    }
  };

  const pause = () => {
    if (state.audio && state.isPlaying) {
      state.audio.pause();
      state.isPlaying = false;
    }
  };

  const resume = () => {
    if (state.audio && !state.isPlaying) {
      state.audio.play();
      state.isPlaying = true;
    }
  };

  // Cleanup on unmount
  onUnmounted(() => {
    if (state.audio) {
      state.audio.pause();
      URL.revokeObjectURL(state.audio.src);
    }
  });

  return {
    // State
    isPlaying: readonly(toRef(state, 'isPlaying')),
    isLoading: readonly(toRef(state, 'isLoading')),
    error: readonly(toRef(state, 'error')),

    // Methods
    play,
    stop,
    pause,
    resume,
    generateSpeech,
  };
};
