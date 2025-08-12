<template>
  <div class="relative">
    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-12 gap-6">
      <!-- Loading Header -->
      <div class="col-span-12">
        <div class="bg-primary-800 flex animate-pulse flex-col items-center rounded-2xl p-4 sm:flex-row">
          <div class="bg-primary-700/50 relative h-[168px] w-[280px] shrink-0" />
          <div class="mt-6 w-full grow sm:mt-0">
            <div class="flex flex-col gap-4 text-center sm:text-right">
              <div class="bg-primary-700/50 mx-auto h-8 w-1/2 rounded-md sm:mr-0" />
              <div class="bg-primary-700/50 mx-auto h-4 w-3/4 rounded-md sm:mr-0" />
              <div class="mt-6 flex flex-wrap gap-4 pb-4 sm:mt-4 sm:pb-0">
                <div class="flex-1">
                  <div class="bg-primary-700/50 h-16 rounded-md" />
                </div>
                <div class="flex-1">
                  <div class="bg-primary-700/50 h-16 rounded-md" />
                </div>
                <div class="flex-1">
                  <div class="bg-primary-700/50 h-16 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Content -->
      <div class="col-span-12 lg:col-span-8">
        <div class="animate-pulse">
          <div class="bg-muted-200 dark:bg-muted-800 mb-6 h-96 rounded-2xl" />
          <div class="bg-muted-200 dark:bg-muted-800 h-64 rounded-2xl" />
        </div>
      </div>

      <!-- Loading Sidebar -->
      <div class="col-span-12 lg:col-span-4">
        <div class="bg-muted-200 dark:bg-muted-800 h-[600px] animate-pulse rounded-2xl" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasData" class="grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <BaseCard class="p-10" shape="curved">
          <div class="flex flex-col items-center text-center">
            <img
              src="/img/illustrations/dashboards/health/doctor.svg"
              alt="No report data"
              class="mb-6 w-72"
            >
            <BaseHeading
              tag="h2"
              size="2xl"
              weight="medium"
              class="text-muted-800 mb-2 dark:text-white"
            >
              گزارشی یافت نشد
            </BaseHeading>
            <BaseParagraph size="md" class="text-muted-400 mb-8">
              هنوز هیچ گزارش نهایی برای شما ثبت نشده است. برای شروع، یک جلسه جدید ایجاد کنید.
            </BaseParagraph>
            <BaseButton color="primary" @click="startNewSession">
              <Icon name="ph:plus-circle-duotone" class="me-2 size-5" />
              شروع جلسه جدید
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Report Content (when data exists) -->
    <div v-else class="grid grid-cols-12 gap-6">
      <!-- Header -->
      <div class="col-span-12">
        <div class="bg-primary-800 flex flex-col items-center rounded-2xl p-4 sm:flex-row">
          <div class="relative h-[168px] w-[280px] shrink-0">
            <img
              class="pointer-events-none absolute -start-6 -top-20 sm:-start-10"
              src="/img/illustrations/dashboards/health/doctor.svg"
              alt="Report illustration"
            >
          </div>
          <div class="mt-6 grow sm:mt-0">
            <div class="text-center sm:text-right">
              <BaseHeading tag="h1" class="text-white opacity-90">
                <span>گزارش نهایی</span>
              </BaseHeading>
              <BaseParagraph size="sm" class="text-white opacity-60">
                <span>
                  <span>
                    خلاصه و تحلیل نهایی جلسات مشاوره
                  </span>
                </span>
              </BaseParagraph>
              <div class="mt-6 flex flex-wrap gap-4 pb-4 text-center sm:mt-4 sm:pb-0 sm:text-right">
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-white/50">تعداد کل جلسات</span>
                    <div class="text-white">
                      <span class="text-base font-medium">
                        {{ report.totalSessions }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-white/50">اولین جلسه</span>
                    <div class="text-white">
                      <span class="text-base font-medium">
                        {{ formatDate(report.created) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-white/50">آخرین بروزرسانی</span>
                    <div class="text-white">
                      <span class="text-base font-medium">
                        {{ formatDate(report.updated) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Content -->
      <div class="col-span-12 mb-8 lg:col-span-8">
        <!-- Summaries Card -->
        <BaseCard class="p-6" shape="curved">
          <div class="mb-2 flex items-center justify-between">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>خلاصه جلسات</span>
            </BaseHeading>
          </div>
          <div class="flex justify-between">
            <BaseParagraph size="xs" class="text-muted-400 max-w-full">
              <Icon name="ph:notepad-duotone" class="size-4" />
              <span>خلاصه تمام جلسات مشاوره</span>
            </BaseParagraph>
          </div>
          <div class="mt-6">
            <template v-if="report.summaries && report.summaries.length > 0">
              <div
                v-for="(summary, idx) in visibleSummaries"
                :key="summary.session"
                class="mb-6"
              >
                <BaseCard
                  shape="rounded"
                  class="border-primary-100 dark:border-primary-500/20 relative border-2 p-5 transition-all duration-300 hover:shadow-lg"
                >
                  <BaseHeading
                    as="h4"
                    size="sm"
                    weight="medium"
                    lead="tight"
                    class="text-primary-500 dark:text-primary-400 mb-2"
                  >
                    {{ summary.title }}
                  </BaseHeading>
                  <div class="my-2 flex flex-wrap gap-4">
                    <span v-if="summary.date" class="text-muted-500 dark:text-muted-400 text-xs">
                      تاریخ برگزاری: {{ formatDate(summary.date) }}
                    </span>
                    <span v-if="summary.duration" class="text-muted-500 dark:text-muted-400 text-xs">
                      مدت جلسه: {{ summary.duration }} دقیقه
                    </span>
                  </div>

                  <BaseText size="sm" class="text-muted-700 dark:text-muted-300 mb-2">
                    {{ summary.summary }}
                  </BaseText>
                  <!-- Delete button -->
                  <button
                    class="text-danger-500 hover:text-danger-600 dark:text-danger-400 dark:hover:text-danger-300 absolute left-2 top-2 transition-colors duration-300"
                    @click.prevent="openDeleteModal(idx, summary)"
                  >
                    <Icon name="ph:trash-duotone" class="size-5" />
                  </button>
                </BaseCard>
              </div>
              <!-- Show More Button -->
              <div v-if="report.summaries.length > visibleCount" class="mt-6 text-center">
                <BaseButton
                  color="primary"
                  class="mx-auto"
                  @click="showMore"
                >
                  نمایش بیشتر ({{ report.summaries.length - visibleCount }} مورد دیگر)
                </BaseButton>
              </div>
            </template>
            <template v-else>
              <div class="flex flex-col items-center justify-center py-10 text-center">
                <Icon name="ph:notepad-duotone" class="text-muted-300 mb-2 size-12" />
                <BaseHeading
                  as="h4"
                  size="sm"
                  class="text-muted-500 mb-2"
                >
                  خلاصه‌ای برای نمایش وجود ندارد
                </BaseHeading>
                <BaseText size="xs" class="text-muted-400">
                  هنوز هیچ خلاصه‌ای برای جلسات شما ثبت نشده است.
                </BaseText>
              </div>
            </template>
          </div>
        </BaseCard>

        <!-- Delete Confirmation Modal -->
        <TairoModal
          :open="isDeleteModalOpen"
          size="sm"
          @close="isDeleteModalOpen = false"
        >
          <template #header>
            <div class="flex w-full items-center justify-between p-4 md:p-6">
              <BaseHeading
                tag="h3"
                size="md"
                weight="medium"
                class="text-muted-800 dark:text-white"
              >
                تایید حذف
              </BaseHeading>
              <div class="flex items-center gap-2">
                <ButtonClose @click="isDeleteModalOpen = false" />
              </div>
            </div>
          </template>
          <div class="p-4 text-center md:p-6">
            <div class="relative mx-auto mb-4 flex size-24 justify-center">
              <Icon
                name="ph:trash-duotone"
                class="text-danger-500 size-24"
              />
            </div>
            <BaseParagraph class="text-muted-700 dark:text-muted-300 mb-4">
              آیا از حذف خلاصه «{{ summaryToDelete?.title }}» اطمینان دارید؟
            </BaseParagraph>
            <BaseParagraph class="text-muted-500 mb-4 text-sm">
              پس از حذف، امکان بازیابی وجود ندارد.
              این اطلاعات از دسترس هوش مصنوعی خارج خواهد شد.
            </BaseParagraph>
          </div>
          <template #footer>
            <div class="flex items-center justify-end gap-2 p-4 sm:p-6">
              <BaseButton @click="isDeleteModalOpen = false">
                انصراف
              </BaseButton>
              <BaseButton
                color="danger"
                :loading="isDeleting"
                @click="confirmDelete"
              >
                حذف
              </BaseButton>
            </div>
          </template>
        </TairoModal>

        <!-- Delete All Deeper Goals Confirmation Modal -->
        <TairoModal
          :open="isDeleteAllDeeperGoalsModalOpen"
          size="sm"
          @close="isDeleteAllDeeperGoalsModalOpen = false"
        >
          <template #header>
            <div class="flex w-full items-center justify-between p-4 md:p-6">
              <BaseHeading
                tag="h3"
                size="md"
                weight="medium"
                class="text-muted-800 dark:text-white"
              >
                تایید حذف همه اهداف
              </BaseHeading>
              <div class="flex items-center gap-2">
                <ButtonClose @click="isDeleteAllDeeperGoalsModalOpen = false" />
              </div>
            </div>
          </template>
          <div class="p-4 text-center md:p-6">
            <div class="relative mx-auto mb-4 flex size-24 justify-center">
              <Icon
                name="ph:trash-duotone"
                class="text-danger-500 size-24"
              />
            </div>
            <BaseParagraph class="text-muted-700 dark:text-muted-300 mb-4">
              آیا از حذف تمامی اهداف عمیق‌تر ({{ report.possibleDeeperGoals.length }} مورد) اطمینان دارید؟
            </BaseParagraph>
            <BaseParagraph class="text-muted-500 mb-4 text-sm">
              پس از حذف، امکان بازیابی وجود ندارد.
              تمام اهداف از دسترس هوش مصنوعی خارج خواهد شد.
            </BaseParagraph>
          </div>
          <template #footer>
            <div class="flex items-center justify-end gap-2 p-4 sm:p-6">
              <BaseButton @click="isDeleteAllDeeperGoalsModalOpen = false">
                انصراف
              </BaseButton>
              <BaseButton
                color="danger"
                :loading="isDeletingAllDeeperGoals"
                @click="confirmDeleteAllDeeperGoals"
              >
                حذف همه
              </BaseButton>
            </div>
          </template>
        </TairoModal>

        <!-- Delete All Risk Factors Confirmation Modal -->
        <TairoModal
          :open="isDeleteAllRiskFactorsModalOpen"
          size="sm"
          @close="isDeleteAllRiskFactorsModalOpen = false"
        >
          <template #header>
            <div class="flex w-full items-center justify-between p-4 md:p-6">
              <BaseHeading
                tag="h3"
                size="md"
                weight="medium"
                class="text-muted-800 dark:text-white"
              >
                تایید حذف همه عوامل خطر
              </BaseHeading>
              <div class="flex items-center gap-2">
                <ButtonClose @click="isDeleteAllRiskFactorsModalOpen = false" />
              </div>
            </div>
          </template>
          <div class="p-4 text-center md:p-6">
            <div class="relative mx-auto mb-4 flex size-24 justify-center">
              <Icon
                name="ph:trash-duotone"
                class="text-danger-500 size-24"
              />
            </div>
            <BaseParagraph class="text-muted-700 dark:text-muted-300 mb-4">
              آیا از حذف تمامی عوامل خطر احتمالی ({{ report.possibleRiskFactors.length }} مورد) اطمینان دارید؟
            </BaseParagraph>
            <BaseParagraph class="text-muted-500 mb-4 text-sm">
              پس از حذف، امکان بازیابی وجود ندارد.
              تمام عوامل خطر از دسترس هوش مصنوعی خارج خواهد شد.
            </BaseParagraph>
          </div>
          <template #footer>
            <div class="flex items-center justify-end gap-2 p-4 sm:p-6">
              <BaseButton @click="isDeleteAllRiskFactorsModalOpen = false">
                انصراف
              </BaseButton>
              <BaseButton
                color="danger"
                :loading="isDeletingAllRiskFactors"
                @click="confirmDeleteAllRiskFactors"
              >
                حذف همه
              </BaseButton>
            </div>
          </template>
        </TairoModal>

        <!-- Demographic Profile Card -->
        <BaseCard shape="curved" class="mt-4 p-6">
          <div class="mb-2 flex items-center justify-between">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>اطلاعات دموگرافیک</span>
            </BaseHeading>
            <BaseButton
              v-if="!isEditingDemographic"
              color="primary"
              size="sm"
              class="ms-2"
              :disabled="!report.finalDemographicProfile ||
                Object.values(report.finalDemographicProfile).every(value => !value)"
              @click="enableEditDemographic"
            >
              <Icon name="ph:pencil-duotone" class="ms-1 size-4" /> ویرایش
            </BaseButton>
            <template v-else>
              <div>
                <BaseButton
                  color="success"
                  size="sm"
                  class="ms-2"
                  :loading="isSavingDemographic"
                  @click="saveDemographicProfile"
                >
                  <Icon name="ph:check-duotone" class="ms-1 size-4" /> ذخیره
                </BaseButton>
                <BaseButton
                  color="muted"
                  size="sm"
                  class="ms-2"
                  @click="cancelEditDemographic"
                >
                  <Icon name="ph:x-duotone" class="ms-1 size-4" /> انصراف
                </BaseButton>
              </div>
            </template>
          </div>
          <div class="flex justify-between">
            <BaseParagraph size="xs" class="text-muted-400 max-w-full">
              <Icon name="ph:user-duotone" class="size-4" />
              <span>
                اطلاعات دموگرافیک مراجع که در طول جلسات استخراج شده است.
              </span>
            </BaseParagraph>
          </div>
          <div class="relative mt-5">
            <div class="grid grid-cols-12 gap-4">
              <!-- First Name -->
              <div class="col-span-12 sm:col-span-6">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">نام</label>
                  <span v-if="report.finalDemographicProfile?.firstName" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseInput
                  v-model="editDemographicProfile.firstName"
                  :disabled="!isEditingDemographic"
                  type="text"
                  icon="ph:user-duotone"
                  placeholder="نام"
                  :class="{'opacity-50': !isEditingDemographic}"
                />
              </div>

              <!-- Last Name -->
              <div class="col-span-12 sm:col-span-6">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">نام خانوادگی</label>
                  <span v-if="report.finalDemographicProfile?.lastName" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseInput
                  v-model="editDemographicProfile.lastName"
                  :disabled="!isEditingDemographic"
                  type="text"
                  icon="ph:user-duotone"
                  placeholder="نام خانوادگی"
                  :class="{'opacity-50': !isEditingDemographic}"
                />
              </div>

              <!-- Age -->
              <div class="col-span-12 sm:col-span-6">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">سن</label>
                  <span v-if="report.finalDemographicProfile?.age" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseInput
                  v-model="editDemographicProfile.age"
                  :disabled="!isEditingDemographic"
                  type="number"
                  icon="ph:calendar-duotone"
                  placeholder="سن"
                  :class="{'opacity-50': !isEditingDemographic}"
                />
              </div>

              <!-- Gender -->
              <div class="col-span-12 sm:col-span-6">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">جنسیت</label>
                  <span v-if="report.finalDemographicProfile?.gender" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseSelect
                  v-model="editDemographicProfile.gender"
                  :disabled="!isEditingDemographic"
                  placeholder="جنسیت"
                  :class="{'opacity-50': !isEditingDemographic}"
                >
                  <option value="">
                    جنسیت
                  </option>
                  <option value="male">
                    مرد
                  </option>
                  <option value="female">
                    زن
                  </option>
                  <option value="other">
                    دیگر
                  </option>
                </BaseSelect>
              </div>

              <!-- Education -->
              <div class="col-span-12 sm:col-span-6">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">تحصیلات</label>
                  <span v-if="report.finalDemographicProfile?.education" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseSelect
                  v-model="editDemographicProfile.education"
                  :disabled="!isEditingDemographic"
                  placeholder="تحصیلات"
                  :class="{'opacity-50': !isEditingDemographic}"
                >
                  <option value="">
                    تحصیلات
                  </option>
                  <option value="under diploma">
                    زیر دیپلم
                  </option>
                  <option value="diploma">
                    دیپلم
                  </option>
                  <option value="bachelor">
                    کارشناسی
                  </option>
                  <option value="master">
                    کارشناسی ارشد
                  </option>
                  <option value="phd">
                    دکتری
                  </option>
                  <option value="other">
                    سایر
                  </option>
                </BaseSelect>
              </div>

              <!-- Occupation -->
              <div class="col-span-12 sm:col-span-6">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">شغل</label>
                  <span v-if="report.finalDemographicProfile?.occupation" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseSelect
                  v-model="editDemographicProfile.occupation"
                  :disabled="!isEditingDemographic"
                  placeholder="شغل"
                  :class="{'opacity-50': !isEditingDemographic}"
                >
                  <option value="">
                    شغل
                  </option>
                  <option value="student">
                    دانشجو
                  </option>
                  <option value="employed">
                    کارمند
                  </option>
                  <option value="self-employed">
                    آزاد
                  </option>
                  <option value="unemployed">
                    بیکار
                  </option>
                  <option value="retired">
                    بازننشسته
                  </option>
                  <option value="householder">
                    خانه‌دار
                  </option>
                  <option value="other">
                    سایر
                  </option>
                </BaseSelect>
              </div>

              <!-- Marital Status -->
              <div class="col-span-12">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">وضعیت تأهل</label>
                  <span v-if="report.finalDemographicProfile?.maritalStatus" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseSelect
                  v-model="editDemographicProfile.maritalStatus"
                  :disabled="!isEditingDemographic"
                  placeholder="وضعیت تأهل"
                  :class="{'opacity-50': !isEditingDemographic}"
                >
                  <option value="">
                    وضعیت تأهل
                  </option>
                  <option value="single">
                    مجرد
                  </option>
                  <option value="married">
                    متأهل
                  </option>
                  <option value="divorced">
                    مطلقه
                  </option>
                  <option value="widowed">
                    بیوه
                  </option>
                </BaseSelect>
              </div>
            </div>

            <!-- No Data Overlay -->
            <div
              v-if="!report.finalDemographicProfile ||
                Object.values(report.finalDemographicProfile).every(value => !value)"
              class="bg-muted-100/50 dark:bg-muted-900/50 absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm"
            >
              <div class="text-center">
                <Icon
                  name="ph:user-circle-minus-duotone"
                  class="text-muted-400 mb-2 size-12"
                />
                <p class="text-muted-500 dark:text-muted-400">
                  اطلاعات جمعیت‌شناختی در دسترس نیست
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar Content -->
      <div class="col-span-12 mb-5 lg:col-span-4">
        <!-- Possible Deeper Goals Card -->
        <div class="col-span-12 lg:col-span-6">
          <BaseCard class="h-full p-6" shape="curved">
            <div class="mb-2 flex items-center justify-between">
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>اهداف عمیق‌تر ممکن</span>
              </BaseHeading>
              <BaseButton
                v-if="report.possibleDeeperGoals.length > 0"
                color="danger"
                size="sm"
                class="ms-2"
                @click="openDeleteAllDeeperGoalsModal"
              >
                <Icon name="ph:trash-duotone" class="ms-1 size-4" /> حذف همه
              </BaseButton>
            </div>
            <div class="flex justify-between">
              <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                <Icon name="ph:target-duotone" class="size-4" />
                <span>اهداف و انگیزه‌های زیربنایی مراجع</span>
              </BaseParagraph>
            </div>
            <div class="mt-6">
              <div v-if="report.possibleDeeperGoals.length > 0" class="space-y-4">
                <div
                  v-for="(goal, idx) in visibleDeeperGoals"
                  :key="idx"
                  class="group relative"
                >
                  <BaseCard
                    shape="rounded"
                    class="border-success-100 dark:border-success-500/20 border-2 p-4 transition-all duration-300 hover:shadow-lg"
                  >
                    <div class="flex w-full items-start gap-3">
                      <div class="bg-success-500/10 dark:bg-success-500/20 rounded-lg p-2">
                        <Icon name="ph:target-duotone" class="text-success-500 size-5" />
                      </div>
                      <div class="flex-1">
                        <BaseText size="xs" class="text-muted-600">
                          {{ goal }}
                        </BaseText>
                      </div>
                    </div>
                  </BaseCard>
                </div>
                <!-- Show More Button for Deeper Goals -->
                <div v-if="report.possibleDeeperGoals.length > visibleDeeperGoalsCount" class="mt-4 text-center">
                  <BaseButton
                    color="primary"
                    size="sm"
                    class="mx-auto"
                    @click="showMoreDeeperGoals"
                  >
                    نمایش بیشتر ({{ report.possibleDeeperGoals.length - visibleDeeperGoalsCount }} مورد دیگر)
                  </BaseButton>
                </div>
              </div>
              <div v-else class="text-center">
                <Icon name="ph:target-duotone" class="text-muted-400 mb-2 size-12" />
                <BaseText size="sm" class="text-muted-400">
                  در حال حاضر هدفی ثبت نشده است.
                </BaseText>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Possible Risk Factors Card -->
        <div class="col-span-12 mt-4 lg:col-span-6">
          <BaseCard class="h-full p-6" shape="curved">
            <div class="mb-2 flex items-center justify-between">
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>عوامل خطر احتمالی</span>
              </BaseHeading>
              <BaseButton
                v-if="report.possibleRiskFactors.length > 0"
                color="danger"
                size="sm"
                class="ms-2"
                @click="openDeleteAllRiskFactorsModal"
              >
                <Icon name="ph:trash-duotone" class="ms-1 size-4" /> حذف همه
              </BaseButton>
            </div>
            <div class="flex justify-between">
              <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                <Icon name="ph:warning-circle-duotone" class="size-4" />
                <span>عوامل خطر شناسایی شده در جلسات</span>
              </BaseParagraph>
            </div>
            <div class="mt-6">
              <div v-if="report.possibleRiskFactors.length > 0" class="space-y-4">
                <div
                  v-for="(group, idx) in visibleRiskFactors"
                  :key="idx"
                  class="space-y-4"
                >
                  <div
                    v-for="(risk, j) in group"
                    :key="j"
                    class="group relative"
                  >
                    <BaseCard
                      shape="rounded"
                      class="border-danger-100 dark:border-danger-500/20 border-2 p-4 transition-all duration-300 hover:shadow-lg"
                    >
                      <div class="flex w-full items-start gap-3">
                        <div class="bg-danger-500/10 dark:bg-danger-500/20 rounded-lg p-2">
                          <Icon name="ph:warning-circle-duotone" class="text-danger-500 size-5" />
                        </div>
                        <div class="flex-1">
                          <BaseHeading
                            as="h4"
                            size="sm"
                            weight="medium"
                            lead="none"
                            class="text-danger-500 mb-3"
                          >
                            {{ risk.title }}
                          </BaseHeading>
                          <BaseText size="xs" class="text-muted-600">
                            {{ risk.description }}
                          </BaseText>
                        </div>
                      </div>
                    </BaseCard>
                  </div>
                </div>
                <!-- Show More Button for Risk Factors -->
                <div v-if="report.possibleRiskFactors.length > visibleRiskFactorsCount" class="mt-4 text-center">
                  <BaseButton
                    color="primary"
                    size="sm"
                    class="mx-auto"
                    @click="showMoreRiskFactors"
                  >
                    نمایش بیشتر ({{ report.possibleRiskFactors.length - visibleRiskFactorsCount }} مورد دیگر)
                  </BaseButton>
                </div>
              </div>
              <div v-else class="text-center">
                <Icon name="ph:warning-circle-duotone" class="text-muted-400 mb-2 size-12" />
                <BaseText size="sm" class="text-muted-400">
                  در حال حاضر عامل خطری شناسایی نشده است.
                </BaseText>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
definePageMeta({
  title: 'گزارش نهایی',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const isLoading = ref(true)
const hasData = ref(true)
const report = ref({
  collectionId: '',
  collectionName: '',
  created: '',
  finalDemographicProfile: {
    age: null,
    education: null,
    firstName: null,
    gender: null,
    lastName: null,
    maritalStatus: null,
    occupation: null,
  },
  id: '',
  possibleDeeperGoals: [],
  possibleRiskFactors: [],
  summaries: [],
  totalSessions: 0,
  updated: '',
  user: '',
})

const router = useRouter()
const route = useRoute()
const { getReportByUserId, updateReport } = useReport()
const nuxtApp = useNuxtApp()
const { user, role } = useUser()

// Batching state
const visibleCount = ref(5)
const visibleDeeperGoalsCount = ref(5)
const visibleRiskFactorsCount = ref(5)

// Computed property for visible deeper goals
const visibleDeeperGoals = computed(() => {
  return [...(report.value.possibleDeeperGoals || [])].slice(0, visibleDeeperGoalsCount.value)
})

// Computed property for visible risk factors
const visibleRiskFactors = computed(() => {
  return [...(report.value.possibleRiskFactors || [])].slice(0, visibleRiskFactorsCount.value)
})

// Show more items for deeper goals
function showMoreDeeperGoals() {
  visibleDeeperGoalsCount.value += 5
}

// Show more items for risk factors
function showMoreRiskFactors() {
  visibleRiskFactorsCount.value += 5
}

// Delete modal state
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const summaryToDelete = ref(null)
const summaryIndexToDelete = ref(-1)

// Delete all deeper goals modal state
const isDeleteAllDeeperGoalsModalOpen = ref(false)
const isDeletingAllDeeperGoals = ref(false)

// Delete all risk factors modal state
const isDeleteAllRiskFactorsModalOpen = ref(false)
const isDeletingAllRiskFactors = ref(false)

// Computed property for visible summaries (reversed and limited)
const visibleSummaries = computed(() => {
  // Create a new array to avoid mutating the original
  const reversed = [...(report.value.summaries || [])].reverse()
  return reversed.slice(0, visibleCount.value)
})

// Show more items
function showMore() {
  visibleCount.value += 5
}

const toaster = useToaster()

// Demographic profile edit state
const isEditingDemographic = ref(false)
const isSavingDemographic = ref(false)
const editDemographicProfile = reactive({
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  education: '',
  occupation: '',
  maritalStatus: '',
})

watch(
  () => report.value.finalDemographicProfile,
  (profile) => {
    if (!isEditingDemographic.value && profile) {
      Object.assign(editDemographicProfile, profile)
    }
  },
  { immediate: true },
)

function enableEditDemographic() {
  isEditingDemographic.value = true
  // Initialize with existing data or empty strings
  const profile = report.value.finalDemographicProfile || {}
  editDemographicProfile.firstName = profile.firstName || ''
  editDemographicProfile.lastName = profile.lastName || ''
  editDemographicProfile.age = profile.age || ''
  editDemographicProfile.gender = profile.gender || ''
  editDemographicProfile.education = profile.education || ''
  editDemographicProfile.occupation = profile.occupation || ''
  editDemographicProfile.maritalStatus = profile.maritalStatus || ''
}

function cancelEditDemographic() {
  isEditingDemographic.value = false
  Object.assign(editDemographicProfile, report.value.finalDemographicProfile || {})
}

async function saveDemographicProfile() {
  isSavingDemographic.value = true
  try {
    await updateReport(report.value.id, {
      finalDemographicProfile: { ...editDemographicProfile },
    })
    report.value.finalDemographicProfile = { ...editDemographicProfile }
    isEditingDemographic.value = false
    toaster.clearAll()
    toaster.show({
      title: 'ذخیره موفق',
      message: 'اطلاعات دموگرافیک با موفقیت ذخیره شد',
      color: 'success',
      icon: 'ph:user-circle-fill',
      closable: true,
    })
  }
  catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در ذخیره اطلاعات دموگرافیک',
      color: 'danger',
      icon: 'ph:warning-circle-duotone',
      closable: true,
    })
  }
  finally {
    isSavingDemographic.value = false
  }
}

// Check if current user is admin
const isAdmin = computed(() => role.value === 'admin')

// Get target user ID from query params or use current user
const targetUserId = computed(() => {
  const queryUserId = Array.isArray(route.query.userId)
    ? route.query.userId[0]
    : route.query.userId

  return queryUserId || nuxtApp.$pb.authStore.model?.id
})
// For demo, we'll simulate data fetching with a timeout

// Function to fetch reports
async function fetchReport() {
  isLoading.value = true

  try {
    // Check if user is trying to access another user's report without admin rights
    const queryUserId = Array.isArray(route.query.userId)
      ? route.query.userId[0]
      : route.query.userId

    if (queryUserId && !isAdmin.value) {
      // Non-admin trying to access another user's report - redirect to their own report
      router.push('/report')
      return
    }

    // If no user ID is available
    if (!targetUserId.value) {
      hasData.value = false
      return
    }

    // Get report for the target user
    const userReport = await getReportByUserId(targetUserId.value)

    if (userReport) {
      report.value = userReport
      hasData.value = true
    }
    else {
      hasData.value = false
    }
  }
  catch (error) {
    console.error('Error fetching report:', error)
    hasData.value = false
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchReport()
})

// Reset visible counts when data changes
watch(() => report.value.summaries, () => {
  visibleCount.value = 5
})

watch(() => report.value.possibleDeeperGoals, () => {
  visibleDeeperGoalsCount.value = 5
})

watch(() => report.value.possibleRiskFactors, () => {
  visibleRiskFactorsCount.value = 5
}, { immediate: false })

function startNewSession() {
  // Navigate to the session creation page
  router.push('/darmana/therapists/sessions')
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)

  // Format date and time separately and combine with dash
  const dateOnly = d.toLocaleDateString('fa-IR', { dateStyle: 'short' })
  const timeOnly = d.toLocaleTimeString('fa-IR', { timeStyle: 'short' })

  return `${dateOnly}-${timeOnly}`
}

// Open the delete confirmation modal
function openDeleteModal(index: number, summary: any) {
  summaryIndexToDelete.value = index
  summaryToDelete.value = summary
  isDeleteModalOpen.value = true
}

// Open the delete all deeper goals confirmation modal
function openDeleteAllDeeperGoalsModal() {
  isDeleteAllDeeperGoalsModalOpen.value = true
}

// Open the delete all risk factors confirmation modal
function openDeleteAllRiskFactorsModal() {
  isDeleteAllRiskFactorsModalOpen.value = true
}

// Confirm deletion of summary
async function confirmDelete() {
  if (summaryIndexToDelete.value < 0 || !summaryToDelete.value) return

  isDeleting.value = true

  try {
    // Create a copy of summaries array
    const updatedSummaries = [...report.value.summaries]

    // Remove the selected summary
    updatedSummaries.splice(summaryIndexToDelete.value, 1)

    // Update the report with the new summaries array
    const updatedReport = {
      ...report.value,
      summaries: updatedSummaries,
    }

    // Save to database
    await updateReport(report.value.id, { summaries: updatedSummaries })

    // Update local state
    report.value = updatedReport

    // Close modal
    isDeleteModalOpen.value = false

    // Show success notification
    toaster.clearAll()
    toaster.show({
      title: 'حذف موفق',
      message: 'خلاصه با موفقیت حذف شد',
      color: 'success',
      icon: 'ph:trash-duotone',
      closable: true,
    })
  }
  catch (error) {
    console.error('Error deleting summary:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در حذف خلاصه',
      color: 'danger',
      icon: 'ph:warning-circle-duotone',
      closable: true,
    })
  }
  finally {
    isDeleting.value = false
    summaryIndexToDelete.value = -1
    summaryToDelete.value = null
  }
}

// Confirm deletion of all deeper goals
async function confirmDeleteAllDeeperGoals() {
  isDeletingAllDeeperGoals.value = true

  try {
    // Update the report with empty deeper goals array
    await updateReport(report.value.id, { possibleDeeperGoals: [] })

    // Update local state
    report.value.possibleDeeperGoals = []

    // Close modal
    isDeleteAllDeeperGoalsModalOpen.value = false

    // Show success notification
    toaster.clearAll()
    toaster.show({
      title: 'حذف موفق',
      message: 'تمامی اهداف عمیق‌تر با موفقیت حذف شدند',
      color: 'success',
      icon: 'ph:trash-duotone',
      closable: true,
    })
  }
  catch (error) {
    console.error('Error deleting all deeper goals:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در حذف اهداف عمیق‌تر',
      color: 'danger',
      icon: 'ph:warning-circle-duotone',
      closable: true,
    })
  }
  finally {
    isDeletingAllDeeperGoals.value = false
  }
}

// Confirm deletion of all risk factors
async function confirmDeleteAllRiskFactors() {
  isDeletingAllRiskFactors.value = true

  try {
    // Update the report with empty risk factors array
    await updateReport(report.value.id, { possibleRiskFactors: [] })

    // Update local state
    report.value.possibleRiskFactors = []

    // Close modal
    isDeleteAllRiskFactorsModalOpen.value = false

    // Show success notification
    toaster.clearAll()
    toaster.show({
      title: 'حذف موفق',
      message: 'تمامی عوامل خطر احتمالی با موفقیت حذف شدند',
      color: 'success',
      icon: 'ph:trash-duotone',
      closable: true,
    })
  }
  catch (error) {
    console.error('Error deleting all risk factors:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در حذف عوامل خطر احتمالی',
      color: 'danger',
      icon: 'ph:warning-circle-duotone',
      closable: true,
    })
  }
  finally {
    isDeletingAllRiskFactors.value = false
  }
}
</script>

<style scoped>
/* Optional: custom styles for RTL and better appearance */
[dir="rtl"] .list-disc { padding-right: 1.5rem; }

</style>
