<script setup lang="ts">
  import { ref, computed } from 'vue';

  interface JournalEntry {
    id: string;
    date: Date;
    title: string;
    content: string;
    stage: string;
  }

  definePageMeta({
    title: 'مستندسازی فرایند پژوهش',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();

  const journalEntries = ref<JournalEntry[]>([
    {
      id: '1',
      date: new Date(),
      title: 'تصمیم اولیه درباره حوزه پژوهش',
      content: 'پس از بررسی، تصمیم گرفتیم روی تأثیر فناوری بر رفتار انسانی تمرکز کنیم...',
      stage: 'مرحله ۱',
    },
  ]);

  const newJournalTitle = ref('');
  const newJournalContent = ref('');
  const selectedStage = ref('عمومی');

  const stageOptions = [
    'عمومی',
    'مرحله ۱',
    'مرحله ۲',
    'مرحله ۳',
    'مرحله ۴',
  ];

  const addJournalEntry = () => {
    if (newJournalTitle.value.trim() && newJournalContent.value.trim()) {
      journalEntries.value.unshift({
        id: Date.now().toString(),
        date: new Date(),
        title: newJournalTitle.value.trim(),
        content: newJournalContent.value.trim(),
        stage: selectedStage.value,
      });
      newJournalTitle.value = '';
      newJournalContent.value = '';
      selectedStage.value = 'عمومی';
    }
  };

  const deleteEntry = (id: string) => {
    journalEntries.value = journalEntries.value.filter(entry => entry.id !== id);
  };

  const exportJournal = () => {
    let content = `# روزنوشتهٔ فرایند پژوهش\n\n`;
    content += `تاریخ خروجی: ${new Date().toLocaleString('fa-IR')}\n`;
    content += `تعداد یادداشت‌ها: ${journalEntries.value.length}\n\n`;
    content += `---\n\n`;

    journalEntries.value.forEach((entry, index) => {
      content += `## ${index + 1}. ${entry.title}\n\n`;
      content += `**تاریخ:** ${new Date(entry.date).toLocaleDateString('fa-IR')}\n`;
      content += `**مرحله:** ${entry.stage}\n\n`;
      content += `${entry.content}\n\n`;
      content += `---\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `process-journal-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const goBack = () => {
    router.push('/hampazhooh/brainstorm');
  };
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4">
          <BaseButton
            color="muted"
            shape="curved"
            size="sm"
            @click="goBack"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-4" />
            بازگشت
          </BaseButton>
          <div class="flex-1">
            <div class="mb-2 flex items-center gap-3">
              <div
                class="bg-success-500 shadow-success-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg"
              >
                <Icon name="ph:notebook" class="size-6 text-white" />
              </div>
              <div>
                <BaseHeading
                  as="h1"
                  size="2xl"
                  weight="bold"
                  class="text-gray-900 dark:text-white"
                >
                  روزنوشتهٔ فرایند پژوهش
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">
                  Process Documentation
                </BaseParagraph>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-5xl">
        <!-- Introduction -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="mb-3 text-gray-900 dark:text-white"
            >
              اهمیت مستندسازی فرایند
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 leading-relaxed">
              روزنوشتهٔ فرایند یک ابزار ضروری برای ثبت تصمیمات، تغییرات، و یادگیری‌های شماست. این مستندات نه تنها به شما
              در ردیابی پیشرفت کمک می‌کند، بلکه برای دیگران نیز منبع ارزشمندی خواهد بود.
            </BaseParagraph>
          </div>

          <!-- Features -->
          <div class="dark:border-muted-700 dark:bg-muted-900/50 rounded-xl border border-gray-100 bg-gray-50 p-6">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="mb-4 text-gray-900 dark:text-white"
            >
              فواید مستندسازی
            </BaseHeading>
            <div class="grid gap-4 sm:grid-cols-3">
              <div class="flex items-start gap-3">
                <Icon name="ph:clock-clockwise-fill" class="text-success-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    ردیابی پیشرفت
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    مشاهده تحول ایده‌ها در طول زمان
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:lightbulb-filament-fill" class="text-success-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    یادگیری
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    درس‌گیری از تصمیمات و اشتباهات
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:users-three-fill" class="text-success-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    اشتراک‌گذاری
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    انتقال دانش به دیگران
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add New Entry Form -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="text-gray-900 dark:text-white"
            >
              افزودن یادداشت جدید
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 mt-1">
              تصمیمات، تغییرات و یادگیری‌های خود را ثبت کنید
            </BaseParagraph>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">عنوان یادداشت</label>
              <BaseInput
                v-model="newJournalTitle"
                placeholder="مثال: تغییر در سؤال تحقیق"
                shape="curved"
                :classes="{ input: 'h-12' }"
              />
            </div>

            <div>
              <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">مرحله مرتبط</label>
              <BaseSelect v-model="selectedStage" shape="curved">
                <option
                  v-for="stage in stageOptions"
                  :key="stage"
                  :value="stage"
                >
                  {{ stage }}
                </option>
              </BaseSelect>
            </div>

            <div>
              <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">محتوای یادداشت</label>
              <BaseTextarea
                v-model="newJournalContent"
                placeholder="تصمیمات، دلایل، و یادگیری‌های خود را بنویسید..."
                rows="6"
                shape="curved"
              />
            </div>

            <div class="flex gap-3">
              <BaseButton
                color="success"
                shape="curved"
                :disabled="!newJournalTitle.trim() || !newJournalContent.trim()"
                @click="addJournalEntry"
              >
                <Icon name="ph:plus-circle" class="ml-2 size-5" />
                افزودن یادداشت
              </BaseButton>
              <BaseButton
                color="muted"
                shape="curved"
                :disabled="journalEntries.length === 0"
                @click="exportJournal"
              >
                <Icon name="ph:download-simple" class="ml-2 size-4" />
                دانلود همه
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Journal Entries -->
        <div class="mb-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="text-gray-900 dark:text-white"
            >
              یادداشت‌های ثبت شده
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 mt-1">
              {{ journalEntries.length }} یادداشت
            </BaseParagraph>
          </div>

          <div v-if="journalEntries.length === 0" class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <Icon name="ph:notebook" class="text-muted-400 mx-auto mb-4 size-16" />
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="text-muted-600 mb-2"
            >
              هنوز یادداشتی ثبت نشده است
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              اولین یادداشت خود را اضافه کنید تا فرایند پژوهش خود را مستند کنید
            </BaseParagraph>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="entry in journalEntries"
              :key="entry.id"
              class="dark:bg-muted-800 dark:border-muted-700 group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:shadow-lg"
            >
              <div class="mb-3 flex items-start justify-between">
                <div class="flex-1">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="semibold"
                    class="mb-2 text-gray-900 dark:text-white"
                  >
                    {{ entry.title }}
                  </BaseHeading>
                  <div class="text-muted-500 flex flex-wrap items-center gap-3 text-xs">
                    <div class="flex items-center gap-1">
                      <Icon name="ph:calendar" class="size-3.5" />
                      <span>{{ new Date(entry.date).toLocaleDateString('fa-IR') }}</span>
                    </div>
                    <span>•</span>
                    <BaseTag
                      color="success"
                      size="sm"
                      shape="full"
                    >
                      {{ entry.stage }}
                    </BaseTag>
                  </div>
                </div>
                <BaseButton
                  color="danger"
                  shape="curved"
                  size="sm"
                  class="opacity-0 transition-opacity group-hover:opacity-100"
                  @click="deleteEntry(entry.id)"
                >
                  <Icon name="ph:trash" class="size-4" />
                </BaseButton>
              </div>
              <div class="text-muted-700 dark:text-muted-300 whitespace-pre-line text-sm leading-relaxed">
                {{ entry.content }}
              </div>
            </div>
          </div>
        </div>

        <!-- Tips Box -->
        <div class="bg-success-500/10 dark:bg-success-500/20 border-success-500/20 rounded-2xl border-2 p-6">
          <div class="flex items-start gap-4">
            <div class="bg-success-500 flex size-12 shrink-0 items-center justify-center rounded-xl">
              <Icon name="ph:lightbulb-fill" class="size-6 text-white" />
            </div>
            <div class="flex-1">
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-3 text-gray-900 dark:text-white"
              >
                نکات مهم برای مستندسازی
              </BaseHeading>
              <ul class="text-muted-700 dark:text-muted-200 space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-success-500 mt-1 size-4 shrink-0" />
                  <span>یادداشت‌های خود را به صورت منظم و در زمان واقعی ثبت کنید، نه در انتها.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-success-500 mt-1 size-4 shrink-0" />
                  <span>حتی تصمیمات و ایده‌های ردشده را ثبت کنید - ممکن است در آینده مفید باشند.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-success-500 mt-1 size-4 shrink-0" />
                  <span>دلایل تصمیمات خود را بنویسید تا بعداً بتوانید آن‌ها را بازبینی کنید.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-success-500 mt-1 size-4 shrink-0" />
                  <span>از این مستندات برای نوشتن مقدمه، روش‌شناسی و بخش بحث مقاله استفاده کنید.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
