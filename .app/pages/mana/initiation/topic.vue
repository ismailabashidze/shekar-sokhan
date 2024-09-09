<script setup lang="ts">
import type { Invite, StepData } from '../../../types'

definePageMeta({
  preview: {
    title: 'انتخاب موضوع - گام 2',
    description: 'انتخاب موضوعات می تواند به تشخیص و فرایند صحبت کمک کند',
    categories: ['layouts', 'wizards', 'forms'],
    src: '/img/screens/layouts-invite-permissions.png',
    srcDark: '/img/screens/layouts-invite-permissions-dark.png',
    order: 37,
    new: true,
  },
})
useHead({
  title: 'انتخاب موضوع',
})

const roles = ref([
  {
    value: 'Excessive Worry or Stress',
    title: 'احساس نگرانی یا استرس زیاد',
    desc: 'احساس مستمر نگرانی و استرس که ممکن است با علائم جسمی مانند تپش قلب، تعریق، یا سردرد همراه باشد و در فعالیت‌های روزمره و تصمیم‌گیری‌های مهم اختلال ایجاد کند.',
  },
  {
    value: 'Persistent Sadness or Despair',
    title: 'احساس غم یا ناامیدی مداوم',
    desc: 'احساس طولانی‌مدت غمگینی، ناامیدی، یا بی‌تفاوتی که تأثیر منفی بر علاقه‌مندی‌ها و فعالیت‌های شخصی می‌گذارد و ممکن است با اختلال در خواب و اشتها همراه باشد.',
  },
  {
    value: 'Relationship Issues',
    title: 'مشکلات در روابط زناشویی یا عاطفی',
    desc: 'دشواری‌ها و تنش‌ها در حفظ روابط سالم و مؤثر با همسر، شریک عاطفی، یا سایر افراد نزدیک، که می‌تواند شامل اختلافات، سوء تفاهم، یا احساس نارضایتی باشد.',
  },
  {
    value: 'Family Problems',
    title: 'مشکلات خانوادگی',
    desc: 'مواجهه با تعارضات یا مشکلات عمیق درون خانواده که ممکن است شامل برخوردهای منفی، عدم درک متقابل، یا فشارهای خانوادگی باشد و احساس آرامش و امنیت را مختل کند.',
  },
  {
    value: 'Anger Management',
    title: 'دشواری در کنترل عصبانیت',
    desc: 'مشکل در کنترل خشم و واکنش‌های پرخاشگرانه که می‌تواند به روابط شخصی و حرفه‌ای آسیب برساند و موجب پشیمانی یا مشکلات قانونی شود.',
  },
  {
    value: 'Eating Disorders',
    title: 'مشکلات مربوط به خوردن و تغذیه',
    desc: 'رفتارهای غیرطبیعی مربوط به خوردن که می‌تواند شامل پرخوری عصبی یا بی‌اشتهایی باشد و بر سلامت جسمانی و روانی تأثیر منفی می‌گذارد.',
  },
  {
    value: 'Substance Abuse',
    title: 'اعتیاد به الکل، دخانیات، یا مواد مخدر',
    desc: 'وابستگی به مواد مخدر، الکل، یا دخانیات که می‌تواند بر تمام جنبه‌های زندگی فرد از جمله سلامتی، روابط، و وضعیت شغلی تأثیر بگذارد.',
  },
  {
    value: 'Fatigue or Lack of Energy',
    title: 'احساس خستگی یا بی‌انرژی بیش از حد',
    desc: 'احساس مداوم خستگی و کمبود انرژی که حتی با استراحت کافی بهبود نمی‌یابد و ممکن است بر عملکرد شغلی و شخصی تأثیر بگذارد.',
  },
  {
    value: 'Sleep Issues',
    title: 'مشکلات مربوط به خواب',
    desc: 'مواجهه با اختلالات خواب مانند بی‌خوابی یا خواب زیاد که می‌تواند ناشی از استرس، مشکلات بهداشتی، یا دیگر شرایط باشد و بر سلامت کلی تأثیر بگذارد.',
  },
  {
    value: 'Low Self-Esteem',
    title: 'مشکلات مربوط به خودباوری و عزت نفس',
    desc: 'احساس ناکافی بودن یا کم ارزش بودن که ممکن است در اعتماد به نفس و توانایی‌های شخصی اختلال ایجاد کند و به افسردگی یا اضطراب منجر شود.',
  },
  {
    value: 'Past Trauma',
    title: 'تجربیات و ناکامی های گذشته',
    desc: 'تجربیات و اتفاقات گذشته که هنوز بر حال و روز فرد تأثیر می‌گذارد و ممکن است شامل حوادث ناگوار، سوء استفاده‌ها، یا حوادث ترسناک باشد. به طور کلی حوادثی از گذشته که در حال حاضر ناراحت کننده هستند.',
  },
  {
    value: 'Concentration or Memory Problems',
    title: 'دشواری در تمرکز یا حافظه',
    desc: 'دشواری در حفظ تمرکز یا مشکلات حافظه که می‌تواند بر عملکرد کاری، تحصیلی، و ارتباطات روزمره تأثیر بگذارد.',
  },
  {
    value: 'Sexual Issues',
    title: 'مشکلات جنسی یا مسائل مربوط به هویت جنسی',
    desc: 'دشواری‌ها یا نگرانی‌های مربوط به فعالیت جنسی، جهت‌گیری جنسی، یا هویت جنسیتی که ممکن است با اضطراب یا تعارض درونی همراه باشد.',
  },
  {
    value: 'Life Changes',
    title: 'نگرانی‌های مربوط به تغییرات بزرگ در زندگی',
    desc: 'مواجهه با تغییرات عمده در زندگی مانند از دست دادن شغل، جدایی، یا مرگ عزیزان که می‌تواند چالش‌برانگیز و استرس‌زا باشد.',
  },
  {
    value: 'Grief and Loss',
    title: 'سوگ و از دست دادن عزیزان',
    desc: 'روند سوگواری و مقابله با احساسات شدید غم و اندوه ناشی از از دست دادن شخصی نزدیک یا دوست‌داشتنی.',
  },
  {
    value: 'Self-Harm',
    title: 'آسیب به خود',
    desc: 'رفتارهای آسیب‌رسان به خود که ممکن است به عنوان راهی برای مقابله با احساسات شدید استفاده شود و نیازمند مداخله فوری است.',
  },
  {
    value: 'Suicidal Thoughts',
    title: 'افکار خودکشی',
    desc: 'داشتن افکاری در مورد خاتمه دادن به زندگی خود که می‌تواند نشانه‌ای از بحران روانی عمیق باشد و نیاز به حمایت فوری دارد.',
  },
  {
    value: 'Suicide Attempts',
    title: 'اقدام به خودکشی',
    desc: 'تلاش‌های قبلی برای پایان دادن به زندگی خود که بیانگر نیاز به دریافت حمایت فوری است.',
  },
],
)
const {
  data: request,
  currentStepId,
  loading,
  errors,
  getPrevStep,
  steps,
  checkPreviousSteps,
} = useMultiStepForm<Invite, StepData>()

onBeforeMount(checkPreviousSteps)
</script>

<template>
  <div class="w-full">
    <div class="mb-8 space-y-2">
      <BaseHeading
        as="h2"
        size="2xl"
        weight="medium"
        class="md:!3xl text-muted-800 dark:text-white"
      >
        {{ steps[currentStepId].meta.title }}
      </BaseHeading>
      <BaseParagraph
        size="sm"
        class="text-muted-500 dark:text-muted-400 max-w-sm"
      >
        {{ steps[currentStepId].meta.subtitle }}
      </BaseParagraph>
    </div>

    <div class="w-full max-w-md">
      <div class="w-full space-y-4">
        <!--Radio groups-->
        <BaseCheckboxHeadless
          v-for="role in roles"
          :key="role.title"
          v-model="request.role"
          :value="role.value"
          name="role_permissions"
          class="nui-focus !appearance-none rounded-lg !opacity-100"
        >
          <div
            class="peer-checked:child:scale-1 peer-not-checked:child:scale-0 bg-muted-100 text-muted-100 dark:bg-muted-900 dark:text-muted-900 peer-checked:text-primary-500 absolute start-[1.35rem] top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full"
          >
            <div
              class="size-3 rounded-full bg-current transition-colors duration-300"
            />
          </div>
          <div
            class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 peer-checked:shadow-muted-400/10 dark:peer-checked:shadow-muted-800/10 group-focus-visible:tw-accessibility-static group flex cursor-pointer items-center rounded-lg border bg-white px-6 py-4 transition-shadow duration-300 peer-checked:shadow-xl"
          >
            <div
              class="border-muted-200 flex size-5 items-center justify-center rounded-full border"
            />
            <div class="ms-6 flex flex-col">
              <BaseText
                weight="medium"
                class="text-muted-800 dark:text-muted-100 block"
              >
                {{ role.title }}
              </BaseText>
              <BaseParagraph
                size="xs"
                class="text-muted-500 dark:text-muted-400"
              >
                {{ role.desc }}
              </BaseParagraph>
            </div>
          </div>
        </BaseCheckboxHeadless>
        <BaseInputHelpText
          v-if="errors.fields.role"
          color="danger"
          class="text-lg"
        >
          {{ errors.fields.role }}
        </BaseInputHelpText>
      </div>

      <div class="mt-4 flex gap-4">
        <BaseButton
          v-if="currentStepId > 0"
          :to="loading ? undefined : getPrevStep()?.to"
          :disabled="!getPrevStep()"
          size="lg"
          class="w-full"
        >
          <span>بازگشت</span>
        </BaseButton>
        <BaseButton
          type="submit"
          color="primary"
          size="lg"
          class="w-full"
        >
          <span>ادامه</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>
