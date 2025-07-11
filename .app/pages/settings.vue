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
const avatarUrl = computed(() => getUserAvatarUrl(user.value))

// Rest of the code remains the same
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
          class="hover:!border-primary-500 group border-2"
        >
          <NuxtLink to="#" class="block p-6">
            <div class="text-center">
              <Icon
                name="ph:brain-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                مشاوره هوشمند
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                تنظیمات مشاور هوشمند
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-primary-500 group border-2"
        >
          <NuxtLink to="/darmana/therapists/sessions" class="block p-6">
            <div class="text-center">
              <Icon
                name="ph:chat-circle-text-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                جلسات
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                جلسات مشاوره
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-primary-500 group border-2"
        >
          <NuxtLink to="#" class="block p-6">
            <div class="text-center">
              <Icon
                name="ph:notebook-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                یادداشت‌ها
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مدیریت یادداشت‌ها
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-primary-500 group border-2"
        >
          <NuxtLink to="#" class="block p-6">
            <div class="text-center">
              <Icon
                name="ph:heartbeat-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                سلامت روان
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                پیگیری وضعیت سلامت
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-primary-500 group border-2"
        >
          <NuxtLink to="/darmana/therapists/chooseTherapist" class="block p-6">
            <div class="text-center">
              <Icon
                name="ph:robot"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                مشاوران
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مشاهده مشاوران
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-primary-500 group border-2"
        >
          <NuxtLink to="/payments" class="block p-6">
            <div class="text-center">
              <Icon
                name="ph:credit-card-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="xs"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                پرداختی‌ها
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مدیریت پرداختی‌ها
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-primary-500 group border-2"
        >
          <NuxtLink to="#" class="block p-6">
            <div class="text-center">
              <Icon
                name="ph:chat-circle-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="xs"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                چت
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مدیریت چت
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-primary-500 group border-2"
        >
          <NuxtLink to="#" class="block p-6">
            <div class="text-center">
              <Icon
                name="ph:shield-check-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="xs"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                امنیت
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مدیریت امنیت
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-primary-500 group border-2"
        >
          <NuxtLink to="/deeds" class="block p-6">
            <div class="text-center">
              <Icon
                name="ph:hands-praying-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="xs"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                کار نیک
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                کارهای نیک شما
              </BaseText>
            </div>
          </NuxtLink>
        </BaseCard>
        <BaseCard
          rounded="lg"
          elevated-hover
          class="hover:!border-primary-500 group border-2"
        >
          <NuxtLink to="#" class="block p-6">
            <div class="text-center">
              <Icon
                name="ph:gear-six-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="xs"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                تنظیمات
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مدیریت تنظیمات
              </BaseText>
            </div>
          </NuxtLink>
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
  </div>
</template>
