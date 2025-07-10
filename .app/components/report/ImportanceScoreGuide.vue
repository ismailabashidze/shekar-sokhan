<template>
  <BaseCard shape="curved" class="p-6">
    <div class="mb-4 flex items-center justify-between">
      <BaseHeading
        as="h3"
        size="md"
        weight="semibold"
        class="text-muted-800 dark:text-white"
      >
        <Icon name="ph:info-duotone" class="me-2 size-5" />
        راهنمای امتیازدهی جلسات
      </BaseHeading>
      <BaseButton
        size="sm"
        variant="ghost"
        @click="isExpanded = !isExpanded"
      >
        <Icon :name="isExpanded ? 'ph:caret-up-duotone' : 'ph:caret-down-duotone'" class="me-1 size-4" />
        {{ isExpanded ? 'بستن' : 'نمایش جزئیات' }}
      </BaseButton>
    </div>

    <!-- Quick Overview -->
    <div class="mb-4">
      <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
        سیستم هوشمند امتیازدهی با استفاده از هوش مصنوعی، اهمیت هر جلسه را بر اساس ۴ معیار علمی محاسبه می‌کند تا بتوانید مهم‌ترین جلسات را سریع‌تر شناسایی کنید.
      </BaseParagraph>
    </div>

    <!-- Importance Levels Quick Reference -->
    <div class="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="rounded-lg border-2 border-red-200 bg-red-50 p-3 text-center dark:border-red-500/20 dark:bg-red-900/20">
        <Icon name="ph:warning-duotone" class="mx-auto mb-1 size-6 text-red-500" />
        <div class="text-xs font-medium text-red-700 dark:text-red-300">
          بحرانی
        </div>
        <div class="text-xs text-red-600 dark:text-red-400">
          ۸۰-۱۰۰
        </div>
      </div>
      <div class="rounded-lg border-2 border-orange-200 bg-orange-50 p-3 text-center dark:border-orange-500/20 dark:bg-orange-900/20">
        <Icon name="ph:star-duotone" class="mx-auto mb-1 size-6 text-orange-500" />
        <div class="text-xs font-medium text-orange-700 dark:text-orange-300">
          مهم
        </div>
        <div class="text-xs text-orange-600 dark:text-orange-400">
          ۶۰-۷۹
        </div>
      </div>
      <div class="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-3 text-center dark:border-yellow-500/20 dark:bg-yellow-900/20">
        <Icon name="ph:circle-duotone" class="mx-auto mb-1 size-6 text-yellow-500" />
        <div class="text-xs font-medium text-yellow-700 dark:text-yellow-300">
          متوسط
        </div>
        <div class="text-xs text-yellow-600 dark:text-yellow-400">
          ۴۰-۵۹
        </div>
      </div>
      <div class="rounded-lg border-2 border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-500/20 dark:bg-gray-900/20">
        <Icon name="ph:minus-circle-duotone" class="mx-auto mb-1 size-6 text-gray-500" />
        <div class="text-xs font-medium text-gray-700 dark:text-gray-300">
          کم
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400">
          ۰-۳۹
        </div>
      </div>
    </div>

    <!-- Detailed Explanation (Expandable) -->
    <div v-if="isExpanded" class="border-muted-200 dark:border-muted-700 border-t pt-4">
      <div class="space-y-6">
        <!-- Algorithm Overview -->
        <div>
          <BaseHeading
            as="h4"
            size="sm"
            weight="medium"
            class="text-muted-700 dark:text-muted-300 mb-3"
          >
            <Icon name="ph:brain-duotone" class="me-2 size-4" />
            چگونه الگوریتم کار می‌کند؟
          </BaseHeading>
          <div class="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/20 dark:bg-indigo-900/20">
            <div class="space-y-3 text-sm text-indigo-700 dark:text-indigo-300">
              <div class="flex items-start gap-2">
                <Icon name="ph:number-circle-one-duotone" class="mt-0.5 size-4 shrink-0" />
                <span>هر جلسه بر اساس ۴ معیار مستقل امتیازدهی می‌شود (هر معیار از ۰ تا ۱۰۰)</span>
              </div>
              <div class="flex items-start gap-2">
                <Icon name="ph:number-circle-two-duotone" class="mt-0.5 size-4 shrink-0" />
                <span>امتیاز نهایی با میانگین وزنی محاسبه می‌شود</span>
              </div>
              <div class="flex items-start gap-2">
                <Icon name="ph:number-circle-three-duotone" class="mt-0.5 size-4 shrink-0" />
                <span>جلسات بر اساس امتیاز نهایی مرتب و گروه‌بندی می‌شوند</span>
              </div>
              <div class="mt-3 rounded border border-indigo-300 bg-indigo-100 p-2 dark:border-indigo-400/30 dark:bg-indigo-800/30">
                <div class="text-xs font-medium">
                  فرمول محاسبه:
                </div>
                <div class="font-mono text-xs">
                  امتیاز نهایی = (تازگی×۰.۳) + (محتوا×۰.۳) + (طول×۰.۲) + (کلیدی×۰.۴)
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scoring Criteria -->
        <div>
          <BaseHeading
            as="h4"
            size="sm"
            weight="medium"
            class="text-muted-700 dark:text-muted-300 mb-3"
          >
            معیارهای امتیازدهی
          </BaseHeading>
          <div class="grid gap-4 sm:grid-cols-2">
            <!-- Recency Score -->
            <div class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-900/20">
              <div class="mb-3 flex items-center gap-2">
                <Icon name="ph:clock-duotone" class="size-5 text-blue-500" />
                <span class="font-medium text-blue-700 dark:text-blue-300">تازگی (وزن: ۳۰٪)</span>
              </div>
              <div class="mb-3 text-xs text-blue-600 dark:text-blue-400">
                <strong>چرا مهم است؟</strong> جلسات جدیدتر معمولاً شامل اطلاعات به‌روز و وضعیت فعلی بیمار هستند.
              </div>
              <div class="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                <div>• امروز تا ۷ روز: ۱۰۰ امتیاز</div>
                <div>• ۷ تا ۳۰ روز: ۸۰ امتیاز</div>
                <div>• ۳۰ تا ۹۰ روز: ۶۰ امتیاز</div>
                <div>• ۹۰ تا ۱۸۰ روز: ۴۰ امتیاز</div>
                <div>• ۶ ماه تا ۱ سال: ۲۰ امتیاز</div>
                <div>• بیش از ۱ سال: ۱۰ امتیاز</div>
              </div>
            </div>

            <!-- Content Score -->
            <div class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-900/20">
              <div class="mb-3 flex items-center gap-2">
                <Icon name="ph:text-aa-duotone" class="size-5 text-green-500" />
                <span class="font-medium text-green-700 dark:text-green-300">محتوا (وزن: ۳۰٪)</span>
              </div>
              <div class="mb-3 text-xs text-green-600 dark:text-green-400">
                <strong>چرا مهم است؟</strong> جلسات با محتوای غنی‌تر و متنوع‌تر اطلاعات بیشتری ارائه می‌دهند.
              </div>
              <div class="space-y-1 text-xs text-green-600 dark:text-green-400">
                <div>• حضور کلمات کلیدی مشاوره</div>
                <div>• تنوع موضوعات مطرح شده</div>
                <div>• عمق بحث و تحلیل</div>
                <div>• تعداد مباحث مهم</div>
                <div>• کیفیت تعامل درمان‌گر و بیمار</div>
              </div>
            </div>

            <!-- Length Score -->
            <div class="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-500/20 dark:bg-purple-900/20">
              <div class="mb-3 flex items-center gap-2">
                <Icon name="ph:ruler-duotone" class="size-5 text-purple-500" />
                <span class="font-medium text-purple-700 dark:text-purple-300">طول محتوا (وزن: ۲۰٪)</span>
              </div>
              <div class="mb-3 text-xs text-purple-600 dark:text-purple-400">
                <strong>چرا مهم است؟</strong> جلسات طولانی‌تر معمولاً حاوی بحث‌های عمیق‌تر و جزئیات بیشتری هستند.
              </div>
              <div class="space-y-1 text-xs text-purple-600 dark:text-purple-400">
                <div>• کمتر از ۵۰ کاراکتر: ۲۰ امتیاز</div>
                <div>• ۵۰ تا ۲۰۰ کاراکتر: ۶۰ امتیاز</div>
                <div>• ۲۰۰ تا ۵۰۰ کاراکتر: ۹۰ امتیاز</div>
                <div>• بیش از ۵۰۰ کاراکتر: ۱۰۰ امتیاز</div>
              </div>
            </div>

            <!-- Keyword Score -->
            <div class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-900/20">
              <div class="mb-3 flex items-center gap-2">
                <Icon name="ph:key-duotone" class="size-5 text-red-500" />
                <span class="font-medium text-red-700 dark:text-red-300">کلمات کلیدی (وزن: ۴۰٪)</span>
              </div>
              <div class="mb-3 text-xs text-red-600 dark:text-red-400">
                <strong>چرا بیشترین وزن را دارد؟</strong> کلمات خاص نشان‌دهنده مسائل مهم و بحرانی روانی هستند.
              </div>
              <div class="space-y-1 text-xs text-red-600 dark:text-red-400">
                <div>• کلمات بحرانی: ۴۰ امتیاز</div>
                <div class="me-2">
                  خودکشی، آسیب، خشونت، بحران
                </div>
                <div>• کلمات مهم: ۲۰ امتیاز</div>
                <div class="me-2">
                  افسردگی، اضطراب، اعتیاد، خانواده
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Practical Examples -->
        <div>
          <BaseHeading
            as="h4"
            size="sm"
            weight="medium"
            class="text-muted-700 dark:text-muted-300 mb-3"
          >
            <Icon name="ph:lightbulb-duotone" class="me-2 size-4" />
            مثال‌های عملی
          </BaseHeading>
          <div class="space-y-3">
            <!-- High Score Example -->
            <div class="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-500/20 dark:bg-red-900/20">
              <div class="mb-2 flex items-center gap-2">
                <Icon name="ph:warning-duotone" class="size-4 text-red-500" />
                <span class="text-sm font-medium text-red-700 dark:text-red-300">مثال جلسه بحرانی (امتیاز ۸۵)</span>
              </div>
              <div class="text-xs text-red-600 dark:text-red-400">
                جلسه دیروز • محتوای غنی با کلمات بحرانی • خلاصه طولانی • شامل مباحث خودکشی و افسردگی
              </div>
            </div>

            <!-- Medium Score Example -->
            <div class="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-500/20 dark:bg-yellow-900/20">
              <div class="mb-2 flex items-center gap-2">
                <Icon name="ph:circle-duotone" class="size-4 text-yellow-500" />
                <span class="text-sm font-medium text-yellow-700 dark:text-yellow-300">مثال جلسه متوسط (امتیاز ۴۵)</span>
              </div>
              <div class="text-xs text-yellow-600 dark:text-yellow-400">
                جلسه ۲ ماه پیش • محتوای عادی • خلاصه متوسط • شامل مباحث عمومی استرس
              </div>
            </div>

            <!-- Low Score Example -->
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-500/20 dark:bg-gray-900/20">
              <div class="mb-2 flex items-center gap-2">
                <Icon name="ph:minus-circle-duotone" class="size-4 text-gray-500" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">مثال جلسه کم‌اهمیت (امتیاز ۲۰)</span>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400">
                جلسه ۸ ماه پیش • محتوای محدود • خلاصه کوتاه • بدون کلمات کلیدی خاص
              </div>
            </div>
          </div>
        </div>

        <!-- Important Keywords -->
        <div>
          <BaseHeading
            as="h4"
            size="sm"
            weight="medium"
            class="text-muted-700 dark:text-muted-300 mb-3"
          >
            <Icon name="ph:key-duotone" class="me-2 size-4" />
            کلمات کلیدی مهم
          </BaseHeading>
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <div class="mb-2 font-medium text-red-600 dark:text-red-400">
                بحرانی (۴۰ امتیاز)
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="keyword in criticalKeywords"
                  :key="keyword"
                  class="rounded bg-red-100 px-2 py-1 text-xs text-red-700 dark:bg-red-900 dark:text-red-300"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
            <div>
              <div class="mb-2 font-medium text-orange-600 dark:text-orange-400">
                مهم (۲۰ امتیاز)
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="keyword in importantKeywords"
                  :key="keyword"
                  class="rounded bg-orange-100 px-2 py-1 text-xs text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
            <div>
              <div class="mb-2 font-medium text-yellow-600 dark:text-yellow-400">
                متوسط (۱۰ امتیاز)
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="keyword in regularKeywords"
                  :key="keyword"
                  class="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Compression Info -->
        <div>
          <BaseHeading
            as="h4"
            size="sm"
            weight="medium"
            class="text-muted-700 dark:text-muted-300 mb-3"
          >
            <Icon name="ph:archive-duotone" class="me-2 size-4" />
            فشرده‌سازی هوشمند
          </BaseHeading>
          <div class="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-900/20">
            <div class="space-y-3 text-sm text-orange-700 dark:text-orange-300">
              <div class="flex items-center gap-2">
                <Icon name="ph:archive-duotone" class="size-4" />
                <span><strong>هدف:</strong> بهینه‌سازی فضای ذخیره‌سازی با حفظ اطلاعات مهم</span>
              </div>
              <div class="me-6 space-y-2 text-xs">
                <div><strong>شرایط فشرده‌سازی:</strong></div>
                <div>• جلسات بیش از ۴ ماه قدمت</div>
                <div>• امتیاز اهمیت کمتر از ۳۵</div>
                <div>• حفظ جملات حاوی کلمات کلیدی</div>
                <div>• حذف جزئیات اضافی و تکراری</div>
                <div class="mt-2 font-medium">
                  نتیجه: کاهش ۴۰٪ حجم با حفظ ۱۰۰٪ اطلاعات مهم
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Usage Tips -->
        <div>
          <BaseHeading
            as="h4"
            size="sm"
            weight="medium"
            class="text-muted-700 dark:text-muted-300 mb-3"
          >
            <Icon name="ph:graduation-cap-duotone" class="me-2 size-4" />
            راهنمای استفاده
          </BaseHeading>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-500/20 dark:bg-green-900/20">
              <div class="flex items-start gap-2">
                <Icon name="ph:target-duotone" class="mt-0.5 size-4 text-green-500" />
                <div class="text-sm text-green-700 dark:text-green-300">
                  <strong>یافتن جلسات بحرانی:</strong> از فیلتر «جلسات بحرانی» برای دسترسی سریع به جلسات با امتیاز ۸۰+
                </div>
              </div>
            </div>
            <div class="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-500/20 dark:bg-blue-900/20">
              <div class="flex items-start gap-2">
                <Icon name="ph:magnifying-glass-duotone" class="mt-0.5 size-4 text-blue-500" />
                <div class="text-sm text-blue-700 dark:text-blue-300">
                  <strong>جستجوی هدفمند:</strong> از کادر جستجو برای یافتن جلسات حاوی کلمات کلیدی خاص
                </div>
              </div>
            </div>
            <div class="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-500/20 dark:bg-purple-900/20">
              <div class="flex items-start gap-2">
                <Icon name="ph:funnel-duotone" class="mt-0.5 size-4 text-purple-500" />
                <div class="text-sm text-purple-700 dark:text-purple-300">
                  <strong>فیلترهای پیشرفته:</strong> از محدوده تاریخ و سطح اهمیت برای تنظیم دقیق نتایج
                </div>
              </div>
            </div>
            <div class="rounded-lg border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-500/20 dark:bg-indigo-900/20">
              <div class="flex items-start gap-2">
                <Icon name="ph:chart-line-duotone" class="mt-0.5 size-4 text-indigo-500" />
                <div class="text-sm text-indigo-700 dark:text-indigo-300">
                  <strong>تحلیل روند:</strong> از نمودار آمار برای بررسی روند بهبود یا تغییرات در طول زمان
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isExpanded = ref(false)

// Keywords categorized by importance
const criticalKeywords = ['خودکشی', 'آسیب', 'خشونت', 'بحران', 'فوری', 'اورژانس', 'خطر', 'تهدید']
const importantKeywords = ['افسردگی', 'اضطراب', 'اعتیاد', 'خانواده', 'ازدواج', 'طلاق', 'فرزند', 'والدین', 'همسر']
const regularKeywords = ['استرس', 'ترس', 'خشم', 'نگرانی', 'غم', 'مشکل', 'چالش', 'هدف', 'پیشرفت', 'بهبود']
</script>

<style scoped>
/* RTL support for nested elements */
[dir="rtl"] .me-2 {
  margin-right: 0.5rem;
}

[dir="rtl"] .me-6 {
  margin-right: 1.5rem;
}
</style>
