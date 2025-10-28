<script setup lang="ts">
import HorizontalSideBar from '~/components/global/HorizontalSideBar.vue';
import { useSessionAnalysis } from '~/composables/useSessionAnalysis';
import { useUser } from '~/composables/user';
import { ref, onMounted, onUnmounted } from 'vue';

definePageMeta({
  title: 'در حال آماده سازی گزارش',
  // layout: 'sidebar',
  layout: 'empty',
  preview: {
    title: 'در حال آماده سازی گزارش',
    description: 'گزارش جلسه در حال آماده سازی است. لطفا صبر کنید.',
    categories: ['layouts', 'profile'],
    src: '/img/screens/layouts-subpages-notifications.png',
    srcDark: '/img/screens/layouts-subpages-notifications-dark.png',
    order: 80,
  },
});
useHead({ htmlAttrs: { dir: 'rtl' } });

const { getAnalysisForSession, generateAnalysis, createAnalysis } = useSessionAnalysis();
const { user, updateUser } = useUser();
const toaster = useToaster();
const isModalOpen = ref(false);
const isPhoneModalOpen = ref(false);
const isSavingPhone = ref(false);
const analysisId = ref('');
const isLoading = ref(true);
const checkInterval = ref(null);
const sessionId = ref('');
const hasCheckedForExistingAnalysis = ref(false);
const phoneNumber = ref('');
const phoneError = ref('');

onMounted(async () => {
  console.log(user.value);

  if (!user.value?.phoneNumber) {
    isPhoneModalOpen.value = true;
    isLoading.value = false;
  }

  // Check if analysis already exists
  try {
    const existingAnalysis = await getAnalysisForSession(sessionId.value);
    if (existingAnalysis && existingAnalysis.id) {
      // Analysis already exists, go directly to it
      analysisId.value = existingAnalysis.id;
      isLoading.value = false;
      isModalOpen.value = true;
      hasCheckedForExistingAnalysis.value = true;
      return;
    }

    // Set up interval to check every 2 seconds for better UX
    checkInterval.value = setInterval(checkForAnalysis, 2000);
  }
  catch (error) {
    console.error('Error checking for existing analysis:', error);
  }
  hasCheckedForExistingAnalysis.value = true;
});

onUnmounted(() => {
  // Clear interval when component is unmounted
  if (checkInterval.value) {
    clearInterval(checkInterval.value);
  }
});

const checkForAnalysis = async () => {
  if (!sessionId.value) {
    console.error('No session ID found');
    return;
  }

  try {
    // Check if analysis exists for this session
    const analysis = await getAnalysisForSession(sessionId.value);

    if (analysis && analysis.id) {
      // Analysis is ready
      analysisId.value = analysis.id;
      isLoading.value = false;

      // Clear interval
      if (checkInterval.value) {
        clearInterval(checkInterval.value);
        checkInterval.value = null;
      }

      // Show modal
      isModalOpen.value = true;

      // Clear localStorage
      localStorage.removeItem('pendingAnalysisSessionId');
    }
  }
  catch (error) {
    console.error('Error checking for analysis:', error);
    // If there's an error, we should stop checking and show an error message
    if (checkInterval.value) {
      clearInterval(checkInterval.value);
      checkInterval.value = null;
    }

    // Show error to user
    toaster.show({
      title: 'خطا',
      message: 'خطا در بررسی آماده بودن گزارش. لطفا دوباره تلاش کنید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    });

    // Redirect to dashboard after showing error
    setTimeout(() => {
      navigateTo('/dashboard');
    }, 3000);
  }
};

const goToAnalysis = () => {
  if (analysisId.value) {
    navigateTo(`/darmana/therapists/analysis?analysis_id=${analysisId.value}`);
  }
  else {
    // If for some reason analysisId is not set, redirect to dashboard
    navigateTo('/dashboard');
  }
};

const validatePhoneNumber = (value) => {
  // Convert Persian numbers to English
  const persianToEnglish = (str) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = 0; i < 10; i++) {
      str = str.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
    }
    return str;
  };

  const sanitizedValue = persianToEnglish(value).replace(/\D/g, '');

  // Check length
  if (sanitizedValue.length !== 11) {
    return 'شماره تماس باید یازده رقم باشد';
  }

  // Check if it starts with 09
  if (!sanitizedValue.startsWith('09')) {
    return 'شماره باید با ۰۹ شروع شود';
  }

  // Check if all characters are digits
  if (!/^\d+$/.test(sanitizedValue)) {
    return 'شماره تماس باید فقط شامل ارقام باشد';
  }

  return null; // Valid phone number
};

const savePhoneNumber = async () => {
  const error = validatePhoneNumber(phoneNumber.value);
  if (error) {
    phoneError.value = error;
    return;
  }

  phoneError.value = '';
  isSavingPhone.value = true;

  try {
    await updateUser({ ...user.value, phoneNumber: phoneNumber.value });

    // Show success message
    toaster.show({
      title: 'موفقیت',
      message: 'شماره تماس با موفقیت ذخیره شد.',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    });

    // Close phone modal and continue with analysis
    isPhoneModalOpen.value = false;
    isSavingPhone.value = false;
    isLoading.value = true;

    try {
      const existingAnalysis = await getAnalysisForSession(sessionId.value);
      if (existingAnalysis && existingAnalysis.id) {
        // Analysis already exists, go directly to it
        analysisId.value = existingAnalysis.id;
        isLoading.value = false;
        isModalOpen.value = true;
        hasCheckedForExistingAnalysis.value = true;
        return;
      }
    }
    catch (error) {
      console.error('Error checking for existing analysis:', error);
    }
    hasCheckedForExistingAnalysis.value = true;
  }
  catch (error) {
    console.error('Error saving phone number:', error);
    isSavingPhone.value = false;
    toaster.show({
      title: 'خطا',
      message: 'خطا در ذخیره شماره تماس. لطفا دوباره تلاش کنید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    });
  }
};

const startAnalysisGeneration = async () => {
  if (!sessionId.value || !hasCheckedForExistingAnalysis.value) return;

  try {
    // Get session details and messages
    const nuxtApp = useNuxtApp();
    const session = await nuxtApp.$pb.collection('sessions').getOne(sessionId.value, {
      expand: 'user, therapist',
    });

    // Get messages for this session
    const messagesRecords = await nuxtApp.$pb.collection('messages').getList(1, 100, {
      filter: `session="${sessionId.value}"`,
      sort: 'time',
    });

    // Format messages for analysis
    const allMessages = messagesRecords.items.map(msg => ({
      role: msg.type === 'sent' ? 'patient' : 'therapist',
      content: msg.message,
    }));

    // Remove first AI message if it was the starting message
    let messagesToAnalyze = allMessages;
    if (allMessages.length > 0 && allMessages[0].role === 'therapist') {
      messagesToAnalyze = allMessages.slice(1);
    }

    // Generate analysis
    const generatedAnalysis = await generateAnalysis({
      sessionId: sessionId.value,
      messages: messagesToAnalyze,
    });

    // Save analysis
    const savedAnalysis = await createAnalysis({
      session: sessionId.value,
      ...generatedAnalysis,
    });

    // Update session with analysis ID
    const endTime = new Date();
    const startTime = new Date(session.created);
    const totalTimePassedMinutes = Math.round((endTime - startTime) / (1000 * 60));

    await nuxtApp.$pb.collection('sessions').update(sessionId.value, {
      status: 'done',
      end_time: endTime.toISOString(),
      count_of_total_messages: messagesToAnalyze.length,
      total_time_passed: totalTimePassedMinutes,
      updated: endTime.toISOString(),
      session_analysis_for_system: savedAnalysis.id,
    });

    console.log('Analysis generation completed and saved:', savedAnalysis.id);
  }
  catch (error) {
    console.error('Error generating analysis:', error);
    toaster.show({
      title: 'خطا',
      message: 'خطا در تولید گزارش. لطفا دوباره تلاش کنید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    });
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row">
    <div class="grow">
      <FullscreenLoading v-if="isLoading" loader-type="user" />
      <div v-else class="container mx-auto px-4 py-8">
        <div class="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
          <div class="text-center">
            <div class="bg-primary-100 dark:bg-primary-900/30 mx-auto mb-6 flex size-20 items-center justify-center rounded-full">
              <Icon name="ph:file-text-fill" class="text-primary-500 dark:text-primary-400 size-10" />
            </div>
            <h2 class="mb-4 text-2xl font-bold text-slate-800 dark:text-white">
              در حال آماده سازی گزارش
            </h2>
            <p class="mb-8 text-slate-600 dark:text-slate-300">
              گزارش جلسه در حال آماده سازی است. لطفا صبر کنید.
            </p>
            <div class="mb-8">
              <div class="mx-auto h-2 w-64 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div class="from-primary-400 to-primary-600 h-full animate-pulse bg-gradient-to-r" style="width: 70%" />
              </div>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                در حال پردازش اطلاعات جلسه...
              </p>
            </div>
            <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
              <p class="text-primary-700 dark:text-primary-300">
                <Icon name="ph:info-fill" class="mr-2 inline size-5 align-text-bottom" />
                گزارش شما به زودی آماده خواهد شد. این فرآیند ممکن است چند دقیقه طول بکشد.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal for phone number input -->
      <TairoModal
        :open="isPhoneModalOpen"
        size="sm"
        @close="isPhoneModalOpen = false"
      >
        <template #header>
          <div class="flex w-full items-center justify-between p-4 md:p-6">
            <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
              وارد کردن شماره تماس
            </h3>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="text-muted-400 hover:text-muted-600 dark:text-muted-400 dark:hover:text-muted-200 flex size-9 items-center justify-center"
                @click="isPhoneModalOpen = false"
              >
                <Icon name="lucide:x" class="size-6" />
              </button>
            </div>
          </div>
        </template>
        <div class="p-4 md:p-6">
          <div class="text-center">
            <div class="bg-primary-100 dark:bg-primary-900/30 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
              <Icon name="ph:phone-fill" class="text-primary-500 dark:text-primary-400 size-8" />
            </div>
            <h3 class="mb-2 text-xl font-bold text-slate-800 dark:text-white">
              شماره تماس شما
            </h3>
            <p class="text-muted-500 dark:text-muted-400 mb-6">
              لطفاً شماره تماس خود را وارد کنید تا بتوانیم گزارش جلسه را برای شما ارسال کنیم.
            </p>
            <div class="bg-primary-50 dark:bg-primary-900/20 mb-6 rounded-lg p-4">
              <p class="text-primary-700 dark:text-primary-300">
                <Icon name="ph:info-fill" class="mr-2 inline size-5 align-text-bottom" />
                هنگامی که گزارش آماده شد، پیامکی حاوی لینک مشاهده گزارش برای شما ارسال خواهد شد.
              </p>
            </div>
            <div class="mb-6">
              <BaseInput
                v-model="phoneNumber"
                placeholder="09123456789"
                :error="phoneError"
                class="text-center text-lg"
                @input="phoneError = ''"
              />
              <p v-if="phoneError" class="text-danger-500 mt-2 text-sm">
                {{ phoneError }}
              </p>
            </div>
            <div class="flex justify-center">
              <BaseButton
                color="primary"
                :loading="isSavingPhone"
                size="lg"
                @click="savePhoneNumber"
              >
                ذخیره و ادامه
              </BaseButton>
            </div>
          </div>
        </div>
      </TairoModal>
    </div>
  </div>
</template>
