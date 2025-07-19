<script setup lang="ts">
import type { Clinic } from '~/types/wizard'

definePageMeta({
  title: 'مشاوران کلینیک',
  layout: 'sidebar',
})

useHead({
  title: 'مشاوران کلینیک',
  htmlAttrs: { dir: 'rtl' },
})

const route = useRoute()
const router = useRouter()
const toaster = useToaster()

const clinicId = route.params.id as string

const { data: clinic } = await useFetch<{ data: Clinic }>(`/api/clinics/${clinicId}`)
const { data: psychologists, pending, error, refresh } = await useFetch(`/api/clinics/${clinicId}/psychologists`)

const showAddModal = ref(false)
const addingPsychologist = ref(false)
const selectedPsychologistId = ref('')

const { data: allPsychologists } = await useFetch('/api/psychotherapists')

const availablePsychologists = computed(() => {
  const existingIds = psychologists.value?.data?.map(p => p.expand?.psychologist?.id) || []
  return allPsychologists.value?.data?.filter(p => !existingIds.includes(p.id)) || []
})

async function addPsychologist() {
  if (!selectedPsychologistId.value) return
  
  addingPsychologist.value = true
  
  try {
    await $fetch(`/api/clinics/${clinicId}/psychologists`, {
      method: 'POST',
      body: {
        psychologistId: selectedPsychologistId.value,
        role: 'member'
      }
    })
    
    toaster.show({
      title: 'افزودن موفق',
      message: 'مشاور با موفقیت به کلینیک اضافه شد',
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
    
    showAddModal.value = false
    selectedPsychologistId.value = ''
    await refresh()
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در افزودن مشاور',
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  } finally {
    addingPsychologist.value = false
  }
}

async function removePsychologist(psychologistId: string) {
  if (!confirm('آیا مطمئن هستید که می‌خواهید این مشاور را از کلینیک حذف کنید؟')) {
    return
  }
  
  try {
    await $fetch(`/api/clinics/${clinicId}/psychologists/${psychologistId}`, {
      method: 'DELETE'
    })
    
    toaster.show({
      title: 'حذف موفق',
      message: 'مشاور از کلینیک حذف شد',
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
    
    await refresh()
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در حذف مشاور',
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  }
}

function getRoleLabel(role: string) {
  switch (role) {
    case 'owner': return 'مالک'
    case 'member': return 'عضو'
    default: return 'نامشخص'
  }
}

function getRoleColor(role: string) {
  switch (role) {
    case 'owner': return 'primary'
    case 'member': return 'success'
    default: return 'muted'
  }
}
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <div>
          <BaseHeading
            as="h1"
            size="3xl"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>مشاوران کلینیک</span>
          </BaseHeading>
          <BaseParagraph v-if="clinic?.data" class="text-muted-500 mt-2">
            {{ clinic.data.name }}
          </BaseParagraph>
        </div>
      </template>
      
      <template #right>
        <div class="flex gap-2">
          <BaseButton
            to="/clinic/dashboard"
            color="muted"
            class="w-full sm:w-auto"
          >
            <Icon name="lucide:arrow-right" class="ml-2 size-4" />
            <span>بازگشت</span>
          </BaseButton>
          
          <BaseButton
            color="primary"
            class="w-full sm:w-auto"
            @click="showAddModal = true"
          >
            <Icon name="lucide:plus" class="ml-2 size-4" />
            <span>افزودن مشاور</span>
          </BaseButton>
        </div>
      </template>

      <div v-if="pending" class="flex justify-center py-20">
        <BaseLoader size="xl" />
      </div>

      <div v-else-if="error" class="text-center py-20">
        <BasePlaceholderPage
          title="خطا در بارگذاری"
          subtitle="خطا در بارگذاری لیست مشاوران"
        />
      </div>

      <div v-else class="space-y-4">
        <div v-if="!psychologists?.data?.length">
          <BaseCard rounded="lg" class="p-8 text-center">
            <BasePlaceholderPage
              title="مشاوری یافت نشد"
              subtitle="هنوز مشاوری به این کلینیک اضافه نشده است"
            >
              <template #action>
                <BaseButton
                  color="primary"
                  rounded="lg"
                  @click="showAddModal = true"
                >
                  <Icon name="lucide:plus" class="ml-2 size-4" />
                  <span>افزودن مشاور</span>
                </BaseButton>
              </template>
            </BasePlaceholderPage>
          </BaseCard>
        </div>

        <div v-else>
          <BaseCard
            v-for="item in psychologists.data"
            :key="item.id"
            rounded="lg"
            class="p-6"
          >
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div class="flex items-center gap-4">
                <BaseAvatar
                  size="lg"
                  :src="item.expand?.psychologist?.avatar"
                  :text="item.expand?.psychologist?.name"
                />
                
                <div>
                  <BaseHeading
                    as="h3"
                    size="lg"
                    weight="semibold"
                    class="text-muted-800 dark:text-muted-100"
                  >
                    {{ item.expand?.psychologist?.name || 'نام نامشخص' }}
                  </BaseHeading>
                  
                  <div class="flex items-center gap-2 mt-1">
                    <BaseTag
                      :color="getRoleColor(item.role)"
                      variant="pastel"
                      rounded="full"
                      size="sm"
                    >
                      {{ getRoleLabel(item.role) }}
                    </BaseTag>
                    
                    <BaseParagraph class="text-muted-500 text-sm">
                      عضو از {{ new Date(item.created).toLocaleDateString('fa-IR') }}
                    </BaseParagraph>
                  </div>
                </div>
              </div>
              
              <div class="flex gap-2 mt-4 lg:mt-0">
                <BaseButton
                  :to="`/darmana/patients/${item.expand?.psychologist?.id}`"
                  color="muted"
                  size="sm"
                  rounded="lg"
                >
                  <Icon name="lucide:eye" class="size-4" />
                  <span>مشاهده</span>
                </BaseButton>
                
                <BaseButton
                  v-if="item.role !== 'owner'"
                  color="danger"
                  variant="outline"
                  size="sm"
                  rounded="lg"
                  @click="removePsychologist(item.psychologist)"
                >
                  <Icon name="lucide:trash-2" class="size-4" />
                  <span>حذف</span>
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </TairoContentWrapper>

    <!-- Add Psychologist Modal -->
    <TairoModal
      :open="showAddModal"
      size="sm"
      @close="showAddModal = false"
    >
      <template #header>
        <div class="flex w-full items-center justify-between p-4 md:p-6">
          <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
            افزودن مشاور جدید
          </h3>
          <BaseButtonClose @click="showAddModal = false" />
        </div>
      </template>

      <div class="p-4 md:p-6">
        <div class="mx-auto w-full max-w-xs">
          <BaseSelect
            v-model="selectedPsychologistId"
            label="انتخاب مشاور"
            placeholder="مشاور را انتخاب کنید"
            :options="availablePsychologists.map(p => ({ value: p.id, label: p.name }))"
            required
          />
        </div>
      </div>

      <template #footer>
        <div class="p-4 md:p-6">
          <div class="flex gap-x-2">
            <BaseButton
              color="primary"
              :loading="addingPsychologist"
              :disabled="!selectedPsychologistId || addingPsychologist"
              @click="addPsychologist"
            >
              افزودن
            </BaseButton>
            <BaseButton
              color="muted"
              @click="showAddModal = false"
            >
              انصراف
            </BaseButton>
          </div>
        </div>
      </template>
    </TairoModal>
  </div>
</template>