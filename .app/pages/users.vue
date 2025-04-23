<script setup lang="ts">
definePageMeta({
  title: 'کاربران',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })
const nuxtApp = useNuxtApp()

const query = reactive({
  page: 1,
  perPage: 10,
  filter: '',
})

const { data, pending, error, refresh } = await useAsyncData(
  'users',
  async () => {
    try {
      const resultList = await nuxtApp.$pb.collection('users').getList(
        query.page,
        query.perPage,
        {
          filter: query.filter,
          sort: '-created',
        },
      )
      return {
        data: resultList.items.map(item => ({
          id: item.id,
          avatarUrl: item.meta?.avatarUrl,
          name: item.meta?.name,
          username: item.username,
          email: item.email,
          emailVisibility: item.emailVisibility,
          role: item.role,
          hasCharge: item.hasCharge,
          startChargeTime: item.startChargeTime,
          expireChargeTime: item.expireChargeTime,
          created: item.created,
          initials: item.meta?.name?.substring(0, 2) || 'کا',
        })),
        total: resultList.totalItems,
      }
    }
    catch (err) {
      console.error('Error fetching users:', err)
      return { data: [], total: 0 }
    }
  },
  {
    watch: [query],
    initialCache: false,
  },
)

const selected = ref<string[]>([])

const isAllVisibleSelected = computed(() => {
  return (data.value?.data?.length ?? 0) > 0 && selected.value.length === data.value?.data?.length
})

function toggleAllVisibleSelection() {
  if (isAllVisibleSelected.value) {
    selected.value = []
  }
  else {
    selected.value = data.value?.data?.map(item => item.id) ?? []
  }
}

</script>

<template>
  <div>
    <TairoContentWrapper>
      <!-- ... -->
      <div>
        <div v-if="error">
          <BasePlaceholderPage
            title="خطا در دریافت اطلاعات"
            subtitle="متاسفانه در دریافت لیست کاربران خطایی رخ داده است. لطفا دوباره تلاش کنید."
          >
            <template #image>
              <img
                class="block dark:hidden"
                src="/img/illustrations/placeholders/flat/placeholder-thinking-canvas.svg"
                alt="خطا"
              >
              <img
                class="hidden dark:block"
                src="/img/illustrations/placeholders/flat/placeholder-thinking-canvas-dark.svg"
                alt="خطا"
              >
            </template>
          </BasePlaceholderPage>
        </div>
        <div v-else-if="pending">
          <div class="flex h-60 items-center justify-center">
            <BaseProgress size="lg" />
          </div>
        </div>
        <div v-else-if="!data?.data?.length">
          <BasePlaceholderPage
            title="کاربری یافت نشد"
            subtitle="هیچ کاربری با معیارهای جستجوی شما پیدا نشد. لطفا معیارهای دیگری را امتحان کنید."
          >
            <template #image>
              <img
                class="block dark:hidden"
                src="/img/illustrations/placeholders/flat/placeholder-search-4.svg"
                alt="کاربری یافت نشد"
              >
              <img
                class="hidden dark:block"
                src="/img/illustrations/placeholders/flat/placeholder-search-4-dark.svg"
                alt="کاربری یافت نشد"
              >
            </template>
          </BasePlaceholderPage>
        </div>
        <div v-else>
          <div class="w-full">
            <TairoTable rounded="sm" :scrollable="false">
              <template #header>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="p-4"
                >
                  <div class="flex items-center">
                    <BaseCheckbox
                      :model-value="isAllVisibleSelected"
                      :indeterminate="selected.length > 0 && !isAllVisibleSelected"
                      name="users-main"
                      rounded="sm"
                      color="primary"
                      @click="toggleAllVisibleSelection"
                    />
                  </div>
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  Avatar
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  Name
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  Email
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  Email Visibility
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  Role
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  Start Charge
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  Expire Charge
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  Created
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-end"
                >
                  Action
                </TairoTableHeading>
              </template>

              <TairoTableRow v-if="selected.length > 0" :hoverable="false">
                <TairoTableCell colspan="10" class="bg-success-100 text-success-700 dark:bg-success-700 dark:text-success-100 p-4">
                  You have selected {{ selected.length }} items of the total {{ data?.total }} items.
                </TairoTableCell>
              </TairoTableRow>

              <TairoTableRow v-for="user in data?.data" :key="user.id">
                <TairoTableCell spaced>
                  <BaseCheckbox
                    v-model="selected"
                    :value="user.id"
                    :name="`user-checkbox-${user.id}`"
                    rounded="sm"
                    color="primary"
                  />
                </TairoTableCell>
                <TairoTableCell light spaced>
                  <BaseAvatar :src="user.avatarUrl" :text="user.initials" />
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="leading-none">
                    <h4 class="font-sans text-sm font-medium">
                      {{ user.name }}
                    </h4>
                    <p class="text-muted-400 font-sans text-xs">
                      {{ user.username }}
                    </p>
                  </div>
                </TairoTableCell>
                <TairoTableCell light spaced>
                  {{ user.email }}
                </TairoTableCell>
                <TairoTableCell spaced>
                  <BaseTag
                    v-if="user.emailVisibility"
                    color="success"
                    variant="pastel"
                    rounded="full"
                    size="sm"
                  >
                    Visible
                  </BaseTag>
                  <BaseTag
                    v-else
                    color="warning"
                    variant="pastel"
                    rounded="full"
                    size="sm"
                  >
                    Hidden
                  </BaseTag>
                </TairoTableCell>
                <TairoTableCell spaced>
                  {{ user.role }}
                </TairoTableCell>
                <TairoTableCell spaced>
                  {{ new Date(user.startChargeTime).toLocaleString() }}
                </TairoTableCell>
                <TairoTableCell spaced>
                  {{ new Date(user.expireChargeTime).toLocaleString() }}
                </TairoTableCell>
                <TairoTableCell spaced>
                  {{ new Date(user.created).toLocaleDateString() }}
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="flex justify-end">
                    <BaseDropdown
                      variant="context"
                      placement="bottom-end"
                      rounded="md"
                    >
                      <BaseDropdownItem
                        to="#"
                        title="View"
                        text="View details"
                        rounded="md"
                      />
                    </BaseDropdown>
                  </div>
                </TairoTableCell>
              </TairoTableRow>
            </TairoTable>
          </div>
          <div class="mt-6">
            <BasePagination
              :total-items="data?.total ?? 0"
              :item-per-page="query.perPage"
              :current-page="query.page"
              rounded="lg"
            />
          </div>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>
