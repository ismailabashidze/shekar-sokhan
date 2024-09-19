<script setup lang="ts">
definePageMeta({
  title: 'فکرها',
  layout: 'sidebar',
  // layout: 'empty',
  preview: {
    title: 'فکرها',
    description: 'زنجیره ذهنی فکرهای هوش مصنوعی',
    categories: ['layouts', 'profile'],
    src: '/img/screens/layouts-subpages-notifications.png',
    srcDark: '/img/screens/layouts-subpages-notifications-dark.png',
    order: 80,
  },
})
useHead({ htmlAttrs: { dir: 'rtl' } })
const route = useRoute()
const { getThoughtsByUserId } = useMessage()

const notifications = ref([])
onMounted(async () => {
  // notifications.value = await getThoughtsByUserId(route.query.userId)
})
</script>

<template>
  <!-- <FullscreenLoading v-if="true" /> -->
  <AudioVisualizer />
  <AudioToTextBtn />
  <div class="min-h-screen overflow-hidden">
    <div class="mx-auto w-full max-w-4xl pt-12">
      <div v-if="notifications.length === 0" />
      <div v-else class="">
        <div
          v-for="item in notifications"
          :key="item.id"
          class="ltablet:after:start-[104px] after:border-muted-300 dark:after:border-muted-800 relative flex items-center gap-4 after:absolute after:start-[8px] after:top-3 after:h-full after:w-px after:border-e-2 after:content-[''] lg:after:start-[104px] [&:not(:first-child)]:pt-3"
        >
          <div class="ltablet:block hidden w-24 text-right lg:block">
            <BaseText size="xs" class="text-muted-400">
              {{ new Date(item.created).toLocaleTimeString('fa') }}
            </BaseText>
          </div>
          <div
            class="dark:bg-muted-800 relative z-10 size-4 shrink-0 rounded-full bg-white"
          >
            <div
              class="size-4 rounded-full border-2 border-current"
              :class="getRandomColor()"
            />
          </div>

          <BaseCard class="p-4">
            <div class="flex w-full items-center gap-4">
              <div
                class="size-2 shrink-0 rounded-full"
                :class="
                  item.status === 0
                    ? 'bg-primary-500'
                    : 'bg-muted-300 dark:bg-muted-700/50'
                "
              />
              <BaseAvatar
                :src="
                  item.role === 'user'
                    ? '/img/avatars/3.svg'
                    : '/img/avatars/1.svg'
                "
                size="sm"
              />
              <div>
                <BaseText size="sm" lead="tight">
                  <div class="text-muted-800 dark:text-muted-100">
                    {{ item.role === 'user' ? 'کاربر' : 'هوش مصنوعی' }}
                  </div>
                  <div>
                    <div
                      class="title text-muted-700 dark:text-muted-200 mb-1 mt-3"
                    >
                      پیام ها:
                    </div>
                    <div class="text-muted-500 dark:text-muted-400">
                      {{ item.contentFa.message }}
                    </div>
                  </div>
                  <div>
                    <div
                      v-if="item.contentFa.thoughts"
                      class="title text-muted-700 dark:text-muted-200 mb-1 mt-3"
                    >
                      فکرها:
                    </div>
                    <div class="text-muted-500 dark:text-muted-400">
                      {{ item.contentFa.thoughts }}
                    </div>
                  </div>
                  <div>
                    <div
                      v-if="item.contentFa.action"
                      class="title text-muted-700 dark:text-muted-200 mb-1 mt-3"
                    >
                      اقدام:
                    </div>
                    <div class="text-muted-500 dark:text-muted-400">
                      {{ item.contentFa.action }}
                    </div>
                  </div>
                  <div class="mb-4">
                    <div
                      v-if="item.contentFa.nextSteps"
                      class="title text-muted-700 dark:text-muted-200 mb-1 mt-3"
                    >
                      گام های بعدی:
                    </div>
                    <div class="text-muted-500 dark:text-muted-400">
                      {{ item.contentFa.nextSteps }}
                    </div>
                  </div>
                  <!-- <NuxtLink
                    :to="item.target.url"
                    class="text-primary-500 underline-offset-4 hover:underline"
                    >{{ item.target.name }}</NuxtLink
                  > -->
                  <!-- <span class="text-muted-500 dark:text-muted-400"
                    >&nbsp;{{ item.target.type }}</span
                  > -->
                </BaseText>
                <BaseText size="xs" class="text-muted-400">
                  <span class="ltablet:hidden lg:hidden">
                    {{ new Date(item.created).toLocaleDateString('fa') }}</span>
                  <span class="ltablet:hidden px-2 lg:hidden">&middot;</span>
                  <span>{{
                    new Date(item.created).toLocaleDateString('fa')
                  }}</span>
                </BaseText>
              </div>
              <div class="ms-auto hidden items-center gap-3 sm:flex">
                <BaseAvatar
                  v-for="user in item.people"
                  :key="user.name"
                  :src="user.src"
                  size="xxs"
                />
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>
