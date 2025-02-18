<script setup lang="ts">
definePageMeta({
  title: 'عامل ها',
  preview: {
    title: 'عامل های هوش مصنوعی',
    description: 'عامل های هوش مصنوعی برای رویکرد های مختلف درمانا',
    categories: ['layouts'],
    src: '/img/screens/layouts-user-grid-4.png',
    srcDark: '/img/screens/layouts-user-grid-4-dark.png',
    order: 67,
  },
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(18)

const { getPatients } = usePatient()
const { role } = useUser()
console.log(role.value)

watch([filter, perPage], () => {
  router.push({
    query: {
      page: undefined,
    },
  })
})

const query = computed(() => {
  return {
    filter: filter.value,
    perPage: perPage.value,
    page: page.value,
  }
})
const patients = await getPatients()
console.log(patients)

const pending = ref()
const error = ref()
const refresh = ref()
</script>

<template>
  <div class="m-10">
    <TairoContentWrapper>
      <template #left>
        <BaseInput
          v-model="filter"
          icon="lucide:search"
          shape="curved"
          placeholder="فیلتر عامل ها . . ."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <template #right>
        <BaseThemeToggle />

        <BaseButton
          color="primary"
          class="w-full gap-1 sm:w-32"
          shape="curved"
          to="/onboarding/newPatient"
        >
          <Icon name="lucide:plus" class="size-4" />
          <span>افزودن</span>
        </BaseButton>
      </template>
      <div>
        <div v-if="!pending && patients.length === 0">
          <BasePlaceholderPage
            title="No matching results"
            subtitle="Looks like we couldn't find any matching results for your search terms. Try other search terms."
          >
            <template #image>
              <img
                class="block dark:hidden"
                src="/img/illustrations/placeholders/flat/placeholder-search-2.svg"
                alt="Placeholder image"
              >
              <img
                class="hidden dark:block"
                src="/img/illustrations/placeholders/flat/placeholder-search-2-dark.svg"
                alt="Placeholder image"
              >
            </template>
          </BasePlaceholderPage>
        </div>
        <div
          v-else
          class="ltablet:grid-cols-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <TransitionGroup
            enter-active-class="transform-gpu"
            enter-from-class="opacity-0 -translate-x-full"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="absolute transform-gpu"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-full"
          >
            <BaseCard
              v-for="(item, index) in patients"
              :key="index"
              shape="curved"
              elevated-hover
              class="overflow-hidden"
            >
              <div class="nui-bg-50 p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <BaseHeading
                      tag="h3"
                      size="md"
                      weight="medium"
                      lead="none"
                    >
                      {{ item.isActive ? 'فعال' : 'غیر فعال' }}
                    </BaseHeading>
                    <!-- <BaseParagraph size="xs" class="text-muted-400 mt-3">
                      {{ item.shortDescription }}
                    </BaseParagraph> -->
                  </div>
                  <div>
                    <Icon
                      :name="item.isActive ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'"
                      :class="item.isActive ? 'text-success-500 size-7' : 'text-danger-500 size-7'"
                    />
                  </div>
                </div>
              </div>
              <div class="p-6">
                <div class="mb-3 flex w-full items-center justify-center">
                  <!-- :src="`https://pocket.zehna.ir/api/files/patients/${item.id}/${item.avatar}`" -->
                  <BaseAvatar
                    size="xl"
                    rounded="full"
                    :src="item.avatar ? `http://localhost:8090/api/files/patients/${item.id}/${item.avatar}` : '/img/avatars/1.svg'"
                    :badge-src="item.badge"
                    :text="item.initials"
                    :class="getRandomColor()"
                  />
                </div>
                <div class="text-center">
                  <BaseHeading
                    tag="h3"
                    size="md"
                    weight="medium"
                    lead="none"
                  >
                    {{ item.name }}
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-400 mt-1">
                    {{ item.position }}
                  </BaseParagraph>
                </div>
                <div
                  class="mb-6 mt-4 flex items-center justify-center gap-3 text-center"
                >
                  {{ item.shortDescription }}
                </div>
                <div class="flex items-center gap-2">
                  <BaseButton
                    v-if="role == 'admin'"
                    shape="curved"
                    color="primary"
                    @click="navigateTo(`/onboarding/editPatient?userId=${item.id}`)"
                  >
                    <Icon name="lucide:edit-3" class="size-4" />
                    <span>ویرایش</span>
                  </BaseButton>
                  <BaseButton
                    v-if="role != 'admin'"
                    shape="curved"
                    class="w-full"
                    @click="navigateTo(`/onboarding/editPatient?userId=${item.id}`)"
                  >
                    <Icon name="ph:user-duotone" class="ml-2 size-4" />
                    <span>نمایه</span>
                  </BaseButton>

                  <BaseButton
                    shape="curved"
                    class="w-full"
                    :to="`/mana/chat-therapist/${item.id}`"
                  >
                    <Icon name="ph:chat-circle-duotone" class="ml-2 size-4" />
                    <span>گفت و گو</span>
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
          </TransitionGroup>
        </div>
        <div v-if="!pending && data?.data.length !== 0" class="mt-4">
          <BasePagination
            :total-items="data?.total ?? 0"
            :item-per-page="perPage"
            :current-page="page"
            shape="curved"
          />
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>
