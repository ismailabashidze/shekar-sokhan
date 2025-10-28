<template>
  <div class="from-primary-50 dark:from-muted-900 dark:via-muted-800 dark:to-muted-900 min-h-screen bg-gradient-to-br via-white to-blue-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div class="border-primary-500 mx-auto mb-4 size-12 animate-spin rounded-full border-2 border-t-transparent" />
        <p class="text-muted-600 dark:text-muted-400">
          در حال بارگذاری مصاحبه...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex min-h-screen items-center justify-center">
      <div class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
        <Icon name="ph:warning" class="mx-auto mb-4 size-12 text-red-500" />
        <h2 class="mb-2 text-xl font-bold text-red-800 dark:text-red-200">
          خطا در بارگذاری مصاحبه
        </h2>
        <p class="text-red-600 dark:text-red-400">
          {{ error }}
        </p>
        <button class="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600" @click="$router.push('/diagnosis/categories')">
          بازگشت به دسته‌بندی‌ها
        </button>
      </div>
    </div>

    <!-- Main Interview Content -->
    <div v-else-if="disorderInfo && currentStep">
      <!-- Header Section -->
      <div class="dark:bg-muted-800/80 dark:border-muted-700/50 border-b border-white/20 bg-white/80 backdrop-blur-sm">
        <div class="container mx-auto max-w-7xl px-4 py-6">
          <!-- Navigation Breadcrumb -->
          <div class="mb-4 flex items-center justify-between">
            <div class="text-muted-600 dark:text-muted-400 flex items-center gap-2 text-sm">
              <Icon name="ph:house" class="size-4" />
              <NuxtLink to="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                خانه
              </NuxtLink>
              <Icon name="ph:caret-left" class="size-3" />
              <NuxtLink to="/diagnosis" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                راهنمای تشخیصی
              </NuxtLink>
              <Icon name="ph:caret-left" class="size-3" />
              <span class="text-primary-600 dark:text-primary-400 font-medium">مصاحبه تشخیصی</span>
            </div>
            <BaseThemeToggle />
          </div>

          <!-- Interview Header -->
          <div class="mb-4 flex items-center gap-4">
            <div class="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-3">
              <Icon name="ph:user-focus" class="size-8 text-white" />
            </div>
            <div>
              <h1 class="text-muted-800 text-2xl font-bold dark:text-white">
                مصاحبه تشخیصی {{ disorderInfo.title }}
              </h1>
              <p class="text-muted-600 dark:text-muted-400">
                {{ disorderInfo.titleEn }} ({{ disorderInfo.code || 'DSM-5' }})
              </p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-6">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-muted-700 dark:text-muted-300 text-sm font-medium">پیشرفت مصاحبه</span>
              <span class="text-primary-600 dark:text-primary-400 text-sm font-medium">
                مرحله {{ currentStepIndex + 1 }} از {{ interviewSteps.length }}
              </span>
            </div>
            <div class="bg-muted-200 dark:bg-muted-700 h-2 w-full rounded-full">
              <div
                class="bg-primary-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: `${((currentStepIndex + 1) / interviewSteps.length) * 100}%` }"
              />
            </div>
          </div>

          <!-- Visual Step Graph -->
          <div class="mb-6">
            <h3 class="text-muted-700 dark:text-muted-300 mb-4 text-sm font-medium">
              نقشه مراحل مصاحبه
            </h3>
            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 step-graph-container rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
              <!-- Compact Step Flow -->
              <div class="relative pb-16 pt-8">
                <!-- Step Indicators -->
                <div class="relative flex items-center justify-between">
                  <!-- Background Progress Line -->
                  <div class="bg-muted-200 dark:bg-muted-700 absolute inset-x-0 top-6 h-2 rounded-full">
                    <div
                      class="from-primary-500 h-2 rounded-full bg-gradient-to-r to-green-500 transition-all duration-1000 ease-out"
                      :style="{ width: `${Math.max(8, (completedSteps.length / Math.max(1, interviewSteps.length)) * 100)}%` }"
                    />
                  </div>
                  <div
                    v-for="(step, index) in interviewSteps"
                    :key="step.id"
                    class="group relative"
                    :class="{ 'cursor-pointer': canNavigateToStep(step.id) }"
                  >
                    <!-- Step Circle -->
                    <div
                      class="dark:bg-muted-800 relative z-10 flex size-12 items-center justify-center rounded-full border-4 bg-white transition-all duration-300"
                      :class="[
                        step.id === currentStep?.id
                          ? 'border-primary-500 shadow-primary-500/30 scale-110 shadow-lg'
                          : completedSteps.includes(step.id)
                            ? 'border-green-500 shadow-lg shadow-green-500/20'
                            : canNavigateToStep(step.id)
                              ? 'border-muted-300 dark:border-muted-600 hover:border-primary-400 cursor-pointer hover:scale-105'
                              : 'border-muted-200 dark:border-muted-700 cursor-not-allowed opacity-60'
                      ]"
                      @click="canNavigateToStep(step.id) && navigateToStep(step.id)"
                    >
                      <!-- Step Content -->
                      <div v-if="completedSteps.includes(step.id)" class="text-green-600">
                        <Icon name="ph:check-bold" class="size-6" />
                      </div>
                      <div v-else-if="step.id === currentStep?.id" class="text-primary-600">
                        <Icon name="ph:play-fill" class="size-6" />
                      </div>
                      <div v-else class="text-muted-500 dark:text-muted-400 text-sm font-bold">
                        {{ index + 1 }}
                      </div>
                    </div>

                    <!-- Step Label -->
                    <div class="absolute left-1/2 top-16 min-w-max -translate-x-1/2 text-center">
                      <div
                        class="max-w-20 break-words rounded-md px-2 py-1 text-xs font-medium"
                        :class="[
                          step.id === currentStep?.id
                            ? 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20'
                            : completedSteps.includes(step.id)
                              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                              : 'text-muted-600 dark:text-muted-400'
                        ]"
                      >
                        {{ step.title }}
                      </div>
                    </div>

                    <!-- Hover Tooltip -->
                    <div class="pointer-events-none absolute -top-20 left-1/2 z-30 -translate-x-1/2 opacity-0 transition-all delay-500 duration-300 group-hover:opacity-100">
                      <div class="bg-muted-900 dark:bg-muted-100 dark:text-muted-900 border-muted-700 dark:border-muted-300 w-32 rounded-lg border px-3 py-2 text-xs text-white shadow-2xl">
                        <div class="mb-1 text-center font-semibold leading-tight">
                          {{ step.title }}
                        </div>
                        <div class="text-muted-300 dark:text-muted-600 text-center text-xs leading-tight">
                          {{ step.description ? (step.description.length > 60 ? step.description.substring(0, 60) + '...' : step.description) : 'مرحله ' + (index + 1) + ' از مصاحبه' }}
                        </div>
                        <!-- Arrow pointing down -->
                        <div class="absolute left-1/2 top-full -translate-x-1/2">
                          <div class="border-t-muted-900 dark:border-t-muted-100 border-x-4 border-t-4 border-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Progress Stats -->
              <div class="mt-12 grid grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                    {{ completedSteps.length }}
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    تکمیل شده
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-primary-600 dark:text-primary-400 text-2xl font-bold">
                    {{ currentStep ? 1 : 0 }}
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    جاری
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-muted-500 dark:text-muted-400 text-2xl font-bold">
                    {{ Math.max(0, interviewSteps.length - completedSteps.length - (currentStep ? 1 : 0)) }}
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    باقی‌مانده
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Steps Navigation -->
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="(step, index) in interviewSteps"
              :key="step.id"
              :disabled="!canNavigateToStep(step.id)"
              class="shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
              :class="[
                step.id === currentStep.id
                  ? 'bg-primary-500 text-white'
                  : completedSteps.includes(step.id)
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : canNavigateToStep(step.id)
                      ? 'bg-muted-100 dark:bg-muted-700 text-muted-700 dark:text-muted-300 hover:bg-primary-100 dark:hover:bg-primary-900/30'
                      : 'bg-muted-50 dark:bg-muted-800/50 text-muted-400 dark:text-muted-500 cursor-not-allowed'
              ]"
              @click="navigateToStep(step.id)"
            >
              {{ index + 1 }}. {{ step.title }}
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="container mx-auto max-w-7xl px-4 py-8">
        <div class="grid grid-cols-1 gap-8 xl:grid-cols-4">
          <!-- Main Interview Area -->
          <div class="xl:col-span-3">
            <!-- Current Step -->
            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-8 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
              <!-- Step Header -->
              <div class="mb-8">
                <div class="mb-4 flex items-center gap-3">
                  <div class="bg-primary-500 rounded-full p-3">
                    <Icon :name="getStepIcon(currentStep.id)" class="size-6 text-white" />
                  </div>
                  <div>
                    <h2 class="text-muted-800 text-2xl font-bold dark:text-white">
                      {{ currentStep.title }}
                    </h2>
                    <p class="text-muted-600 dark:text-muted-400">
                      {{ currentStep.description }}
                    </p>
                  </div>
                </div>

                <!-- Goals -->
                <div class="mb-4 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h3 class="mb-2 flex items-center gap-2 font-semibold text-blue-800 dark:text-blue-300">
                    <Icon name="ph:target" class="size-5" />
                    اهداف این مرحله
                  </h3>
                  <ul class="space-y-1">
                    <li
                      v-for="goal in currentStep.goals"
                      :key="goal"
                      class="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300"
                    >
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0" />
                      <span>{{ goal }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Precautions -->
                <div v-if="currentStep.precautions?.length" class="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
                  <h3 class="mb-2 flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
                    <Icon name="ph:warning-circle" class="size-5" />
                    نکات مهم و احتیاط‌ها
                  </h3>
                  <ul class="space-y-1">
                    <li
                      v-for="precaution in currentStep.precautions"
                      :key="precaution"
                      class="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300"
                    >
                      <Icon name="ph:warning" class="mt-0.5 size-4 shrink-0" />
                      <span>{{ precaution }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Tasks -->
              <div class="space-y-6">
                <div
                  v-for="task in currentStep.tasks"
                  :key="task.id"
                  class="border-muted-200 dark:border-muted-700 rounded-xl border p-6"
                >
                  <div class="mb-4 flex items-start justify-between gap-4">
                    <div class="flex items-start gap-3">
                      <Icon :name="getTaskIcon(task.type)" class="text-primary-500 mt-1 size-5 shrink-0" />
                      <div>
                        <h4 class="text-muted-800 mb-1 font-semibold dark:text-white">
                          {{ task.content }}
                        </h4>
                        <span class="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full px-2 py-1 text-xs">
                          {{ getTaskTypeLabel(task.type) }}
                        </span>
                      </div>
                    </div>
                    <div v-if="task.required" class="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-300">
                      ضروری
                    </div>
                  </div>

                  <!-- Task Input -->
                  <div class="mt-4">
                    <!-- Multiple Choice Questions -->
                    <div v-if="task.options" class="space-y-2">
                      <div
                        v-for="option in task.options"
                        :key="option"
                        class="flex items-center gap-3"
                      >
                        <input
                          :id="`${task.id}-${option}`"
                          v-model="taskResponses[task.id]"
                          :value="option"
                          type="radio"
                          :name="task.id"
                          class="text-primary-500 border-muted-300 focus:ring-primary-500 size-4"
                        >
                        <label :for="`${task.id}-${option}`" class="text-muted-700 dark:text-muted-300 text-sm">{{ option }}</label>
                      </div>
                    </div>

                    <!-- Text Input for Observations/Notes -->
                    <div v-else-if="task.type === 'observation' || task.type === 'documentation'">
                      <textarea
                        v-model="taskResponses[task.id]"
                        rows="4"
                        class="border-muted-300 dark:border-muted-600 dark:bg-muted-800 text-muted-800 w-full rounded-lg border bg-white p-3 dark:text-white"
                        :placeholder="getTaskPlaceholder(task.type)"
                      />
                    </div>

                    <!-- Assessment Input -->
                    <div v-else-if="task.type === 'assessment'">
                      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label class="text-muted-700 dark:text-muted-300 mb-2 block text-sm font-medium">نتیجه ارزیابی</label>
                          <select v-model="taskResponses[task.id]" class="border-muted-300 dark:border-muted-600 dark:bg-muted-800 w-full rounded-lg border bg-white p-2">
                            <option value="">
                              انتخاب کنید
                            </option>
                            <option value="positive">
                              مثبت
                            </option>
                            <option value="negative">
                              منفی
                            </option>
                            <option value="inconclusive">
                              غیرقطعی
                            </option>
                          </select>
                        </div>
                        <div class="md:col-span-2">
                          <label class="text-muted-700 dark:text-muted-300 mb-2 block text-sm font-medium">یادداشت‌ها</label>
                          <textarea
                            v-model="taskNotes[task.id]"
                            rows="3"
                            class="border-muted-300 dark:border-muted-600 dark:bg-muted-800 w-full rounded-lg border bg-white p-3"
                            placeholder="یادداشت‌های تکمیلی..."
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Simple Yes/No for Questions -->
                    <div v-else class="space-y-2">
                      <div class="flex gap-4">
                        <label class="flex items-center gap-2">
                          <input
                            v-model="taskResponses[task.id]"
                            value="yes"
                            type="radio"
                            :name="task.id"
                            class="size-4 text-green-500"
                          >
                          <span class="text-sm text-green-700 dark:text-green-300">بله</span>
                        </label>
                        <label class="flex items-center gap-2">
                          <input
                            v-model="taskResponses[task.id]"
                            value="no"
                            type="radio"
                            :name="task.id"
                            class="size-4 text-red-500"
                          >
                          <span class="text-sm text-red-700 dark:text-red-300">خیر</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation Actions -->
              <div class="border-muted-200 dark:border-muted-700 mt-8 flex items-center justify-between border-t pt-6">
                <button
                  v-if="currentStepIndex > 0"
                  class="text-muted-600 dark:text-muted-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-2 px-4 py-2 transition-colors"
                  @click="goToPreviousStep"
                >
                  <Icon name="ph:arrow-right" class="size-4" />
                  مرحله قبل
                </button>
                <div />

                <div class="flex gap-3">
                  <button
                    class="bg-muted-200 dark:bg-muted-700 text-muted-700 dark:text-muted-300 hover:bg-muted-300 dark:hover:bg-muted-600 rounded-lg px-4 py-2 transition-colors"
                    @click="saveStepProgress"
                  >
                    ذخیره پیشرفت
                  </button>
                  <button
                    :disabled="!canCompleteStep"
                    class="bg-primary-500 hover:bg-primary-600 rounded-lg px-6 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    @click="completeStep"
                  >
                    {{ isLastStep ? 'اتمام مصاحبه' : 'مرحله بعد' }}
                    <Icon name="ph:arrow-left" class="mr-2 inline size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="xl:col-span-1">
            <!-- Interview Progress -->
            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-6 rounded-3xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <h3 class="text-muted-800 mb-4 flex items-center gap-2 font-semibold dark:text-white">
                <Icon name="ph:chart-line" class="size-5" />
                وضعیت مصاحبه
              </h3>

              <div class="space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-muted-600 dark:text-muted-400">مراحل تکمیل شده</span>
                  <span class="font-medium text-green-600 dark:text-green-400">{{ completedSteps.length }}/{{ interviewSteps.length }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-muted-600 dark:text-muted-400">زمان شروع</span>
                  <span class="text-muted-800 font-medium dark:text-white">{{ formatTime(session.startTime) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-muted-600 dark:text-muted-400">مدت زمان</span>
                  <span class="text-muted-800 font-medium dark:text-white">{{ getElapsedTime() }}</span>
                </div>
              </div>
            </div>

            <!-- Quick Notes -->
            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-6 rounded-3xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <h3 class="text-muted-800 mb-4 flex items-center gap-2 font-semibold dark:text-white">
                <Icon name="ph:note-pencil" class="size-5" />
                یادداشت‌های سریع
              </h3>

              <textarea
                v-model="quickNotes"
                rows="6"
                class="border-muted-300 dark:border-muted-600 dark:bg-muted-800 w-full rounded-lg border bg-white p-3 text-sm"
                placeholder="یادداشت‌های کلی مصاحبه..."
              />

              <button
                class="bg-primary-500 hover:bg-primary-600 mt-3 w-full rounded-lg px-4 py-2 text-sm text-white transition-colors"
                @click="saveQuickNotes"
              >
                ذخیره یادداشت
              </button>
            </div>

            <!-- Activity Log -->
            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-3xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <h3 class="text-muted-800 mb-4 flex items-center gap-2 font-semibold dark:text-white">
                <Icon name="ph:list-bullets" class="size-5" />
                گزارش فعالیت‌ها
              </h3>

              <div class="max-h-64 space-y-3 overflow-y-auto">
                <div
                  v-for="log in activityLogs.slice().reverse()"
                  :key="log.id"
                  class="flex items-start gap-3 text-xs"
                >
                  <Icon :name="getLogIcon(log.action)" class="text-muted-500 mt-0.5 size-4 shrink-0" />
                  <div>
                    <p class="text-muted-800 dark:text-white">
                      {{ getLogDescription(log) }}
                    </p>
                    <p class="text-muted-500 dark:text-muted-400">
                      {{ formatTime(log.timestamp) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDSMInfoGenerator } from '~/composables/useDSMInfoGenerator';

// Types
interface InterviewStep {
  id: string;
  title: string;
  description: string;
  goals: string[];
  precautions: string[];
  tasks: Task[];
  passCriteria: PassCriteria;
  connectedSteps: string[];
  isStatic?: boolean;
}

interface Task {
  id: string;
  type: 'observation' | 'question' | 'assessment' | 'documentation';
  content: string;
  required: boolean;
  options?: string[];
}

interface PassCriteria {
  requiredTasks: string[];
  optionalTasks: string[];
  minimumScore?: number;
}

interface InterviewLog {
  id: string;
  timestamp: Date;
  action: 'step_started' | 'step_completed' | 'step_failed' | 'task_completed' | 'note_added';
  stepId: string;
  details: Record<string, any>;
}

// Route params
const route = useRoute();
const disorderSlug = route.params.disorder as string;

// Composables
const { fetchDisorderBySlug } = useDSMInfoGenerator();

// State
const disorderInfo = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const currentStepId = ref<string>('');
const completedSteps = ref<string[]>([]);
const taskResponses = ref<Record<string, any>>({});
const taskNotes = ref<Record<string, string>>({});
const quickNotes = ref('');
const activityLogs = ref<InterviewLog[]>([]);
const session = ref({
  disorderId: '',
  startTime: new Date(),
  endTime: null as Date | null,
});

// Generate interview steps based on disorder info
const generateInterviewSteps = (disorder: any): InterviewStep[] => {
  const steps: InterviewStep[] = [
    // Static Step 1: Introduction
    {
      id: 'introduction',
      title: 'معرفی و آشنایی',
      description: 'معرفی درمانگر، توضیح فرآیند مصاحبه و کسب رضایت',
      isStatic: true,
      goals: [
        'برقراری ارتباط مناسب با مراجع',
        'توضیح فرآیند مصاحبه و اهداف آن',
        'کسب رضایت آگاهانه',
        'ایجاد محیط امن و راحت',
      ],
      precautions: [
        'حفظ محرمانگی اطلاعات',
        'عدم قضاوت در مورد مراجع',
        'استفاده از زبان ساده و قابل فهم',
        'توجه به نشانه‌های استرس یا نگرانی',
      ],
      tasks: [
        {
          id: 'therapist-intro',
          type: 'documentation',
          content: 'معرفی خود، سوابق تحصیلی و حرفه‌ای',
          required: true,
        },
        {
          id: 'process-explanation',
          type: 'question',
          content: 'آیا فرآیند مصاحبه و اهداف آن به طور کامل توضیح داده شد؟',
          required: true,
        },
        {
          id: 'consent-obtained',
          type: 'question',
          content: 'آیا رضایت آگاهانه کسب شد؟',
          required: true,
        },
        {
          id: 'comfort-check',
          type: 'observation',
          content: 'ارزیابی سطح راحتی و آمادگی مراجع',
          required: true,
        },
      ],
      passCriteria: {
        requiredTasks: ['therapist-intro', 'process-explanation', 'consent-obtained', 'comfort-check'],
        optionalTasks: [],
      },
      connectedSteps: ['symptom-screening'],
    },

    // Dynamic steps based on disorder
    {
      id: 'symptom-screening',
      title: 'غربالگری علائم اولیه',
      description: `بررسی علائم اصلی ${disorder.title || disorder.titleFa || 'این اختلال'}`,
      goals: [
        'شناسایی علائم اصلی و کلیدی اختلال',
        'ارزیابی شدت و مدت علائم',
        'بررسی الگوی شروع علائم',
      ],
      precautions: [
        'دقت در ثبت جزئیات علائم',
        'پرسش سوالات باز',
        'عدم تلقین علائم',
      ],
      tasks: generateSymptomTasks(disorder),
      passCriteria: {
        requiredTasks: ['main-symptoms-check'],
        optionalTasks: ['severity-assessment'],
      },
      connectedSteps: ['diagnostic-criteria'],
    },

    {
      id: 'diagnostic-criteria',
      title: 'بررسی معیارهای تشخیصی',
      description: 'ارزیابی معیارهای DSM-5 برای تشخیص',
      goals: [
        'بررسی هر معیار تشخیصی به طور جداگانه',
        'ثبت شواهد موافق یا مخالف',
        'ارزیابی مدت زمان علائم',
      ],
      precautions: [
        'رعایت ترتیب معیارهای DSM-5',
        'دقت در محاسبه مدت علائم',
        'جمع‌آوری شواهد کافی',
      ],
      tasks: generateDiagnosticCriteriaTasks(disorder),
      passCriteria: {
        requiredTasks: ['criteria-assessment'],
        optionalTasks: [],
      },
      connectedSteps: ['differential-diagnosis'],
    },

    {
      id: 'differential-diagnosis',
      title: 'تشخیص افتراقی',
      description: 'بررسی اختلالات مشابه و حذف تشخیص‌های جایگزین',
      goals: [
        'بررسی اختلالات مشابه',
        'تعیین علت‌های طبی احتمالی',
        'حذف تشخیص‌های جایگزین',
      ],
      precautions: [
        'دقت در تفکیک اختلالات',
        'در نظر گیری همه احتمالات',
        'مراجعه برای بررسی‌های طبی در صورت نیاز',
      ],
      tasks: generateDifferentialTasks(disorder),
      passCriteria: {
        requiredTasks: ['differential-review'],
        optionalTasks: ['medical-causes'],
      },
      connectedSteps: ['risk-assessment'],
    },

    {
      id: 'risk-assessment',
      title: 'ارزیابی خطرات',
      description: 'بررسی خطر خودکشی، خودآسیبی و سایر خطرات',
      goals: [
        'ارزیابی خطر خودکشی',
        'بررسی خطر آسیب به دیگران',
        'شناسایی عوامل محافظت‌کننده',
      ],
      precautions: [
        'جدی گرفتن هر نشانه خطر',
        'مستندسازی دقیق ارزیابی خطر',
        'برنامه‌ریزی ایمنی در صورت نیاز',
      ],
      tasks: [
        {
          id: 'suicide-risk',
          type: 'assessment',
          content: 'ارزیابی خطر خودکشی',
          required: true,
        },
        {
          id: 'self-harm-risk',
          type: 'assessment',
          content: 'ارزیابی خطر خودآسیبی',
          required: true,
        },
        {
          id: 'protective-factors',
          type: 'observation',
          content: 'شناسایی عوامل محافظت‌کننده',
          required: false,
        },
      ],
      passCriteria: {
        requiredTasks: ['suicide-risk', 'self-harm-risk'],
        optionalTasks: ['protective-factors'],
      },
      connectedSteps: ['treatment-planning'],
    },

    {
      id: 'treatment-planning',
      title: 'برنامه‌ریزی درمان',
      description: 'تدوین برنامه درمانی اولیه و توصیه‌ها',
      goals: [
        'تعیین اهداف درمانی',
        'انتخاب روش‌های درمانی مناسب',
        'برنامه‌ریزی جلسات بعدی',
      ],
      precautions: [
        'در نظر گیری ترجیحات مراجع',
        'واقعی بودن اهداف درمانی',
        'توضیح روند درمان',
      ],
      tasks: [
        {
          id: 'treatment-goals',
          type: 'documentation',
          content: 'تعیین اهداف درمانی کوتاه و بلندمدت',
          required: true,
        },
        {
          id: 'treatment-methods',
          type: 'documentation',
          content: 'انتخاب روش‌های درمانی مناسب',
          required: true,
        },
        {
          id: 'next-session',
          type: 'documentation',
          content: 'برنامه‌ریزی جلسه بعدی',
          required: true,
        },
      ],
      passCriteria: {
        requiredTasks: ['treatment-goals', 'treatment-methods', 'next-session'],
        optionalTasks: [],
      },
      connectedSteps: [],
    },
  ];

  return steps;
};

// Helper functions for task generation
const generateSymptomTasks = (disorder: any): Task[] => {
  const tasks: Task[] = [
    {
      id: 'main-symptoms-check',
      type: 'question',
      content: 'آیا مراجع علائم اصلی اختلال را دارد؟',
      required: true,
      options: ['بله، همه علائم', 'بله، برخی علائم', 'خیر'],
    },
  ];

  if (disorder.diagnosticMarkers) {
    disorder.diagnosticMarkers.forEach((category: any, index: number) => {
      tasks.push({
        id: `symptom-category-${index}`,
        type: 'observation',
        content: `بررسی ${category.category}`,
        required: false,
      });
    });
  }

  return tasks;
};

const generateDiagnosticCriteriaTasks = (disorder: any): Task[] => {
  const tasks: Task[] = [
    {
      id: 'criteria-assessment',
      type: 'assessment',
      content: 'ارزیابی کلی معیارهای تشخیصی',
      required: true,
    },
  ];

  return tasks;
};

const generateDifferentialTasks = (disorder: any): Task[] => {
  const tasks: Task[] = [
    {
      id: 'differential-review',
      type: 'assessment',
      content: 'بررسی اختلالات افتراقی',
      required: true,
    },
  ];

  if (disorder.differentialDiagnosis) {
    disorder.differentialDiagnosis.forEach((diff: any, index: number) => {
      tasks.push({
        id: `differential-${index}`,
        type: 'question',
        content: `آیا علائم ${diff.disorder} وجود دارد؟`,
        required: false,
      });
    });
  }

  return tasks;
};

// Computed properties
const interviewSteps = computed(() => {
  if (!disorderInfo.value) return [];
  return generateInterviewSteps(disorderInfo.value);
});

const currentStep = computed(() => {
  return interviewSteps.value.find(step => step.id === currentStepId.value);
});

const currentStepIndex = computed(() => {
  return interviewSteps.value.findIndex(step => step.id === currentStepId.value);
});

const isLastStep = computed(() => {
  return currentStepIndex.value === interviewSteps.value.length - 1;
});

const canCompleteStep = computed(() => {
  if (!currentStep.value) return false;

  const requiredTasks = currentStep.value.passCriteria.requiredTasks;
  return requiredTasks.every((taskId) => {
    return taskResponses.value[taskId] !== undefined && taskResponses.value[taskId] !== '';
  });
});

// Methods
const navigateToStep = (stepId: string) => {
  if (canNavigateToStep(stepId)) {
    console.log('🚀 Navigating to step:', stepId);
    addActivityLog('step_started', stepId);
    currentStepId.value = stepId;
  }
  else {
    console.log('❌ Cannot navigate to step:', stepId);
  }
};

const canNavigateToStep = (stepId: string): boolean => {
  const stepIndex = interviewSteps.value.findIndex(step => step.id === stepId);
  const currentIndex = currentStepIndex.value;

  // Can always go to completed steps or current step
  if (completedSteps.value.includes(stepId) || stepId === currentStepId.value) {
    return true;
  }

  // Can only go forward one step at a time
  return stepIndex === currentIndex + 1;
};

const completeStep = () => {
  if (!currentStep.value || !canCompleteStep.value) return;

  // Mark step as completed
  if (!completedSteps.value.includes(currentStep.value.id)) {
    completedSteps.value.push(currentStep.value.id);
  }

  addActivityLog('step_completed', currentStep.value.id, {
    responses: { ...taskResponses.value },
    notes: { ...taskNotes.value },
  });

  // Move to next step or finish
  if (!isLastStep.value) {
    const nextStepIndex = currentStepIndex.value + 1;
    currentStepId.value = interviewSteps.value[nextStepIndex].id;
  }
  else {
    finishInterview();
  }
};

const goToPreviousStep = () => {
  if (currentStepIndex.value > 0) {
    const prevStepIndex = currentStepIndex.value - 1;
    currentStepId.value = interviewSteps.value[prevStepIndex].id;
  }
};

const saveStepProgress = () => {
  addActivityLog('note_added', currentStepId.value, {
    progress_saved: true,
    responses: { ...taskResponses.value },
  });
};

const saveQuickNotes = () => {
  addActivityLog('note_added', currentStepId.value, {
    quick_note: quickNotes.value,
  });
};

const finishInterview = () => {
  session.value.endTime = new Date();
  addActivityLog('step_completed', 'interview', {
    total_duration: getElapsedTime(),
    completed_steps: completedSteps.value.length,
  });

  // Here you would typically save the interview results
  console.log('Interview completed!', {
    session: session.value,
    responses: taskResponses.value,
    logs: activityLogs.value,
  });
};

const addActivityLog = (action: InterviewLog['action'], stepId: string, details: Record<string, any> = {}) => {
  activityLogs.value.push({
    id: `log-${Date.now()}`,
    timestamp: new Date(),
    action,
    stepId,
    details,
  });
};

// Helper functions
const getStepIcon = (stepId: string): string => {
  const iconMap: Record<string, string> = {
    'introduction': 'ph:hand-waving',
    'symptom-screening': 'ph:magnifying-glass',
    'diagnostic-criteria': 'ph:check-square',
    'differential-diagnosis': 'ph:scales',
    'risk-assessment': 'ph:warning-circle',
    'treatment-planning': 'ph:calendar-check',
  };
  return iconMap[stepId] || 'ph:circle';
};

const getTaskIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    observation: 'ph:eye',
    question: 'ph:question',
    assessment: 'ph:clipboard-text',
    documentation: 'ph:note-pencil',
  };
  return iconMap[type] || 'ph:circle';
};

const getTaskTypeLabel = (type: string): string => {
  const labelMap: Record<string, string> = {
    observation: 'مشاهده',
    question: 'پرسش',
    assessment: 'ارزیابی',
    documentation: 'مستندسازی',
  };
  return labelMap[type] || type;
};

const getTaskPlaceholder = (type: string): string => {
  const placeholderMap: Record<string, string> = {
    observation: 'مشاهدات خود را ثبت کنید...',
    documentation: 'جزئیات را مستند کنید...',
  };
  return placeholderMap[type] || 'توضیحات...';
};

const getLogIcon = (action: string): string => {
  const iconMap: Record<string, string> = {
    step_started: 'ph:play',
    step_completed: 'ph:check-circle',
    step_failed: 'ph:x-circle',
    task_completed: 'ph:check',
    note_added: 'ph:note',
  };
  return iconMap[action] || 'ph:circle';
};

const getLogDescription = (log: InterviewLog): string => {
  const step = interviewSteps.value.find(s => s.id === log.stepId);
  const stepTitle = step?.title || log.stepId;

  switch (log.action) {
    case 'step_started': return `شروع مرحله: ${stepTitle}`;
    case 'step_completed': return `تکمیل مرحله: ${stepTitle}`;
    case 'step_failed': return `عدم تکمیل مرحله: ${stepTitle}`;
    case 'task_completed': return `تکمیل وظیفه در ${stepTitle}`;
    case 'note_added': return `افزودن یادداشت در ${stepTitle}`;
    default: return `فعالیت در ${stepTitle}`;
  }
};

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getElapsedTime = (): string => {
  const now = new Date();
  const elapsed = now.getTime() - session.value.startTime.getTime();
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const getStepTitle = (stepId: string): string => {
  const step = interviewSteps.value.find(s => s.id === stepId);
  return step?.title || stepId;
};

// Initialize
onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    const disorderResult = await fetchDisorderBySlug(disorderSlug);
    disorderInfo.value = disorderResult;

    // Initialize session
    session.value.disorderId = disorderResult.id;

    // Start with first step
    if (interviewSteps.value.length > 0) {
      currentStepId.value = interviewSteps.value[0].id;
      console.log('✅ Initial step set to:', currentStepId.value);
      console.log('📋 All steps:', interviewSteps.value.map(s => s.id));
      console.log('🎯 Current step object:', currentStep.value);
      addActivityLog('step_started', currentStepId.value);
    }
    else {
      console.error('❌ No interview steps generated!');
    }

    useHead({
      htmlAttrs: { dir: 'rtl' },
      title: `مصاحبه تشخیصی ${disorderResult.title} | ذهنا`,
      meta: [
        {
          name: 'description',
          content: `مصاحبه تشخیصی گام به گام برای ${disorderResult.title} بر اساس معیارهای DSM-5`,
        },
      ],
    });
  }
  catch (err: any) {
    console.error('Error loading disorder data:', err);
    error.value = err.message || 'خطا در بارگذاری اطلاعات';
  }
  finally {
    loading.value = false;
  }
});

definePageMeta({
  layout: 'default',
  title: 'مصاحبه تشخیصی | ذهنا',
});
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Smooth transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* Custom scrollbar for activity log */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

/* Enhanced animations for step graph */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite;
}

/* Step connection lines animation */
@keyframes flow {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 0;
  }
}

.flow-animation {
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 5px,
    rgba(255, 255, 255, 0.3) 5px,
    rgba(255, 255, 255, 0.3) 10px
  );
  animation: flow 1s linear infinite;
}

/* Tooltip improvements */
.group:hover .tooltip {
  transform: translateX(-50%) translateY(-8px);
}

/* Prevent tooltip cutoff */
.step-graph-container {
  overflow: visible;
  padding-top: 2rem;
  padding-bottom: 1rem;
}

/* Responsive graph adjustments */
@media (max-width: 768px) {
  .step-graph-mobile {
    flex-direction: column;
    align-items: stretch;
  }

  .step-graph-mobile .absolute {
    position: relative;
  }

  /* Hide tooltips on mobile to prevent overlap */
  .group:hover .opacity-0 {
    opacity: 0 !important;
  }
}
</style>
