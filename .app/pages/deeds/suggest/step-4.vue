<script setup lang="ts">
import type { Deed, DeedStepData } from '../types'

definePageMeta({
  title: 'پیشنهاد کار نیک - مرحله ۴',
  preview: {
    title: 'پیشنهاد کار نیک - مرحله ۴',
    description: 'برای پیشنهاد کارهای نیک',
    categories: ['dashboards', 'wizards', 'forms'],
    src: '/img/screens/wizard-4.png',
    srcDark: '/img/screens/wizard-4-dark.png',
    order: 33,
  },
})
useHead({
  title: 'نیازمندی‌ها و ذی‌نفعان',
  htmlAttrs: { dir: 'rtl' },
})

const { data: deed, errors, checkPreviousSteps } = useMultiStepForm<Deed, DeedStepData>()

onBeforeMount(checkPreviousSteps)

const newBeneficiary = ref('')
const newRequirement = ref('')

function addBeneficiary() {
  if (newBeneficiary.value.trim()) {
    deed.value.beneficiaries.push(newBeneficiary.value.trim())
    newBeneficiary.value = ''
  }
}

function removeBeneficiary(index: number) {
  deed.value.beneficiaries.splice(index, 1)
}

function addRequirement() {
  if (newRequirement.value.trim()) {
    deed.value.requirements.push(newRequirement.value.trim())
    newRequirement.value = ''
  }
}

function removeRequirement(index: number) {
  deed.value.requirements.splice(index, 1)
}
</script>

<template>
  <div>
    <DemoWizardStepTitle />

    <div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4">
      <!-- Beneficiaries Section -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <BaseHeading
            as="h3"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-muted-100"
          >
            <span>ذی‌نفعان</span>
          </BaseHeading>
          <BaseParagraph
            size="sm"
            class="text-muted-400"
          >
            <span>چه کسانی از این کار نیک بهره‌مند می‌شوند؟</span>
          </BaseParagraph>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex gap-2">
            <BaseInput
              v-model="newBeneficiary"
              placeholder="نام گروه یا فرد ذی‌نفع"
              rounded="lg"
              @keyup.enter="addBeneficiary"
            />
            <BaseButton
              rounded="lg"
              @click="addBeneficiary"
            >
              افزودن
            </BaseButton>
          </div>
          <div v-if="deed.beneficiaries.length > 0" class="mt-2">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div
                v-for="(beneficiary, index) in deed.beneficiaries"
                :key="index"
                class="flex items-center justify-between rounded-lg p-2 bg-muted-100 dark:bg-muted-800"
              >
                <span class="text-muted-800 dark:text-muted-100">{{ beneficiary }}</span>
                <BaseButtonIcon
                  size="sm"
                  rounded="full"
                  @click="removeBeneficiary(index)"
                >
                  <Icon name="lucide:x" class="size-4" />
                </BaseButtonIcon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Requirements Section -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <BaseHeading
            as="h3"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-muted-100"
          >
            <span>نیازمندی‌ها</span>
          </BaseHeading>
          <BaseParagraph
            size="sm"
            class="text-muted-400"
          >
            <span>چه چیزهایی برای انجام این کار نیک لازم است؟</span>
          </BaseParagraph>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex gap-2">
            <BaseInput
              v-model="newRequirement"
              placeholder="نیازمندی جدید"
              rounded="lg"
              @keyup.enter="addRequirement"
            />
            <BaseButton
              rounded="lg"
              @click="addRequirement"
            >
              افزودن
            </BaseButton>
          </div>
          <div v-if="deed.requirements.length > 0" class="mt-2">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div
                v-for="(requirement, index) in deed.requirements"
                :key="index"
                class="flex items-center justify-between rounded-lg p-2 bg-muted-100 dark:bg-muted-800"
              >
                <span class="text-muted-800 dark:text-muted-100">{{ requirement }}</span>
                <BaseButtonIcon
                  size="sm"
                  rounded="full"
                  @click="removeRequirement(index)"
                >
                  <Icon name="lucide:x" class="size-4" />
                </BaseButtonIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
