<script setup lang="ts">
  import { toTypedSchema } from '@vee-validate/zod';
  import { Field, useForm } from 'vee-validate';
  import { z } from 'zod';

  definePageMeta({
    title: 'ویرایش پروفایل پژوهشگر',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const VALIDATION_TEXT = {
    FIRST_NAME_REQUIRED: 'نام نیاز است',
    LAST_NAME_REQUIRED: 'نام خانوادگی نیاز است',
    EMAIL_REQUIRED: 'آدرس ایمیل نیاز است',
    EMAIL_INVALID: 'یک ایمیل معتبر وارد کنید',
    PHONE_REQUIRED: 'شماره تماس نیاز است',
    PHONE_INVALID: 'شماره تماس معتبر نیست',
    INSTITUTION_REQUIRED: 'نام موسسه/دانشگاه نیاز است',
    FIELD_REQUIRED: 'حوزه پژوهشی نیاز است',
    DEGREE_REQUIRED: 'مقطع تحصیلی نیاز است',
  };

  const zodSchema = z.object({
    firstName: z
      .string({ required_error: VALIDATION_TEXT.FIRST_NAME_REQUIRED })
      .min(1, VALIDATION_TEXT.FIRST_NAME_REQUIRED),
    lastName: z
      .string({ required_error: VALIDATION_TEXT.LAST_NAME_REQUIRED })
      .min(1, VALIDATION_TEXT.LAST_NAME_REQUIRED),
    email: z
      .string({ required_error: VALIDATION_TEXT.EMAIL_REQUIRED })
      .min(1, VALIDATION_TEXT.EMAIL_REQUIRED)
      .email(VALIDATION_TEXT.EMAIL_INVALID),
    phone: z
      .string({ required_error: VALIDATION_TEXT.PHONE_REQUIRED })
      .min(1, VALIDATION_TEXT.PHONE_REQUIRED)
      .regex(/^09\d{9}$/, VALIDATION_TEXT.PHONE_INVALID),
    institution: z
      .string({ required_error: VALIDATION_TEXT.INSTITUTION_REQUIRED })
      .min(1, VALIDATION_TEXT.INSTITUTION_REQUIRED),
    researchField: z.string({ required_error: VALIDATION_TEXT.FIELD_REQUIRED }).min(1, VALIDATION_TEXT.FIELD_REQUIRED),
    academicDegree: z
      .string({ required_error: VALIDATION_TEXT.DEGREE_REQUIRED })
      .min(1, VALIDATION_TEXT.DEGREE_REQUIRED),
    bio: z.string().optional(),
    experience: z.string().optional(),
    website: z.string().url('آدرس وب‌سایت معتبر نیست').optional().or(z.literal('')),
    orcid: z.string().optional(),
    googleScholar: z.string().url('آدرس Google Scholar معتبر نیست').optional().or(z.literal('')),
    researchGate: z.string().url('آدرس ResearchGate معتبر نیست').optional().or(z.literal('')),
  });

  type FormInput = z.infer<typeof zodSchema>;

  const validationSchema = toTypedSchema(zodSchema);

  // Mock data - In real app, fetch from API
  const currentData = {
    firstName: 'علی',
    lastName: 'محمدی',
    email: 'ali.mohammadi@example.com',
    phone: '09123456789',
    institution: 'دانشگاه تهران',
    academicDegree: 'دکتری',
    researchField: 'روانشناسی بالینی',
    bio: 'پژوهشگر و استاد دانشگاه با تخصص در روانشناسی بالینی. علاقه‌مند به پژوهش‌های بین‌رشته‌ای و کاربرد فناوری در سلامت روان.',
    experience:
      'با بیش از ۱۰ سال تجربه پژوهشی در حوزه روانشناسی بالینی و درمان اختلالات اضطرابی. تمرکز اصلی من بر روی درمان‌های شناختی-رفتاری و مداخلات مبتنی بر ذهن‌آگاهی است.',
    website: 'https://ali-mohammadi.com',
    orcid: '0000-0002-1234-5678',
    googleScholar: 'https://scholar.google.com/citations?user=example',
    researchGate: 'https://www.researchgate.net/profile/Ali-Mohammadi',
    avatar: '/img/avatars/1.svg',
  };

  const initialValues = computed<FormInput>(() => ({
    firstName: currentData.firstName,
    lastName: currentData.lastName,
    email: currentData.email,
    phone: currentData.phone,
    institution: currentData.institution,
    researchField: currentData.researchField,
    academicDegree: currentData.academicDegree,
    bio: currentData.bio,
    experience: currentData.experience,
    website: currentData.website,
    orcid: currentData.orcid,
    googleScholar: currentData.googleScholar,
    researchGate: currentData.researchGate,
  }));

  const activeTab = ref('basic');
  const avatarPreview = ref(currentData.avatar);
  const skills = ref(['SPSS', 'R Programming', 'روش‌های کیفی', 'تحلیل داده', 'طراحی پژوهش', 'CBT', 'Mindfulness']);
  const newSkill = ref('');
  const interests = ref(['اختلالات اضطرابی', 'افسردگی', 'درمان‌های دیجیتال', 'روانشناسی مثبت‌گرا']);
  const newInterest = ref('');

  const addSkill = () => {
    if (newSkill.value.trim() && !skills.value.includes(newSkill.value.trim())) {
      skills.value.push(newSkill.value.trim());
      newSkill.value = '';
    }
  };

  const removeSkill = (skill: string) => {
    skills.value = skills.value.filter((s) => s !== skill);
  };

  const addInterest = () => {
    if (newInterest.value.trim() && !interests.value.includes(newInterest.value.trim())) {
      interests.value.push(newInterest.value.trim());
      newInterest.value = '';
    }
  };

  const removeInterest = (interest: string) => {
    interests.value = interests.value.filter((i) => i !== interest);
  };

  const handleAvatarUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const { handleSubmit, isSubmitting, validate } = useForm({
    validationSchema,
    initialValues,
  });

  const router = useRouter();
  const toaster = useToaster();

  const validateAndSubmit = async () => {
    const validationResult = await validate();

    if (!validationResult.valid) {
      toaster.clearAll();
      toaster.show({
        title: 'خطا در اطلاعات',
        message: 'لطفاً تمام فیلدهای الزامی را کامل کنید.',
        color: 'danger',
        icon: 'ph:warning-fill',
        closable: true,
      });
      return;
    }

    await handleSubmit(onSubmit)();
  };

  const onSubmit = async (values: FormInput) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toaster.clearAll();
      toaster.show({
        title: 'بروزرسانی موفق',
        message: 'اطلاعات پروفایل شما با موفقیت بروزرسانی شد.',
        color: 'success',
        icon: 'ph:check-circle-fill',
        closable: true,
      });

      setTimeout(() => {
        router.push('/hampazhooh/researcher');
      }, 1000);
    } catch (error: any) {
      toaster.show({
        title: 'خطا در بروزرسانی',
        message: error.message || 'متاسفانه مشکلی پیش آمد. لطفا دوباره تلاش کنید.',
        color: 'danger',
        icon: 'ph:warning-fill',
        closable: true,
      });
    }
  };

  const cancelEdit = () => {
    router.push('/hampazhooh/researcher');
  };

  const academicDegrees = ['کارشناسی', 'کارشناسی ارشد', 'دکتری', 'فوق دکتری', 'استادیار', 'دانشیار', 'استاد'];

  const researchFields = [
    'روانشناسی بالینی',
    'روانشناسی رشد',
    'روانشناسی شناختی',
    'روانشناسی اجتماعی',
    'روانشناسی industrial-organizational',
    'عصب‌شناسی',
    'روانپزشکی',
    'مشاوره',
    'سایر',
  ];
</script>

<template>
  <div class="min-h-screen bg-muted-100 dark:bg-muted-900">
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <BaseButton size="sm" shape="curved" @click="cancelEdit">
            <Icon name="ph:arrow-right" class="size-4" />
            <span>بازگشت به پروفایل</span>
          </BaseButton>
          <div class="flex gap-2">
            <BaseButton
              :disabled="isSubmitting"
              :loading="isSubmitting"
              type="button"
              color="primary"
              shape="curved"
              @click="validateAndSubmit"
            >
              <Icon name="ph:check" class="size-4" />
              ذخیره تغییرات
            </BaseButton>
          </div>
        </div>
        <BaseHeading as="h1" size="3xl" weight="bold">ویرایش پروفایل</BaseHeading>
        <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mt-2">
          اطلاعات پروفایل و شبکه‌های اجتماعی خود را بروزرسانی کنید
        </BaseParagraph>
      </div>

      <!-- Tabs -->
      <BaseCard class="mb-6" shape="curved">
        <div class="flex gap-2 overflow-x-auto p-2">
          <button
            :class="[
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === 'basic'
                ? 'bg-primary-500 text-white'
                : 'text-muted-600 hover:bg-muted-100 dark:text-muted-400 dark:hover:bg-muted-800',
            ]"
            @click="activeTab = 'basic'"
          >
            <Icon name="ph:user" class="size-4" />
            اطلاعات پایه
          </button>
          <button
            :class="[
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === 'academic'
                ? 'bg-primary-500 text-white'
                : 'text-muted-600 hover:bg-muted-100 dark:text-muted-400 dark:hover:bg-muted-800',
            ]"
            @click="activeTab = 'academic'"
          >
            <Icon name="ph:graduation-cap" class="size-4" />
            اطلاعات آکادمیک
          </button>
          <button
            :class="[
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === 'research'
                ? 'bg-primary-500 text-white'
                : 'text-muted-600 hover:bg-muted-100 dark:text-muted-400 dark:hover:bg-muted-800',
            ]"
            @click="activeTab = 'research'"
          >
            <Icon name="ph:book-open" class="size-4" />
            پژوهش و تخصص
          </button>
          <button
            :class="[
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === 'social'
                ? 'bg-primary-500 text-white'
                : 'text-muted-600 hover:bg-muted-100 dark:text-muted-400 dark:hover:bg-muted-800',
            ]"
            @click="activeTab = 'social'"
          >
            <Icon name="ph:link" class="size-4" />
            شبکه‌های علمی
          </button>
        </div>
      </BaseCard>

      <!-- Edit Form Card -->
      <BaseCard class="p-6" shape="curved">
        <form method="POST" novalidate>
          <!-- Basic Information Tab -->
          <div v-if="activeTab === 'basic'" class="space-y-6">
            <!-- Profile Picture -->
            <div>
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">تصویر پروفایل</BaseHeading>
              <div class="flex items-center gap-6">
                <div class="relative">
                  <div class="size-32 overflow-hidden rounded-2xl">
                    <img :src="avatarPreview" alt="Profile" class="size-full object-cover" />
                  </div>
                  <label
                    for="avatar-upload"
                    class="bg-primary-500 hover:bg-primary-600 absolute bottom-2 right-2 cursor-pointer rounded-lg p-2 text-white transition-colors"
                  >
                    <Icon name="ph:camera" class="size-4" />
                  </label>
                  <input id="avatar-upload" type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
                </div>
                <div class="flex-1">
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    عکس پروفایل خود را بارگذاری کنید. فرمت‌های مجاز: JPG، PNG، حداکثر 5MB
                  </BaseParagraph>
                  <div class="mt-3 flex gap-2">
                    <label for="avatar-upload">
                      <BaseButton as="span" size="sm" color="primary" shape="curved">
                        <Icon name="ph:upload" class="size-4" />
                        بارگذاری تصویر
                      </BaseButton>
                    </label>
                    <BaseButton size="sm" color="default" shape="curved" @click="avatarPreview = currentData.avatar">
                      حذف
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>

            <BasePlaceload class="h-px w-full" />

            <div>
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">اطلاعات شخصی</BaseHeading>
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="firstName">
                    <BaseInput
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="text"
                      label="نام"
                      placeholder="نام"
                      shape="curved"
                      :classes="{ input: 'h-12' }"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>

                  <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="lastName">
                    <BaseInput
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="text"
                      label="نام خانوادگی"
                      placeholder="نام خانوادگی"
                      shape="curved"
                      :classes="{ input: 'h-12' }"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="email">
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="email"
                    label="آدرس ایمیل"
                    placeholder="example@email.com"
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>

                <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="phone">
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="tel"
                    label="شماره تماس"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>

                <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="bio">
                  <BaseTextarea
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    label="بیوگرافی کوتاه"
                    placeholder="توضیح مختصری درباره خود و علایق پژوهشی..."
                    shape="curved"
                    :rows="3"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>
          </div>

          <!-- Academic Information Tab -->
          <div v-if="activeTab === 'academic'" class="space-y-6">
            <div>
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">اطلاعات آکادمیک</BaseHeading>
              <div class="space-y-4">
                <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="institution">
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    label="موسسه/دانشگاه"
                    placeholder="نام موسسه یا دانشگاه"
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>

                <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="academicDegree">
                  <BaseListbox
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    label="مقطع تحصیلی"
                    placeholder="مقطع تحصیلی را انتخاب کنید"
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    :items="academicDegrees"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>

                <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="researchField">
                  <BaseListbox
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    label="حوزه پژوهشی"
                    placeholder="حوزه پژوهشی خود را انتخاب کنید"
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    :items="researchFields"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>

            <BasePlaceload class="h-px w-full" />

            <!-- Experience Section -->
            <div>
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">سابقه پژوهشی</BaseHeading>
              <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="experience">
                <BaseTextarea
                  :model-value="field.value"
                  :error="errorMessage"
                  :disabled="isSubmitting"
                  label="سابقه پژوهشی (اختیاری)"
                  placeholder="توضیحاتی در مورد سابقه و زمینه‌های پژوهشی خود بنویسید..."
                  shape="curved"
                  :rows="4"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>
            </div>
          </div>

          <!-- Research & Expertise Tab -->
          <div v-if="activeTab === 'research'" class="space-y-6">
            <!-- Skills Section -->
            <div>
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">مهارت‌ها و تخصص‌ها</BaseHeading>
              <div class="space-y-4">
                <div class="flex flex-wrap gap-2">
                  <BaseTag v-for="skill in skills" :key="skill" color="primary" shape="curved">
                    {{ skill }}
                    <button
                      type="button"
                      class="hover:text-danger-500 ml-1 transition-colors"
                      @click="removeSkill(skill)"
                    >
                      <Icon name="ph:x" class="size-3" />
                    </button>
                  </BaseTag>
                </div>
                <div class="flex gap-2">
                  <BaseInput
                    v-model="newSkill"
                    placeholder="مهارت جدید اضافه کنید..."
                    shape="curved"
                    :classes="{ input: 'h-10' }"
                    @keyup.enter="addSkill"
                  />
                  <BaseButton size="sm" color="primary" shape="curved" @click="addSkill">
                    <Icon name="ph:plus" class="size-4" />
                    افزودن
                  </BaseButton>
                </div>
              </div>
            </div>

            <BasePlaceload class="h-px w-full" />

            <!-- Research Interests Section -->
            <div>
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">علایق پژوهشی</BaseHeading>
              <div class="space-y-4">
                <div class="flex flex-wrap gap-2">
                  <BaseTag v-for="interest in interests" :key="interest" color="default" shape="curved">
                    <Icon name="ph:lightbulb" class="size-3" />
                    {{ interest }}
                    <button
                      type="button"
                      class="hover:text-danger-500 ml-1 transition-colors"
                      @click="removeInterest(interest)"
                    >
                      <Icon name="ph:x" class="size-3" />
                    </button>
                  </BaseTag>
                </div>
                <div class="flex gap-2">
                  <BaseInput
                    v-model="newInterest"
                    placeholder="علاقه پژوهشی جدید اضافه کنید..."
                    shape="curved"
                    :classes="{ input: 'h-10' }"
                    @keyup.enter="addInterest"
                  />
                  <BaseButton size="sm" color="primary" shape="curved" @click="addInterest">
                    <Icon name="ph:plus" class="size-4" />
                    افزودن
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Networks Tab -->
          <div v-if="activeTab === 'social'" class="space-y-6">
            <div>
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">وب‌سایت و شناسه‌های علمی</BaseHeading>
              <div class="space-y-4">
                <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="website">
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="url"
                    label="وب‌سایت شخصی"
                    placeholder="https://example.com"
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  >
                    <template #icon>
                      <Icon name="ph:globe" class="size-5" />
                    </template>
                  </BaseInput>
                </Field>

                <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="orcid">
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    label="ORCID iD"
                    placeholder="0000-0002-1234-5678"
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  >
                    <template #icon>
                      <Icon name="academicons:orcid" class="size-5" />
                    </template>
                  </BaseInput>
                </Field>
              </div>
            </div>

            <BasePlaceload class="h-px w-full" />

            <div>
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">شبکه‌های اجتماعی علمی</BaseHeading>
              <div class="space-y-4">
                <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="googleScholar">
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="url"
                    label="Google Scholar"
                    placeholder="https://scholar.google.com/citations?user=..."
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  >
                    <template #icon>
                      <Icon name="academicons:google-scholar" class="size-5" />
                    </template>
                  </BaseInput>
                </Field>

                <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="researchGate">
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="url"
                    label="ResearchGate"
                    placeholder="https://www.researchgate.net/profile/..."
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  >
                    <template #icon>
                      <Icon name="academicons:researchgate" class="size-5" />
                    </template>
                  </BaseInput>
                </Field>
              </div>
            </div>
          </div>
        </form>
      </BaseCard>

      <!-- Bottom Action Bar -->
      <BaseCard class="sticky bottom-4 mt-6 p-4" shape="curved">
        <div class="flex items-center justify-between gap-4">
          <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">آخرین بروزرسانی: امروز</BaseParagraph>
          <div class="flex gap-2">
            <BaseButton :disabled="isSubmitting" type="button" color="default" shape="curved" @click="cancelEdit">
              <Icon name="ph:x" class="size-4" />
              انصراف
            </BaseButton>
            <BaseButton
              :disabled="isSubmitting"
              :loading="isSubmitting"
              type="button"
              color="primary"
              shape="curved"
              @click="validateAndSubmit"
            >
              <Icon name="ph:check" class="size-4" />
              ذخیره تغییرات
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
