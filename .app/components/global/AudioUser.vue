<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useHead } from '@vueuse/head'

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
const isStarted = ref(false) // Unified variable for both starting and recognizing

let context, analyser, freqs
let recognition
let tipTimeout

const finalText = ref('')
const interimText = ref('')
const showTip = ref(false)

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
  const offset = (WIDTH - 15 * opts.width) / 2
  const x = range(15).map(i => offset + channel * opts.shift + i * opts.width)
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
  const ctx = canvas.value.getContext('2d')
  const WIDTH = canvas.value.width = 500 // Reduced canvas width
  const HEIGHT = canvas.value.height = 200 // Reduced canvas height

  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  if (isStarted.value) {
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  requestAnimationFrame(visualize)
}

// Initialize speech recognition
const initSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition()
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onresult = (event) => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText.value += event.results[i][0].transcript
        }
        else {
          interimTranscript += event.results[i][0].transcript
        }
      }

      interimText.value = interimTranscript
    }

    recognition.onend = () => {
      isStarted.value = false
      if (finalText.value.trim() === '') {
        showTipMessage()
      }
      // Stop the audio context when recognition ends
      if (context) context.close()
    }
  }
  else {
    console.warn('Speech recognition not supported in this browser.')
  }
}

// Start speech recognition and audio visualization
const startRecognition = () => {
  if (!isStarted.value) {
    finalText.value = ''
    interimText.value = ''
    isStarted.value = true

    recognition.start()

    context = new AudioContext()
    analyser = context.createAnalyser()
    freqs = new Uint8Array(analyser.frequencyBinCount)

    navigator.mediaDevices.getUserMedia({ audio: true }).then(onStream).catch(onStreamError)
  }
}

// End speech recognition and audio visualization
const endRecognition = () => {
  if (isStarted.value) {
    recognition.stop()
    isStarted.value = false
    if (context) context.close()
  }
}

const onStream = (stream) => {
  const input = context.createMediaStreamSource(stream)
  input.connect(analyser)
  visualize()
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

onMounted(() => {
  initSpeechRecognition()

  // Initialize dat.GUI (optional, can be removed if not needed)
  const gui = new dat.GUI()
  gui.addColor(opts, 'color1')
  gui.addColor(opts, 'color2')
  gui.addColor(opts, 'color3')
  gui.add(opts, 'fillOpacity', 0, 1)
  gui.add(opts, 'lineWidth', 0, 10).step(0.1)
  gui.add(opts, 'glow', 0, 100)
  gui.add(opts, 'blend', ['normal', 'multiply', 'screen', 'overlay', 'lighten', 'difference'])
  gui.add(opts, 'smoothing', 0, 1)
  gui.add(opts, 'minDecibels', -100, 0)
  gui.add(opts, 'amp', 0, 5)
  gui.add(opts, 'width', 0, 60)
  gui.add(opts, 'shift', 0, 200)
  gui.close() // Hide controls initially
})

onBeforeUnmount(() => {
  if (recognition) recognition.abort()
  if (context) context.close()
})
const closeModal = () => {

}
</script>

<template>
  <div>
    <div>
      <BaseCard
        rounded="md"
        shadow="flat"
        class="p-6"
      >
        <BaseHeading
          weight="semibold"
          lead="tight"
        >
          تبدیل صوت به متن:
        </BaseHeading>
        <BaseParagraph class="mt-5" size="lg">
          متن وارد شده:
          <!-- Show interim text during recognition, final text after release -->
          <span
            v-if="isStarted"
            id="interim_span"
            class="interim"
          >{{ interimText }}</span>
          <span
            v-else
            id="final_span"
            class="final"
          >{{ finalText }}</span>
        </BaseParagraph>
        <BaseMessage color="primary" class="m-3 flex items-center justify-center">
          <canvas ref="canvas" class="visualizer-canvas" />
        </BaseMessage>

        <div
          class="flex items-center justify-center gap-4"
        >
          <BaseButtonIcon
            id="button"
            rounded="full"
            color="default"
            role="button"
            tabindex="0"
            :class="{ cancel: isStarted }"
            @mousedown="startRecognition"
            @mouseup="endRecognition"
            @touchstart="startRecognition"
            @touchend="endRecognition"
          >
            <Icon :name="isStarted ? '' : 'ph:microphone'" class="size-5" />
          </BaseButtonIcon>
          <BaseButtonIcon
            rounded="full"
            color="success"
            role="button"
            tabindex="0"
            @click="closeModal()"
          >
            <Icon name="ph:check" class="size-5" />
          </BaseButtonIcon>
          <div id="tip" :class="{ show: showTip }">
            نگه دارید و صحبت کنید
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.visualizer-canvas {
  position: relative; /* Changed from absolute to relative */
  margin: 20px auto;  /* Center the canvas */
  display: block;
  width: 500px;       /* Match the reduced canvas width */
  height: 200px;      /* Match the reduced canvas height */
  background-color: transparent;
}

#interim_span {
  opacity: 0.6;
}

#tip {
  position: absolute;
  bottom: 100px;
  left: 50%;
  width: 250px;
  color: rgba(255, 255, 255, 0.75);
  margin-left: -125px;
  text-align: center;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.4s ease-in;
}
#tip.show {
  opacity: 0.8;
  transform: translateY(0);
  transition: all 0.3s ease-out;
}

#button:active {
  background-color: #dd0022;
}
#button:active #microphone {
  display: none;
}

#button.cancel #microphone {
  fill: transparent;
}
#button.cancel:before,
#button.cancel:after {
  position: absolute;
  background-color: #fff;
  width: 2px;
  height: 16px;
  display: block;
  content: '';
  transform: rotate(45deg);
  left: 50%;
  top: 50%;
  margin-left: -1px;
  margin-top: -8px;
  opacity: 0.8;
  z-index: 15;
}
#button.cancel:after {
  transform: rotate(-45deg);
}
</style>
