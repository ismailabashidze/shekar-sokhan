<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useHead } from '@vueuse/head'

// Define emits
const emit = defineEmits(['close', 'textReady', 'sendMessage'])

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
let recognition = ref<any>(null) // Explicitly type recognition
let recognitionTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
let tipTimeout

const finalText = ref('')
const interimText = ref('')
const allText = ref('') // Store all completed sentences
const lastProcessedIndex = ref(-1) // Track last processed result index
const showTip = ref(false)

const silenceTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const countDown = ref(3)
const showCountdown = ref(false)

const deviceInfo = ref('')
const audioStatus = ref('')
const errorMessage = ref('')

// Helper function to log status with visual feedback
const logStatus = (status: string, error = false) => {
  audioStatus.value = status
  console.log(`[AudioUser] ${status}`)
  if (error) {
    errorMessage.value = status
  }
}

// Get device information
const getDeviceInfo = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const audioDevices = devices.filter(device => device.kind === 'audioinput')
    deviceInfo.value = `دستگاه‌های صوتی موجود: ${audioDevices.map(d => d.label || 'دستگاه بدون نام').join(', ')}`
    console.log('[AudioUser] اطلاعات دستگاه:', deviceInfo.value)
  }
  catch (err) {
    console.error('[AudioUser] خطا در دریافت اطلاعات دستگاه:', err)
    deviceInfo.value = `خطا در دریافت اطلاعات دستگاه: ${err.message}`
  }
}

const startSilenceTimer = () => {
  if (silenceTimer.value) clearTimeout(silenceTimer.value)
  showCountdown.value = true
  countDown.value = 1.5

  const countdown = () => {
    if (countDown.value > 0) {
      countDown.value -= 0.5
      silenceTimer.value = setTimeout(countdown, 500)
    }
    else {
      handleAutoClose()
    }
  }

  silenceTimer.value = setTimeout(countdown, 500)
}

const resetSilenceTimer = () => {
  if (silenceTimer.value) {
    clearTimeout(silenceTimer.value)
    silenceTimer.value = null
  }
  showCountdown.value = false
  countDown.value = 1.5
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
  const containerWidth = canvas.value.parentElement?.clientWidth || 500
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
  logStatus('بررسی تشخیص گفتار...')
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    recognition.value = new SpeechRecognition()
    recognition.value.continuous = true
    recognition.value.interimResults = true
    recognition.value.lang = 'fa-IR'
    recognition.value.maxAlternatives = 1

    recognition.value.onstart = () => {
      logStatus('تشخیص گفتار آغاز شد')
    }

    recognition.value.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      // Process all results to ensure nothing is missed on mobile
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' '
          // Update lastProcessedIndex to prevent reprocessing
          lastProcessedIndex.value = i
        }
        else {
          // Always process interim results
          interimTranscript += result[0].transcript + ' '
        }
      }

      // Update the display text
      if (finalTranscript) {
        finalText.value = finalTranscript.trim()
        // Add a space only if allText is not empty
        allText.value = allText.value ? `${allText.value} ${finalTranscript}`.trim() : finalTranscript.trim()
        interimText.value = '' // Clear interim when we have final text
        startSilenceTimer()
      }
      else if (interimTranscript) {
        interimText.value = interimTranscript.trim()
        resetSilenceTimer()
      }

      // Force update the UI by triggering a reactivity refresh
      nextTick(() => {
        // This ensures the UI updates even on mobile devices
      })
    }

    recognition.value.onerror = (event: any) => {
      logStatus(`خطای تشخیص گفتار: ${event.error}`, true)
      console.error('[AudioUser] Recognition error:', event)

      // Handle specific mobile errors
      if (event.error === 'no-speech') {
        logStatus('هیچ گفتاری شناسایی نشد. لطفاً دوباره تلاش کنید.', true)
      }
      else if (event.error === 'audio-capture') {
        logStatus('دستگاه صوتی یافت نشد. لطفاً اتصال میکروفون را بررسی کنید.', true)
      }
      else if (event.error === 'not-allowed') {
        logStatus('دسترسی به میکروفون رد شد. لطفاً مجوزها را بررسی کنید.', true)
      }
    }

    recognition.value.onend = () => {
      logStatus('تشخیص گفتار پایان یافت')
      if (isStarted.value) {
        // Add a small delay before restarting recognition
        recognitionTimeout.value = setTimeout(() => {
          try {
            recognition.value.start()
          }
          catch (e) {
            console.error('خطا در راه‌اندازی مجدد تشخیص گفتار:', e)
            logStatus(`خطا در راه‌اندازی مجدد: ${e.message}`, true)
          }
        }, 100)
      }
    }

    logStatus('تشخیص گفتار مقداردهی اولیه شد')
  }
  else {
    logStatus('تشخیص گفتار در این مرورگر پشتیبانی نمی‌شود', true)
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
  if (recognition.value && !isStarted.value) {
    finalText.value = ''
    interimText.value = ''
    allText.value = ''
    lastProcessedIndex.value = -1

    // Add a small delay before starting recognition
    setTimeout(() => {
      try {
        recognition.value.start()
        isStarted.value = true

        // Create audio context for visualization
        context = new (window.AudioContext || (window as any).webkitAudioContext)()
        analyser = context.createAnalyser()
        freqs = new Uint8Array(analyser.frequencyBinCount)

        // Get audio stream for visualization
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(onStream)
          .catch(onStreamError)
      }
      catch (e) {
        console.error('خطا در شروع تشخیص گفتار:', e)
        logStatus(`خطا در شروع تشخیص گفتار: ${e.message}`, true)
      }
    }, 100)
  }
}

const endRecognition = () => {
  if (recognition.value && isStarted.value) {
    if (recognitionTimeout.value) {
      clearTimeout(recognitionTimeout.value)
      recognitionTimeout.value = null
    }

    try {
      recognition.value.stop()
    }
    catch (e) {
      console.error('خطا در توقف تشخیص گفتار:', e)
    }

    isStarted.value = false

    // Stop the audio context
    if (context) {
      context.close()
      context = null
    }
  }
}

const onStream = (stream) => {
  logStatus('جریان صوتی راه‌اندازی شد')
  try {
    // Handle different browser prefixes for AudioContext
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    context = new AudioContext()
    const source = context.createMediaStreamSource(stream)
    analyser = context.createAnalyser()
    freqs = new Uint8Array(analyser.frequencyBinCount)
    source.connect(analyser)
    visualize()
  }
  catch (e) {
    console.error('[AudioUser] Error setting up audio context:', e)
    logStatus(`خطا در راه‌اندازی زمینه صوتی: ${e.message}`, true)
  }
}

const onStreamError = (e) => {
  logStatus(`خطای میکروفون: ${e.message}`, true)
  console.error('[AudioUser] Stream error:', e)
  isStarted.value = false
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
    emit('sendMessage')
  }
  closeModal()
}

const closeModal = () => {
  const textToSubmit = allText.value.trim()
  if (textToSubmit) {
    emit('textReady', textToSubmit)
    emit('sendMessage')
  }
  emit('close')
  resetState()
}

const handleAutoClose = () => {
  const textToSubmit = allText.value.trim()
  if (textToSubmit) {
    emit('textReady', textToSubmit)
    emit('sendMessage')
  }
  emit('close')
  resetState()
}

const resetState = () => {
  allText.value = ''
  interimText.value = ''
  finalText.value = ''
  isStarted.value = false
  showCountdown.value = false
  countDown.value = 1.5
  if (recognition.value) {
    try {
      recognition.value.stop()
    }
    catch (e) {
      console.error('خطا در توقف تشخیص گفتار:', e)
    }
  }
}

// Update the autoCloseTimer to use handleAutoClose
const startAutoCloseTimer = () => {
  showCountdown.value = true
  countDown.value = 1.5

  const timer = setInterval(() => {
    countDown.value -= 0.5
    if (countDown.value <= 0) {
      clearInterval(timer)
      handleAutoClose()
    }
  }, 500)
}

onMounted(() => {
  logStatus('کامپوننت بارگذاری شد')
  getDeviceInfo()
  initSpeechRecognition()
  visualize()
})

onBeforeUnmount(() => {
  // Clean up resources
  if (recognition.value) {
    try {
      recognition.value.stop()
    }
    catch (e) {
      console.error('خطا در توقف تشخیص گفتار:', e)
    }
  }

  if (recognitionTimeout.value) {
    clearTimeout(recognitionTimeout.value)
  }

  if (context) {
    try {
      context.close()
    }
    catch (e) {
      console.error('خطا در بستن زمینه صوتی:', e)
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
      <BaseCard rounded="lg" class="relative">
        <!-- Add debug info section -->
        <div v-if="audioStatus || errorMessage || deviceInfo" class="mb-2 rounded bg-gray-100 p-2 text-sm">
          <p v-if="audioStatus" class="text-blue-600">
            وضعیت: {{ audioStatus }}
          </p>
          <p v-if="errorMessage" class="text-red-600">
            خطا: {{ errorMessage }}
          </p>
          <p v-if="deviceInfo" class="text-xs text-gray-600">
            {{ deviceInfo }}
          </p>
        </div>
        <div>
          <BaseCard
            rounded="lg"
            shadow="md"
            class="dark:bg-muted-800 bg-white p-6"
          >
            <!-- User activation notice for mobile -->
            <div v-if="!isStarted && !finalText && !allText" class="mb-4 rounded-lg bg-blue-50 p-3 text-center text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <Icon name="ph:info-duotone" class="mr-1 inline size-4" />
              برای شروع ضبط، روی دکمه میکروفون کلیک کنید. در موبایل ممکن است نیاز به تعامل مستقیم با صفحه داشته باشید.
            </div>

            <!-- Base message -->
            <div class="mb-4 text-center">
              <div class="text-muted-500 dark:text-muted-400 text-sm">
                پس از ۱.۵ ثانیه سکوت، پیام به صورت خودکار ارسال می‌شود
              </div>
            </div>

            <!-- Text display area -->
            <div class="bg-muted-100 dark:bg-muted-700/50 mb-4 min-h-[100px] rounded-lg p-4 text-right">
              <div class="text-muted-500 dark:text-muted-400 mb-2 flex items-center justify-between text-sm">
                <div>متن وارد شده:</div>
              </div>
              <!-- Show interim text during recognition, final text after release -->
              <div class="text-muted-800 break-words text-lg dark:text-white">
                <span
                  v-if="isStarted && interimText"
                  id="interim_span"
                  class="bg-primary-500/20 text-primary-600 rounded px-1 dark:text-white"
                >{{ interimText }}</span>
                <span
                  v-else-if="finalText"
                  id="final_span"
                >{{ finalText }}</span>
                <span
                  v-else-if="allText"
                  id="all_text_span"
                >{{ allText }}</span>
                <span
                  v-else
                  id="placeholder_span"
                  class="text-muted-400"
                >برای شروع ضبط، روی دکمه میکروفون کلیک کنید</span>
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
                پایان ضبط در {{ countDown }} ثانیه
              </div>
              <div class="bg-muted-100 dark:bg-muted-700 h-1 w-full max-w-xs rounded-full">
                <div
                  class="bg-primary-500 h-1 rounded-full transition-all duration-500"
                  :style="{ width: `${(countDown / 1.5) * 100}%` }"
                />
              </div>
            </div>
          </BaseCard>
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
