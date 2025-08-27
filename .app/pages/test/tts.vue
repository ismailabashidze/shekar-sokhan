<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mx-auto max-w-4xl">
      <h1 class="mb-8 text-3xl font-bold text-gray-900">
        OpenAI TTS Test Page
      </h1>

      <!-- Configuration Panel -->
      <div class="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h2 class="mb-4 text-xl font-semibold">
          Configuration
        </h2>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Text Input -->
          <div class="col-span-2">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Text to Speech
            </label>
            <textarea
              v-model="config.text"
              rows="4"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter text to convert to speech..."
            />
          </div>

          <!-- Model Selection -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Model
            </label>
            <select
              v-model="config.model"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tts-1">
                tts-1 (Fast)
              </option>
              <option value="tts-1-hd">
                tts-1-hd (High Quality)
              </option>
              <option value="gpt-4o-mini-tts">
                gpt-4o-mini-tts (Advanced)
              </option>
            </select>
          </div>

          <!-- Voice Selection -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Voice Character
            </label>
            <select
              v-model="config.voice"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="alloy">
                Alloy
              </option>
              <option value="echo">
                Echo
              </option>
              <option value="fable">
                Fable
              </option>
              <option value="onyx">
                Onyx
              </option>
              <option value="nova">
                Nova
              </option>
              <option value="shimmer">
                Shimmer
              </option>
            </select>
          </div>

          <!-- Speed Control -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Speed: {{ config.speed }}x
            </label>
            <input
              v-model.number="config.speed"
              type="range"
              min="0.25"
              max="4.0"
              step="0.25"
              class="w-full"
            >
          </div>

          <!-- Response Format -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Format
            </label>
            <select
              v-model="config.response_format"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mp3">
                MP3
              </option>
              <option value="opus">
                Opus
              </option>
              <option value="aac">
                AAC
              </option>
              <option value="flac">
                FLAC
              </option>
              <option value="wav">
                WAV
              </option>
              <option value="pcm">
                PCM
              </option>
            </select>
          </div>

          <!-- Instructions (for gpt-4o-mini-tts) -->
          <div class="col-span-2">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Instructions (for gpt-4o-mini-tts)
            </label>
            <textarea
              v-model="config.instructions"
              rows="3"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter instructions for the AI voice (e.g., 'Speak in a cheerful and positive tone', 'Use a professional and calm voice', 'Speak slowly and clearly')..."
              :disabled="config.model !== 'gpt-4o-mini-tts'"
            />
            <p v-if="config.model !== 'gpt-4o-mini-tts'" class="mt-1 text-sm text-gray-500">
              Instructions are only available with gpt-4o-mini-tts model
            </p>
          </div>
        </div>
      </div>

      <!-- Test Controls -->
      <div class="rounded-lg bg-white p-6 shadow-md">
        <h2 class="mb-4 text-xl font-semibold">
          Test Controls
        </h2>

        <div class="flex items-center gap-4">
          <button
            :disabled="!config.text || isLoading || isPlaying"
            class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            @click="testTTS"
          >
            <span v-if="isLoading">Generating...</span>
            <span v-else-if="isPlaying">Playing...</span>
            <span v-else>Test TTS</span>
          </button>

          <button
            v-if="isPlaying"
            class="rounded-md bg-yellow-600 px-6 py-2 text-white hover:bg-yellow-700"
            @click="pauseTTS"
          >
            Pause
          </button>

          <button
            v-if="isPlaying || isLoading"
            class="rounded-md bg-red-600 px-6 py-2 text-white hover:bg-red-700"
            @click="stopTTS"
          >
            Stop
          </button>
        </div>

        <!-- Status Messages -->
        <div v-if="error" class="mt-4 rounded-md bg-red-100 p-3 text-red-700">
          {{ error }}
        </div>

        <div v-if="isLoading" class="mt-4 rounded-md bg-blue-100 p-3 text-blue-700">
          Generating speech audio...
        </div>

        <div v-if="isPlaying" class="mt-4 rounded-md bg-green-100 p-3 text-green-700">
          Playing audio...
        </div>
      </div>

      <!-- Preset Examples -->
      <div class="mt-6 rounded-lg bg-white p-6 shadow-md">
        <h2 class="mb-4 text-xl font-semibold">
          Preset Examples
        </h2>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            v-for="example in examples"
            :key="example.text"
            class="rounded-md border border-gray-300 p-4 text-left hover:bg-gray-50"
            @click="loadExample(example)"
          >
            <div class="font-medium">
              {{ example.title }}
            </div>
            <div class="mt-1 text-sm text-gray-600">
              {{ example.text.substring(0, 60) }}...
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { play, stop, pause, isPlaying, isLoading, error } = useOpenAITTS()

const config = reactive({
  text: 'Hello! This is a test of the OpenAI Text-to-Speech system. How does it sound?',
  model: 'tts-1' as const,
  voice: 'alloy' as const,
  response_format: 'mp3' as const,
  speed: 1.0,
})

const examples = [
  {
    title: 'Welcome Message',
    text: 'Welcome to our platform! We are excited to have you here. Let me know how I can help you today.',
    voice: 'nova' as const,
  },
  {
    title: 'AI Assistant',
    text: 'I am your AI assistant, ready to help you with any questions or tasks you might have.',
    voice: 'onyx' as const,
  },
  {
    title: 'Persian Greeting',
    text: 'سلام! خوش آمدید به پلتفرم ما. چطور می توانم به شما کمک کنم؟',
    voice: 'alloy' as const,
  },
  {
    title: 'Long Text',
    text: 'The integration of artificial intelligence into daily applications has revolutionized how we interact with technology. From voice assistants to automated customer service, AI is becoming an integral part of our digital experience.',
    voice: 'fable' as const,
  },
]

const testTTS = async () => {
  await play(config.text, {
    model: config.model,
    voice: config.voice,
    response_format: config.response_format,
    speed: config.speed,
  })
}

const pauseTTS = () => {
  pause()
}

const stopTTS = () => {
  stop()
}

const loadExample = (example: typeof examples[0]) => {
  config.text = example.text
  config.voice = example.voice
}

useHead({
  title: 'TTS Test - OpenAI Text-to-Speech',
})
</script>
