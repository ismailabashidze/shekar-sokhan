<script setup lang="ts">
import { ref } from 'vue';
import { definePageMeta } from '#imports';
import type { Deed } from '~/composables/useDeed';

definePageMeta({
  title: 'ایجاد عمل نیک جدید',
  layout: 'sidebar',
});

useHead({ htmlAttrs: { dir: 'rtl' } });

const { createDeed } = useDeed();
const router = useRouter();
const toaster = useToaster();

const backToDeeds = () => {
  router.push('/deeds/list');
};

// Initialize deed with default values
const deed = ref<Deed>({
  id: '',
  emoji: '🌟',
  title: '',
  description: '',
  shortDescription: '',
  longDescription: '',
  type: 'family',
  status: 'pending',
  author: '',
  approvedBy: '',
  approvedAt: '',
  views: 0,
  completions: 0,
  category_deed: '',
  tags: [],
  difficulty: 'simple',
  timeRequired: 'below_15',
});

const loading = ref(false);
const error = ref<string | null>(null);

// Maps for dropdown options
const typeMap = {
  family: 'خانواده',
  society: 'اجتماعی',
  spiritual: 'معنوی',
  environment: 'محیط زیست',
  mindfulness: 'ذهن‌آگاهی',
  self: 'خودسازی',
};

const difficultyMap = {
  simple: 'ساده',
  moderate: 'متوسط',
  hard: 'چالش‌برانگیز',
};

const timeMap = {
  below_15: 'کمتر از ۱۵ دقیقه',
  between_15_60: '۱۵ تا ۶۰ دقیقه',
  more_60: 'بیش از ۶۰ دقیقه',
};

// Common emojis for deeds, categorized
const emojiCategories = {
  positive: ['🌟', '✨', '💫', '⭐', '🌈', '🎯', '💝', '💪', '🙌', '👏', '🎉', '🎊', '🌅', '🎨', '🎭', '🎪', '🎠', '🎡', '🎢', '🎬', '🎮', '🎲', '🎰', '🎳', '🎱', '🎸', '🎹', '🎺', '🎻', '🥁', '🎷', '🪗', '🪘', '🎵', '🎶', '🎼', '🎧', '🎤', '🖼️', '🕹️'],
  nature: ['🌱', '🌿', '🌺', '🌸', '🌼', '🌻', '🌍', '🌎', '🌞', '🌙', '🦋', '🕊️', '🌳', '🌲', '🌴', '🌵', '🌾', '🌷', '🌹', '🥀', '🍀', '🦁', '🐯', '🦊', '🦝', '🐨', '🐼', '🦘', '🦬', '🦃', '🦚', '🦜', '🦢', '🦩', '🦅', '🦉', '🐝', '🐌', '🐞', '🦗'],
  spiritual: ['🙏', '☮️', '🕯️', '🧘‍♀️', '🧘‍♂️', '📿', '⚛️', '🕉️', '☯️', '✝️', '☪️', '🕌', '⛪', '🕍', '🛕', '🏰', '⚜️', '🔮', '📖', '🧎‍♀️', '🧎‍♂️', '🙇‍♀️', '🙇‍♂️', '🤲', '👐', '🌠', '🌌', '🎇', '🎆', '🪬'],
  family: ['👨‍👩‍👧‍👦', '👨‍👩‍👦', '👩‍👦', '👨‍👧', '💑', '💖', '❤️', '💕', '💓', '💗', '💞', '👶', '🧒', '👧', '👦', '👩', '👨', '👵', '👴', '🧑‍🤝‍🧑', '💏', '👨‍👨‍👦', '👩‍👩‍👦', '👨‍👨‍👧‍👦', '👩‍👩‍👧‍👦', '🫂', '👨‍👩‍👧', '👨‍👩‍👧‍👧', '👨‍👩‍👦‍👦', '💘'],
  social: ['🤝', '👥', '💬', '🗣️', '💭', '💡', '🤗', '🎁', '💌', '💐', '🎈', '🫶', '🤜', '🤛', '✊', '👊', '🫱‍🫲', '💃', '🕺', '👯‍♀️', '👯‍♂️', '✌️', '🤞', '🤟', '🤘', '👌', '🫰', '🎭', '🎪', '🎨'],
  mindfulness: ['🧠', '⚖️', '💆‍♀️', '💆‍♂️', '🎐', '🪷', '🍃', '🌊', '🌄', '🎑', '🏔️', '⛰️', '🗻', '🌋', '🎋', '🎍', '🎎', '🏃‍♀️', '🏃‍♂️', '🚶‍♀️', '🚶‍♂️', '🧘', '🏊‍♀️', '🏊‍♂️', '🧗‍♀️', '🧗‍♂️', '🚴‍♀️', '🚴‍♂️', '🌇', '🌆'],
};

const activeCategory = ref('positive');

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Validate required fields
    if (!deed.value.title || !deed.value.description || !deed.value.shortDescription || !deed.value.emoji || !deed.value.type || !deed.value.difficulty || !deed.value.timeRequired) {
      throw new Error('لطفا همه فیلدهای ضروری را پر کنید');
    }

    // Create new deed
    const newDeed = await createDeed(deed.value);

    // Show success message
    toaster.clearAll();
    toaster.show({
      title: 'موفقیت‌آمیز',
      message: 'عمل نیک جدید با موفقیت ایجاد شد',
      color: 'success',
      icon: 'ph:check-circle',
      closable: true,
    });

    // Redirect to deed detail page
    router.push(`/deeds/${newDeed.id}`);
  }
  catch (e: any) {
    error.value = e.message || 'خطا در ایجاد عمل نیک';
    toaster.clearAll();
    toaster.show({
      title: 'خطا',
      message: error.value,
      color: 'danger',
      icon: 'ph:x-circle',
      closable: true,
    });
  }
  finally {
    loading.value = false;
  }
};
const convertHtmlToMarkdown = (html: string) => {
  if (!html) return '';

  return html
    // Convert divs with # to headings
    .replace(/<div>#+ ([^<]+)<\/div>/g, (_, title) => `# ${title}\n`)
    .replace(/<div>##+ ([^<]+)<\/div>/g, (_, title) => `## ${title}\n`)
    // Convert lists
    .replace(/<div>&nbsp; &nbsp;\* ([^<]+)<\/div>/g, (_, item) => `* ${item}\n`)
    .replace(/<div>\d+\. ([^<]+)<\/div>/g, (_, item) => `1. ${item}\n`)
    // Convert regular divs to paragraphs
    .replace(/<div>([^<]+)<\/div>/g, (_, text) => `${text}\n`)
    // Clean up
    .replace(/<br>/g, '\n')
    .replace(/&zwnj;/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
};
const formatLongDescription = (html: string) => {
  return convertHtmlToMarkdown(html);
};

const newTag = ref('');

const addTag = () => {
  if (!newTag.value) return;
  if (!deed.value.tags) deed.value.tags = [];
  if (!deed.value.tags.includes(newTag.value)) {
    deed.value.tags.push(newTag.value);
  }
  newTag.value = '';
};

const removeTag = (tag: string) => {
  if (!deed.value.tags) return;
  deed.value.tags = deed.value.tags.filter(t => t !== tag);
};
</script>

<template>
  <div class="p-4">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink to="/deeds/list" class="text-primary-500 hover:text-primary-600">
          <Icon name="ph:arrow-right" class="size-6" />
        </NuxtLink>
        <BaseHeading
          tag="h1"
          size="2xl"
          weight="semibold"
          lead="tight"
          class="text-muted-800 dark:text-white"
        >
          ایجاد عمل نیک جدید
        </BaseHeading>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Main Content -->
      <div class="lg:col-span-2">
        <BaseCard rounded="lg" class="mb-6">
          <div class="relative">
            <div class="p-6">
              <!-- Form -->

              <form class="space-y-6">
                <!-- Emoji Selector -->
                <div class="space-y-4">
                  <label class="text-muted-500 dark:text-muted-400 mb-1 block font-medium">
                    ایموجی
                  </label>
                  <!-- Category Tabs -->
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="(emojis, category) in emojiCategories"
                      :key="category"
                      type="button"
                      class="text-muted-500 dark:text-muted-400 hover:bg-muted-100 dark:hover:bg-muted-700 rounded-lg px-3 py-1.5 text-sm transition-colors"
                      :class="{ 'bg-muted-100 dark:bg-muted-700 text-primary-500': activeCategory === category }"
                      @click="activeCategory = category"
                    >
                      {{ {
                        positive: 'مثبت',
                        nature: 'طبیعت',
                        spiritual: 'معنوی',
                        family: 'خانواده',
                        social: 'اجتماعی',
                        mindfulness: 'ذهن‌آگاهی'
                      }[category] }}
                    </button>
                  </div>
                  <!-- Emoji Grid -->
                  <div class="bg-muted-50 dark:bg-muted-800/50 max-h-[300px] overflow-y-auto rounded-xl p-4">
                    <div class="grid grid-cols-4 gap-2 sm:grid-cols-8">
                      <button
                        v-for="emoji in emojiCategories[activeCategory]"
                        :key="emoji"
                        type="button"
                        class="hover:bg-muted-100 dark:hover:bg-muted-700 flex aspect-square items-center justify-center rounded-lg text-2xl transition-colors"
                        :class="{ 'bg-muted-100 dark:bg-muted-700 ring-primary-500 ring-2': deed.emoji === emoji }"
                        @click="deed.emoji = emoji"
                      >
                        {{ emoji }}
                      </button>
                    </div>
                  </div>
                  <!-- Selected Emoji Preview -->
                  <div v-if="deed.emoji" class="flex items-center gap-3">
                    <div class="bg-primary-50 dark:bg-primary-500/20 flex size-12 items-center justify-center rounded-lg pt-2 text-3xl">
                      {{ deed.emoji }}
                    </div>
                    <div class="text-muted-400 text-sm">
                      ایموجی انتخاب شده
                    </div>
                  </div>
                </div>

                <!-- Title -->
                <BaseInput
                  v-model="deed.title"
                  label="عنوان"
                  placeholder="عنوان عمل نیک را وارد کنید"
                  :classes="{
                    wrapper: 'max-w-full',
                  }"
                  required
                />

                <!-- Short Description -->
                <BaseTextarea
                  v-model="deed.shortDescription"
                  label="توضیح کوتاه"
                  placeholder="یک توضیح کوتاه در مورد این عمل نیک بنویسید"
                  :classes="{
                    wrapper: 'max-w-full',
                  }"
                  rows="2"
                  required
                />

                <!-- Description -->
                <BaseTextarea
                  v-model="deed.description"
                  label="توضیح"
                  placeholder="توضیح کامل در مورد این عمل نیک بنویسید"
                  :classes="{
                    wrapper: 'max-w-full',
                  }"
                  rows="4"
                  required
                />

                <!-- Long Description -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label class="text-muted-800 dark:text-muted-100 block font-medium">توضیح تکمیلی</label>
                    <NuxtLink to="/markdown-tutorial" class="text-primary-500 hover:text-primary-600 inline-flex items-center gap-1 text-sm">
                      <Icon name="ph:info" class="size-4" />
                      <span>راهنمای نگارش</span>
                    </NuxtLink>
                  </div>
                  <BaseTextarea
                    v-model="deed.longDescription"
                    rows="6"
                    :classes="{
                      wrapper: 'max-w-full',
                    }"
                    placeholder="توضیحات تکمیلی خود را وارد کنید..."
                  />
                  <!-- Markdown Preview -->
                  <div v-if="deed.longDescription" class="border-muted-200 dark:border-muted-700 dark:bg-muted-800/50 rounded-xl border p-4">
                    <div class="mb-2 flex items-center gap-2">
                      <Icon name="ph:eye" class="text-primary-500 size-4" />
                      <h3 class="text-muted-800 text-sm font-medium dark:text-white">
                        پیش‌نمایش
                      </h3>
                    </div>
                    <div class="prose prose-sm dark:prose-invert prose-headings:mb-4 prose-ul:list-disc prose-ol:list-decimal prose-li:mr-4 rtl max-w-none">
                      <div class="text-muted-500 dark:text-muted-400 leading-relaxed">
                        <AddonMarkdownRemark :source="formatLongDescription(deed.longDescription)" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Form Grid -->
                <div class="grid gap-6 sm:grid-cols-2">
                  <!-- Type -->
                  <div class="border-muted-200 dark:border-muted-700 dark:bg-muted-800/50 rounded-xl border bg-white p-4">
                    <div class="mb-4 flex items-center gap-2">
                      <Icon name="ph:list" class="text-primary-500 size-5" />
                      <h3 class="text-muted-800 text-lg font-medium dark:text-white">
                        نوع کار نیک
                      </h3>
                    </div>
                    <BaseSelect
                      v-model="deed.type"
                      label="نوع کار نیک"
                      placeholder="نوع کار نیک را انتخاب کنید"
                      required
                    >
                      <option
                        v-for="[value, label] in Object.entries(typeMap)"
                        :key="value"
                        :value="value"
                      >
                        {{ label }}
                      </option>
                    </BaseSelect>
                  </div>

                  <!-- Difficulty -->
                  <div class="border-muted-200 dark:border-muted-700 dark:bg-muted-800/50 rounded-xl border bg-white p-4">
                    <div class="mb-4 flex items-center gap-2">
                      <Icon name="ph:barbell" class="text-primary-500 size-5" />
                      <h3 class="text-muted-800 text-lg font-medium dark:text-white">
                        سطح سختی
                      </h3>
                    </div>
                    <BaseSelect
                      v-model="deed.difficulty"
                      label="سطح سختی"
                      placeholder="سطح سختی را انتخاب کنید"
                      required
                    >
                      <option
                        v-for="[value, label] in Object.entries(difficultyMap)"
                        :key="value"
                        :value="value"
                      >
                        {{ label }}
                      </option>
                    </BaseSelect>
                  </div>

                  <!-- Time Required -->
                  <div class="border-muted-200 dark:border-muted-700 dark:bg-muted-800/50 rounded-xl border bg-white p-4">
                    <div class="mb-4 flex items-center gap-2">
                      <Icon name="ph:clock" class="text-primary-500 size-5" />
                      <h3 class="text-muted-800 text-lg font-medium dark:text-white">
                        زمان مورد نیاز
                      </h3>
                    </div>
                    <BaseSelect
                      v-model="deed.timeRequired"
                      label="زمان مورد نیاز"
                      placeholder="زمان مورد نیاز را انتخاب کنید"
                      required
                    >
                      <option
                        v-for="[value, label] in Object.entries(timeMap)"
                        :key="value"
                        :value="value"
                      >
                        {{ label }}
                      </option>
                    </BaseSelect>
                  </div>

                  <!-- Tags -->
                  <div class="border-muted-200 dark:border-muted-700 dark:bg-muted-800/50 rounded-xl border bg-white p-4">
                    <div class="mb-4 flex items-center gap-2">
                      <Icon name="ph:tag" class="text-primary-500 size-5" />
                      <h3 class="text-muted-800 text-lg font-medium dark:text-white">
                        برچسب‌ها
                      </h3>
                    </div>
                    <div class="space-y-2">
                      <div class="flex w-full gap-2">
                        <BaseInput
                          v-model="newTag"
                          placeholder="برچسب جدید را وارد کنید..."
                          :classes="{
                            wrapper: 'flex-1',
                            input: 'w-full'
                          }"
                          @keydown.enter.prevent="addTag"
                        >
                          <template #suffix>
                            <button
                              type="button"
                              class="text-primary-500 hover:text-primary-600 disabled:text-muted-300 dark:disabled:text-muted-500 transition-colors"
                              :disabled="!newTag"
                              @click="addTag"
                            >
                              <Icon name="ph:plus-circle" class="size-5" />
                            </button>
                          </template>
                        </BaseInput>
                      </div>
                      <div v-if="deed.tags?.length" class="flex flex-wrap gap-2">
                        <div
                          v-for="tag in deed.tags"
                          :key="tag"
                          class="bg-muted-100 dark:bg-muted-700 text-muted-500 dark:text-muted-200 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm"
                        >
                          <span>{{ tag }}</span>
                          <button
                            type="button"
                            class="text-muted-400 hover:text-danger-500 transition-colors"
                            @click="removeTag(tag)"
                          >
                            <Icon name="ph:x-circle" class="size-4" />
                          </button>
                        </div>
                      </div>
                      <p v-else class="text-muted-400 text-sm">
                        برچسب‌ها به شما کمک می‌کنند تا کار نیک خود را بهتر دسته‌بندی کنید.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="bg-danger-50 dark:bg-danger-500/20 text-danger-500 rounded-lg p-4 text-center">
                  {{ error }}
                </div>
              </form>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <BaseCard rounded="lg" class="mb-6 flex items-center justify-end gap-2 p-4">
          <BaseButton
            color="muted"
            :loading="loading"
            :disabled="loading"
            @click="backToDeeds"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-4" />
            انصراف
          </BaseButton>
          <BaseButton
            color="primary"
            :loading="loading"
            :disabled="loading"
            @click="handleSubmit"
          >
            <Icon name="ph:check" class="ml-4 size-4" />
            ایجاد عمل نیک
          </BaseButton>
        </BaseCard>
        <BaseCard rounded="lg" class="mb-6">
          <div class="p-6">
            <div class="space-y-4">
              <BaseHeading
                tag="h3"
                size="sm"
                weight="medium"
                class="text-muted-800 dark:text-muted-100"
              >
                راهنما
              </BaseHeading>
              <BaseParagraph class="text-muted-500 dark:text-muted-400">
                <ul class="list-inside list-disc space-y-2">
                  <li>عنوان باید کوتاه و گویا باشد</li>
                  <li>توضیح کوتاه برای نمایش در لیست اعمال نیک استفاده می‌شود</li>
                  <li>توضیح اصلی باید شامل جزئیات کافی باشد</li>
                  <li>توضیح تکمیلی می‌تواند شامل نکات، مثال‌ها و راهنمایی‌های بیشتر باشد</li>
                  <li>برچسب‌ها به جستجوپذیری عمل نیک کمک می‌کنند</li>
                </ul>
              </BaseParagraph>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.long-description {
  @apply space-y-6 text-muted-500 dark:text-muted-400 leading-relaxed;
}

.long-description h1 {
  @apply text-muted-800 dark:text-muted-100 text-xl font-semibold mb-4;
}

.long-description h2 {
  @apply text-muted-800 dark:text-muted-100 text-lg font-medium mb-3;
}

.long-description p {
  @apply mb-4;
}

.long-description ul {
  @apply list-disc list-inside mb-4;
}

.long-description ol {
  @apply list-decimal list-inside mb-4;
}
</style>
