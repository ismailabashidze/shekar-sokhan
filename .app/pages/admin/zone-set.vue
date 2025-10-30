<script setup lang="ts">
  definePageMeta({
    title: 'پیکربندی مناطق کاربر',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const route = useRoute();
  const router = useRouter();
  const toaster = useToaster();
  const { ZONE_CONFIGS } = useZones();
  const { getUserById, updateUserZonesById, user } = useUser();

  const userId = route.query.userId as string;
  const selectedZones = ref<string[]>([]);
  const loading = ref(false);
  const userName = ref('');

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'شناسه کاربر الزامی است',
    });
  }

  const {
    data: userData,
    pending,
    refresh,
  } = await useAsyncData(
    `user-${userId}`,
    async () => {
      try {
        const result = await getUserById(userId);
        selectedZones.value = result.zones || [];
        userName.value = result.meta?.name || result.username;
        return result;
      }
 catch (error) {
        console.error('Error fetching user:', error);
        throw createError({
          statusCode: 404,
          statusMessage: 'کاربر یافت نشد',
        });
      }
    },
    {
      initialCache: false,
    },
  );

  const visibleZones = computed(() => {
    const zones = { ...ZONE_CONFIGS };
    delete zones.admin; // Hide admin zone from configuration
    return zones;
  });

  const handleZoneToggle = (zoneName: string) => {
    const index = selectedZones.value.indexOf(zoneName);
    if (index > -1) {
      selectedZones.value.splice(index, 1);
    }
 else {
      selectedZones.value.push(zoneName);
    }
  };

  const handleRefresh = async () => {
    try {
      await refresh();
      toaster.show({
        title: 'موفقیت',
        message: 'اطلاعات کاربر با موفقیت به‌روزرسانی شد.',
        color: 'success',
        icon: 'ph:arrow-clockwise',
        closable: true,
      });
    }
 catch (error) {
      console.error('Error refreshing user data:', error);
      toaster.show({
        title: 'خطا',
        message: 'در به‌روزرسانی اطلاعات کاربر خطایی رخ داد.',
        color: 'danger',
        icon: 'ph:x-circle',
        closable: true,
      });
    }
  };

  const handleDiscard = () => {
    selectedZones.value = userData.value?.zones || [];
    router.push('/admin/users');
  };
  const handleSave = async () => {
    try {
      loading.value = true;
      await updateUserZonesById(userId, selectedZones.value);

      toaster.show({
        title: 'موفقیت',
        message: `مناطق کاربر ${userName.value} با موفقیت به‌روزرسانی شد.`,
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
      });

      router.push('/admin/users');
    }
 catch (error) {
      console.error('Error updating user zones:', error);
      toaster.show({
        title: 'خطا',
        message: 'در به‌روزرسانی مناطق کاربر خطایی رخ داد. لطفا دوباره تلاش کنید.',
        color: 'danger',
        icon: 'ph:x-circle',
        closable: true,
      });
    }
 finally {
      loading.value = false;
    }
  };

  const zoneColor = computed(() => {
    return (zone: string) => {
      if (selectedZones.value.includes(zone)) {
        return 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-800/50';
      }
      return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50';
    };
  });

  const zoneIconColor = computed(() => {
    return (zone: string) => {
      if (selectedZones.value.includes(zone)) {
        return {
          container: 'bg-green-200 dark:bg-green-700',
          icon: 'text-green-700 dark:text-green-200',
          text: 'text-green-700 dark:text-green-200',
        };
      }
      return {
        container: 'bg-gray-300 dark:bg-gray-600',
        icon: 'text-gray-600 dark:text-gray-300',
        text: 'text-gray-600 dark:text-gray-400',
      };
    };
  });
</script>

<template>
  <div>
    <TairoContentWrapper>
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              پیکربندی مناطق کاربر
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mt-1">
              مناطق قابل دسترسی برای کاربر {{ userName || 'در حال بارگذاری...' }} را انتخاب کنید
            </BaseParagraph>
          </div>
          <div class="flex gap-3">
            <BaseButton
              variant="outline"
              :disabled="loading"
              @click="handleRefresh"
            >
              <Icon name="ph:arrow-clockwise" class="ml-2 size-4" />
              به‌روزرسانی اطلاعات
            </BaseButton>
            <BaseButton variant="outline" to="/admin/users">
              <Icon name="lucide:arrow-left" class="ml-2 size-4" />
              بازگشت به کاربران
            </BaseButton>
          </div>
        </div>
      </div>

      <div v-if="pending" class="flex items-center justify-center py-12">
        <BasePlaceload class="h-6 w-32 rounded" />
      </div>

      <div v-else class="space-y-6">
        <BaseCard rounded="lg" class="p-6">
          <div class="mb-4">
            <BaseHeading
              as="h3"
              size="sm"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              انتخاب مناطق
            </BaseHeading>
            <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 mt-1">
              مناطقی که می‌خواهید این کاربر به آن‌ها دسترسی داشته باشد را انتخاب کنید. مناطق فعال با رنگ سبز نمایش داده
              می‌شوند.
            </BaseParagraph>
          </div>

          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
            <div
              v-for="(zone, key) in visibleZones"
              :key="key"
              class="cursor-pointer"
              @click="handleZoneToggle(zone.name)"
            >
              <div
                class="flex items-center gap-2 rounded-lg border p-3 transition-all hover:shadow-md"
                :class="zoneColor(zone.name)"
              >
                <div
                  class="flex size-8 items-center justify-center rounded-lg"
                  :class="zoneIconColor(zone.name).container"
                >
                  <Icon
                    :name="zone.icon"
                    class="size-4"
                    :class="zoneIconColor(zone.name).icon"
                  />
                </div>
                <div class="flex flex-1 flex-col gap-1">
                  <BaseText
                    size="xs"
                    weight="semibold"
                    :class="zoneIconColor(zone.name).text"
                  >
                    {{ zone.label }}
                  </BaseText>
                </div>
                <div
                  class="flex size-6 items-center justify-center rounded-full"
                  :class="selectedZones.includes(zone.name) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'"
                >
                  <Icon
                    name="ph:check"
                    class="size-4 text-white"
                    :class="selectedZones.includes(zone.name) ? 'opacity-100' : 'opacity-0'"
                  />
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <div class="flex items-center justify-end gap-3">
          <BaseButton
            variant="outline"
            :disabled="loading"
            @click="handleDiscard"
          >
            انصراف
          </BaseButton>
          <BaseButton
            color="primary"
            :loading="loading"
            :disabled="loading"
            @click="handleSave"
          >
            <Icon name="ph:check-circle" class="ml-2 size-4" />
            ذخیره تغییرات
          </BaseButton>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>
