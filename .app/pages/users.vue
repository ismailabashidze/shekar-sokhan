<script setup lang="ts">
definePageMeta({
  title: 'کاربران',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })
const nuxtApp = useNuxtApp()
const { getUserAvatarUrl } = useAvatarManager()

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
          avatarUrl: getUserAvatarUrl(item),
          name: item.meta?.name,
          username: item.username,
          email: item.meta?.email,
          emailVisibility: item.emailVisibility,
          role: item.role,
          hasCharge: item.hasCharge,
          startChargeTime: item.startChargeTime,
          expireChargeTime: item.expireChargeTime,
          created: item.created,
          initials: item.meta?.name?.substring(0, 2) || 'کا',
          isNew: item.meta?.isNew,
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

function toPersianNumber(num: number | string) {
  return String(num).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)])
}

function getRelativeTime(dateString: string) {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'لحظاتی پیش'
  if (diffMin < 60) return `${toPersianNumber(diffMin)} دقیقه پیش`
  if (diffHour < 24) return `${toPersianNumber(diffHour)} ساعت پیش`
  return `${toPersianNumber(diffDay)} روز پیش`
}

function formatPersianDateTime(dateInput: string | number | Date): string {
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return 'نامشخص'
  return date.toLocaleTimeString('fa-IR') + ' - ' + date.toLocaleDateString('fa-IR')
}

function onPageChange(newPage: number) {
  query.page = newPage
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
          <div class="w-full">
            <TairoTable rounded="sm" :scrollable="false">
              <template #header>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="p-4"
                >
                  <div class="flex items-center">
                    <BasePlaceload class="size-5 rounded" />
                  </div>
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  آواتار
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  نام
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  وضعیت ایمیل
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  شروع شارژ
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  پایان شارژ
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  تاریخ ساخت
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  زمان نسبی
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  عملیات
                </TairoTableHeading>
              </template>
              <TairoTableRow v-for="index in 10" :key="index">
                <TairoTableCell spaced>
                  <BasePlaceload class="size-5 rounded" />
                </TairoTableCell>
                <TairoTableCell
                  light
                  spaced
                  class="text-center"
                >
                  <BasePlaceload class="size-[46px] shrink-0 rounded-xl" />
                </TairoTableCell>
                <TairoTableCell spaced class="text-center">
                  <BasePlaceload class="h-3 w-24 rounded-lg" />
                </TairoTableCell>
                <TairoTableCell
                  light
                  spaced
                  class="text-center"
                >
                  <BasePlaceload class="h-3 w-12 rounded-lg" />
                </TairoTableCell>
                <TairoTableCell spaced class="text-center">
                  <BasePlaceload class="h-3 w-24 rounded-lg" />
                </TairoTableCell>
                <TairoTableCell spaced class="text-center">
                  <BasePlaceload class="h-3 w-24 rounded-lg" />
                </TairoTableCell>
                <TairoTableCell spaced class="text-center">
                  <BasePlaceload class="h-3 w-24 rounded-lg" />
                </TairoTableCell>
                <TairoTableCell spaced class="text-center">
                  <BasePlaceload class="h-3 w-16 rounded-lg" />
                </TairoTableCell>
              </TairoTableRow>
            </TairoTable>
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
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  آواتار
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  نام
                </TairoTableHeading>

                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  وضعیت ایمیل
                </TairoTableHeading>

                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  شروع شارژ
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  پایان شارژ
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  تاریخ ساخت
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  زمان نسبی
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-center"
                >
                  عملیات
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
                <TairoTableCell
                  light
                  spaced
                  class="text-center"
                >
                  <BaseAvatar
                    :src="user.avatarUrl"
                    :text="user.initials"
                    :badge-src="user.isNew ? '/img/icons/banking/bank-1.svg' : ''"
                  />
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="leading-none">
                    <p class="text-muted-400 font-sans text-xs">
                      {{ user.email }}
                    </p>
                    <h4 class="font-sans text-sm font-medium">
                      {{ user.name }}
                    </h4>
                    <p class="text-muted-400 font-sans text-xs">
                      {{ user.username }}
                    </p>
                  </div>
                </TairoTableCell>

                <TairoTableCell
                  light
                  spaced
                  class="text-center"
                >
                  <BaseTag
                    v-if="user.emailVisibility"
                    color="success"
                    variant="pastel"
                    rounded="full"
                    size="sm"
                  >
                    قابل نمایش
                  </BaseTag>
                  <BaseTag
                    v-else
                    color="warning"
                    variant="pastel"
                    rounded="full"
                    size="sm"
                  >
                    مخفی
                  </BaseTag>
                </TairoTableCell>

                <TairoTableCell
                  spaced
                  class="text-center"
                >
                  {{ formatPersianDateTime(user.startChargeTime) }}
                </TairoTableCell>
                <TairoTableCell
                  spaced
                  class="text-center"
                >
                  {{ formatPersianDateTime(user.expireChargeTime) }}
                </TairoTableCell>
                <TairoTableCell
                  spaced
                  class="text-center"
                >
                  {{ new Date(user.created).toLocaleDateString('fa-IR') }}
                </TairoTableCell>
                <TairoTableCell
                  spaced
                  class="text-center"
                >
                  {{ getRelativeTime(user.created) }}
                </TairoTableCell>
                <TairoTableCell
                  spaced
                  class="text-center"
                >
                  <div class="flex justify-end">
                    <BaseDropdown
                      variant="context"
                      placement="bottom-end"
                      rounded="md"
                    >
                      <BaseDropdownItem
                        :to="`/report?userId=${user.id}`"
                        text="مشاهده پروفایل"
                        rounded="md"
                        @click="$event.stopPropagation()"
                      >
                        <template #start>
                          <Icon name="lucide:user" class="me-2 block text-[1.15rem]" />
                        </template>
                      </BaseDropdownItem>
                      <BaseDropdownItem
                        :to="`/darmana/therapists/sessions?userId=${user.id}`"
                        text="مشاهده نشست‌ها"
                        rounded="md"
                        @click="$event.stopPropagation()"
                      >
                        <template #start>
                          <Icon name="lucide:clock" class="me-2 block text-[1.15rem]" />
                        </template>
                      </BaseDropdownItem>
                      <BaseDropdownItem
                        to="#"
                        text="مشاهده تحلیل‌ها"
                        rounded="md"
                      >
                        <template #start>
                          <Icon name="lucide:bar-chart" class="me-2 block text-[1.15rem]" />
                        </template>
                      </BaseDropdownItem>
                      <BaseDropdownItem
                        :to="`/payments?userId=${user.id}`"
                        text="مشاهده تراکنش‌ها"
                        rounded="md"
                        @click="$event.stopPropagation()"
                      >
                        <template #start>
                          <Icon name="lucide:repeat-2" class="me-2 block text-[1.15rem]" />
                        </template>
                      </BaseDropdownItem>
                      <BaseDropdownItem
                        to="#"
                        text="مشاهده اسناد"
                        rounded="md"
                      >
                        <template #start>
                          <Icon name="lucide:file-text" class="me-2 block text-[1.15rem]" />
                        </template>
                      </BaseDropdownItem>
                      <BaseDropdownItem
                        to="#"
                        text="مسدود / رفع مسدودی"
                        rounded="md"
                      >
                        <template #start>
                          <Icon name="lucide:ban" class="me-2 block text-[1.15rem]" />
                        </template>
                      </BaseDropdownItem>
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
              @update:current-page="onPageChange"
            />
          </div>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>
