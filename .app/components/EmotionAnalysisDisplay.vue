<script setup lang="ts">
import { ref, computed } from 'vue'
import { convertToEmotionWheel, getActiveEmotions, getDominantEmotion } from '~/utils/emotion-mapper'

// Example JSON data from API response
const emotionAnalysisData = ref([
  {
    "emotionName": "غم",
    "severity": "زیاد"
  },
  {
    "emotionName": "ترس",
    "severity": "متوسط"
  },
  {
    "emotionName": "انتظار",
    "severity": "متوسط"
  },
  {
    "emotionName": "شادی",
    "severity": "خالی"
  },
  {
    "emotionName": "اعتماد",
    "severity": "خالی"
  },
  {
    "emotionName": "تعجب",
    "severity": "خالی"
  },
  {
    "emotionName": "انزجار",
    "severity": "خالی"
  },
  {
    "emotionName": "خشم",
    "severity": "خالی"
  },
  {
    "emotionName": "نامشخص",
    "severity": "خالی"
  }
])

// Convert to EmotionWheel format
const selectedEmotions = computed(() => convertToEmotionWheel(emotionAnalysisData.value))

// Get active emotions for summary
const activeEmotions = computed(() => getActiveEmotions(emotionAnalysisData.value))

// Get dominant emotion
const dominantEmotion = computed(() => getDominantEmotion(emotionAnalysisData.value))

// Handle emotion wheel changes
const handleEmotionChange = (newSelected: string[]) => {
  console.log('Selected emotions changed:', newSelected)
  // You can update your data or emit to parent component
}
</script>

<template>
  <div class="space-y-6">
    <!-- Emotion Analysis Summary -->
    <div class="rounded-lg bg-white p-4 shadow-sm">
      <h3 class="mb-4 text-lg font-medium">تحلیل احساسات</h3>
      
      <!-- Dominant Emotion -->
      <div v-if="dominantEmotion" class="mb-4">
        <p class="text-sm text-gray-600">احساس غالب:</p>
        <p class="text-lg font-semibold">
          {{ dominantEmotion.emotionName }} - {{ dominantEmotion.severity }}
        </p>
      </div>

      <!-- Active Emotions List -->
      <div v-if="activeEmotions.length > 0" class="mb-4">
        <p class="mb-2 text-sm text-gray-600">احساسات فعال:</p>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="emotion in activeEmotions" 
            :key="emotion.emotionName"
            class="rounded-full bg-blue-100 px-3 py-1 text-sm"
          >
            {{ emotion.emotionName }} ({{ emotion.severity }})
          </span>
        </div>
      </div>
    </div>

    <!-- Emotion Wheel Visualization -->
    <div class="rounded-lg bg-white p-4 shadow-sm">
      <h3 class="mb-4 text-lg font-medium">چرخه احساسات</h3>
      <EmotionWheel 
        :model-value="selectedEmotions"
        lang="pes"
        @update:model-value="handleEmotionChange"
      />
    </div>

    <!-- Raw Data (for debugging) -->
    <details class="rounded-lg bg-gray-50 p-4">
      <summary class="cursor-pointer font-medium">داده‌های خام (برای دیباگ)</summary>
      <pre class="mt-2 text-xs">{{ JSON.stringify(emotionAnalysisData, null, 2) }}</pre>
      <pre class="mt-2 text-xs">Selected for wheel: {{ selectedEmotions }}</pre>
    </details>
  </div>
</template> 