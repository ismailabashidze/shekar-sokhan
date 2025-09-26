<script setup lang="ts">
definePageMeta({
  title: 'تنظیمات',
  preview: {
    title: 'تنظیمات',
    description: 'نمایش تنظیمات حساب کاربری',
    categories: ['layouts', 'profile'],
    src: '/img/screens/layouts-subpages-settings.png',
    srcDark: '/img/screens/layouts-subpages-settings-dark.png',
    order: 81,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const { user } = useUser()
const { getUserAvatarUrl } = useAvatarManager()
const { executeDataRemoval } = useDataRemoval()
const avatarUrl = computed(() => getUserAvatarUrl(user.value))

// Modal state
const showDataRemovalModal = ref(false)
const confirmationStep = ref(1)
const confirmationText = ref('')
const isDeleting = ref(false)
const errorMessage = ref('')

const handleDataRemoval = () => {
  console.log('handleDataRemoval called')
  showDataRemovalModal.value = true
  confirmationStep.value = 1
  confirmationText.value = ''
  errorMessage.value = ''
  console.log('Modal should be open:', showDataRemovalModal.value)
}

const closeModal = () => {
  showDataRemovalModal.value = false
  confirmationStep.value = 1
  confirmationText.value = ''
  isDeleting.value = false
  errorMessage.value = ''
}

const nextStep = () => {
  if (confirmationStep.value < 2) {
    confirmationStep.value++
  }
}

const previousStep = () => {
  if (confirmationStep.value > 1) {
    confirmationStep.value--
  }
}

const confirmDeletion = async () => {
  if (confirmationText.value !== 'DELETE MY DATA') {
    errorMessage.value = 'متن تایید اشتباه است. لطفاً دقیقاً "DELETE MY DATA" تایپ کنید.'
    return
  }

  try {
    isDeleting.value = true
    errorMessage.value = ''
    await executeDataRemoval()
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'خطای نامشخص رخ داد'
    isDeleting.value = false
  }
}

</script>

<template>
  <div class="mx-auto w-full max-w-5xl">
    <div v-if="!user" />
    <div v-else class="relative w-full">
      <div class="absolute end-0 top-2 z-20">
        <BaseDropdown
          variant="context"
          label="منو"
          placement="bottom-end"
          size="md"
          class="z-20"
          rounded="lg"
        >
          <BaseDropdownItem
            to="/layouts/profile-edit"
            title="ویرایش"
            text="ویرایش پروفایل"
          >
            <template #start>
              <Icon name="ph:pencil-duotone" class="me-2 block size-5" />
            </template>
          </BaseDropdownItem>

          <BaseDropdownDivider />
          <BaseDropdownItem
            to="#"
            title="اشتراک‌گذاری"
            text="اشتراک‌گذاری پروفایل"
          >
            <template #start>
              <Icon name="ph:link-duotone" class="me-2 block size-5" />
            </template>
          </BaseDropdownItem>
        </BaseDropdown>
      </div>
      <div class="flex w-full flex-col">
        <BaseAvatar
          v-if="user"
          :src="avatarUrl || '/img/avatars/1.png'"
          badge-src="/img/logo.png"
          size="2xl"
          class="mx-auto"
        />
        <div class="mx-auto w-full max-w-md text-center">
          <BaseHeading
            tag="h2"
            size="xl"
            weight="medium"
            class="mt-4"
          >
            {{ user?.meta?.name }}
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-400 mb-3 mt-1">
            {{ user?.meta?.shortBio? user?.meta?.shortBio : 'اطلاعات در حال تکمیل شدن است.' }}
          </BaseParagraph>
          <div
            class="divide-muted-200 dark:divide-muted-800 divide-s flex items-center justify-center"
          >
            <div class="text-muted-400 flex h-8 items-center gap-1 ps-4">
              <Icon name="ph:chat" class="size-5" />
              <BaseText size="sm">
                {{ user?.messages?.length || 0 }} پیام
              </BaseText>
            </div>
            <div
              class="text-muted-400 hidden h-8 items-center gap-1 ps-4 sm:flex"
            >
              <Icon name="ph:book" class="size-5" />
              <BaseText size="sm">
                {{ user?.sessions?.length || 0 }} جلسه
              </BaseText>
            </div>
            <!-- <div class="flex h-8 items-center gap-2 px-4">
              <NuxtLink
                v-for="link in user?.socials"
                :key="link.name"
                :to="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="border-muted-200 hover:border-primary-500 dark:border-muted-700 dark:hover:border-primary-500 dark:bg-muted-800 text-muted-400 hover:text-primary-500 flex size-8 items-center justify-center rounded-full border bg-white transition-colors duration-300"
              >
                <Icon :name="link.icon" class="size-3" />
                <span class="sr-only">{{ link.name }}</span>
              </NuxtLink>
            </div> -->
          </div>
        </div>
      </div>

      <div
        class="ltablet:grid-cols-5 mx-auto mt-6 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5"
      >
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-primary-500 group border-2 transition-all duration-300 hover:shadow-lg"
        >
          <NuxtLink to="/settings/ai-response" class="block p-6">
            <div class="text-center">
              <div class="bg-primary-100 dark:bg-primary-900/30 mx-auto flex size-12 items-center justify-center rounded-full">
                <Icon
                  name="ph:brain-duotone"
                  class="group-hover:text-primary-500 text-primary-500 size-6 transition-all duration-300 group-hover:scale-110"
                />
              </div>
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-3 !text-[0.65rem] uppercase"
              >
                مشاوره هوشمند
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400 mt-1">
                تنظیمات مشاور هوشمند
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-info-500 group border-2 transition-all duration-300 hover:shadow-lg"
        >
          <NuxtLink to="#" class="block p-6">
            <div class="text-center">
              <div class="bg-info-100 dark:bg-info-900/30 mx-auto flex size-12 items-center justify-center rounded-full">
                <Icon
                  name="ph:notebook-duotone"
                  class="group-hover:text-info-500 text-info-500 size-6 transition-all duration-300 group-hover:scale-110"
                />
              </div>
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-3 !text-[0.65rem] uppercase"
              >
                یادداشت‌ها
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400 mt-1">
                مدیریت یادداشت‌ها
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-success-500 group border-2 transition-all duration-300 hover:shadow-lg"
        >
          <NuxtLink to="#" class="block p-6">
            <div class="text-center">
              <div class="bg-success-100 dark:bg-success-900/30 mx-auto flex size-12 items-center justify-center rounded-full">
                <Icon
                  name="ph:heartbeat-duotone"
                  class="group-hover:text-success-500 text-success-500 size-6 transition-all duration-300 group-hover:scale-110"
                />
              </div>
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-3 !text-[0.65rem] uppercase"
              >
                سلامت روان
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400 mt-1">
                پیگیری وضعیت سلامت
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="group border-2 transition-all duration-300 hover:!border-purple-500 hover:shadow-lg"
        >
          <NuxtLink to="/darmana/therapists/chooseTherapist" class="block p-6">
            <div class="text-center">
              <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Icon
                  name="ph:robot"
                  class="size-6 text-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-500"
                />
              </div>
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-3 !text-[0.65rem] uppercase"
              >
                مشاوران
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400 mt-1">
                مشاهده مشاوران
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-warning-500 group border-2 transition-all duration-300 hover:shadow-lg"
        >
          <NuxtLink to="/payments" class="block p-6">
            <div class="text-center">
              <div class="bg-warning-100 dark:bg-warning-900/30 mx-auto flex size-12 items-center justify-center rounded-full">
                <Icon
                  name="ph:credit-card-duotone"
                  class="group-hover:text-warning-500 text-warning-500 size-6 transition-all duration-300 group-hover:scale-110"
                />
              </div>
              <BaseHeading
                tag="h3"
                size="xs"
                weight="semibold"
                class="mt-3 !text-[0.65rem] uppercase"
              >
                پرداختی‌ها
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400 mt-1">
                مدیریت پرداختی‌ها
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="group border-2 transition-all duration-300 hover:!border-teal-500 hover:shadow-lg"
        >
          <NuxtLink to="#" class="block p-6">
            <div class="text-center">
              <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                <Icon
                  name="ph:chat-circle-duotone"
                  class="size-6 text-teal-500 transition-all duration-300 group-hover:scale-110 group-hover:text-teal-500"
                />
              </div>
              <BaseHeading
                tag="h3"
                size="xs"
                weight="semibold"
                class="mt-3 !text-[0.65rem] uppercase"
              >
                چت
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400 mt-1">
                مدیریت چت
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-danger-500 group border-2 transition-all duration-300 hover:shadow-lg"
        >
          <NuxtLink to="#" class="block p-6">
            <div class="text-center">
              <div class="bg-danger-100 dark:bg-danger-900/30 mx-auto flex size-12 items-center justify-center rounded-full">
                <Icon
                  name="ph:shield-check-duotone"
                  class="group-hover:text-danger-500 text-danger-500 size-6 transition-all duration-300 group-hover:scale-110"
                />
              </div>
              <BaseHeading
                tag="h3"
                size="xs"
                weight="semibold"
                class="mt-3 !text-[0.65rem] uppercase"
              >
                امنیت
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400 mt-1">
                مدیریت امنیت
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="group border-2 transition-all duration-300 hover:!border-pink-500 hover:shadow-lg"
        >
          <NuxtLink to="/deeds" class="block p-6">
            <div class="text-center">
              <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
                <Icon
                  name="ph:hands-praying-duotone"
                  class="size-6 text-pink-500 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-500"
                />
              </div>
              <BaseHeading
                tag="h3"
                size="xs"
                weight="semibold"
                class="mt-3 !text-[0.65rem] uppercase"
              >
                کار نیک
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400 mt-1">
                کارهای نیک شما
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-muted-500 group border-2 transition-all duration-300 hover:shadow-lg"
        >
          <NuxtLink to="#" class="block p-6">
            <div class="text-center">
              <div class="bg-muted-100 dark:bg-muted-800 mx-auto flex size-12 items-center justify-center rounded-full">
                <Icon
                  name="ph:gear-six-duotone"
                  class="group-hover:text-muted-500 text-muted-500 size-6 transition-all duration-300 group-hover:scale-110"
                />
              </div>
              <BaseHeading
                tag="h3"
                size="xs"
                weight="semibold"
                class="mt-3 !text-[0.65rem] uppercase"
              >
                تنظیمات
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400 mt-1">
                مدیریت تنظیمات
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>

        <!-- Data Removal Card -->
        <BaseCard
          rounded="lg"
          elevated-hover
          class="group cursor-pointer border-2 transition-all duration-300 hover:!border-red-500 hover:shadow-lg"
          @click="handleDataRemoval"
        >
          <div class="block p-6">
            <div class="text-center">
              <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <Icon
                  name="ph:trash-duotone"
                  class="size-6 text-red-500 transition-all duration-300 group-hover:scale-110 group-hover:text-red-500"
                />
              </div>
              <BaseHeading
                tag="h3"
                size="xs"
                weight="semibold"
                class="mt-3 !text-[0.65rem] uppercase"
              >
                حذف داده‌ها
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400 mt-1">
                حذف کامل اطلاعات
              </BaseText>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- PWA Permissions Status Section -->
      <div class="mx-auto mt-8 max-w-4xl">
        <PwaPermissionsStatus />
      </div>

      <!-- PWA Notification Settings Section -->
      <div class="mx-auto mt-8 max-w-4xl">
        <PwaNotificationSettings />
      </div>

      <!-- PWA Cache Management Section -->
      <div class="mx-auto mt-8 max-w-4xl">
        <PwaCacheManager />
      </div>
    </div>

    <!-- Data Removal Confirmation Modal -->
    <TairoModal
      :open="showDataRemovalModal"
      size="xl"
      rounded="lg"
      :classes="{
        wrapper: 'max-h-[90vh] overflow-hidden flex flex-col',
        dialog: 'flex flex-col max-h-full overflow-hidden'
      }"
      @close="closeModal"
    >
      <template #header>
        <div class="border-muted-200 dark:border-muted-700 flex w-full items-center justify-between border-b p-6">
          <div class="flex items-center gap-3" dir="rtl">
            <h3 class="font-heading text-muted-900 text-xl font-bold leading-tight dark:text-white">
              حذف کامل داده‌ها
            </h3>
            <div class="flex size-8 items-center justify-center rounded-lg bg-red-500/10">
              <Icon name="ph:warning-circle-duotone" class="size-5 text-red-500" />
            </div>
          </div>
          <BaseButtonClose class="ms-4" @click="closeModal" />
        </div>
      </template>

      <div class="flex-1 overflow-y-auto p-4" dir="rtl">
        <!-- Step 1: Warning -->
        <div v-if="confirmationStep === 1" class="space-y-4">
          <!-- Main Warning Icon -->
          <div class="text-center">
            <div class="mx-auto mb-3 flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/10 via-red-500/5 to-orange-500/10 ring-1 ring-red-500/20">
              <Icon name="ph:warning-diamond-duotone" class="size-8 text-red-500" />
            </div>
          </div>

          <!-- Main Warning Text -->
          <div class="space-y-4 text-center">
            <div class="space-y-2">
              <h4 class="text-muted-900 text-lg font-bold leading-tight dark:text-white">
                هشدار مهم!
              </h4>
              <p class="text-muted-700 dark:text-muted-300 mx-auto max-w-md text-sm leading-relaxed">
                این عملیات تمام داده‌های شما را
                <span class="inline-block bg-gradient-to-l from-red-600 to-red-500 bg-clip-text text-sm font-black text-transparent">به طور کامل و برای همیشه</span>
                حذف خواهد کرد
              </p>
            </div>

            <!-- Data List -->
            <div class="from-muted-50 to-muted-50 dark:from-muted-900/80 dark:via-muted-900/50 dark:to-muted-800/50 border-muted-200/50 dark:border-muted-700/50 rounded-xl border bg-gradient-to-bl via-white p-4 shadow-sm">
              <h5 class="text-muted-800 dark:text-muted-200 mb-3 text-center text-sm font-semibold">
                داده‌های قابل حذف:
              </h5>
              <div class="grid grid-cols-2 gap-2">
                <div class="dark:bg-muted-800/30 flex items-center gap-2 rounded-lg border border-red-100 bg-white/50 p-2 dark:border-red-900/30">
                  <div class="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
                    <Icon name="ph:chats-duotone" class="size-2.5 text-white" />
                  </div>
                  <span class="text-muted-800 dark:text-muted-200 flex-1 text-xs font-medium leading-tight">
                    جلسات درمانی
                  </span>
                </div>
                <div class="dark:bg-muted-800/30 flex items-center gap-2 rounded-lg border border-red-100 bg-white/50 p-2 dark:border-red-900/30">
                  <div class="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
                    <Icon name="ph:chat-circle-text-duotone" class="size-2.5 text-white" />
                  </div>
                  <span class="text-muted-800 dark:text-muted-200 flex-1 text-xs font-medium leading-tight">
                    پیام‌ها
                  </span>
                </div>
                <div class="dark:bg-muted-800/30 flex items-center gap-2 rounded-lg border border-red-100 bg-white/50 p-2 dark:border-red-900/30">
                  <div class="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
                    <Icon name="ph:chart-line-duotone" class="size-2.5 text-white" />
                  </div>
                  <span class="text-muted-800 dark:text-muted-200 flex-1 text-xs font-medium leading-tight">
                    گزارش‌ها
                  </span>
                </div>
                <div class="dark:bg-muted-800/30 flex items-center gap-2 rounded-lg border border-red-100 bg-white/50 p-2 dark:border-red-900/30">
                  <div class="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
                    <Icon name="ph:bell-duotone" class="size-2.5 text-white" />
                  </div>
                  <span class="text-muted-800 dark:text-muted-200 flex-1 text-xs font-medium leading-tight">
                    اعلان‌ها
                  </span>
                </div>
                <div class="dark:bg-muted-800/30 col-span-2 flex items-center gap-2 rounded-lg border border-red-100 bg-white/50 p-2 dark:border-red-900/30">
                  <div class="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
                    <Icon name="ph:user-circle-duotone" class="size-2.5 text-white" />
                  </div>
                  <span class="text-muted-800 dark:text-muted-200 flex-1 text-xs font-medium leading-tight">
                    اطلاعات حساب کاربری
                  </span>
                </div>
              </div>
            </div>

            <!-- Final Warning -->
            <div class="relative">
              <div class="absolute inset-0 rounded-xl bg-gradient-to-l from-red-500/10 via-red-500/5 to-orange-500/10 blur-sm" />
              <div class="relative rounded-xl border-2 border-red-300 bg-gradient-to-l from-red-50 via-white to-red-50 p-3 dark:border-red-700 dark:from-red-950/40 dark:via-red-950/20 dark:to-red-950/40">
                <div class="flex items-center justify-center gap-2">
                  <Icon name="ph:warning-octagon-duotone" class="size-4 animate-pulse text-red-600" />
                  <p class="text-sm font-bold text-red-700 dark:text-red-300">
                    این عمل قابل بازگشت نیست!
                  </p>
                  <Icon name="ph:warning-octagon-duotone" class="size-4 animate-pulse text-red-600" />
                </div>
                <p class="mt-1 text-center text-xs font-medium text-red-600 dark:text-red-400">
                  پس از تایید، هیچ راهی برای بازیابی داده‌ها وجود ندارد
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Final Confirmation -->
        <div v-if="confirmationStep === 2" class="space-y-4">
          <!-- Header -->
          <div class="text-center">
            <div class="mx-auto mb-3 flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-yellow-500/10 ring-1 ring-orange-500/20">
              <Icon name="ph:keyboard-duotone" class="size-8 text-orange-500" />
            </div>
            <h4 class="text-muted-900 mb-2 text-lg font-bold leading-tight dark:text-white">
              تایید نهایی
            </h4>
            <p class="text-muted-600 dark:text-muted-400 mx-auto max-w-lg text-sm leading-relaxed">
              برای تکمیل فرآیند حذف، عبارت زیر را دقیقاً در کادر پایین تایپ کنید
            </p>
          </div>

          <!-- Required Text Display -->
          <div class="relative">
            <div class="absolute inset-0 rounded-xl bg-gradient-to-l from-orange-500/10 via-orange-500/5 to-yellow-500/10 blur-sm" />
            <div class="dark:via-muted-900 relative rounded-xl border border-orange-200/50 bg-gradient-to-bl from-orange-50 via-white to-yellow-50 p-4 shadow-sm dark:border-orange-700/50 dark:from-orange-950/20 dark:to-yellow-950/20">
              <div class="space-y-2 text-center">
                <p class="text-muted-700 dark:text-muted-300 text-xs font-medium">
                  عبارت مورد نیاز:
                </p>
                <div class="dark:bg-muted-800 rounded-lg border-2 border-dashed border-orange-300 bg-white p-3 shadow-inner dark:border-orange-600">
                  <p class="select-all font-mono text-lg font-black tracking-widest text-orange-600 dark:text-orange-400">
                    DELETE MY DATA
                  </p>
                </div>
                <p class="text-muted-500 dark:text-muted-500 text-xs font-medium">
                  برای کپی کردن روی متن بالا کلیک کنید
                </p>
              </div>
            </div>
          </div>

          <!-- Input Section -->
          <div class="space-y-3">
            <div class="text-center">
              <label class="text-muted-700 dark:text-muted-300 mb-2 block text-sm font-semibold">
                عبارت را در کادر زیر وارد کنید:
              </label>
            </div>

            <div class="relative">
              <BaseInput
                v-model="confirmationText"
                placeholder="DELETE MY DATA"
                class="w-full border-2 py-3 text-center font-mono text-sm tracking-widest focus:border-orange-500 focus:ring-orange-500/20"
                :class="{
                  'border-green-400 bg-green-50 ring-green-400/20 dark:bg-green-950/20': confirmationText === 'DELETE MY DATA',
                  'border-red-400 bg-red-50 ring-red-400/20 dark:bg-red-950/20': errorMessage && confirmationText !== 'DELETE MY DATA'
                }"
              />
              <div class="absolute left-3 top-1/2 -translate-y-1/2">
                <Icon
                  v-if="confirmationText === 'DELETE MY DATA'"
                  name="ph:check-circle-duotone"
                  class="size-4 text-green-500"
                />
                <Icon
                  v-else-if="confirmationText && confirmationText !== 'DELETE MY DATA'"
                  name="ph:x-circle-duotone"
                  class="size-4 text-red-500"
                />
                <Icon
                  v-else
                  name="ph:keyboard-duotone"
                  class="text-muted-400 size-4"
                />
              </div>
            </div>

            <!-- Progress Indicator -->
            <div class="text-center">
              <div class="text-muted-500 dark:text-muted-500 text-xs font-medium">
                تایپ شده: {{ confirmationText.length }} / 14 کاراکتر
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="text-center">
              <div class="relative">
                <div class="absolute inset-0 rounded-lg bg-red-500/10 blur-sm" />
                <div class="relative rounded-lg border-2 border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/30">
                  <div class="flex items-center justify-center gap-2">
                    <Icon name="ph:warning-circle-duotone" class="size-4 animate-pulse text-red-600" />
                    <p class="text-xs font-semibold text-red-600 dark:text-red-400">
                      {{ errorMessage }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isDeleting" class="py-8 text-center">
          <div class="from-primary-500/10 via-primary-500/5 ring-primary-500/20 mx-auto mb-4 flex size-16 items-center justify-center rounded-xl bg-gradient-to-br to-blue-500/10 ring-1">
            <Icon name="ph:spinner-duotone" class="text-primary-500 size-8 animate-spin" />
          </div>
          <div class="space-y-3">
            <h4 class="text-muted-900 text-lg font-bold dark:text-white">
              در حال حذف داده‌ها
            </h4>
            <div class="space-y-1">
              <p class="text-muted-600 dark:text-muted-400 mx-auto max-w-md text-sm leading-relaxed">
                لطفاً صبر کنید، این عملیات ممکن است چند لحظه طول بکشد
              </p>
              <p class="text-muted-500 dark:text-muted-500 text-xs font-medium">
                در حین این فرآیند صفحه را نبندید
              </p>
            </div>

            <!-- Progress Animation -->
            <div class="mt-4">
              <div class="flex justify-center gap-1">
                <div class="bg-primary-500 size-1.5 animate-pulse rounded-full" style="animation-delay: 0ms" />
                <div class="bg-primary-500 size-1.5 animate-pulse rounded-full" style="animation-delay: 200ms" />
                <div class="bg-primary-500 size-1.5 animate-pulse rounded-full" style="animation-delay: 400ms" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="border-muted-200 dark:border-muted-700 bg-muted-50/50 dark:bg-muted-900/50 shrink-0 border-t p-3 w-full" dir="rtl">
          <!-- Step 1 buttons -->
          <template v-if="confirmationStep === 1 && !isDeleting">
            <div class="flex gap-2">
              <BaseButton
                variant="ghost"
                color="muted"
                class="border-muted-200 dark:border-muted-700 hover:border-muted-300 dark:hover:border-muted-600 !h-9 flex-1 rounded-md border-2 text-xs font-medium transition-all duration-200"
                @click="closeModal"
              >
                <Icon name="ph:x-circle-duotone" class="ml-1 size-3.5" />
                انصراف
              </BaseButton>
              <BaseButton
                variant="solid"
                color="warning"
                class="!h-9 flex-[2] rounded-md text-xs font-medium shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
                @click="nextStep"
              >
                ادامه می دهم
                <Icon name="ph:arrow-left-duotone" class="mr-1 size-3.5" />
              </BaseButton>
            </div>
          </template>

          <!-- Step 2 buttons -->
          <template v-if="confirmationStep === 2 && !isDeleting">
            <div class="flex gap-2">
              <BaseButton
                variant="ghost"
                color="muted"
                class="border-muted-200 dark:border-muted-700 hover:border-muted-300 dark:hover:border-muted-600 !h-9 flex-1 rounded-md border-2 text-xs font-medium transition-all duration-200"
                @click="previousStep"
              >
                <Icon name="ph:arrow-right-duotone" class="ml-1 size-3.5" />
                مرحله قبل
              </BaseButton>
              <BaseButton
                variant="solid"
                color="danger"
                class="!h-9 flex-[2] rounded-md text-xs font-medium shadow-sm transition-all duration-200"
                :class="{
                  'cursor-not-allowed opacity-50': confirmationText !== 'DELETE MY DATA',
                  'bg-gradient-to-l from-red-600 to-red-500 hover:scale-[1.01] hover:shadow-md': confirmationText === 'DELETE MY DATA'
                }"
                :disabled="confirmationText !== 'DELETE MY DATA'"
                @click="confirmDeletion"
              >
                <template v-if="confirmationText === 'DELETE MY DATA'">
                  حذف کامل داده‌ها
                  <Icon name="ph:trash-duotone" class="mr-1 size-3.5" />
                </template>
                <template v-else>
                  ابتدا عبارت را وارد کنید
                  <Icon name="ph:lock-duotone" class="mr-1 size-3.5" />
                </template>
              </BaseButton>
            </div>
          </template>

          <!-- Loading state -->
          <template v-if="isDeleting">
            <div class="flex">
              <BaseButton
                variant="solid"
                color="primary"
                class="!h-9 w-full cursor-not-allowed rounded-md text-xs font-medium"
                disabled
              >
                <Icon name="ph:spinner-duotone" class="ml-1 size-3.5 animate-spin" />
                در حال حذف داده‌ها...
              </BaseButton>
            </div>
          </template>
        </div>
      </template>
    </TairoModal>
  </div>
</template>
