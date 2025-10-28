<template>
  <div class="fixed bottom-4 left-4 z-50" style="display: none;">
    <!-- Install Button -->
    <button
      v-if="canInstall && !isInstalled"
      class="bg-primary-500 hover:bg-primary-600 mb-16 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white shadow-lg transition-colors"
      @click="installPwa"
    >
      <Icon name="mdi:download" class="size-4" />
      نصب اپ
    </button>

    <!-- Installed Indicator -->
    <div
      v-else-if="isInstalled"
      class="mb-16 flex items-center gap-2 rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white shadow-lg"
      style="display: none;"
    >
      <Icon name="mdi:check" class="size-4" />
      نصب شده
    </div>
  </div>
</template>

<script setup lang="ts">
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const canInstall = ref(false);
const isInstalled = ref(false);
const isStandalone = ref(false);
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);

onMounted(() => {
  if (process.client) {
    // Check if running in standalone mode (already installed)
    isStandalone.value = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as any).standalone === true;

    if (isStandalone.value) {
      isInstalled.value = true;
      return;
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt.value = e as BeforeInstallPromptEvent;
      canInstall.value = true;
    });

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      isInstalled.value = true;
      canInstall.value = false;
      deferredPrompt.value = null;
    });

    // Force show install button for testing (if needed)
    setTimeout(() => {
      if (!canInstall.value && !isInstalled.value) {
        canInstall.value = true;
      }
    }, 3000);
  }
});

const installPwa = async () => {
  if (!deferredPrompt.value) {
    return;
  }

  try {
    await deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;

    if (outcome === 'accepted') {
      isInstalled.value = true;
    }

    canInstall.value = false;
    deferredPrompt.value = null;
  }
  catch (error) {
    console.error('خطا در نصب اپلیکیشن:', error);
  }
};
</script>
