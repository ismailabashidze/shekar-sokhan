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
  scale: 0.2,
  glow: 10,
  color1: [203, 36, 128],
  color2: [41, 200, 192],
  color3: [24, 137, 218],
  fillOpacity: 0.6,
  lineWidth: 1,
  blend: 'screen',
  shift: 50,
  width: 60,
  amp: 1,
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

  const HEIGHT = 400
  const WIDTH = 1000
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
  if (!isStarted.value) return

  analyser.smoothingTimeConstant = opts.smoothing
  analyser.fftSize = Math.pow(2, opts.fft)
  analyser.minDecibels = opts.minDecibels
  analyser.maxDecibels = 0
  analyser.getByteFrequencyData(freqs)

  canvas.value.width = 1000
  canvas.value.height = 400

  path(0)
  path(1)
  path(2)

  requestAnimationFrame(visualize)
}

// Initialize speech recognition
const initSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition()
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
        else {
          interimTranscript += event.results[i][0].transcript
        }
      }

      finalText.value = finalTranscript
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

  // Initialize dat.GUI
  const gui = new dat.GUI()
  gui.addColor(opts, 'color1')
  gui.addColor(opts, 'color2')
  gui.addColor(opts, 'color3')
  gui.add(opts, 'fillOpacity', 0, 1)
  gui.add(opts, 'lineWidth', 0, 10).step(1)
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
          <span id="final_span" class="final">{{ finalText }}</span>
          <span id="interim_span" class="interim">{{ interimText }}</span>
        </BaseParagraph>
        <canvas ref="canvas" class="visualizer-canvas" />
      </BaseCard>
      <BaseButton
        id="button"
        role="button"
        tabindex="0"
        rounded="full"
        :class="{ cancel: isStarted }"
        @mousedown="startRecognition"
        @mouseup="endRecognition"
        @touchstart="startRecognition"
        @touchend="endRecognition"
      >
        <Icon
          id="microphone"
          name="ph:microphone"
          class="size-5"
        />
        <div id="contents" />
      </BaseButton>
      <div id="tip" :class="{ show: showTip }">
        نگه دارید و صحبت کنید
      </div>
    </div>
  </div>
</template>

<style scoped>
.visualizer-canvas {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 400px;
}

#results {
  width: 100%;
  padding: 0 20px;
  max-width: 500px;
  margin: 0 auto;
  margin-top: 50px;
  font-size: 24px;
  font-weight: 300;
  line-height: 1.5em;
}

#interim_span {
  opacity: 0.4;
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
