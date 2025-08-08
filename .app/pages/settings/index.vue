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
  } catch (error) {
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
              <div class="bg-primary-100 dark:bg-primary-900/30 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
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
              <div class="bg-info-100 dark:bg-info-900/30 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
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
              <div class="bg-success-100 dark:bg-success-900/30 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
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
          class="hover:!border-purple-500 group border-2 transition-all duration-300 hover:shadow-lg"
        >
          <NuxtLink to="/darmana/therapists/chooseTherapist" class="block p-6">
            <div class="text-center">
              <div class="bg-purple-100 dark:bg-purple-900/30 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                <Icon
                  name="ph:robot"
                  class="group-hover:text-purple-500 text-purple-500 size-6 transition-all duration-300 group-hover:scale-110"
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
              <div class="bg-warning-100 dark:bg-warning-900/30 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
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
          class="hover:!border-teal-500 group border-2 transition-all duration-300 hover:shadow-lg"
        >
          <NuxtLink to="#" class="block p-6">
            <div class="text-center">
              <div class="bg-teal-100 dark:bg-teal-900/30 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                <Icon
                  name="ph:chat-circle-duotone"
                  class="group-hover:text-teal-500 text-teal-500 size-6 transition-all duration-300 group-hover:scale-110"
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
              <div class="bg-danger-100 dark:bg-danger-900/30 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
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
          class="hover:!border-pink-500 group border-2 transition-all duration-300 hover:shadow-lg"
        >
          <NuxtLink to="/deeds" class="block p-6">
            <div class="text-center">
              <div class="bg-pink-100 dark:bg-pink-900/30 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                <Icon
                  name="ph:hands-praying-duotone"
                  class="group-hover:text-pink-500 text-pink-500 size-6 transition-all duration-300 group-hover:scale-110"
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
              <div class="bg-muted-100 dark:bg-muted-800 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
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
          class="hover:!border-red-500 group border-2 cursor-pointer transition-all duration-300 hover:shadow-lg"
          @click="handleDataRemoval"
        >
          <div class="block p-6">
            <div class="text-center">
              <div class="bg-red-100 dark:bg-red-900/30 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                <Icon
                  name="ph:trash-duotone"
                  class="group-hover:text-red-500 text-red-500 size-6 transition-all duration-300 group-hover:scale-110"
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
      @close="closeModal"
      rounded="lg"
      :classes="{
        wrapper: 'max-h-[90vh] overflow-hidden flex flex-col',
        dialog: 'flex flex-col max-h-full overflow-hidden'
      }"
    >
      <template #header>
        <div class="flex w-full items-center justify-between border-b border-muted-200 dark:border-muted-700 p-6">
          <div class="flex items-center gap-3" dir="rtl">
            <h3 class="font-heading text-muted-900 text-xl font-bold leading-tight dark:text-white">
              حذف کامل داده‌ها
            </h3>
            <div class="flex size-8 items-center justify-center rounded-lg bg-red-500/10">
              <Icon name="ph:warning-circle-duotone" class="size-5 text-red-500" />
            </div>
          </div>
          <BaseButtonClose @click="closeModal" class="ms-4" />
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
          <div class="text-center space-y-4">
            <div class="space-y-2">
              <h4 class="text-muted-900 dark:text-white text-lg font-bold leading-tight">
                هشدار مهم!
              </h4>
              <p class="text-muted-700 dark:text-muted-300 text-sm leading-relaxed max-w-md mx-auto">
                این عملیات تمام داده‌های شما را 
                <span class="inline-block bg-gradient-to-l from-red-600 to-red-500 bg-clip-text text-transparent font-black text-sm">به طور کامل و برای همیشه</span>
                حذف خواهد کرد
              </p>
            </div>
            
            <!-- Data List -->
            <div class="bg-gradient-to-bl from-muted-50 via-white to-muted-50 dark:from-muted-900/80 dark:via-muted-900/50 dark:to-muted-800/50 rounded-xl p-4 border border-muted-200/50 dark:border-muted-700/50 shadow-sm">
              <h5 class="text-muted-800 dark:text-muted-200 text-sm font-semibold mb-3 text-center">
                داده‌های قابل حذف:
              </h5>
              <div class="grid grid-cols-2 gap-2">
                <div class="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-muted-800/30 border border-red-100 dark:border-red-900/30">
                  <div class="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
                    <Icon name="ph:chats-duotone" class="size-2.5 text-white" />
                  </div>
                  <span class="text-muted-800 dark:text-muted-200 text-xs font-medium flex-1 leading-tight">
                    جلسات درمانی
                  </span>
                </div>
                <div class="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-muted-800/30 border border-red-100 dark:border-red-900/30">
                  <div class="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
                    <Icon name="ph:chat-circle-text-duotone" class="size-2.5 text-white" />
                  </div>
                  <span class="text-muted-800 dark:text-muted-200 text-xs font-medium flex-1 leading-tight">
                    پیام‌ها
                  </span>
                </div>
                <div class="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-muted-800/30 border border-red-100 dark:border-red-900/30">
                  <div class="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
                    <Icon name="ph:chart-line-duotone" class="size-2.5 text-white" />
                  </div>
                  <span class="text-muted-800 dark:text-muted-200 text-xs font-medium flex-1 leading-tight">
                    گزارش‌ها
                  </span>
                </div>
                <div class="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-muted-800/30 border border-red-100 dark:border-red-900/30">
                  <div class="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
                    <Icon name="ph:bell-duotone" class="size-2.5 text-white" />
                  </div>
                  <span class="text-muted-800 dark:text-muted-200 text-xs font-medium flex-1 leading-tight">
                    اعلان‌ها
                  </span>
                </div>
                <div class="col-span-2 flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-muted-800/30 border border-red-100 dark:border-red-900/30">
                  <div class="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
                    <Icon name="ph:user-circle-duotone" class="size-2.5 text-white" />
                  </div>
                  <span class="text-muted-800 dark:text-muted-200 text-xs font-medium flex-1 leading-tight">
                    اطلاعات حساب کاربری
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Final Warning -->
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-l from-red-500/10 via-red-500/5 to-orange-500/10 rounded-xl blur-sm"></div>
              <div class="relative border-2 border-red-300 dark:border-red-700 bg-gradient-to-l from-red-50 via-white to-red-50 dark:from-red-950/40 dark:via-red-950/20 dark:to-red-950/40 rounded-xl p-3">
                <div class="flex items-center justify-center gap-2">
                  <Icon name="ph:warning-octagon-duotone" class="size-4 text-red-600 animate-pulse" />
                  <p class="text-red-700 dark:text-red-300 text-sm font-bold">
                    این عمل قابل بازگشت نیست!
                  </p>
                  <Icon name="ph:warning-octagon-duotone" class="size-4 text-red-600 animate-pulse" />
                </div>
                <p class="text-red-600 dark:text-red-400 text-xs mt-1 text-center font-medium">
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
            <h4 class="text-muted-900 dark:text-white text-lg font-bold leading-tight mb-2">
              تایید نهایی
            </h4>
            <p class="text-muted-600 dark:text-muted-400 text-sm leading-relaxed max-w-lg mx-auto">
              برای تکمیل فرآیند حذف، عبارت زیر را دقیقاً در کادر پایین تایپ کنید
            </p>
          </div>

          <!-- Required Text Display -->
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-l from-orange-500/10 via-orange-500/5 to-yellow-500/10 rounded-xl blur-sm"></div>
            <div class="relative bg-gradient-to-bl from-orange-50 via-white to-yellow-50 dark:from-orange-950/20 dark:via-muted-900 dark:to-yellow-950/20 rounded-xl p-4 border border-orange-200/50 dark:border-orange-700/50 shadow-sm">
              <div class="text-center space-y-2">
                <p class="text-muted-700 dark:text-muted-300 text-xs font-medium">
                  عبارت مورد نیاز:
                </p>
                <div class="bg-white dark:bg-muted-800 border-2 border-dashed border-orange-300 dark:border-orange-600 rounded-lg p-3 shadow-inner">
                  <p class="text-lg font-mono font-black text-orange-600 dark:text-orange-400 tracking-widest select-all">
                    DELETE MY DATA
                  </p>
                </div>
                <p class="text-xs text-muted-500 dark:text-muted-500 font-medium">
                  برای کپی کردن روی متن بالا کلیک کنید
                </p>
              </div>
            </div>
          </div>

          <!-- Input Section -->
          <div class="space-y-3">
            <div class="text-center">
              <label class="text-muted-700 dark:text-muted-300 text-sm font-semibold block mb-2">
                عبارت را در کادر زیر وارد کنید:
              </label>
            </div>
            
            <div class="relative">
              <BaseInput
                v-model="confirmationText"
                placeholder="DELETE MY DATA"
                class="w-full text-center text-sm font-mono tracking-widest py-3 border-2 focus:border-orange-500 focus:ring-orange-500/20"
                :class="{
                  'border-green-400 ring-green-400/20 bg-green-50 dark:bg-green-950/20': confirmationText === 'DELETE MY DATA',
                  'border-red-400 ring-red-400/20 bg-red-50 dark:bg-red-950/20': errorMessage && confirmationText !== 'DELETE MY DATA'
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
                  class="size-4 text-muted-400" 
                />
              </div>
            </div>

            <!-- Progress Indicator -->
            <div class="text-center">
              <div class="text-xs text-muted-500 dark:text-muted-500 font-medium">
                تایپ شده: {{ confirmationText.length }} / 14 کاراکتر
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="text-center">
              <div class="relative">
                <div class="absolute inset-0 bg-red-500/10 rounded-lg blur-sm"></div>
                <div class="relative bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div class="flex items-center justify-center gap-2">
                    <Icon name="ph:warning-circle-duotone" class="size-4 text-red-600 animate-pulse" />
                    <p class="text-red-600 dark:text-red-400 text-xs font-semibold">{{ errorMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isDeleting" class="py-8 text-center">
          <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/10 via-primary-500/5 to-blue-500/10 ring-1 ring-primary-500/20">
            <Icon name="ph:spinner-duotone" class="size-8 animate-spin text-primary-500" />
          </div>
          <div class="space-y-3">
            <h4 class="text-muted-900 dark:text-white text-lg font-bold">
              در حال حذف داده‌ها
            </h4>
            <div class="space-y-1">
              <p class="text-muted-600 dark:text-muted-400 text-sm leading-relaxed max-w-md mx-auto">
                لطفاً صبر کنید، این عملیات ممکن است چند لحظه طول بکشد
              </p>
              <p class="text-muted-500 dark:text-muted-500 text-xs font-medium">
                در حین این فرآیند صفحه را نبندید
              </p>
            </div>
            
            <!-- Progress Animation -->
            <div class="mt-4">
              <div class="flex justify-center gap-1">
                <div class="size-1.5 rounded-full bg-primary-500 animate-pulse" style="animation-delay: 0ms"></div>
                <div class="size-1.5 rounded-full bg-primary-500 animate-pulse" style="animation-delay: 200ms"></div>
                <div class="size-1.5 rounded-full bg-primary-500 animate-pulse" style="animation-delay: 400ms"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex-shrink-0 border-t border-muted-200 dark:border-muted-700 bg-muted-50/50 dark:bg-muted-900/50 p-3" dir="rtl">
          <!-- Step 1 buttons -->
          <template v-if="confirmationStep === 1 && !isDeleting">
            <div class="flex gap-2">
              <BaseButton
                variant="ghost"
                color="muted"
                class="!h-9 flex-1 text-xs font-semibold rounded-md border-2 border-muted-200 dark:border-muted-700 hover:border-muted-300 dark:hover:border-muted-600 transition-all duration-200"
                @click="closeModal"
              >
                <Icon name="ph:x-circle-duotone" class="ml-1 size-3.5" />
                انصراف
              </BaseButton>
              <BaseButton
                variant="solid"
                color="warning"
                class="!h-9 flex-[2] text-xs font-bold rounded-md shadow-sm hover:shadow-md transform hover:scale-[1.01] transition-all duration-200"
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
                class="!h-9 flex-1 text-xs font-semibold rounded-md border-2 border-muted-200 dark:border-muted-700 hover:border-muted-300 dark:hover:border-muted-600 transition-all duration-200"
                @click="previousStep"
              >
                <Icon name="ph:arrow-right-duotone" class="ml-1 size-3.5" />
                مرحله قبل
              </BaseButton>
              <BaseButton
                variant="solid"
                color="danger"
                class="!h-9 flex-[2] text-xs font-bold rounded-md shadow-sm transition-all duration-200"
                :class="{
                  'opacity-50 cursor-not-allowed': confirmationText !== 'DELETE MY DATA',
                  'hover:shadow-md transform hover:scale-[1.01] bg-gradient-to-l from-red-600 to-red-500': confirmationText === 'DELETE MY DATA'
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
                class="!h-9 w-full text-xs font-bold rounded-md cursor-not-allowed"
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
