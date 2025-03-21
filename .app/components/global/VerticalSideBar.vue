<template>
  <div
    class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative z-10 hidden h-screen w-20 border-r bg-white sm:block"
  >
    <div class="flex h-full flex-col justify-between">
      <div class="flex flex-col">
        <div
          class="ltablet:w-full flex size-16 shrink-0 items-center justify-center lg:w-full"
        >
          <NuxtLink to="#" class="flex items-center justify-center">
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
      <div class="flex flex-col">
        <!-- <div class="flex h-16 w-full items-center justify-center">
          <NuxtLink
            to=""
            title="پاک کردن گفت و گو"
            class="text-warning-400 hover:text-primary-500 bg-warning-500/20 hover:bg-primary-500/20 flex size-12 cursor-pointer items-center justify-center rounded-2xl transition-colors duration-300"
            @click.prevent="canDelete"
          >
            <Icon name="ph:arrow-clockwise" class="size-5" />
          </NuxtLink>
        </div> -->
        <div class="flex h-16 w-full items-center justify-center">
          <NuxtLink
            to="/dashboard"
            class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
            title="بازگشت به صفحه اصلی"
          >
            <Icon name="ph:house-line" class="size-5" />
          </NuxtLink>
        </div>
        <div class="hidden h-16 w-full items-center justify-center md:flex">
          <button
            class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
            title="نمایش اطلاعات"
            @click.prevent="changeExpanded"
          >
            <Icon name="ph:robot" class="size-5" />
          </button>
        </div>
        <div class="flex h-16 w-full items-center justify-center">
          <NuxtLink
            to="/login"
            class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
            title="خروج"
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
//   changeExpanded: {
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
