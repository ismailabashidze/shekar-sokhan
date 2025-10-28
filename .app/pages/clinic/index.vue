<script setup lang="ts">
definePageMeta({
  title: 'لیست مشاوران',
  layout: 'sidebar',
  preview: {
    title: 'لیست مشاوران',
    description: 'افزودن و مدیریت کاربران مشاور',
    categories: ['layouts', 'lists'],
    src: '/img/screens/layouts-list-view-1.png',
    srcDark: '/img/screens/layouts-list-view-1-dark.png',
    order: 37,
  },
});
useHead({ htmlAttrs: { dir: 'rtl' } });

const route = useRoute();
const router = useRouter();
const page = computed(() => parseInt((route.query.page as string) ?? '1'));

const filter = ref('');
const perPage = ref(5);

watch([filter, perPage], () => {
  router.push({
    query: {
      page: undefined,
    },
  });
});

const query = computed(() => {
  return {
    filter: filter.value,
    perPage: perPage.value,
    page: page.value,
  };
});

const { data, pending, error, refresh } = await useFetch('/api/psychotherapists', {
  query,
});
function setFaLevel(level: string) {
  if (level == 'Listener') {
    return 'شنونده';
  }
  else if (level == 'Junior Therapist') {
    return 'درمانگر تازه کار';
  }
  else if (level == 'Mid Therapist') {
    return 'درمانگر نیمه حرفه ای';
  }
  else if (level == 'Senior Therapist') {
    return 'درمانگر حرفه ای';
  }
  else if (level == 'Supervisor') {
    return 'سوپروایزور';
  }
  return 'نامشخص';
}
data.value.data = data.value.data.map((d) => { return { ...d, faLevel: setFaLevel(d.level) }; });
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseInput
          v-model="filter"
          icon="lucide:search"
          placeholder="جست و جو"
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <template #right>
        <BaseButton class="w-full sm:w-32">
          مدیریت
        </BaseButton>
        <BaseButton color="primary" class="w-full sm:w-32">
          <Icon name="lucide:plus" class="ml-2 size-4" />
          <span>افزودن </span>
        </BaseButton>
      </template>
      <div>
        <div v-if="!pending && data?.data.length === 0">
          <BasePlaceholderPage
            title="No matching results"
            subtitle="Looks like we couldn't find any matching results for your search terms. Try other search terms."
          >
            <template #image>
              <img
                class="block dark:hidden"
                src="/img/illustrations/placeholders/flat/placeholder-search-1.svg"
                alt="Placeholder image"
              >
              <img
                class="hidden dark:block"
                src="/img/illustrations/placeholders/flat/placeholder-search-1-dark.svg"
                alt="Placeholder image"
              >
            </template>
          </BasePlaceholderPage>
        </div>
        <div v-else class="space-y-4">
          <TransitionGroup
            enter-active-class="transform-gpu"
            enter-from-class="opacity-0 -translate-x-full"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="absolute transform-gpu"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-full"
          >
            <BaseCard
              v-for="item in data?.data"
              :key="item.id"
              rounded="lg"
              class="flex flex-col p-5 sm:flex-row sm:items-center"
            >
              <div
                class="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-start sm:text-left"
              >
                <BaseAvatar
                  size="lg"
                  :src="item.medias.avatar"
                  :badge-src="item.medias.flag"
                />
                <div>
                  <BaseHeading
                    tag="h3"
                    size="sm"
                    weight="medium"
                    class="text-muted-800 dark:text-muted-100"
                  >
                    {{ item.name }}
                  </BaseHeading>
                  <BaseParagraph
                    size="xs"
                    lead="none"
                    class="text-muted-400 flex items-end text-sm"
                  >
                    <Icon name="lucide:map-pin" class="size-4" />
                    <span>{{ item.location }}</span>
                  </BaseParagraph>
                </div>
              </div>
              <div
                class="flex flex-col gap-4 pt-4 sm:ms-auto sm:flex-row sm:items-center sm:justify-end sm:pt-0"
              >
                <div
                  class="flex w-full items-center justify-center sm:w-[160px] sm:justify-end"
                >
                  <BaseTag
                    size="sm"
                    color="primary"
                    variant="pastel"
                    rounded="full"
                  >
                    {{ item.faLevel }}
                  </BaseTag>
                </div>
                <div
                  class="divide-muted-200 dark:divide-muted-700 flex items-center justify-center divide-x"
                >
                  <div class="flex flex-col gap-1 px-4 text-center">
                    <BaseHeading
                      tag="h3"
                      size="md"
                      weight="semibold"
                      class="text-muted-800 dark:text-muted-100"
                    >
                      <span>{{ item.stats.clients }}</span>
                    </BaseHeading>
                    <BaseParagraph
                      lead="none"
                      weight="semibold"
                      class="text-muted-400 !text-[0.65rem] uppercase"
                    >
                      <span>مراجعان</span>
                    </BaseParagraph>
                  </div>
                  <div class="flex flex-col gap-1 px-4 text-center">
                    <BaseHeading
                      tag="h3"
                      size="md"
                      weight="semibold"
                      class="text-muted-800 dark:text-muted-100"
                    >
                      <span>{{ item.stats.sessions }}</span>
                    </BaseHeading>
                    <BaseParagraph
                      lead="none"
                      weight="semibold"
                      class="text-muted-400 !text-[0.65rem] uppercase"
                    >
                      <span>جلسات</span>
                    </BaseParagraph>
                  </div>
                  <div class="flex flex-col gap-1 px-4 text-center">
                    <BaseHeading
                      tag="h3"
                      size="md"
                      weight="semibold"
                      class="text-muted-800 dark:text-muted-100"
                    >
                      <span>{{ item.stats.articles }}</span>
                    </BaseHeading>
                    <BaseParagraph
                      lead="none"
                      weight="semibold"
                      class="text-muted-400 !text-[0.65rem] uppercase"
                    >
                      <span>مقالات</span>
                    </BaseParagraph>
                  </div>
                </div>
                <div
                  class="ptablet:hidden flex w-full items-center justify-center gap-1 py-3 sm:w-[160px] sm:justify-end sm:py-0"
                >
                  <p class="text-muted-400 font-sans text-xs">
                    همگروهی با
                  </p>
                  <BaseAvatarGroup
                    size="xs"
                    :avatars="item.teams"
                    :limit="3"
                  />
                </div>
                <div class="sm:ms-6">
                  <BaseButtonAction class="w-full sm:w-auto">
                    <Icon name="ph:user" class="ml-2 size-4" />
                    مشاهده
                  </BaseButtonAction>
                </div>
                <div class="sm:ms-6">
                  <BaseButtonAction class="w-full sm:w-auto">
                    <Icon name="ph:calendar" class="ml-2 size-4" />
                    برنامه زمانی
                  </BaseButtonAction>
                </div>
              </div>
            </BaseCard>
          </TransitionGroup>

          <div>
            <BasePagination
              :total-items="data?.total ?? 0"
              :item-per-page="perPage"
              :current-page="page"
              rounded="full"
            />
          </div>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>
