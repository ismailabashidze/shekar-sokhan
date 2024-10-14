<template>
  <div
    class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 bg-white0 relative z-10 block w-full border-r sm:hidden"
  >
    <div class="flex w-full flex-row justify-between">
      <div class="flex flex-row">
        <div
          class="ltablet:w-full flex size-16 shrink-0 items-center justify-center lg:w-full"
        >
          <NuxtLink to="/dashboard" class="flex items-center justify-center">
            <div class="rounded-full bg-white p-[5px]">
              <img
                src="/img/logo-no-bg.png"
                width="40"
                height="40"
                alt=""
                srcset=""
              >
            </div>
          </NuxtLink>
        </div>
        <div
          class="ltablet:w-full flex size-16 shrink-0 items-center justify-center lg:w-full"
        >
          <BaseThemeToggle />
        </div>
      </div>
      <div class="ml-5 flex flex-row gap-x-2">
        <div class="flex h-16 w-full items-center justify-center">
          <!-- <NuxtLink
            to=""
            title="Settings"
            class="text-warning-400 hover:text-primary-500 bg-warning-500/20 hover:bg-primary-500/20 flex size-12 cursor-pointer items-center justify-center rounded-2xl transition-colors duration-300"
            @click.prevent="canDelete"
          >
            <Icon name="ph:arrow-clockwise" class="size-5" />
          </NuxtLink> -->
        </div>
        <div class="flex h-16 w-full items-center justify-center">
          <NuxtLink
            to="/dashboard"
            class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
            title="Settings"
          >
            <Icon name="ph:house-line" class="size-5" />
          </NuxtLink>
        </div>
        <div class="flex h-16 w-full items-center justify-center">
          <NuxtLink
            to=""
            class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
            title="Settings"
            @click.prevent="signout"
          >
            <Icon name="ph:sign-out" class="size-5" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// defineProps({
//   canDelete: {
//     type: Function,
//     required: true,
//   },
//   signout: {
//     type: Function,
//     required: true,
//   },
// })
const signout = () => {}
const changeExpanded = () => {}
const canDelete = () => {}

</script>

  <style scoped>
  /* Add any component-specific styles here */
  </style>
