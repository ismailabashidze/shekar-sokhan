<template>
  <div>
    <canvas ref="canvas" class="visualizer-canvas" />
    <button
      v-if="!isStarted"
      class="start-button"
      @click="start"
    >
      شروع
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
const isStarted = ref(false)

let context, analyser, freqs

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

// Get the audio stream
const onStream = (stream) => {
  const input = context.createMediaStreamSource(stream)
  input.connect(analyser)
  requestAnimationFrame(visualize)
}

const onStreamError = (e) => {
  console.error(e)
}

const start = () => {
  context = new AudioContext()
  analyser = context.createAnalyser()
  freqs = new Uint8Array(analyser.frequencyBinCount)
  isStarted.value = true

  navigator.mediaDevices.getUserMedia({ audio: true }).then(onStream).catch(onStreamError)
}

// Initialize dat.GUI after the component mounts
onMounted(() => {
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
</script>

  <style>
  .visualizer-canvas {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 400px;
  }

  .start-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    font-size: 2vw;
    border-radius: 9em;
    padding: 0.5em 1.5em;
    border: none;
    background: rgba(255, 255, 255, 0.8);
  }
  .dg .main .close-button {
    display: none;
  }
  </style>
