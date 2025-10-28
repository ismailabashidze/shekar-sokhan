<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Deed } from '~/composables/useDeed';

definePageMeta({
  title: 'مدیریت عمل های نیک',
  preview: {
    title: 'مدیریت عمل های نیک',
    description: 'For list views and collections',
    categories: ['layouts', 'lists'],
    src: '/img/screens/layouts-table-list-1.png',
    srcDark: '/img/screens/layouts-table-list-1-dark.png',
    order: 44,
  },
  layout: 'sidebar',
});

useHead({ htmlAttrs: { dir: 'rtl' } });

const route = useRoute();
const router = useRouter();
const page = computed(() => parseInt((route.query.page as string) ?? '1'));
const toaster = useToaster();

// Add role check
const { role } = useUser();
const isAdmin = computed(() => role.value === 'admin');

const filter = ref('');
const perPage = ref(10);
const loading = ref(false);
const deeds = ref<Deed[]>([]);
const totalDeeds = ref(0);

const { getDeeds, approveDeed, rejectDeed } = useDeed();

watch([filter, perPage], () => {
  router.push({
    query: {
      page: undefined,
    },
  });
});

const fetchDeeds = async () => {
  try {
    loading.value = true;
    const result = await getDeeds({
      search: filter.value || undefined,
      page: page.value,
      perPage: perPage.value,
    });
    deeds.value = result.items;
    totalDeeds.value = result.total;
  }
  catch (error: any) {
    console.error('Error fetching deeds:', error);
    toaster.show({
      title: 'خطا',
      message: error.message || 'خطا در دریافت اطلاعات',
      color: 'danger',
      icon: 'ph:x-circle',
      closable: true,
    });
  }
  finally {
    loading.value = false;
  }
};

const handleApprove = async (deed: Deed) => {
  try {
    loading.value = true;
    await approveDeed(deed.id);
    toaster.show({
      title: 'موفقیت‌آمیز',
      message: 'عمل نیک با موفقیت تایید شد',
      color: 'success',
      icon: 'ph:check-circle',
      closable: true,
    });
    await fetchDeeds();
  }
  catch (error: any) {
    toaster.show({
      title: 'خطا',
      message: error.message || 'خطا در تایید عمل نیک',
      color: 'danger',
      icon: 'ph:x-circle',
      closable: true,
    });
  }
  finally {
    loading.value = false;
  }
};

const handleReject = async (deed: Deed) => {
  try {
    loading.value = true;
    const result = await rejectDeed(deed.id);
    if (!result) {
      throw new Error('خطا در تغییر وضعیت عمل نیک');
    }

    toaster.show({
      title: 'موفقیت‌آمیز',
      message: deed.status === 'approved' ? 'عمل نیک با موفقیت غیرفعال شد' : 'عمل نیک با موفقیت رد شد',
      color: 'success',
      icon: 'ph:check-circle',
      closable: true,
    });
    await fetchDeeds();
  }
  catch (error: any) {
    console.error('Error rejecting deed:', error);
    toaster.show({
      title: 'خطا',
      message: error.message || 'خطا در تغییر وضعیت عمل نیک',
      color: 'danger',
      icon: 'ph:x-circle',
      closable: true,
    });
  }
  finally {
    loading.value = false;
  }
};

// Initialize data
onMounted(() => {
  fetchDeeds();
});

// Status color mapping
const statusColors = {
  draft: 'info',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
} as const;

// Status text mapping
const statusText = {
  draft: 'پیش‌نویس',
  pending: 'در انتظار بررسی',
  approved: 'تایید شده',
  rejected: 'رد شده',
} as const;
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseInput
          v-model="filter"
          icon="ph:magnifying-glass"
          placeholder="جستجو در عمل‌های نیک..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <template #right>
        <BaseSelect
          v-model="perPage"
          label=""
          :classes="{
            wrapper: 'w-full sm:w-40',
          }"
        >
          <option :value="10">
            ۱۰ مورد در صفحه
          </option>
          <option :value="25">
            ۲۵ مورد در صفحه
          </option>
          <option :value="50">
            ۵۰ مورد در صفحه
          </option>
          <option :value="100">
            ۱۰۰ مورد در صفحه
          </option>
        </BaseSelect>
      </template>

      <div>
        <div v-if="!loading && deeds.length === 0">
          <BasePlaceholderPage
            title="نتیجه‌ای یافت نشد"
            subtitle="هیچ عمل نیکی با معیارهای جستجوی شما یافت نشد."
          >
            <template #image>
              <img
                class="block dark:hidden"
                src="/img/illustrations/placeholders/flat/placeholder-search-4.svg"
                alt="تصویر پیش‌فرض"
              >
              <img
                class="hidden dark:block"
                src="/img/illustrations/placeholders/flat/placeholder-search-4-dark.svg"
                alt="تصویر پیش‌فرض"
              >
            </template>
          </BasePlaceholderPage>
        </div>
        <div v-else>
          <div class="w-full">
            <TairoTable rounded="sm" :loading="loading">
              <template #header>
                <TairoTableHeading uppercase spaced>
                  ایموجی
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  عنوان
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  نوع
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  وضعیت
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  نویسنده
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  بازدیدها
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  تکمیل‌ها
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  تاریخ تایید
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-end"
                >
                  عملیات
                </TairoTableHeading>
              </template>

              <TairoTableRow v-for="deed in deeds" :key="deed.id">
                <TairoTableCell spaced>
                  <div class="text-2xl">
                    {{ deed.emoji }}
                  </div>
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="flex items-center">
                    <div class="leading-none">
                      <h4 class="font-sans text-sm font-medium">
                        {{ deed.title }}
                      </h4>
                      <p class="text-muted-400 line-clamp-1 font-sans text-xs">
                        {{ deed.shortDescription }}
                      </p>
                    </div>
                  </div>
                </TairoTableCell>
                <TairoTableCell light spaced>
                  {{ {
                    family: 'خانواده',
                    society: 'اجتماعی',
                    spiritual: 'معنوی',
                    environment: 'محیط زیست',
                    mindfulness: 'ذهن‌آگاهی',
                    self: 'خودسازی',
                  }[deed.type] }}
                </TairoTableCell>
                <TairoTableCell spaced>
                  <BaseTag
                    :color="statusColors[deed.status]"
                    variant="pastel"
                    rounded="full"
                    size="sm"
                    class="font-medium"
                  >
                    {{ statusText[deed.status] }}
                  </BaseTag>
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="flex items-center">
                    <BaseAvatar
                      :text="deed.expand.author?.name?.[0] || 'U'"
                      class="bg-primary-500/20"
                    />
                    <div class="ms-3 leading-none">
                      <p class="text-muted-500 font-sans text-xs">
                        {{ deed.expand.author?.name || 'کاربر ناشناس' }}
                      </p>
                    </div>
                  </div>
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="flex items-center gap-2">
                    <Icon name="ph:eye" class="text-muted-400 size-4" />
                    <span class="text-sm">{{ deed.views || 0 }}</span>
                  </div>
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="flex items-center gap-2">
                    <Icon name="ph:check-circle" class="text-muted-400 size-4" />
                    <span class="text-sm">{{ deed.completions || 0 }}</span>
                  </div>
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div v-if="deed.approvedAt" class="text-muted-500 text-sm">
                    {{ new Date(deed.approvedAt).toLocaleDateString('fa-IR') }}
                  </div>
                  <div v-else class="text-muted-400 text-sm">
                    -
                  </div>
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="flex items-center justify-end gap-2">
                    <div v-if="isAdmin" class="flex items-center gap-1">
                      <BaseTooltip text="تایید عمل نیک">
                        <BaseButton
                          v-if="deed.status === 'draft' || deed.status === 'rejected'"
                          color="success"
                          variant="solid"
                          size="sm"
                          class="ml-1 transition-all duration-200 hover:shadow-lg"
                          @click="handleApprove(deed)"
                        >
                          <div class="flex items-center gap-1">
                            <Icon name="ph:check" class="size-4" />
                          </div>
                        </BaseButton>
                      </BaseTooltip>
                      <BaseTooltip :text="deed.status === 'approved' ? 'غیرفعال کردن' : 'رد کردن'">
                        <BaseButton
                          v-if="deed.status === 'draft' || deed.status === 'approved'"
                          :color="deed.status === 'approved' ? 'warning' : 'danger'"
                          variant="solid"
                          size="sm"
                          class="transition-all duration-200 hover:shadow-lg"
                          @click="handleReject(deed)"
                        >
                          <div class="flex items-center gap-1">
                            <Icon :name="deed.status === 'approved' ? 'ph:power' : 'ph:x'" class="size-4" />
                          </div>
                        </BaseButton>
                      </BaseTooltip>
                      <BaseTooltip text="ویرایش">
                        <NuxtLink :to="`/deeds/edit/${deed.id}`">
                          <BaseButton
                            color="info"
                            variant="solid"
                            size="sm"
                            class="transition-all duration-200 hover:shadow-lg"
                          >
                            <div class="flex items-center gap-1">
                              <Icon name="ph:pencil-simple" class="size-4" />
                            </div>
                          </BaseButton>
                        </NuxtLink>
                      </BaseTooltip>
                    </div>
                    <BaseTooltip text="مشاهده جزئیات">
                      <NuxtLink :to="`/deeds/${deed.id}`">
                        <BaseButton
                          color="primary"
                          variant="solid"
                          size="sm"
                          class="transition-all duration-200 hover:shadow-lg"
                        >
                          <div class="flex items-center gap-1">
                            <Icon name="ph:eye" class="size-4" />
                          </div>
                        </BaseButton>
                      </NuxtLink>
                    </BaseTooltip>
                  </div>
                </TairoTableCell>
              </TairoTableRow>
            </TairoTable>
          </div>
          <div class="mt-6">
            <BasePagination
              :total-items="totalDeeds"
              :item-per-page="perPage"
              :current-page="page"
              rounded="lg"
              @update:current-page="fetchDeeds"
            />
          </div>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>
