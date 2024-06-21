<script setup lang="ts">
import type { Invite, StepData } from '../../types'

definePageMeta({
  layout: 'empty',
})
useHead({
  titleTemplate: title => `${title} | گام  ${currentStepId.value + 1}`,
  htmlAttrs: { dir: 'rtl' },
})

const { createUserDetails, getUserDetails } = useUser()

const initialState = ref<Invite>({
  name: '',
  email: '',
  role: [],
  gender: '',
  age: null,
  maritalStatus: '',
  jobStatus: '',
  description: '',
})

const toaster = useToaster()
const nuxtApp = useNuxtApp()

const res = await getUserDetails(nuxtApp.$pb.authStore.model.id)
if (res.length) {
  toaster.clearAll()
  toaster.show({
    title: 'اطلاعات ثبت شده',
    message: `اطلاعات قبلی ثبت شده است. `,
    color: 'warning',
    icon: 'ph:warning',
    closable: true,
  })
  navigateTo('/mani/')
}

function convertLabels(label) {
  const maritalStatus = {
    'مجرد': 'single',
    'متاهل': 'married',
    'در رابطه عاطفی': 'inRelation',
    'اقدام برای جدایی': 'breakUp',
    'طلاق گرفته': 'divorced',
  }

  const employmentStatus = {
    'دانش آموز': 'schoolStudent',
    'دانشجو': 'universityStudent',
    'استخدام بخش دولتی': 'publicSectorRecruitment',
    'استخدام بخش خصوصی': 'privateSectorRecruitment',
    'شغل آزاد': 'freelance',
    'جویای کار': 'seekingForJob',
    'خانه دار': 'houseWife',
    'بیکار': 'jobless',
  }

  const gender = {
    'مرد': 'male',
    'زن': 'female',
    'ترجیح می دهم نگویم': 'NA',
  }

  if (maritalStatus[label]) {
    return maritalStatus[label]
  }
  else if (employmentStatus[label]) {
    return employmentStatus[label]
  }
  else if (gender[label]) {
    return gender[label]
  }
  else {
    return 'Unknown label' // Return the label as is if no translation is found
  }
}

const { handleSubmit, currentStepId, goToStep, progress, complete, steps } = provideMultiStepForm({
  initialState,
  steps: [
    {
      to: '/mani/initiation',
      meta: {
        name: 'اطلاعات اولیه',
        title: 'اطلاعات اولیه',
        subtitle:
          'کمی بیشتر از خودتان بگویید. این به ما کمک می کند تا خدمات را بهتر به شما ارائه کنیم.',
      },
      async validate({ data, setFieldError, resetFieldError }) {
        resetFieldError(['name', 'age', 'gender', 'maritalStatus', 'jobStatus'])
        if (!data.value.age) setFieldError('age', 'سن خود را وارد نمایید')
        if (!data.value.gender) setFieldError('gender', 'جنسیت را به درستی انتخاب نمایید')
        if (!data.value.maritalStatus) setFieldError('maritalStatus', 'وضعیت تاهل را به درستی وارد نمایید')
        if (!data.value.jobStatus) setFieldError('jobStatus', 'وضعیت شغلی را به درستی وارد نمایید')
      },
    },
    {
      to: '/mani/initiation/topic',
      meta: {
        name: 'موضوع صحبت',
        title: 'انتخاب کنید',
        subtitle:
          'لطفا از موارد زیر، موضوعاتی که می خواهید در مورد آن ها در این جلسه ی گفت و گو صحبت کنید را انتخاب نمایید. می توانید یک یا چند مورد را انتخاب نمایید.',
      },
      async validate({ data, setFieldError, resetFieldError }) {
        resetFieldError(['role'])
        if (!data.value.role?.length) setFieldError('role', 'حداقل یک عدد باید انتخاب گردد.')
      },
    },
    {
      to: '/mani/initiation/review',
      meta: {
        name: 'کمی توضیح بیشتر',
        title: 'کمی توضیح بیشتر',
        subtitle:
          'هر آنچه که فکر می کنید برای توضیح لازم است بنویسید. اطلاعات بیشتر همواره کمک کننده است. لطفا وقت بگذارید و چند خطی بنویسید!',
      },
    },
  ],
  onSubmit: async (data, ctx) => {
    // Simulate async request
    await new Promise(resolve => setTimeout(resolve, 4000))
    data.gender = convertLabels(data.gender)
    data.maritalStatus = convertLabels(data.maritalStatus)
    data.jobStatus = convertLabels(data.jobStatus)
    await createUserDetails({ ...data, user: nuxtApp.$pb.authStore.model.id, topics: data.role })
    toaster.clearAll()
    toaster.show({
      title: 'ثبت موفق',
      message: `اطلاعات با موفقیت ثبت شد`,
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
  },
  onError: (error) => {
    toaster.clearAll()
    toaster.show({
      title: 'Error',
      message: error.message,
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  },
})
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-white">
    <NavigationTop title="به ذهنا خوش آمدید" close-to="/" />
    <div class="w-full pb-20 pt-32">
      <div class="mx-auto w-full max-w-6xl px-4">
        <div class="grid w-full gap-10 md:grid-cols-12">
          <!--Stepper column-->
          <div :class="complete ? 'hidden' : 'md:col-span-3 lg:col-span-4'">
            <!--Stepper-->
            <div
              class="xs:w-full xs:max-w-xs xs:mx-auto flex flex-col gap-4 md:flex-row"
            >
              <div
                class="xs:max-w-xs xs:mx-auto relative flex justify-between gap-7 md:flex-col"
              >
                <!--Progress-->
                <div
                  class="xs:top-1.5 xs:inset-x-0 bg-muted-200 dark:bg-muted-700 absolute start-1 top-2 z-0 mx-auto h-1 w-[calc(100%_-_1rem)] md:h-[calc(100%_-_1rem)] md:w-1 md:-translate-x-1/2"
                />
                <!--Vertical progress-->
                <div
                  class="bg-primary-500 absolute start-[6px] top-0 z-10 mx-auto hidden w-0.5 -translate-x-1/2 rounded-full transition-all duration-300 md:block"
                  :style="`height: ${progress}%;`"
                />
                <!--Horizontal progress (mobile)-->
                <div
                  class="bg-primary-500 absolute start-1.5 top-[7px] z-10 h-0.5 rounded-full transition-all duration-300 md:hidden"
                  :style="`width: calc(${progress}% - 0.5rem);`"
                />
                <!--Nodes-->
                <div
                  v-for="(step, index) in steps"
                  :key="index"
                  class="bg-muted-200 dark:bg-muted-700 relative z-20 flex size-4 items-center justify-center rounded-full"
                >
                  <span
                    class="bg-primary-500 block size-2 rounded-full transition-transform duration-300"
                    :class="currentStepId >= index ? 'scale-1' : 'scale-0'"
                  />
                </div>
              </div>
              <div
                class="relative flex justify-center gap-7 md:flex-col md:justify-between"
              >
                <a
                  v-for="(step, index) in steps"
                  :key="index"
                  class="h-4 leading-none"
                  role="button"
                  :tabindex="0"
                  :class="[currentStepId === index ? '' : 'xs:hidden', currentStepId > step.id ? 'nui-link' : 'cursor-default']"
                  @click.prevent="currentStepId > step.id ? goToStep(step) : () => {}"
                >
                  <span
                    class="font-heading block text-xs"
                    :class="
                      currentStepId === index
                        ? 'text-muted-800 dark:text-muted-100'
                        : 'text-muted-400 dark:text-muted-500'
                    "
                  >
                    {{ step.meta.name }}
                  </span>
                </a>
              </div>
            </div>
          </div>

          <!--Steps column-->
          <div
            :class="complete ? 'col-span-12' : 'md:col-span-9 lg:col-span-8'"
          >
            <form
              action=""
              method="POST"
              novalidate
              @submit.prevent="handleSubmit"
            >
              <NuxtPage />
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
