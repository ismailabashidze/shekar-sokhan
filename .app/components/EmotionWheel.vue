<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => []
  },
  emotions: {
    type: Array,
    default: () => [
      { category: 'joy', colors: ['#FFFAC0', '#FFFF00', '#FFCC00'], variants: ['serenity', 'joy', 'ecstasy'], angle: 0, oppositeCategory: 'sadness', textRadii: [180, 125, 60] },
      { category: 'trust', colors: ['#C0FFD7', '#00FF99', '#00CC66'], variants: ['acceptance', 'trust', 'admiration'], angle: 45, oppositeCategory: 'disgust', textRadii: [180, 125, 60] },
      { category: 'fear', colors: ['#C0F7FF', '#00E1FF', '#00B3CC'], variants: ['apprehension', 'fear', 'terror'], angle: 90, oppositeCategory: 'anger', textRadii: [180, 125, 60] },
      { category: 'surprise', colors: ['#C0E1FF', '#0099FF', '#0066CC'], variants: ['distraction', 'surprise', 'amazement'], angle: 135, oppositeCategory: 'anticipation', textRadii: [180, 125, 60] },
      { category: 'sadness', colors: ['#C0C8FF', '#000FFF', '#0000CC'], variants: ['pensiveness', 'sadness', 'grief'], angle: 180, oppositeCategory: 'joy', textRadii: [180, 125, 60] },
      { category: 'disgust', colors: ['#E1C0FF', '#9900FF', '#6600CC'], variants: ['boredom', 'disgust', 'loathing'], angle: 225, oppositeCategory: 'trust', textRadii: [180, 125, 60] },
      { category: 'anger', colors: ['#FFC0C0', '#FF0000', '#CC0000'], variants: ['annoyance', 'anger', 'rage'], angle: 270, oppositeCategory: 'fear', textRadii: [180, 125, 60] },
      { category: 'anticipation', colors: ['#FFE1C0', '#FF9900', '#CC6600'], variants: ['interest', 'anticipation', 'vigilance'], angle: 315, oppositeCategory: 'surprise', textRadii: [180, 125, 60] },
    ]
  },
  dyads: {
    type: Array,
    default: () => [
      { label: 'optimism', angle: 337.5, radius: 218 },
      { label: 'love', angle: 22.5, radius: 218 },
      { label: 'submission', angle: 67.5, radius: 218 },
      { label: 'awe', angle: 112.5, radius: 218 },
      { label: 'disapproval', angle: 157.5, radius: 218 },
      { label: 'remorse', angle: 202.5, radius: 218 },
      { label: 'contempt', angle: 247.5, radius: 218 },
      { label: 'aggressiveness', angle: 292.5, radius: 218 },
    ]
  },
  lang: {
    type: String,
    default: 'en',
    validator: (v: string) => ['en', 'pes'].includes(v),
  }
})

const emit = defineEmits(['update:modelValue'])

const localSelected = ref(new Set(props.modelValue))
watch(() => props.modelValue, val => {
  localSelected.value = new Set(val)
})

const emotionKey = (category: string, variant: string) => `${category}|${variant}`
const isSelected = (category: string, variant: string) => localSelected.value.has(emotionKey(category, variant))
const isPrimary = (_emotion: any, vIdx: number) => vIdx === 1

const handleEmotionClick = (category: string, variant: string) => {
  const key = emotionKey(category, variant)
  const next = new Set(localSelected.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  localSelected.value = next
  emit('update:modelValue', Array.from(next))
}

const getPosition = (angle: number, radius: number) => {
  const radians = (angle - 90) * Math.PI / 180
  return {
    x: 250 + radius * Math.cos(radians),
    y: 250 + radius * Math.sin(radians)
  }
}

// Persian translations for emotion variants and dyads
const pesLabels = {
  variants: {
    serenity: 'آرامش', joy: 'شادی', ecstasy: 'وجد',
    acceptance: 'پذیرش', trust: 'اعتماد', admiration: 'تحسین',
    apprehension: 'نگرانی', fear: 'ترس', terror: 'وحشت',
    distraction: 'حواس‌پرتی', surprise: 'شگفتی', amazement: 'اعجاب',
    pensiveness: 'تأمل', sadness: 'اندوه', grief: 'غم',
    boredom: 'کسالت', disgust: 'نفرت', loathing: 'انزجار',
    annoyance: 'رنجش', anger: 'خشم', rage: 'غضب',
    interest: 'علاقه', anticipation: 'انتظار', vigilance: 'هوشیاری',
  },
  dyads: {
    optimism: 'خوش‌بینی', love: 'عشق', submission: 'تسلیم', awe: 'شگفت‌زدگی',
    disapproval: 'عدم تایید', remorse: 'پشیمانی', contempt: 'تحقیر', aggressiveness: 'پرخاشگری',
  }
}

// Get label in correct language
const getLabel = (key: string, type: 'variant' | 'dyad') => {
  if (props.lang === 'pes') {
    if (type === 'variant') return pesLabels.variants[key as keyof typeof pesLabels.variants] || key
    if (type === 'dyad') return pesLabels.dyads[key as keyof typeof pesLabels.dyads] || key
  }
  return key
}
</script>

<template>
  <div>
    <!-- Legend -->
    <div class="mb-4 flex flex-wrap items-center justify-center gap-4 text-sm">
      <div class="flex items-center gap-2">
        <svg width="24" height="24"><circle cx="12" cy="12" r="10" stroke="#222" stroke-width="2" fill="none" stroke-dasharray="4,2" /></svg>
        <span class="font-semibold">{{ props.lang === 'pes' ? 'احساس اولیه' : 'Primary emotion' }}</span>
      </div>
      <div class="flex items-center gap-2">
        <svg width="24" height="24"><circle cx="12" cy="12" r="10" stroke="#333" stroke-width="1.5" fill="none" /></svg>
        <span>{{ props.lang === 'pes' ? 'احساس ثانویه' : 'Secondary emotion' }}</span>
      </div>
      <div class="flex items-center gap-2">
        <svg width="24" height="24"><circle cx="12" cy="12" r="10" stroke="#2563eb" stroke-width="3" fill="none" stroke-dasharray="4,2" /></svg>
        <span>{{ props.lang === 'pes' ? 'انتخاب شده' : 'Selected' }}</span>
      </div>
    </div>
    <div class="relative mx-auto max-w-3xl">
      <svg viewBox="0 0 500 500" class="w-full">
        <defs>
          <filter id="emotion-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#38bdf8" flood-opacity="0.7"/>
            <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#fff" flood-opacity="0.7"/>
          </filter>
        </defs>
        <circle cx="250" cy="250" r="200" fill="none" stroke="#ddd" stroke-width="0.5" stroke-dasharray="5,5" />
        <circle cx="250" cy="250" r="150" fill="none" stroke="#ddd" stroke-width="0.5" stroke-dasharray="5,5" />
        <circle cx="250" cy="250" r="100" fill="none" stroke="#ddd" stroke-width="0.5" stroke-dasharray="5,5" />
        <g v-for="emotion in props.emotions" :key="emotion.category">
          <g v-for="(variant, vIdx) in emotion.variants" :key="variant">
            <path
              :d="createPetalPath(emotion.angle - 22.5, emotion.angle + 22.5, vIdx === 0 ? 150 : vIdx === 1 ? 100 : 0, vIdx === 0 ? 200 : vIdx === 1 ? 150 : 100)"
              :fill="emotion.colors[vIdx]"
              :stroke="isSelected(emotion.category, variant) ? '#2563eb' : (isPrimary(emotion, vIdx) ? '#222' : '#333')"
              :stroke-width="isSelected(emotion.category, variant) ? 2.5 : isPrimary(emotion, vIdx) ? 2.2 : 1"
              :stroke-dasharray="isPrimary(emotion, vIdx) ? '5,3' : '0'"
              :filter="isSelected(emotion.category, variant) ? 'url(#emotion-glow)' : ''"
              :style="isSelected(emotion.category, variant) ? 'transform: scale(1.06); transform-origin: 250px 250px; transition: all 0.18s cubic-bezier(.4,2,.6,1);' : 'transition: all 0.18s cubic-bezier(.4,2,.6,1);'"
              class="cursor-pointer"
              @click="handleEmotionClick(emotion.category, variant)"
            />
          </g>
          <text
            v-for="(variant, vIdx) in emotion.variants"
            :key="variant"
            :x="getPosition(emotion.angle, emotion.textRadii[vIdx]).x"
            :y="getPosition(emotion.angle, emotion.textRadii[vIdx]).y + 4"
            text-anchor="middle"
            dominant-baseline="middle"
            :fill="isSelected(emotion.category, variant) ? '#2563eb' : '#222'"
            :font-size="isSelected(emotion.category, variant) ? 13 : 9"
            :font-weight="isSelected(emotion.category, variant) ? 'bold' : isPrimary(emotion, vIdx) ? 'bold' : 'normal'"
            class="pointer-events-none select-none"
            style="transition: all 0.13s cubic-bezier(.4,2,.6,1);"
          >
            {{ getLabel(variant, 'variant') }}
          </text>
        </g>
        <g v-for="dyad in props.dyads" :key="dyad.label">
          <text
            :x="getPosition(dyad.angle, dyad.radius).x"
            :y="getPosition(dyad.angle, dyad.radius).y + 3"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#333"
            font-size="13"
            class="pointer-events-none select-none"
          >
            {{ getLabel(dyad.label, 'dyad') }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
// Helper for SVG arc path
export function createPetalPath(startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) {
  const toRadians = (deg: number) => (deg - 90) * Math.PI / 180
  const startOuter = {
    x: 250 + outerRadius * Math.cos(toRadians(startAngle)),
    y: 250 + outerRadius * Math.sin(toRadians(startAngle))
  }
  const endOuter = {
    x: 250 + outerRadius * Math.cos(toRadians(endAngle)),
    y: 250 + outerRadius * Math.sin(toRadians(endAngle))
  }
  const startInner = {
    x: 250 + innerRadius * Math.cos(toRadians(endAngle)),
    y: 250 + innerRadius * Math.sin(toRadians(endAngle))
  }
  const endInner = {
    x: 250 + innerRadius * Math.cos(toRadians(startAngle)),
    y: 250 + innerRadius * Math.sin(toRadians(startAngle))
  }
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
    'Z'
  ].join(' ')
}
</script>
