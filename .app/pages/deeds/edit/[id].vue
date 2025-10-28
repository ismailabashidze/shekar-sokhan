<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Deed } from '~/composables/useDeed';

definePageMeta({
  title: 'ویرایش عمل نیک',
  layout: 'sidebar',
});

useHead({ htmlAttrs: { dir: 'rtl' } });

const route = useRoute();
const router = useRouter();
const { getDeed, updateDeed } = useDeed();
const { role } = useUser();
const toaster = useToaster();
const loading = ref(false);
const error = ref('');

// Form data
const deed = ref<Deed>({
  id: '',
  emoji: '',
  title: '',
  description: '',
  shortDescription: '',
  longDescription: '',
  type: 'family',
  status: 'draft',
  author: null,
  approvedBy: '',
  approvedAt: '',
  views: 0,
  completions: 0,
  tags: [],
  difficulty: 'simple',
  timeRequired: 'below_15',
});

// Check if user is admin
const isAdmin = computed(() => role.value === 'admin');

onMounted(async () => {
  if (!isAdmin.value) {
    toaster.show({
      title: 'خطا',
      message: 'شما دسترسی به این صفحه را ندارید',
      color: 'danger',
      icon: 'ph:x-circle',
      closable: true,
    });
    router.push('/deeds/list');
    return;
  }

  const id = route.params.id as string;
  try {
    loading.value = true;
    const result = await getDeed(id);
    if (result) {
      deed.value = result;
    }
    else {
      error.value = 'عمل نیک مورد نظر یافت نشد';
    }
  }
  catch (err: any) {
    error.value = err.message || 'خطا در دریافت اطلاعات';
  }
  finally {
    loading.value = false;
  }
});

const handleSubmit = async () => {
  try {
    loading.value = true;
    deed.value.status = 'draft'; // Reset status to draft after edit
    const result = await updateDeed(deed.value.id, deed.value);
    if (result) {
      toaster.show({
        title: 'موفقیت‌آمیز',
        message: 'عمل نیک با موفقیت ویرایش شد',
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
      });
      router.push('/deeds/table-list-admin');
    }
  }
  catch (err: any) {
    toaster.show({
      title: 'خطا',
      message: err.message || 'خطا در ویرایش عمل نیک',
      color: 'danger',
      icon: 'ph:x-circle',
      closable: true,
    });
  }
  finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseHeading
          tag="h2"
          size="2xl"
          weight="semibold"
          lead="tight"
          class="text-muted-800 dark:text-white"
        >
          ویرایش عمل نیک
        </BaseHeading>
      </template>
    </TairoContentWrapper>

    <div v-if="loading" class="flex items-center justify-center p-6">
      <TairoLoading size="lg" />
    </div>

    <div v-else-if="error" class="bg-danger-50 dark:bg-danger-500/20 text-danger-500 rounded-lg p-4 text-center">
      {{ error }}
    </div>

    <div v-else class="mx-auto max-w-3xl p-4">
      <BaseCard class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <BaseInput
              v-model="deed.emoji"
              label="ایموجی"
              placeholder="یک ایموجی انتخاب کنید"
              required
            />
          </div>

          <div class="mb-6">
            <BaseInput
              v-model="deed.title"
              label="عنوان"
              placeholder="عنوان عمل نیک را وارد کنید"
              required
            />
          </div>

          <div class="mb-6">
            <BaseTextarea
              v-model="deed.shortDescription"
              label="توضیح کوتاه"
              placeholder="یک توضیح کوتاه وارد کنید"
              required
            />
          </div>

          <div class="mb-6">
            <BaseTextarea
              v-model="deed.description"
              label="توضیح"
              placeholder="توضیح کامل را وارد کنید"
              rows="4"
              required
            />
          </div>

          <div class="mb-6">
            <BaseTextarea
              v-model="deed.longDescription"
              label="توضیح تکمیلی"
              placeholder="توضیحات تکمیلی را وارد کنید"
              rows="6"
            />
          </div>

          <div class="mb-6">
            <BaseSelect
              v-model="deed.type"
              label="نوع"
              required
            >
              <option value="family">
                خانواده
              </option>
              <option value="society">
                اجتماعی
              </option>
              <option value="spiritual">
                معنوی
              </option>
            </BaseSelect>
          </div>

          <div class="mb-6">
            <BaseSelect
              v-model="deed.difficulty"
              label="سختی"
              required
            >
              <option value="simple">
                ساده
              </option>
              <option value="moderate">
                متوسط
              </option>
              <option value="hard">
                سخت
              </option>
            </BaseSelect>
          </div>

          <div class="mb-6">
            <BaseSelect
              v-model="deed.timeRequired"
              label="زمان مورد نیاز"
              required
            >
              <option value="below_15">
                کمتر از ۱۵ دقیقه
              </option>
              <option value="between_15_60">
                بین ۱۵ تا ۶۰ دقیقه
              </option>
              <option value="more_60">
                بیشتر از ۶۰ دقیقه
              </option>
            </BaseSelect>
          </div>

          <div class="flex justify-end gap-2">
            <BaseButton
              type="button"
              color="muted"
              @click="router.push('/deeds/table-list-admin')"
            >
              انصراف
            </BaseButton>
            <BaseButton
              type="submit"
              color="primary"
              :loading="loading"
            >
              ذخیره تغییرات
            </BaseButton>
          </div>
        </form>
      </BaseCard>
    </div>
  </div>
</template>
