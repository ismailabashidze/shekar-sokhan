<script setup lang="ts">
  definePageMeta({
    title: 'پروفایل پژوهشگر',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();

  // Mock data - In real app, fetch from API
  const researcher = ref({
    firstName: 'علی',
    lastName: 'محمدی',
    email: 'ali.mohammadi@example.com',
    phone: '09123456789',
    institution: 'دانشگاه تهران',
    academicDegree: 'دکتری',
    researchField: 'روانشناسی بالینی',
    experience:
      'با بیش از ۱۰ سال تجربه پژوهشی در حوزه روانشناسی بالینی و درمان اختلالات اضطرابی. تمرکز اصلی من بر روی درمان‌های شناختی-رفتاری و مداخلات مبتنی بر ذهن‌آگاهی است.',
    bio: 'پژوهشگر و استاد دانشگاه با تخصص در روانشناسی بالینی. علاقه‌مند به پژوهش‌های بین‌رشته‌ای و کاربرد فناوری در سلامت روان.',
    registeredAt: '۱۴۰۲/۰۸/۱۵',
    avatar: '/img/avatars/3.svg',
    website: 'https://ali-mohammadi.com',
    orcid: '0000-0002-1234-5678',
    googleScholar: 'https://scholar.google.com/citations?user=example',
    researchGate: 'https://www.researchgate.net/profile/Ali-Mohammadi',
    skills: ['SPSS', 'R Programming', 'روش‌های کیفی', 'تحلیل داده', 'طراحی پژوهش', 'CBT', 'Mindfulness'],
    interests: ['اختلالات اضطرابی', 'افسردگی', 'درمان‌های دیجیتال', 'روانشناسی مثبت‌گرا'],
  });

  const stats = ref([
    { label: 'پروژه‌های فعال', value: '12', icon: 'ph:folder-open', color: 'primary' },
    { label: 'پروژه‌های تکمیل شده', value: '45', icon: 'ph:check-circle', color: 'success' },
    { label: 'مقالات منتشر شده', value: '28', icon: 'ph:file-text', color: 'info' },
    { label: 'استناد', value: '342', icon: 'ph:quotes', color: 'warning' },
  ]);

  const publications = ref([
    {
      title: 'تأثیر درمان شناختی-رفتاری بر اختلالات اضطرابی در نوجوانان',
      journal: 'مجله روانشناسی بالینی ایران',
      year: '۱۴۰۲',
      citations: 45,
      doi: '10.1234/ijcp.2023.123',
    },
    {
      title: 'بررسی اثربخشی مداخلات مبتنی بر ذهن‌آگاهی در کاهش استرس',
      journal: 'فصلنامه سلامت روان',
      year: '۱۴۰۱',
      citations: 67,
      doi: '10.1234/mhq.2022.456',
    },
    {
      title: 'نقش فناوری دیجیتال در ارتقای سلامت روان جامعه',
      journal: 'مجله پزشکی و فناوری',
      year: '۱۴۰۱',
      citations: 23,
      doi: '10.1234/jmt.2022.789',
    },
  ]);

  const recentProjects = ref([
    {
      title: 'بررسی تأثیر مداخلات روانشناختی بر بیماران کرونا',
      status: 'در حال انجام',
      participants: 120,
      progress: 65,
      statusColor: 'info',
    },
    {
      title: 'طراحی اپلیکیشن موبایل برای درمان اضطراب',
      status: 'در حال انجام',
      participants: 45,
      progress: 40,
      statusColor: 'info',
    },
    {
      title: 'مطالعه طولی سلامت روان دانشجویان',
      status: 'تکمیل شده',
      participants: 250,
      progress: 100,
      statusColor: 'success',
    },
  ]);

  const achievements = ref([
    { title: 'برنده جایزه بهترین پژوهش سال', year: '۱۴۰۲', icon: 'ph:trophy' },
    { title: 'عضو انجمن روانشناسی ایران', year: '۱۳۹۵', icon: 'ph:seal-check' },
    { title: 'داور مجلات معتبر بین‌المللی', year: '۱۴۰۰', icon: 'ph:medal' },
  ]);

  const activeTab = ref('overview');

  const navigateToEdit = () => {
    router.push('/hampazhooh/researcher/edit');
  };

  const downloadCV = () => {
    // Implement CV download logic
    const toaster = useToaster();
    toaster.show({
      title: 'در حال دانلود',
      message: 'فایل رزومه شما در حال آماده‌سازی است.',
      color: 'info',
      icon: 'ph:download-simple',
      closable: true,
    });
  };
</script>

<template>
  <div class="min-h-screen bg-muted-100 dark:bg-muted-900">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Hero Section with Profile Header -->
      <BaseCard class="mb-6 overflow-hidden" shape="curved">
        <div class="bg-gradient-to-r from-primary-500 to-primary-600 h-32" />
        <div class="relative px-6 pb-6">
          <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <!-- Profile Image and Basic Info -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div class="-mt-16">
                <div
                  class="border-muted-100 dark:border-muted-800 relative size-32 overflow-hidden rounded-2xl border-4"
                >
                  <img
                    :src="researcher.avatar"
                    :alt="`${researcher.firstName} ${researcher.lastName}`"
                    class="size-full object-cover"
                  />
                  <div class="bg-success-500 absolute bottom-2 right-2 size-4 rounded-full border-2 border-white" />
                </div>
              </div>
              <div class="space-y-2">
                <BaseHeading as="h1" size="2xl" weight="bold">
                  {{ researcher.firstName }} {{ researcher.lastName }}
                </BaseHeading>
                <div class="flex flex-wrap gap-2">
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 flex items-center gap-1">
                    <Icon name="ph:graduation-cap" class="size-4" />
                    {{ researcher.academicDegree }}
                  </BaseParagraph>
                  <span class="text-muted-400">•</span>
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 flex items-center gap-1">
                    <Icon name="ph:buildings" class="size-4" />
                    {{ researcher.institution }}
                  </BaseParagraph>
                </div>
                <div class="flex gap-2">
                  <BaseTag v-if="researcher.orcid" color="default" shape="curved" size="sm">
                    <Icon name="academicons:orcid" class="size-3" />
                    <span class="text-xs">ORCID</span>
                  </BaseTag>
                  <BaseTag color="primary" shape="curved" size="sm">
                    {{ researcher.researchField }}
                  </BaseTag>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-2">
              <BaseButton color="primary" shape="curved" @click="navigateToEdit">
                <Icon name="ph:pencil-simple" class="size-4" />
                <span>ویرایش پروفایل</span>
              </BaseButton>
              <BaseButton color="default" shape="curved" @click="downloadCV">
                <Icon name="ph:download-simple" class="size-4" />
                <span>دانلود رزومه</span>
              </BaseButton>
              <BaseButton color="default" shape="curved" @click="$router.push('/hampazhooh/projects')">
                <Icon name="ph:folder-open" class="size-4" />
              </BaseButton>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Stats Cards -->
      <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BaseCard v-for="stat in stats" :key="stat.label" shape="curved" class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <BaseParagraph size="xs" class="text-muted-400 mb-1">
                {{ stat.label }}
              </BaseParagraph>
              <BaseHeading as="h3" size="2xl" weight="bold">
                {{ stat.value }}
              </BaseHeading>
            </div>
            <div :class="`bg-${stat.color}-500/10 text-${stat.color}-500 rounded-lg p-3`">
              <Icon :name="stat.icon" class="size-6" />
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Main Content Area -->
        <div class="lg:col-span-2">
          <!-- Tabs Navigation -->
          <BaseCard class="mb-6" shape="curved">
            <div class="flex gap-2 overflow-x-auto p-2">
              <button
                :class="[
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === 'overview'
                    ? 'bg-primary-500 text-white'
                    : 'text-muted-600 hover:bg-muted-100 dark:text-muted-400 dark:hover:bg-muted-800',
                ]"
                @click="activeTab = 'overview'"
              >
                <Icon name="ph:user" class="size-4" />
                نمای کلی
              </button>
              <button
                :class="[
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === 'publications'
                    ? 'bg-primary-500 text-white'
                    : 'text-muted-600 hover:bg-muted-100 dark:text-muted-400 dark:hover:bg-muted-800',
                ]"
                @click="activeTab = 'publications'"
              >
                <Icon name="ph:file-text" class="size-4" />
                انتشارات
              </button>
              <button
                :class="[
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === 'projects'
                    ? 'bg-primary-500 text-white'
                    : 'text-muted-600 hover:bg-muted-100 dark:text-muted-400 dark:hover:bg-muted-800',
                ]"
                @click="activeTab = 'projects'"
              >
                <Icon name="ph:folder-open" class="size-4" />
                پروژه‌ها
              </button>
              <button
                :class="[
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === 'achievements'
                    ? 'bg-primary-500 text-white'
                    : 'text-muted-600 hover:bg-muted-100 dark:text-muted-400 dark:hover:bg-muted-800',
                ]"
                @click="activeTab = 'achievements'"
              >
                <Icon name="ph:trophy" class="size-4" />
                دستاورد‌ها
              </button>
            </div>
          </BaseCard>

          <!-- Tab Content -->
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <BaseCard shape="curved" class="p-6">
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">درباره من</BaseHeading>
              <BaseParagraph class="text-muted-600 dark:text-muted-300 leading-relaxed">
                {{ researcher.bio }}
              </BaseParagraph>
            </BaseCard>

            <BaseCard shape="curved" class="p-6">
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">سابقه پژوهشی</BaseHeading>
              <BaseParagraph class="text-muted-600 dark:text-muted-300 leading-relaxed">
                {{ researcher.experience }}
              </BaseParagraph>
            </BaseCard>

            <BaseCard shape="curved" class="p-6">
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">مهارت‌ها و تخصص‌ها</BaseHeading>
              <div class="flex flex-wrap gap-2">
                <BaseTag v-for="skill in researcher.skills" :key="skill" color="primary" shape="curved">
                  {{ skill }}
                </BaseTag>
              </div>
            </BaseCard>

            <BaseCard shape="curved" class="p-6">
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">علایق پژوهشی</BaseHeading>
              <div class="flex flex-wrap gap-2">
                <BaseTag v-for="interest in researcher.interests" :key="interest" color="default" shape="curved">
                  <Icon name="ph:lightbulb" class="size-3" />
                  {{ interest }}
                </BaseTag>
              </div>
            </BaseCard>
          </div>

          <!-- Publications Tab -->
          <div v-if="activeTab === 'publications'" class="space-y-4">
            <BaseCard
              v-for="(pub, index) in publications"
              :key="index"
              shape="curved"
              class="p-6 transition-all hover:shadow-lg"
            >
              <div class="space-y-3">
                <BaseHeading as="h4" size="md" weight="medium">
                  {{ pub.title }}
                </BaseHeading>
                <div class="flex flex-wrap items-center gap-3 text-sm">
                  <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 flex items-center gap-1">
                    <Icon name="ph:book-open" class="size-4" />
                    {{ pub.journal }}
                  </BaseParagraph>
                  <span class="text-muted-400">•</span>
                  <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                    {{ pub.year }}
                  </BaseParagraph>
                  <span class="text-muted-400">•</span>
                  <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 flex items-center gap-1">
                    <Icon name="ph:quotes" class="size-4" />
                    {{ pub.citations }} استناد
                  </BaseParagraph>
                </div>
                <div class="flex items-center gap-2">
                  <BaseTag color="default" shape="curved" size="sm">DOI: {{ pub.doi }}</BaseTag>
                  <BaseButton size="sm" color="default" shape="curved">
                    <Icon name="ph:link" class="size-3" />
                    مشاهده
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Projects Tab -->
          <div v-if="activeTab === 'projects'" class="space-y-4">
            <BaseCard v-for="(project, index) in recentProjects" :key="index" shape="curved" class="p-6">
              <div class="space-y-4">
                <div class="flex items-start justify-between">
                  <div>
                    <BaseHeading as="h4" size="md" weight="medium">
                      {{ project.title }}
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mt-1">
                      {{ project.participants }} شرکت‌کننده
                    </BaseParagraph>
                  </div>
                  <BaseTag :color="project.statusColor" shape="curved">
                    {{ project.status }}
                  </BaseTag>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-500 dark:text-muted-400">پیشرفت</span>
                    <span class="text-muted-800 dark:text-muted-100 font-medium">{{ project.progress }}%</span>
                  </div>
                  <div class="bg-muted-200 dark:bg-muted-700 h-2 w-full overflow-hidden rounded-full">
                    <div
                      :class="`bg-${project.statusColor}-500 h-full rounded-full transition-all`"
                      :style="{ width: `${project.progress}%` }"
                    />
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Achievements Tab -->
          <div v-if="activeTab === 'achievements'" class="space-y-4">
            <BaseCard v-for="(achievement, index) in achievements" :key="index" shape="curved" class="p-6">
              <div class="flex items-center gap-4">
                <div class="bg-warning-500/10 text-warning-500 rounded-lg p-3">
                  <Icon :name="achievement.icon" class="size-8" />
                </div>
                <div>
                  <BaseHeading as="h4" size="md" weight="medium">
                    {{ achievement.title }}
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mt-1">
                    {{ achievement.year }}
                  </BaseParagraph>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Contact Information -->
          <BaseCard shape="curved" class="p-6">
            <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">اطلاعات تماس</BaseHeading>
            <div class="space-y-3">
              <a
                :href="`mailto:${researcher.email}`"
                class="text-muted-600 hover:text-primary-500 dark:text-muted-400 flex items-center gap-2 text-sm transition-colors"
              >
                <Icon name="ph:envelope" class="size-4" />
                {{ researcher.email }}
              </a>
              <div class="text-muted-600 dark:text-muted-400 flex items-center gap-2 text-sm">
                <Icon name="ph:phone" class="size-4" />
                {{ researcher.phone }}
              </div>
              <a
                v-if="researcher.website"
                :href="researcher.website"
                target="_blank"
                class="text-muted-600 hover:text-primary-500 dark:text-muted-400 flex items-center gap-2 text-sm transition-colors"
              >
                <Icon name="ph:globe" class="size-4" />
                وب‌سایت شخصی
              </a>
            </div>
          </BaseCard>

          <!-- Academic Networks -->
          <BaseCard shape="curved" class="p-6">
            <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">شبکه‌های علمی</BaseHeading>
            <div class="space-y-2">
              <a
                v-if="researcher.googleScholar"
                :href="researcher.googleScholar"
                target="_blank"
                class="hover:bg-muted-100 dark:hover:bg-muted-800 flex items-center gap-2 rounded-lg p-2 text-sm transition-colors"
              >
                <Icon name="academicons:google-scholar" class="size-5" />
                Google Scholar
              </a>
              <a
                v-if="researcher.researchGate"
                :href="researcher.researchGate"
                target="_blank"
                class="hover:bg-muted-100 dark:hover:bg-muted-800 flex items-center gap-2 rounded-lg p-2 text-sm transition-colors"
              >
                <Icon name="academicons:researchgate" class="size-5" />
                ResearchGate
              </a>
              <a
                v-if="researcher.orcid"
                :href="`https://orcid.org/${researcher.orcid}`"
                target="_blank"
                class="hover:bg-muted-100 dark:hover:bg-muted-800 flex items-center gap-2 rounded-lg p-2 text-sm transition-colors"
              >
                <Icon name="academicons:orcid" class="size-5" />
                ORCID
              </a>
            </div>
          </BaseCard>

          <!-- Quick Stats -->
          <BaseCard shape="curved" class="p-6">
            <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">آمار سریع</BaseHeading>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-muted-600 dark:text-muted-400 text-sm">h-index</span>
                <span class="text-muted-800 dark:text-muted-100 font-semibold">18</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-600 dark:text-muted-400 text-sm">i10-index</span>
                <span class="text-muted-800 dark:text-muted-100 font-semibold">24</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-600 dark:text-muted-400 text-sm">سال‌های فعالیت</span>
                <span class="text-muted-800 dark:text-muted-100 font-semibold">10+</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-600 dark:text-muted-400 text-sm">عضویت از</span>
                <span class="text-muted-800 dark:text-muted-100 font-semibold">{{ researcher.registeredAt }}</span>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>
