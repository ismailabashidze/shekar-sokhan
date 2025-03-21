<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useHead } from '@vueuse/head'

// Define emits
const emit = defineEmits(['close', 'textReady'])

// Inject the external script for dat.GUI using the CDN
useHead({
  script: [
    {
      src: '//cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.3/dat.gui.min.js',
      type: 'text/javascript',
    },
  ],
})

const canvas = ref(null)
const isStarted = ref(false) // Changed to a toggle state instead of press state

let context, analyser, freqs
let recognition: any // Explicitly type recognition
let tipTimeout

const finalText = ref('')
const interimText = ref('')
const allText = ref('') // Store all completed sentences
const lastProcessedIndex = ref(-1) // Track last processed result index
const showTip = ref(false)

const silenceTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const countDown = ref(5)
const showCountdown = ref(false)

const startSilenceTimer = () => {
  if (silenceTimer.value) clearTimeout(silenceTimer.value)
  showCountdown.value = true
  countDown.value = 5

  const countdown = () => {
    if (countDown.value > 0) {
      countDown.value--
      silenceTimer.value = setTimeout(countdown, 1000)
    }
    else {
      submitText()
      closeModal()
    }
  }

  silenceTimer.value = setTimeout(countdown, 1000)
}

const resetSilenceTimer = () => {
  if (silenceTimer.value) {
    clearTimeout(silenceTimer.value)
    silenceTimer.value = null
  }
  showCountdown.value = false
  countDown.value = 5
}

// Set the visualization options
const opts = {
  smoothing: 0.6,
  fft: 8,
  minDecibels: -70,
  scale: 0.1, // Reduced scale to make the visual effect smaller
  glow: 5, // Reduced glow
  color1: [203, 36, 128],
  color2: [41, 200, 192],
  color3: [24, 137, 218],
  fillOpacity: 0.5, // Reduced fill opacity
  lineWidth: 0.5, // Reduced line width
  blend: 'screen',
  shift: 30, // Reduced shift
  width: 30, // Reduced width
  amp: 0.5, // Reduced amplitude
}

// Helper functions for visualizing frequencies
const shuffle = [1, 3, 0, 4, 2]
const range = i => Array.from(Array(i).keys())

const freq = (channel, i) => {
  const band = 2 * channel + shuffle[i] * 6
  return freqs[band]
}

const scale = (i) => {
  const x = Math.abs(2 - i)
  const s = 3 - x
  return (s / 3) * opts.amp
}

// Function to draw the visualization path
const path = (channel) => {
  if (!canvas.value) return

  const ctx = canvas.value.getContext('2d')
  const color = opts[`color${channel + 1}`].map(Math.floor)
  ctx.fillStyle = `rgba(${color}, ${opts.fillOpacity})`
  ctx.strokeStyle = ctx.shadowColor = `rgb(${color})`

  ctx.lineWidth = opts.lineWidth
  ctx.shadowBlur = opts.glow
  ctx.globalCompositeOperation = opts.blend

  const HEIGHT = canvas.value.height
  const WIDTH = canvas.value.width
  const m = HEIGHT / 2

  // Adjust width parameters based on canvas size
  const scaleFactor = WIDTH / 500 // Scale based on reference width of 500px
  const adjustedWidth = opts.width * scaleFactor
  const adjustedShift = opts.shift * scaleFactor

  const offset = (WIDTH - 15 * adjustedWidth) / 2
  const x = range(15).map(i => offset + channel * adjustedShift + i * adjustedWidth)
  const y = range(5).map(i => Math.max(0, m - scale(i) * freq(channel, i)))
  const h = 2 * m

  ctx.beginPath()
  ctx.moveTo(0, m)
  ctx.lineTo(x[0], m + 1)
  ctx.bezierCurveTo(x[1], m + 1, x[2], y[0], x[3], y[0])
  ctx.bezierCurveTo(x[4], y[0], x[4], y[1], x[5], y[1])
  ctx.bezierCurveTo(x[6], y[1], x[6], y[2], x[7], y[2])
  ctx.bezierCurveTo(x[8], y[2], x[8], y[3], x[9], y[3])
  ctx.bezierCurveTo(x[10], y[3], x[10], y[4], x[11], y[4])
  ctx.bezierCurveTo(x[12], y[4], x[12], m, x[13], m)
  ctx.lineTo(WIDTH, m + 1)
  ctx.lineTo(x[13], m - 1)

  ctx.bezierCurveTo(x[12], m, x[12], h - y[4], x[11], h - y[4])
  ctx.bezierCurveTo(x[10], h - y[4], x[10], h - y[3], x[9], h - y[3])
  ctx.bezierCurveTo(x[8], h - y[3], x[8], h - y[2], x[7], h - y[2])
  ctx.bezierCurveTo(x[6], h - y[2], x[6], h - y[1], x[5], h - y[1])
  ctx.bezierCurveTo(x[4], h - y[1], x[4], h - y[0], x[3], h - y[0])
  ctx.bezierCurveTo(x[2], h - y[0], x[1], m, x[0], m)

  ctx.lineTo(0, m)
  ctx.fill()
  ctx.stroke()
}

// Visualize frequencies
const visualize = () => {
  if (!canvas.value) return

  const ctx = canvas.value.getContext('2d')
  const containerWidth = canvas.value.parentElement.clientWidth || 500
  const WIDTH = canvas.value.width = containerWidth
  const HEIGHT = canvas.value.height = 150

  // Center the visualization in the canvas
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.translate(0, 0)

  if (isStarted.value && analyser && freqs) {
    analyser.smoothingTimeConstant = opts.smoothing
    analyser.fftSize = Math.pow(2, opts.fft)
    analyser.minDecibels = opts.minDecibels
    analyser.maxDecibels = 0
    analyser.getByteFrequencyData(freqs)

    path(0)
    path(1)
    path(2)
  }
  else {
    // Draw a flat line when not recording
    ctx.beginPath()
    ctx.moveTo(0, HEIGHT / 2)
    ctx.lineTo(WIDTH, HEIGHT / 2)
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  if (isStarted.value) {
    requestAnimationFrame(visualize)
  }
}

// Initialize speech recognition
const initSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window) {
    recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'fa-IR'

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      // Only process new results
      for (let i = Math.max(lastProcessedIndex.value + 1, 0); i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' '
          lastProcessedIndex.value = i
        } else {
          interimTranscript += result[0].transcript + ' '
        }
      }

      // Update the display text
      if (finalTranscript) {
        finalText.value = finalTranscript.trim()
        allText.value = (allText.value + ' ' + finalTranscript).trim()
        interimText.value = interimTranscript.trim()
        startSilenceTimer()
      } else if (interimTranscript) {
        interimText.value = interimTranscript.trim()
        resetSilenceTimer()
      }
    }

    recognition.onend = () => {
      if (isStarted.value) {
        // Restart recognition if it was still supposed to be running
        recognition.start()
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      if (event.error !== 'no-speech') {
        isStarted.value = false
      }
    }
  } else {
    console.warn('Speech recognition not supported in this browser.')
  }
}

// Modified to toggle recording on/off with a single click
const toggleRecognition = () => {
  if (isStarted.value) {
    endRecognition()
  }
  else {
    startRecognition()
  }
}

const startRecognition = () => {
  if (recognition && !isStarted.value) {
    finalText.value = ''
    interimText.value = ''
    allText.value = ''
    lastProcessedIndex.value = -1
    recognition.start()
    isStarted.value = true

    // Create audio context for visualization
    context = new AudioContext()
    analyser = context.createAnalyser()
    freqs = new Uint8Array(analyser.frequencyBinCount)

    // Get audio stream for visualization
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(onStream)
      .catch(onStreamError)
  }
}

const endRecognition = () => {
  if (recognition && isStarted.value) {
    recognition.stop()
    isStarted.value = false

    // Stop the audio context
    if (context) {
      context.close()
      context = null
    }
  }
}

const onStream = (stream) => {
  if (context && analyser) {
    const input = context.createMediaStreamSource(stream)
    input.connect(analyser)
    visualize()
  }
}

const onStreamError = (e) => {
  console.error(e)
}

const showTipMessage = () => {
  showTip.value = true
  clearTimeout(tipTimeout)
  tipTimeout = setTimeout(() => {
    showTip.value = false
  }, 3000)
}

const submitText = () => {
  const textToSubmit = allText.value.trim()
  if (textToSubmit) {
    emit('textReady', textToSubmit)
  }
  closeModal()
}

const closeModal = () => {
  // Make sure recognition is stopped when modal is closed
  if (isStarted.value) {
    endRecognition()
  }

  // Reset all state
  finalText.value = ''
  interimText.value = ''
  allText.value = ''
  lastProcessedIndex.value = -1
  resetSilenceTimer()

  // Emit event to parent to close modal
  emit('close')
}

onMounted(() => {
  initSpeechRecognition()

  // Initialize visualizer with a flat line
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d')
    const WIDTH = canvas.value.width = canvas.value.parentElement?.clientWidth || 500
    const HEIGHT = canvas.value.height = 150

    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    ctx.beginPath()
    ctx.moveTo(0, HEIGHT / 2)
    ctx.lineTo(WIDTH, HEIGHT / 2)
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)'
    ctx.lineWidth = 1
    ctx.stroke()
  }
})

onBeforeUnmount(() => {
  // Clean up resources
  if (recognition) {
    try {
      recognition.stop()
    }
    catch (e) {
      console.error('Error stopping recognition:', e)
    }
  }

  if (context) {
    try {
      context.close()
    }
    catch (e) {
      console.error('Error closing audio context:', e)
    }
  }

  if (tipTimeout) {
    clearTimeout(tipTimeout)
  }
})
</script>

<template>
  <div>
    <div>
      <BaseCard
        rounded="lg"
        shadow="md"
        class="dark:bg-muted-800 bg-white p-6"
      >
        <!-- Text display area -->
        <div class="bg-muted-100 dark:bg-muted-700/50 mb-4 min-h-[100px] rounded-lg p-4 text-right">
          <div class="text-muted-500 dark:text-muted-400 mb-2 text-sm">
            متن وارد شده:
          </div>
          <!-- Show interim text during recognition, final text after release -->
          <div class="text-muted-800 text-lg dark:text-white">
            <span
              v-if="isStarted"
              id="interim_span"
              class="bg-primary-500/20 text-primary-600 rounded px-1 dark:text-white"
            >{{ interimText }}</span>
            <span
              v-else
              id="final_span"
            >{{ finalText || 'برای شروع ضبط، روی دکمه میکروفون کلیک کنید' }}</span>
          </div>
        </div>

        <!-- Visualizer -->
        <div class="bg-primary-500/10 dark:bg-primary-500/5 mb-4 flex items-center justify-center overflow-hidden rounded-lg" style="height: 150px;">
          <canvas ref="canvas" class="visualizer-canvas" />
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center gap-4">
          <!-- Cancel button -->
          <BaseButton
            rounded="full"
            color="muted"
            @click="closeModal"
          >
            <div class="flex items-center gap-2">
              <Icon name="ph:x-circle-fill" class="size-5" />
              <span>انصراف</span>
            </div>
          </BaseButton>
          <!-- Record button -->
          <BaseButton
            id="button"
            rounded="full"
            color="primary"
            :class="{ 'bg-danger-500 hover:bg-danger-600': isStarted }"
            @click="toggleRecognition"
          >
            <div class="flex items-center gap-2">
              <div class="relative">
                <div class="bg-muted-100 dark:bg-muted-700 flex items-center justify-center rounded-full p-3" />
                <Icon
                  :name="isStarted ? 'ph:stop-circle-fill' : 'ph:microphone-fill'"
                  class="absolute right-1/2 top-1/2 size-5 -translate-y-1/2 translate-x-1/2 text-slate-700 dark:text-white"
                />
              </div>
              <span>{{ isStarted ? 'پایان' : 'شروع' }}</span>
            </div>
          </BaseButton>

          <!-- Submit button -->
          <BaseButton
            rounded="full"
            color="success"
            :disabled="!finalText"
            @click="submitText"
          >
            <div class="flex items-center gap-2">
              <Icon name="ph:check-circle-fill" class="size-5" />
              <span>تایید</span>
            </div>
          </BaseButton>
        </div>

        <!-- Recording status indicator -->
        <div v-if="isStarted" class="mt-4 text-center">
          <div class="bg-danger-500/20 text-danger-600 dark:text-danger-400 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm">
            <span class="bg-danger-500 recording-pulse size-2 animate-pulse rounded-full" />
            در حال ضبط...
          </div>
        </div>

        <!-- Countdown indicator -->
        <div v-if="showCountdown" class="mt-4 flex flex-col items-center">
          <div class="text-muted-500 dark:text-muted-400 mb-2 text-sm">
            ارسال خودکار در {{ countDown }} ثانیه
          </div>
          <div class="bg-muted-100 dark:bg-muted-700 h-1 w-full max-w-xs rounded-full">
            <div
              class="bg-primary-500 h-1 rounded-full transition-all duration-1000"
              :style="{ width: `${(countDown / 5) * 100}%` }"
            />
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.visualizer-canvas {
  position: relative;
  margin: 0 auto;
  display: block;
  width: 100%;
  height: 150px;
  background-color: transparent;
}

.interim {
  background-color: rgba(79, 70, 229, 0.2);
  color: #4338ca;
  padding: 0 4px;
  border-radius: 4px;
}

#interim_span {
  opacity: 0.7;
  font-style: italic;
}

.final {
  color: var(--color-muted-800);
}

@media (prefers-color-scheme: dark) {
  .final {
    color: var(--color-white);
  }
}

/* Pulse animation for recording indicator */
@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}

.recording-pulse {
  animation: recording-pulse 2s infinite;
}

@keyframes recording-pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(220, 38, 38, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
  }
}
</style>
