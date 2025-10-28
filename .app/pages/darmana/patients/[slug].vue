<script setup lang="ts">
definePageMeta({
  title: 'جزئیات درس',
  layout: 'sidebar',
});

useHead({ htmlAttrs: { dir: 'rtl' } });

const route = useRoute();
const router = useRouter();
const { data: lessonData, error } = await useFetch(`/api/darmana/lessons/${route.params.slug}`);

// If there's an error or no lesson data, show error and redirect
if (error.value || !lessonData.value?.lesson) {
  const errorMessage = error.value?.message || 'درس مورد نظر یافت نشد';
  useToast().error(errorMessage, {
    title: 'خطا',
    duration: 3000,
  });
  router.push('/darmana/patients/chooseLesson');
}

const lesson = computed(() => lessonData.value?.lesson);

const { open } = usePanels();
const currentTask = ref();

function openTaskPanel(id: number, tasks: any) {
  currentTask.value = tasks.find((task: any) => task.id === id);
  open('task', { task: currentTask });
}
</script>

<template>
  <div>
    <!-- Show error state -->
    <div v-if="error || !lesson" class="flex h-[400px] items-center justify-center">
      <BaseCard class="max-w-lg p-6 text-center">
        <div class="mb-4">
          <img
            class="mx-auto block size-40 dark:hidden"
            src="/img/illustrations/placeholders/flat/placeholder-search-1.svg"
            alt="درس یافت نشد"
          >
          <img
            class="mx-auto hidden size-40 dark:block"
            src="/img/illustrations/placeholders/flat/placeholder-search-1-dark.svg"
            alt="درس یافت نشد"
          >
        </div>
        <BaseHeading
          as="h3"
          size="lg"
          weight="semibold"
          class="text-muted-800 mb-2 dark:text-white"
        >
          درس یافت نشد
        </BaseHeading>
        <BaseParagraph class="text-muted-500">
          {{ error?.message || 'درس مورد نظر در سیستم موجود نیست. لطفاً درس دیگری را انتخاب کنید.' }}
        </BaseParagraph>
        <div class="mt-4">
          <BaseButton
            to="/darmana/patients/chooseLesson"
            color="primary"
          >
            بازگشت به لیست درس‌ها
          </BaseButton>
        </div>
      </BaseCard>
    </div>

    <!-- Show lesson content when available -->
    <div v-else>
      <div class="relative">
        <div class="absolute end-12 top-2.5 z-20 hidden sm:block">
          <BaseButton
            size="sm"
            rounded="lg"
            :to="`/darmana/patients/chooseLesson`"
          >
            <Icon name="ph:arrow-left" class="size-4" />
            <span>بازگشت به درس‌ها</span>
          </BaseButton>
        </div>
        <div class="absolute end-0 top-2 z-20">
          <BaseDropdown
            variant="context"
            label="Dropdown"
            placement="bottom-end"
            size="md"
            class="z-20"
            rounded="lg"
          >
            <BaseDropdownItem
              :to="`/darmana/patients/chooseLesson`"
              title="لیست درس‌ها"
              text="بازگشت به لیست درس‌ها"
              class="sm:hidden"
            >
              <template #start>
                <Icon name="ph:arrow-left" class="me-2 block size-5" />
              </template>
            </BaseDropdownItem>
            <BaseDropdownDivider />
            <BaseDropdownItem
              to="#"
              title="شروع درس"
              text="شروع تمرین با عامل هوش مصنوعی"
            >
              <template #start>
                <Icon name="ph:play-duotone" class="me-2 block size-5" />
              </template>
            </BaseDropdownItem>
            <BaseDropdownDivider />
            <BaseDropdownItem
              to="#"
              title="راهنما"
              text="مشاهده راهنمای درس"
            >
              <template #start>
                <Icon name="ph:info-duotone" class="me-2 block size-5" />
              </template>
            </BaseDropdownItem>
          </BaseDropdown>
        </div>
        <div class="h-full">
          <BaseTabs
            model-value="overview"
            :tabs="[
              {
                label: 'مرور درس',
                value: 'overview',
              },
              {
                label: 'تکنیک‌ها',
                value: 'techniques',
              },
              {
                label: 'تمرین‌ها',
                value: 'exercises',
              },
            ]"
          >
            <template #tab="{ activeValue }">
              <!-- Overview -->
              <div v-if="activeValue === 'overview'">
                <div class="grid grid-cols-12 gap-6">
                  <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
                    <BaseCard class="space-y-12 p-10">
                      <div class="border-muted-200 dark:border-muted-700 flex flex-col items-center justify-between gap-8 border-b pb-12 sm:flex-row">
                        <div>
                          <BaseHeading
                            tag="h2"
                            size="2xl"
                            weight="medium"
                          >
                            {{ lesson.name }}
                          </BaseHeading>
                          <BaseParagraph
                            size="lg"
                            class="text-muted-600 dark:text-muted-400"
                          >
                            {{ lesson.category }}
                          </BaseParagraph>
                          <BaseParagraph size="sm" class="text-muted-400 py-4">
                            {{ lesson.description }}
                          </BaseParagraph>
                          <div class="flex items-center gap-2">
                            <BaseTag
                              :color="lesson.difficulty === 'پیشرفته' ? 'danger' : 'primary'"
                              rounded="lg"
                            >
                              {{ lesson.difficulty }}
                            </BaseTag>
                            <BaseTag
                              color="info"
                              rounded="lg"
                            >
                              {{ lesson.duration }} دقیقه
                            </BaseTag>
                          </div>
                        </div>
                        <div class="w-full shrink-0 sm:w-72">
                          <img
                            :src="lesson.image"
                            :alt="lesson.name"
                            class="rounded-lg"
                          >
                        </div>
                      </div>
                      <div class="border-muted-200 dark:border-muted-700 grid gap-4 border-b pb-12 sm:grid-cols-4">
                        <div>
                          <Icon
                            name="ph:brain-duotone"
                            class="text-primary-500 mb-2 size-6"
                          />
                          <div>
                            <BaseHeading
                              tag="h3"
                              size="sm"
                              weight="medium"
                            >
                              مهارت‌های روانشناسی
                            </BaseHeading>
                            <BaseParagraph
                              size="xs"
                              lead="tight"
                              class="text-muted-400"
                            >
                              تمرین مهارت‌های روانشناسی با عامل هوش مصنوعی
                            </BaseParagraph>
                          </div>
                        </div>
                        <div>
                          <Icon
                            name="ph:timer-duotone"
                            class="text-primary-500 mb-2 size-6"
                          />
                          <div>
                            <BaseHeading
                              tag="h3"
                              size="sm"
                              weight="medium"
                            >
                              جلسات ۳۰ دقیقه‌ای
                            </BaseHeading>
                            <BaseParagraph
                              size="xs"
                              lead="tight"
                              class="text-muted-400"
                            >
                              هر جلسه تمرینی به مدت ۳۰ دقیقه برگزار می‌شود
                            </BaseParagraph>
                          </div>
                        </div>
                        <div>
                          <Icon
                            name="ph:chat-circle-text-duotone"
                            class="text-primary-500 mb-2 size-6"
                          />
                          <div>
                            <BaseHeading
                              tag="h3"
                              size="sm"
                              weight="medium"
                            >
                              گفتگوی تعاملی
                            </BaseHeading>
                            <BaseParagraph
                              size="xs"
                              lead="tight"
                              class="text-muted-400"
                            >
                              تمرین مهارت‌ها از طریق گفتگو با عامل هوش مصنوعی
                            </BaseParagraph>
                          </div>
                        </div>
                        <div>
                          <Icon
                            name="ph:chart-line-up-duotone"
                            class="text-primary-500 mb-2 size-6"
                          />
                          <div>
                            <BaseHeading
                              tag="h3"
                              size="sm"
                              weight="medium"
                            >
                              پیشرفت تدریجی
                            </BaseHeading>
                            <BaseParagraph
                              size="xs"
                              lead="tight"
                              class="text-muted-400"
                            >
                              افزایش تدریجی سطح دشواری تمرین‌ها
                            </BaseParagraph>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 class="text-muted-400 mb-6 font-sans text-xs font-semibold uppercase">
                          منابع آموزشی
                        </h4>
                        <div class="grid gap-8 pb-6 sm:grid-cols-2">
                          <div
                            v-for="(resource, index) in lesson.resources"
                            :key="index"
                            rounded="lg"
                          >
                            <div class="flex w-full items-center gap-2">
                              <img
                                :src="resource.icon"
                                :alt="resource.name"
                                class="max-w-[46px]"
                              >
                              <div>
                                <BaseHeading
                                  tag="h3"
                                  size="sm"
                                  weight="medium"
                                >
                                  {{ resource.name }}
                                </BaseHeading>
                                <BaseParagraph size="xs" class="text-muted-400">
                                  <span>{{ resource.size }}</span>
                                  <span class="px-1 text-base leading-tight">•</span>
                                  <span>{{ resource.type }}</span>
                                </BaseParagraph>
                              </div>
                              <div class="ms-auto">
                                <BaseButtonIcon
                                  rounded="full"
                                  data-nui-tooltip="دانلود فایل"
                                  size="sm"
                                >
                                  <Icon name="lucide:arrow-down" />
                                </BaseButtonIcon>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </BaseCard>
                  </div>
                  <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
                    <div class="space-y-6">
                      <!-- Progress -->
                      <BaseCard class="p-8">
                        <h4 class="text-muted-400 mb-6 font-sans text-xs font-semibold uppercase">
                          پیشرفت شما
                        </h4>
                        <div class="w-full space-y-1">
                          <div class="flex items-center justify-between">
                            <h4 class="text-muted-700 dark:text-muted-100 font-sans text-sm font-medium">
                              درصد تکمیل
                            </h4>
                            <div>
                              <span class="text-muted-400 font-sans text-sm">
                                {{ lesson.completed }}%
                              </span>
                            </div>
                          </div>
                          <BaseProgress
                            size="xs"
                            color="primary"
                            :value="lesson.completed"
                          />
                        </div>
                      </BaseCard>
                      <!-- Techniques -->
                      <BaseCard class="p-8">
                        <h4 class="text-muted-400 mb-6 font-sans text-xs font-semibold uppercase">
                          تکنیک‌های درس
                        </h4>
                        <div class="space-y-8">
                          <div
                            v-for="technique in lesson.techniques"
                            :key="technique.name"
                            class="flex items-center gap-2"
                          >
                            <Icon
                              :name="technique.icon"
                              class="text-primary-500 size-6"
                            />
                            <div>
                              <BaseHeading
                                tag="h5"
                                size="sm"
                                weight="medium"
                                lead="none"
                                class="line-clamp-1"
                              >
                                {{ technique.name }}
                              </BaseHeading>
                              <BaseParagraph size="xs" class="text-muted-400">
                                {{ technique.description }}
                              </BaseParagraph>
                            </div>
                          </div>
                        </div>
                      </BaseCard>
                      <!-- Requirements -->
                      <BaseCard class="p-8">
                        <h4 class="text-muted-400 mb-6 font-sans text-xs font-semibold uppercase">
                          پیش‌نیازها
                        </h4>
                        <div class="space-y-8">
                          <div
                            v-for="requirement in lesson.requirements"
                            :key="requirement.name"
                            class="flex items-center gap-2"
                          >
                            <Icon
                              :name="requirement.icon"
                              class="text-primary-500 size-6"
                            />
                            <div>
                              <BaseHeading
                                tag="h5"
                                size="sm"
                                weight="medium"
                                lead="none"
                                class="line-clamp-1"
                              >
                                {{ requirement.name }}
                              </BaseHeading>
                              <BaseParagraph size="xs" class="text-muted-400">
                                {{ requirement.description }}
                              </BaseParagraph>
                            </div>
                          </div>
                        </div>
                      </BaseCard>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Techniques -->
              <div v-else-if="activeValue === 'techniques'">
                <div class="grid gap-6 sm:grid-cols-3">
                  <BaseCard
                    v-for="technique in lesson.techniques"
                    :key="technique.id"
                    elevated-hover
                    class="hover:!border-primary-500"
                  >
                    <div class="flex flex-col items-center p-5">
                      <Icon
                        :name="technique.icon"
                        class="text-primary-500 mb-4 size-12"
                      />
                      <div class="text-center">
                        <BaseHeading
                          tag="h4"
                          size="sm"
                          weight="medium"
                          class="mb-2"
                        >
                          {{ technique.name }}
                        </BaseHeading>
                        <BaseParagraph size="xs" class="text-muted-400">
                          {{ technique.description }}
                        </BaseParagraph>
                      </div>
                    </div>
                  </BaseCard>
                </div>
              </div>
              <!-- Exercises -->
              <div v-else-if="activeValue === 'exercises'">
                <div class="grid gap-6 sm:grid-cols-3">
                  <BaseCard
                    v-for="exercise in lesson.exercises"
                    :key="exercise.id"
                    elevated-hover
                    class="hover:!border-primary-500 flex cursor-pointer flex-col"
                    @click="openTaskPanel(exercise.id, lesson.exercises)"
                  >
                    <div class="flex flex-col items-center p-5">
                      <div class="flex flex-col gap-3">
                        <Icon
                          :name="exercise.status === 'completed' ? 'ph:check-circle-duotone' : 'ph:circle-duotone'"
                          :class="[
                            'size-6 shrink-0',
                            exercise.status === 'completed' ? 'text-success-500' : 'text-muted-400'
                          ]"
                        />
                        <div class="text-center">
                          <h4 class="text-muted-800 dark:text-muted-100 mb-2 font-sans text-base font-medium leading-tight">
                            {{ exercise.name }}
                          </h4>
                          <p class="text-muted-400 line-clamp-2 font-sans text-xs">
                            {{ exercise.description }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="bg-muted-50 dark:bg-muted-700/50 mt-auto flex items-center justify-between rounded-b-lg px-5 py-3">
                      <div class="flex max-w-[180px] grow items-center gap-2">
                        <Icon
                          name="ph:timer-duotone"
                          class="text-primary-500 size-4"
                        />
                        <span class="text-muted-400 text-sm">{{ exercise.duration }} دقیقه</span>
                      </div>
                      <div class="text-muted-400 flex items-center gap-4">
                        <div class="flex items-center gap-1 text-sm">
                          <Icon name="ph:star-duotone" class="size-4" />
                          <span class="font-sans">{{ exercise.difficulty }}</span>
                        </div>
                      </div>
                    </div>
                  </BaseCard>
                </div>
              </div>
            </template>
          </BaseTabs>
        </div>
      </div>
    </div>
  </div>
</template>
