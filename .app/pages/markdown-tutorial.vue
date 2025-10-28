<script setup lang="ts">

definePageMeta({
  title: 'جزئیات عمل نیک',
  layout: 'sidebar',
});

useHead({ htmlAttrs: { dir: 'rtl' } });
const markdownExample = `# راهنمای نگارش مارک‌داون

مارک‌داون یک روش ساده برای قالب‌بندی متن است. در این راهنما، نحوه استفاده از آن را یاد می‌گیرید.

## سرفصل‌ها
برای ایجاد سرفصل از علامت # استفاده کنید. تعداد # نشان‌دهنده سطح سرفصل است.

# سرفصل سطح ۱
## سرفصل سطح ۲
### سرفصل سطح ۳
#### سرفصل سطح ۴

## متن‌های ویژه
می‌توانید متن را به شکل‌های مختلف قالب‌بندی کنید:

- **متن پررنگ** با \`**متن**\`
- *متن مورب* با \`*متن*\`
- ***متن پررنگ و مورب*** با \`***متن***\`
- ~~متن خط خورده~~ با \`~~متن~~\`
- \`کد تک خطی\` با \`\`کد\`\`

## لیست‌ها
### لیست نامرتب
- مورد اول
  - زیرمورد اول
  - زیرمورد دوم
- مورد دوم
  * می‌توانید از * هم استفاده کنید
  + یا از + استفاده کنید

### لیست مرتب
1. مورد اول
2. مورد دوم
   1. زیرمورد اول
   2. زیرمورد دوم
3. مورد سوم

## چک‌لیست
- [x] کار انجام شده
- [ ] کار در انتظار
- [x] کار تکمیل شده دیگر

## نقل قول
نقل قول‌ها با > شروع می‌شوند:

> این یک نقل قول است
> که می‌تواند چند خط باشد
>> حتی می‌توانید نقل قول تو در تو داشته باشید

## پیوندها
- [لینک ساده](https://example.com)
- [لینک با توضیح](https://example.com "روی من هاور کنید!")
- لینک مستقیم: <https://example.com>

## تصاویر
تصاویر مانند لینک‌ها هستند، فقط با یک ! در ابتدا:

![توضیح تصویر](https://picsum.photos/200/100)

## کد بلاک
برای نمایش کد از سه بک‌تیک استفاده کنید:

\`\`\`javascript
// این یک بلاک کد است
function sayHello() {
  console.log("سلام دنیا!");
}
\`\`\`

## جدول‌ها
جدول‌ها با خط عمودی (|) ایجاد می‌شوند:

| عنوان ۱ | عنوان ۲ | عنوان ۳ |
|---------|---------|---------|
| سلول ۱  | سلول ۲  | سلول ۳  |
| ردیف ۲  | مقدار   | دیگر    |

## خط افقی
سه خط تیره یا بیشتر یک خط افقی ایجاد می‌کند:

---

## نکات پیشرفته
### کاراکترهای خاص
برای نمایش کاراکترهای خاص از \\ استفاده کنید:
\\* این یک ستاره است \\*

### متن‌های کلید
می‌توانید از <kbd>Ctrl</kbd> + <kbd>C</kbd> برای کپی استفاده کنید.

### پانویس
متن با پانویس[^1] و پانویس دیگر[^2]

[^1]: این توضیح پانویس اول است
[^2]: این توضیح پانویس دوم است`;
</script>

<template>
  <div class="bg-muted-100 dark:bg-muted-900 min-h-screen">
    <div class="container py-10">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-muted-800 text-2xl font-bold dark:text-white">
            راهنمای نگارش مارک‌داون
          </h1>
          <p class="text-muted-500 mt-2 text-sm">
            با این راهنما یاد بگیرید چطور متن‌های خود را زیباتر و ساختاریافته‌تر بنویسید.
          </p>
        </div>
        <NuxtLink to="/deeds/create" class="text-primary-500 hover:text-primary-600 inline-flex items-center gap-1">
          <Icon name="ph:arrow-right" class="size-4" />
          <span>بازگشت به ایجاد کار نیک</span>
        </NuxtLink>
      </div>

      <div class="dark:bg-muted-800 mb-6 rounded-xl bg-white p-4">
        <div class="flex gap-3">
          <Icon name="ph:info" class="text-primary-500 mt-1 size-5 shrink-0" />
          <div class="space-y-2">
            <p class="text-muted-500 dark:text-muted-400 text-sm">
              در این صفحه می‌توانید کد مارک‌داون را در سمت راست و نتیجه نهایی آن را در سمت چپ مشاهده کنید.
              از این مثال‌ها برای نوشتن توضیحات کار نیک خود استفاده کنید.
            </p>
            <ul class="text-muted-500 dark:text-muted-400 space-y-3 text-sm">
              <li class="flex items-center gap-2 leading-relaxed">
                <Icon name="ph:check-circle" class="text-primary-500 size-4 shrink-0" />
                <span>برای استفاده، کافیست متن مورد نظر خود را با قالب مارک‌داون در بخش «توضیح تکمیلی» وارد کنید.</span>
              </li>
              <li class="flex items-center gap-2 leading-relaxed">
                <Icon name="ph:check-circle" class="text-primary-500 size-4 shrink-0" />
                <span>می‌توانید از ترکیب سرفصل‌ها، لیست‌ها و سایر قالب‌بندی‌ها برای ایجاد متن‌های ساختاریافته استفاده کنید.</span>
              </li>
              <li class="flex items-center gap-2 leading-relaxed">
                <Icon name="ph:check-circle" class="text-primary-500 size-4 shrink-0" />
                <span>پیش‌نمایش زنده به شما کمک می‌کند تا نتیجه نهایی را قبل از ثبت مشاهده کنید.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Source -->
        <div class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 rounded-xl border bg-white p-6">
          <div class="mb-4 flex items-center gap-2">
            <Icon name="ph:code" class="text-primary-500 size-5" />
            <h3 class="text-muted-800 text-lg font-medium dark:text-white">
              کد مارک‌داون
            </h3>
          </div>
          <pre class="text-muted-500 dark:text-muted-400 whitespace-pre-wrap text-sm leading-relaxed">{{ markdownExample }}</pre>
        </div>

        <!-- Preview -->
        <div class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 rounded-xl border bg-white p-6">
          <div class="mb-4 flex items-center gap-2">
            <Icon name="ph:eye" class="text-primary-500 size-5" />
            <h3 class="text-muted-800 text-lg font-medium dark:text-white">
              پیش‌نمایش
            </h3>
          </div>
          <div class="prose prose-sm dark:prose-invert prose-headings:mb-4 prose-ul:list-disc prose-ol:list-decimal prose-li:mr-4 rtl max-w-none">
            <AddonMarkdownRemark :source="markdownExample" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
