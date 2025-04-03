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
          <BaseDropdownDivider />
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
            title="امنیت"
            text="تنظیمات امنیتی"
          >
            <template #start>
              <Icon name="ph:lock-duotone" class="me-2 block size-5" />
            </template>
          </BaseDropdownItem>
          <BaseDropdownItem
            to="#"
            title="صورتحساب"
            text="مدیریت صورتحساب"
          >
            <template #start>
              <Icon name="ph:bank-duotone" class="me-2 block size-5" />
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
          :src="user?.meta?.avatarUrl? user?.meta?.avatarUrl : '/img/avatars/1.png'"
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
            class="divide-muted-200 dark:divide-muted-800 flex items-center justify-center divide-s"
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
                name="ph:buildings-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                شرکت
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مدیریت شرکت
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
                name="ph:users-four-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                تیم
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مدیریت تیم
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
                name="ph:briefcase-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                پروژه‌ها
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                تنظیمات پروژه
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
                name="ph:users-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                کاربران
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مدیریت کاربران
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
                name="ph:upload-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="sm"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                آپلود
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مدیریت فایل‌ها
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
                name="ph:credit-card-duotone"
                class="group-hover:text-primary-500 text-muted-400 size-8 transition-all duration-300 group-hover:rotate-6"
              />
              <BaseHeading
                tag="h3"
                size="xs"
                weight="semibold"
                class="mt-2 !text-[0.65rem] uppercase"
              >
                صورتحساب
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مدیریت صورتحساب
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
    </div>
  </div>
</template>
