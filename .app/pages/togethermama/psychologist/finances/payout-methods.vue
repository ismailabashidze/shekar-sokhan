<script setup lang="ts">
definePageMeta({
  title: 'روش‌های تسویه - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const payoutMethods = ref([
  {
    id: 1,
    type: 'bank-account',
    name: 'حساب بانک ملی',
    number: 'IR123456789012345678901234',
    isDefault: true,
  },
  {
    id: 2,
    type: 'bank-account',
    name: 'حساب بانک صادرات',
    number: 'IR098765432109876543210987',
    isDefault: false,
  },
])

const newPayoutMethod = ref({
  accountNumber: '',
  bankName: '',
  accountHolder: '',
})

const addPayoutMethod = () => {
  // Mock add payout method functionality
  alert('روش تسویه جدید اضافه شد')
}

const removePayoutMethod = (id: number) => {
  // Mock remove payout method functionality
  alert(`روش تسویه با شناسه ${id} حذف شد`)
}

const setDefault = (id: number) => {
  // Mock set default functionality
  alert(`روش تسویه با شناسه ${id} به عنوان پیش‌فرض تنظیم شد`)
}
</script>

<template>
  <div>
    <div class="mb-8">
      <BaseHeading
        as="h1"
        size="2xl"
        weight="bold"
        class="text-muted-800 dark:text-white"
      >
        روش‌های تسویه
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مدیریت حساب‌ها و روش‌های تسویه درآمد
      </BaseParagraph>
    </div>

    <!-- Payout Methods List -->
    <div class="mb-8">
      <div class="mb-4 flex items-center justify-between">
        <BaseHeading as="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
          حساب‌های تسویه
        </BaseHeading>
      </div>

      <div class="space-y-4">
        <BaseCard
          v-for="method in payoutMethods"
          :key="method.id"
          class="p-5"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="bg-muted-100 dark:bg-muted-800 flex size-12 items-center justify-center rounded-lg">
                <Icon name="ph:bank" class="text-muted-500 size-6" />
              </div>
              <div>
                <BaseHeading as="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                  {{ method.name }}
                </BaseHeading>
                <BaseParagraph class="text-muted-500 text-sm">
                  {{ method.number }}
                </BaseParagraph>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <BaseTag v-if="method.isDefault" color="success" variant="pastel" size="sm">
                پیش‌فرض
              </BaseTag>
              <BaseDropdown>
                <template #button>
                  <BaseButtonIcon size="sm" color="muted">
                    <Icon name="ph:dots-three-vertical" class="size-4" />
                  </BaseButtonIcon>
                </template>
                <template #content>
                  <BaseDropdownItem @click="setDefault(method.id)">
                    <Icon name="ph:star" class="size-4" />
                    <span>تنظیم به عنوان پیش‌فرض</span>
                  </BaseDropdownItem>
                  <BaseDropdownItem @click="removePayoutMethod(method.id)">
                    <Icon name="ph:trash" class="size-4" />
                    <span>حذف حساب</span>
                  </BaseDropdownItem>
                </template>
              </BaseDropdown>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Add New Payout Method -->
    <BaseCard class="p-6">
      <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
        افزودن روش تسویه جدید
      </BaseHeading>

      <form @submit.prevent="addPayoutMethod">
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
          <BaseInput
            v-model="newPayoutMethod.accountHolder"
            label="نام صاحب حساب"
            placeholder="نام کامل"
            shape="curved"
          />
          
          <BaseSelect
            v-model="newPayoutMethod.bankName"
            label="نام بانک"
            shape="curved"
          >
            <option value="">انتخاب بانک</option>
            <option value="ملی">بانک ملی</option>
            <option value="صادرات">بانک صادرات</option>
            <option value="ملت">بانک ملت</option>
            <option value="تجارت">بانک تجارت</option>
            <option value="سامان">بانک سامان</option>
          </BaseSelect>
          
          <BaseInput
            v-model="newPayoutMethod.accountNumber"
            label="شماره شبا"
            placeholder="IR123456789012345678901234"
            shape="curved"
            class="md:col-span-2"
          />
        </div>

        <div class="mt-6 flex justify-end">
          <BaseButton
            type="submit"
            color="primary"
            shape="curved"
          >
            افزودن حساب
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
