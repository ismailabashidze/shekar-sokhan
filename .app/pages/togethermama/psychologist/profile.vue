<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  title: 'پروفایل روانشناس - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const psychologist = ref({
  name: 'دکتر مریم ترابی',
  email: 'maryam.tarabi@example.com',
  phone: '09123456789',
  specialty: 'روانشناس کودک',
  experience: '۸ سال',
  license: 'شماره نظام روانشناسی: 123456',
  avatar: '/img/avatars/2.svg',
  bio: 'متخصص در زمینه رشد کودک و مشکلات رفتاری کودکان. دارای مدرک دکتری روانشناسی بالینی از دانشگاه تهران و عضو هیئت علمی دانشگاه شهید بهشتی.',
  education: [
    'دکتری روانشناسی بالینی - دانشگاه تهران',
    'کارشناسی ارشد روانشناسی کودک - دانشگاه شهید بهشتی',
    'کارشناسی روانشناسی - دانشگاه الزهرا',
  ],
  specialties: [
    'روانشناسی کودک',
    'مشکلات رفتاری کودک',
    'اختلالات یادگیری',
    'مشاوره خانواده',
    'آسیب‌شناسی رشد کودک',
  ],
})

const updateProfile = () => {
  // Mock update functionality
  alert('پروفایل با موفقیت به‌روزرسانی شد')
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
        پروفایل
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        اطلاعات حساب حرفه‌ای خود را مدیریت کنید
      </BaseParagraph>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Profile Info -->
      <div class="lg:col-span-2">
        <BaseCard class="p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            اطلاعات حساب
          </BaseHeading>

          <form @submit.prevent="updateProfile">
            <div class="space-y-5">
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <BaseInput
                  v-model="psychologist.name"
                  label="نام و نام خانوادگی"
                  placeholder="نام کامل شما"
                  shape="curved"
                />
                
                <BaseInput
                  v-model="psychologist.email"
                  label="آدرس ایمیل"
                  type="email"
                  placeholder="example@email.com"
                  shape="curved"
                />
                
                <BaseInput
                  v-model="psychologist.phone"
                  label="شماره تماس"
                  type="tel"
                  placeholder="09123456789"
                  shape="curved"
                />
                
                <BaseInput
                  v-model="psychologist.license"
                  label="شماره نظام روانشناسی"
                  placeholder="شماره معتبر"
                  shape="curved"
                />
              </div>

              <BaseSelect
                v-model="psychologist.specialty"
                label="تخصص"
                shape="curved"
              >
                <option value="روانشناس کودک">روانشناس کودک</option>
                <option value="متخصص رفتار کودک">متخصص رفتار کودک</option>
                <option value="روان درمانگر کودک">روان درمانگر کودک</option>
                <option value="مشاوره خانواده">مشاوره خانواده</option>
              </BaseSelect>

              <BaseTextarea
                v-model="psychologist.bio"
                label="درباره شما"
                placeholder="توضیحاتی درباره تخصص و تجربیات خود بنویسید"
                rows="4"
              />

              <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white mt-8 mb-4">
                تحصیلات
              </BaseHeading>

              <div class="space-y-3">
                <BaseInput
                  v-for="(edu, index) in psychologist.education"
                  :key="index"
                  v-model="psychologist.education[index]"
                  :label="`مدرک ${index + 1}`"
                  placeholder="نام مدرک و دانشگاه"
                  shape="curved"
                />
              </div>

              <div class="flex justify-end pt-4">
                <BaseButton
                  type="submit"
                  color="primary"
                  shape="curved"
                >
                  به‌روزرسانی پروفایل
                </BaseButton>
              </div>
            </div>
          </form>
        </BaseCard>
      </div>

      <!-- Avatar Section -->
      <div>
        <BaseCard class="p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            تصویر پروفایل
          </BaseHeading>

          <div class="flex flex-col items-center">
            <BaseAvatar
              :src="psychologist.avatar"
              :text="psychologist.name.substring(0, 2)"
              size="xl"
              class="mb-4"
            />
            
            <BaseButton size="sm" color="muted" variant="outline" class="mb-3 w-full">
              تغییر تصویر
            </BaseButton>
            
            <BaseButton size="sm" color="danger" variant="outline" class="w-full">
              حذف تصویر
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>