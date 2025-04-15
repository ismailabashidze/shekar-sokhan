<script setup lang="ts">
// ...

const { data, pending, error, refresh } = await useAsyncData(
  'users',
  async () => {
    try {
      const resultList = await nuxtApp.$pb.collection('users').getList(
        query.value.page,
        query.value.perPage,
        {
          filter: query.value.filter,
          sort: '-created',
        },
      )
      return {
        data: resultList.items.map(item => ({
          id: item.id,
          name: item.name,
          username: item.username,
          email: item.email,
          phoneNumber: item.phoneNumber,
          role: item.role,
          isPhoneVerified: item.isPhoneVerified,
          hasCharge: item.hasCharge,
          expireChargeTime: item.expireChargeTime,
          created: item.created,
          initials: item.name?.substring(0, 2) || 'کا',
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

// ...
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
                src="/img/illustrations/placeholders/flat/placeholder-error.svg"
                alt="خطا"
              >
              <img
                class="hidden dark:block"
                src="/img/illustrations/placeholders/flat/placeholder-error-dark.svg"
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
          <!-- ... -->
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>
