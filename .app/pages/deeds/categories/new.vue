<template>
  <div>
    <div class="mb-6">
      <BaseHeading
        as="h1"
        size="xl"
        weight="semibold"
        class="text-muted-800 dark:text-white"
      >
        ایجاد دسته‌بندی جدید
      </BaseHeading>
      <BaseParagraph size="sm" class="text-muted-400">
        دسته‌بندی جدیدی برای کارهای نیک ایجاد کنید
      </BaseParagraph>
    </div>

    <div class="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <!-- Title and Icon -->
      <div class="flex gap-4">
        <div class="flex-1">
          <BaseHeading
            as="h3"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-muted-100 mb-2"
          >
            <span>عنوان دسته‌بندی</span>
          </BaseHeading>
          <BaseInput
            v-model="category.title"
            placeholder="عنوان دسته‌بندی را وارد کنید"
            rounded="lg"
          />
        </div>

        <div>
          <BaseHeading
            as="h3"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-muted-100 mb-2"
          >
            <span>آیکون</span>
          </BaseHeading>
          <div class="flex gap-2">
            <button
              class="hover:border-primary-500 hover:bg-primary-50 dark:border-muted-600 dark:bg-muted-700 dark:hover:border-primary-500 dark:hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-lg border bg-white"
              @click="showIconSelector = true"
            >
              <Icon :name="category.icon" class="text-muted-500 dark:text-muted-100 size-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Icon Selector Modal -->
      <IconSelector
        v-if="showIconSelector"
        @select="icon => { category.icon = icon; showIconSelector = false }"
        @close="showIconSelector = false"
      />

      <!-- Difficulty and Time -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <BaseHeading
            as="h3"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-muted-100"
          >
            <span>سطح سختی</span>
          </BaseHeading>

          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="level in difficultyLevels"
              :key="level.value"
              class="hover:border-primary-500 hover:bg-primary-50 dark:border-muted-600 dark:bg-muted-700 dark:hover:border-primary-500 dark:hover:bg-primary-500/20 flex flex-col items-center gap-1 rounded-xl border bg-white p-4 transition-colors"
              :class="{
                'border-primary-500 bg-primary-50 dark:border-primary-500 dark:bg-primary-500/20': category.difficulty === level.value && category.timeRequired === level.timeRequired,
              }"
              @click="() => {
                category.difficulty = level.value
                category.timeRequired = level.timeRequired
              }"
            >
              <div class="bg-primary-100 dark:bg-primary-500/20 flex size-10 items-center justify-center rounded-lg">
                <Icon :name="level.icon" class="text-primary-500 size-6" />
              </div>
              <span class="text-muted-800 dark:text-muted-100 text-sm font-medium">{{ level.label }}</span>
              <span class="text-muted-400 text-xs">{{ level.timeLabel }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div class="flex flex-col gap-2">
        <BaseHeading
          as="h3"
          size="sm"
          weight="medium"
          class="text-muted-800 dark:text-muted-100"
        >
          <span>برچسب‌ها</span>
        </BaseHeading>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(tag, index) in category.value.tags"
            :key="index"
            class="bg-primary-100 text-primary-500 dark:bg-primary-500/20 flex items-center gap-1 rounded-full px-3 py-1 text-sm"
          >
            <span>{{ tag }}</span>
            <button
              class="hover:text-primary-600"
              @click="removeTag(index)"
            >
              <Icon name="ph:x" class="size-4" />
            </button>
          </div>
        </div>
        <div class="flex gap-2">
          <BaseInput
            v-model="newTag"
            placeholder="برچسب جدید را وارد کنید"
            rounded="lg"
            @keyup.enter="addTag"
          />
          <BaseButton color="primary" @click="addTag">
            افزودن
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="dark:border-muted-700 dark:bg-muted-900 fixed inset-x-0 bottom-0 z-10 flex justify-center gap-2 border-t bg-white p-4">
      <div class="flex w-full max-w-3xl justify-between gap-2">
        <BaseButton
          to="/deeds/categories"
          variant="outline"
          class="flex items-center gap-2"
        >
          <Icon name="ph:arrow-right" class="size-5" />
          <span>قبلی</span>
        </BaseButton>
        <BaseButton
          color="primary"
          class="flex items-center gap-2"
          @click="onSubmit"
        >
          <span>ادامه</span>
          <Icon name="ph:arrow-left" class="size-5" />
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDeedCategory } from '~/composables/useDeedCategory';
import IconSelector from '~/components/icons/IconSelector.vue';

definePageMeta({
  title: 'افزودن کار نیک پیشنهادی',
  layout: 'sidebar',
});

useHead({
  title: 'افزودن کار نیک پیشنهادی',
  htmlAttrs: { dir: 'rtl' },
});

const { category, createCategory } = useDeedCategory();

const difficultyLevels = [
  {
    value: 'simple',
    label: 'ساده',
    description: 'کارهای کوچک و سریع که می‌توانید در کمتر از ۱۵ دقیقه انجام دهید',
    timeRequired: 'below_15',
    timeLabel: 'کمتر از ۱۵ دقیقه',
    icon: 'ph:leaf',
  },
  {
    value: 'medium',
    label: 'متوسط',
    description: 'کارهایی که نیاز به زمان و تلاش متوسط دارند',
    timeRequired: '15_to_60',
    timeLabel: '۱۵ تا ۶۰ دقیقه',
    icon: 'ph:tree',
  },
  {
    value: 'hard',
    label: 'چالش‌برانگیز',
    description: 'کارهای بزرگتر که نیاز به برنامه‌ریزی و تعهد بیشتری دارند',
    timeRequired: 'above_60',
    timeLabel: 'بیش از ۱ ساعت',
    icon: 'ph:mountains',
  },
];

const newTag = ref('');
const showIconSelector = ref(false);

function addTag() {
  if (newTag.value.trim() && !category.value.tags.includes(newTag.value.trim())) {
    category.value.tags.push(newTag.value.trim());
    newTag.value = '';
  }
}

function removeTag(index: number) {
  category.value.tags.splice(index, 1);
}

async function onSubmit() {
  await createCategory();
  navigateTo('/deeds/categories');
}
</script>
