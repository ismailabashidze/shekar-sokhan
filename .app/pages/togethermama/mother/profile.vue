<script setup lang="ts">
definePageMeta({
  title: 'پروفایل من',
  layout: 'default',
})

const user = {
  name: 'زهرا محمدی',
  email: 'zahra.m@gmail.com',
  phone: '09123456789',
  memberSince: '1402/02/15',
  avatar: '/img/avatars/1.svg',
}

const preferences = {
  notifications: true,
  newsletter: true,
  sms: false,
}

const updateProfile = () => {
  // Mock function for updating profile
  alert('پروفایل با موفقیت به‌روزرسانی شد')
}

const changePassword = () => {
  // Mock function for changing password
  alert('لینک تغییر رمز عبور به ایمیل شما ارسال شد')
}
</script>

<template>
  <div>
    <div class="mb-8">
      <BaseHeading
        as="h1"
        size="2xl"
        weight="semibold"
        class="text-muted-800 dark:text-white"
      >
        <span>پروفایل من</span>
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        <span>اطلاعات حساب کاربری خود را مدیریت کنید</span>
      </BaseParagraph>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Profile Info -->
      <div class="lg:col-span-2">
        <BaseCard class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              اطلاعات شخصی
            </BaseHeading>
          </div>

          <div class="space-y-6">
            <!-- Avatar and Name -->
            <div class="flex items-center gap-6">
              <BaseAvatar
                :src="user.avatar"
                size="xl"
              />
              <div>
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="medium"
                  class="text-muted-800 dark:text-white mb-1"
                >
                  {{ user.name }}
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-500">
                  عضو از {{ user.memberSince }}
                </BaseParagraph>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <BaseLabel class="mb-2">نام و نام خانوادگی</BaseLabel>
                <BaseInput
                  v-model="user.name"
                  placeholder="نام و نام خانوادگی"
                />
              </div>
              
              <div>
                <BaseLabel class="mb-2">ایمیل</BaseLabel>
                <BaseInput
                  v-model="user.email"
                  type="email"
                  placeholder="ایمیل"
                />
              </div>
              
              <div>
                <BaseLabel class="mb-2">تلفن همراه</BaseLabel>
                <BaseInput
                  v-model="user.phone"
                  type="tel"
                  placeholder="تلفن همراه"
                />
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <BaseButton color="muted" variant="outline">
                <span>لغو</span>
              </BaseButton>
              <BaseButton color="primary" @click="updateProfile">
                <span>ذخیره تغییرات</span>
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <!-- Password Change -->
        <BaseCard class="p-6 mt-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              تغییر رمز عبور
            </BaseHeading>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <BaseLabel class="mb-2">رمز عبور فعلی</BaseLabel>
                <BaseInput
                  type="password"
                  placeholder="رمز عبور فعلی"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <BaseLabel class="mb-2">رمز عبور جدید</BaseLabel>
                <BaseInput
                  type="password"
                  placeholder="رمز عبور جدید"
                />
              </div>
              
              <div>
                <BaseLabel class="mb-2">تکرار رمز عبور جدید</BaseLabel>
                <BaseInput
                  type="password"
                  placeholder="تکرار رمز عبور جدید"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <BaseButton color="primary" @click="changePassword">
                <span>تغییر رمز عبور</span>
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Preferences -->
        <BaseCard class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              تنظیمات اعلان‌ها
            </BaseHeading>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <BaseHeading
                  as="h3"
                  size="sm"
                  weight="medium"
                  class="text-muted-800 dark:text-white mb-1"
                >
                  اعلان‌های برنامه
                </BaseHeading>
                <BaseParagraph size="xs" class="text-muted-500">
                  دریافت اعلان‌های جلسات و برنامه‌ها
                </BaseParagraph>
              </div>
              <BaseSwitch
                v-model="preferences.notifications"
                color="primary"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <BaseHeading
                  as="h3"
                  size="sm"
                  weight="medium"
                  class="text-muted-800 dark:text-white mb-1"
                >
                  خبرنامه
                </BaseHeading>
                <BaseParagraph size="xs" class="text-muted-500">
                  دریافت مقالات و نکات آموزشی
                </BaseParagraph>
              </div>
              <BaseSwitch
                v-model="preferences.newsletter"
                color="primary"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <BaseHeading
                  as="h3"
                  size="sm"
                  weight="medium"
                  class="text-muted-800 dark:text-white mb-1"
                >
                  پیامک‌های سیستمی
                </BaseHeading>
                <BaseParagraph size="xs" class="text-muted-500">
                  دریافت پیامک‌های مهم سیستمی
                </BaseParagraph>
              </div>
              <BaseSwitch
                v-model="preferences.sms"
                color="primary"
              />
            </div>
          </div>
        </BaseCard>

        <!-- Danger Zone -->
        <BaseCard class="border-danger-500/30 bg-danger-500/10 dark:bg-danger-500/10 p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-danger-700 dark:text-danger-300"
            >
              ناحیه خطر
            </BaseHeading>
          </div>

          <div class="space-y-4">
            <BaseButton color="danger" variant="solid">
              <span>حذف حساب کاربری</span>
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
