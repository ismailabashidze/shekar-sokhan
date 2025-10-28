<script setup lang="ts">
definePageMeta({
  title: 'سرمایه‌گذاران',
  preview: {
    title: 'سرمایه‌گذاران',
    description: 'لیست سرمایه‌گذاران',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-jobs.png',
    srcDark: '/img/screens/dashboards-jobs-dark.png',
    order: 15,
  },
  layout: 'sidebar',
});

useHead({ htmlAttrs: { dir: 'rtl' } });

// Sample investors data based on the image
const investors = [
  {
    id: 1,
    name: 'علی محمدی',
    company: 'شرکت فناوری پیشرو',
    email: 'ali.mohammadi@example.com',
    phone: '09123456789',
    message: 'علاقه‌مند به سرمایه‌گذاری در حوزه هوش مصنوعی',
    created: '2025-04-15',
  },
  {
    id: 2,
    name: 'سارا احمدی',
    company: 'گروه سرمایه‌گذاری نوآفرین',
    email: 'sara.ahmadi@example.com',
    phone: '09187654321',
    message: 'تمایل به مشارکت در پروژه‌های استارتاپی حوزه سلامت',
    created: '2025-04-18',
  },
  {
    id: 3,
    name: 'رضا کریمی',
    company: 'هلدینگ توسعه فناوری',
    email: 'reza.karimi@example.com',
    phone: '09361234567',
    message: 'بررسی فرصت‌های سرمایه‌گذاری در حوزه تکنولوژی‌های جدید',
    created: '2025-04-22',
  },
  {
    id: 4,
    name: 'مریم حسینی',
    company: 'صندوق سرمایه‌گذاری خصوصی ایران',
    email: 'maryam.hosseini@example.com',
    phone: '09125678901',
    message: 'علاقه‌مند به مشارکت در پروژه‌های نوآورانه',
    created: '2025-05-01',
  },
  {
    id: 5,
    name: 'امیر رضایی',
    company: 'گروه توسعه کسب و کار نوین',
    email: 'amir.rezaei@example.com',
    phone: '09352345678',
    message: 'جستجوی فرصت‌های سرمایه‌گذاری در استارتاپ‌های مرحله رشد',
    created: '2025-05-10',
  },
];

// Search query
const searchQuery = ref('');

// Sorting options
const sortBy = ref('newest');
const sortOptions = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'oldest', label: 'قدیمی‌ترین' },
  { value: 'name', label: 'نام' },
  { value: 'company', label: 'شرکت' },
];

// Computed properties for filtering and sorting
const filteredInvestors = computed(() => {
  let result = [...investors];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      investor =>
        investor.name.toLowerCase().includes(query)
        || investor.company.toLowerCase().includes(query)
        || investor.email.toLowerCase().includes(query)
        || investor.phone.includes(query)
        || investor.message.toLowerCase().includes(query),
    );
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      break;
    case 'oldest':
      result.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
      break;
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'company':
      result.sort((a, b) => a.company.localeCompare(b.company));
      break;
    default:
      result.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  }

  return result;
});

// View mode (grid or list)
const viewMode = ref('list');
</script>

<template>
  <div>
    <BasePageHeading
      title="سرمایه‌گذاران"
      subtitle="مدیریت و بررسی درخواست‌های سرمایه‌گذاری"
    >
      <template #pageTitle>
        <div class="flex items-center">
          <Icon name="ph:users-duotone" class="text-primary-500 me-2 size-6" />
          <span>سرمایه‌گذاران</span>
        </div>
      </template>
    </BasePageHeading>

    <div class="pb-20">
      <BaseCard class="p-5">
        <!-- Content -->
        <div class="relative">
          <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <NuxtLink
                to="/dashboard"
                class="bg-muted-100 dark:bg-muted-700 hover:bg-muted-200 dark:hover:bg-muted-600 flex size-8 items-center justify-center rounded-full transition-colors duration-300"
              >
                <Icon name="ph:arrow-right-duotone" class="size-5" />
                <span class="text-muted-500">بازگشت</span>
              </NuxtLink>
              <h1 class="text-muted-800 text-2xl font-bold dark:text-white">
                لیست سرمایه‌گذاران
              </h1>
            </div>

            <div class="flex items-center gap-4">
              <!-- Search -->
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  class="text-muted-600 dark:text-muted-200 placeholder:text-muted-300 dark:placeholder:text-muted-500 border-muted-300 dark:border-muted-700 dark:bg-muted-900 focus:border-primary-500 h-10 w-full rounded-lg border bg-white pe-10 ps-4 transition-colors duration-300 focus:outline-none"
                  placeholder="جستجو..."
                >
                <Icon name="ph:magnifying-glass-duotone" class="text-muted-400 absolute left-3 top-2.5 size-5" />
              </div>

              <!-- View Mode Toggle -->
              <div class="ml-4 flex items-center gap-2">
                <button
                  :class="[
                    'rounded-lg p-2 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary-500 text-white'
                      : 'bg-muted-100 text-muted-500 hover:bg-muted-200 dark:bg-muted-700 dark:text-muted-200 dark:hover:bg-muted-600',
                  ]"
                  @click="viewMode = 'grid'"
                >
                  <Icon name="ph:grid-four-duotone" class="size-5" />
                </button>
                <button
                  :class="[
                    'rounded-lg p-2 transition-colors',
                    viewMode === 'list'
                      ? 'bg-primary-500 text-white'
                      : 'bg-muted-100 text-muted-500 hover:bg-muted-200 dark:bg-muted-700 dark:text-muted-200 dark:hover:bg-muted-600',
                  ]"
                  @click="viewMode = 'list'"
                >
                  <Icon name="ph:list-bullets-duotone" class="size-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Toolbar -->
          <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
            <!-- Sorting -->
            <div class="flex items-center gap-2">
              <label class="text-muted-400 text-sm">مرتب‌سازی:</label>
              <select
                v-model="sortBy"
                class="text-muted-600 dark:text-muted-200 border-muted-300 dark:border-muted-700 dark:bg-muted-900 focus:border-primary-500 h-10 rounded-lg border bg-white px-3 transition-colors duration-300 focus:outline-none"
              >
                <option
                  v-for="option in sortOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- List View -->
          <div v-if="viewMode === 'list'">
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-muted-100 dark:bg-muted-700 text-left">
                    <th class="p-3 text-right">
                      نام
                    </th>
                    <th class="p-3 text-right">
                      شرکت
                    </th>
                    <th class="p-3 text-right">
                      ایمیل
                    </th>
                    <th class="p-3 text-right">
                      تلفن
                    </th>
                    <th class="p-3 text-right">
                      پیام
                    </th>
                    <th class="p-3 text-right">
                      اقدامات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="investor in filteredInvestors"
                    :key="investor.id"
                    class="border-muted-200 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-800/50 border-b"
                  >
                    <td class="p-3">
                      <div class="font-medium">
                        {{ investor.name }}
                      </div>
                    </td>
                    <td class="p-3">
                      {{ investor.company }}
                    </td>
                    <td class="p-3">
                      <a
                        :href="`mailto:${investor.email}`"
                        class="text-primary-500 hover:text-primary-600"
                      >
                        {{ investor.email }}
                      </a>
                    </td>
                    <td class="p-3">
                      <a
                        :href="`tel:${investor.phone}`"
                        class="text-primary-500 hover:text-primary-600"
                      >
                        {{ investor.phone }}
                      </a>
                    </td>
                    <td class="p-3">
                      <div class="max-w-xs truncate">
                        {{ investor.message }}
                      </div>
                    </td>
                    <td class="p-3">
                      <div class="flex gap-2">
                        <button
                          class="bg-primary-500 hover:bg-primary-600 rounded px-3 py-1 text-xs text-white"
                          @click="$router.push(`/investors/${investor.id}`)"
                        >
                          مشاهده
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Grid View -->
          <div
            v-else
            class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="investor in filteredInvestors"
              :key="investor.id"
              class="dark:bg-muted-800 overflow-hidden rounded-xl bg-white p-4 shadow-lg transition-transform duration-300 hover:-translate-y-1"
            >
              <div class="mb-4">
                <h3 class="text-muted-800 text-lg font-bold dark:text-white">
                  {{ investor.name }}
                </h3>
                <p class="text-muted-500 text-sm">
                  {{ investor.company }}
                </p>
              </div>

              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <Icon name="ph:envelope-duotone" class="text-primary-500 size-5" />
                  <a
                    :href="`mailto:${investor.email}`"
                    class="text-primary-500 hover:text-primary-600 text-sm"
                  >
                    {{ investor.email }}
                  </a>
                </div>

                <div class="flex items-center gap-2">
                  <Icon name="ph:phone-duotone" class="text-primary-500 size-5" />
                  <a
                    :href="`tel:${investor.phone}`"
                    class="text-primary-500 hover:text-primary-600 text-sm"
                  >
                    {{ investor.phone }}
                  </a>
                </div>

                <div class="flex gap-2">
                  <Icon name="ph:chat-text-duotone" class="text-primary-500 mt-1 size-5 shrink-0" />
                  <p class="text-muted-500 text-sm">
                    {{ investor.message }}
                  </p>
                </div>
              </div>

              <div class="mt-4 flex justify-end">
                <button
                  class="bg-primary-500 hover:bg-primary-600 rounded px-4 py-2 text-sm text-white"
                  @click="$router.push(`/investors/${investor.id}`)"
                >
                  مشاهده جزئیات
                </button>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
