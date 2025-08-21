<script setup lang="ts">
import { ref } from 'vue'
import EmotionWheel from '~/components/EmotionWheel.vue'

const emotions = [
  { category: 'joy', colors: ['#FFFAC0', '#FFFF00', '#FFCC00'], variants: ['serenity', 'joy', 'ecstasy'], angle: 0, oppositeCategory: 'sadness', textRadii: [180, 125, 60] },
  { category: 'trust', colors: ['#C0FFD7', '#00FF99', '#00CC66'], variants: ['acceptance', 'trust', 'admiration'], angle: 45, oppositeCategory: 'disgust', textRadii: [180, 125, 60] },
  { category: 'fear', colors: ['#C0F7FF', '#00E1FF', '#00B3CC'], variants: ['apprehension', 'fear', 'terror'], angle: 90, oppositeCategory: 'anger', textRadii: [180, 125, 60] },
  { category: 'surprise', colors: ['#C0E1FF', '#0099FF', '#0066CC'], variants: ['distraction', 'surprise', 'amazement'], angle: 135, oppositeCategory: 'anticipation', textRadii: [180, 125, 60] },
  { category: 'sadness', colors: ['#C0C8FF', '#000FFF', '#0000CC'], variants: ['pensiveness', 'sadness', 'grief'], angle: 180, oppositeCategory: 'joy', textRadii: [180, 125, 60] },
  { category: 'disgust', colors: ['#E1C0FF', '#9900FF', '#6600CC'], variants: ['boredom', 'disgust', 'loathing'], angle: 225, oppositeCategory: 'trust', textRadii: [180, 125, 60] },
  { category: 'anger', colors: ['#FFC0C0', '#FF0000', '#CC0000'], variants: ['annoyance', 'anger', 'rage'], angle: 270, oppositeCategory: 'fear', textRadii: [180, 125, 60] },
  { category: 'anticipation', colors: ['#FFE1C0', '#FF9900', '#CC6600'], variants: ['interest', 'anticipation', 'vigilance'], angle: 315, oppositeCategory: 'surprise', textRadii: [180, 125, 60] },
]
const dyads = [
  { label: 'optimism', angle: 337.5, radius: 218 },
  { label: 'love', angle: 22.5, radius: 218 },
  { label: 'submission', angle: 67.5, radius: 218 },
  { label: 'awe', angle: 112.5, radius: 218 },
  { label: 'disapproval', angle: 157.5, radius: 218 },
  { label: 'remorse', angle: 202.5, radius: 218 },
  { label: 'contempt', angle: 247.5, radius: 218 },
  { label: 'aggressiveness', angle: 292.5, radius: 218 },
]

const selectedEmotions = ref<string[]>([])
const lang = ref<'en' | 'pes'>('en')

const getEmotionType = (key: string) => {
  const [cat, variant] = key.split('|')
  const emotion = emotions.find(e => e.category === cat)
  return emotion && emotion.variants[1] === variant ? 'Primary' : 'Secondary'
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="mb-6 text-center text-3xl font-bold">
      Wheel of Emotions
    </h1>
    <div class="mb-4 flex justify-center">
      <button :class="['rounded-l border border-gray-300 px-3 py-1', lang === 'en' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700']" @click="lang = 'en'">
        EN
      </button>
      <button :class="['rounded-r border border-gray-300 px-3 py-1', lang === 'pes' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700']" @click="lang = 'pes'">
        FA
      </button>
    </div>
    <EmotionWheel
      v-model="selectedEmotions"
      :emotions="emotions"
      :dyads="dyads"
      :lang="lang"
      class="mb-6"
    />

    <div v-if="selectedEmotions.length" class="mb-6 rounded-lg bg-white p-4 text-center shadow">
      <p class="mb-2 text-xl">
        Selected emotions:
      </p>
      <div class="flex flex-wrap justify-center gap-2">
        <span
          v-for="key in selectedEmotions"
          :key="key"
          class="inline-block rounded bg-blue-100 px-2 py-1 text-sm font-semibold text-blue-800"
        >
          {{ key.split('|')[1] }} <span class="text-gray-500">({{ key.split('|')[0] }})</span>
          <span class="ml-2 rounded px-1 py-0.5 text-xs" :class="getEmotionType(key) === 'Primary' ? 'bg-gray-200 text-gray-900 border border-gray-400' : 'bg-gray-100 text-gray-600'">
            {{ getEmotionType(key) }}
          </span>
        </span>
      </div>
    </div>

    <div class="mx-auto mt-8 max-w-3xl rounded-lg bg-white p-6 shadow">
      <h2 class="mb-4 text-xl font-semibold">
        About the Wheel of Emotions
      </h2>
      <p class="mb-3">
        This diagram, based on Plutchik's Wheel of Emotions, is a psychological tool used to classify and organize human emotions.
      </p>
      <p class="mb-3">
        The emotions are arranged in a flower-like pattern with:
      </p>
      <ul class="mb-3 list-disc pl-6">
        <li>Core emotions appearing toward the center</li>
        <li>Intensity increasing as you move toward the center</li>
        <li>Opposite emotions appearing across from each other</li>
        <li>Adjacent emotions blending to form more complex feelings</li>
      </ul>
      <p>
        Click on any section of the wheel to select or unselect an emotion.
      </p>
    </div>
  </div>
</template>
