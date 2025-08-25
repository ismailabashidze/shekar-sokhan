<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  title: 'ثبت بار جدید',
  layout: 'sidebar',
})

useHead({
  title: 'ثبت بار جدید | با هم',
  htmlAttrs: { dir: 'rtl' },
})

// Form steps
const currentStep = ref(1)
const totalSteps = ref(3)

// Form data
const formData = reactive({
  // Step 1: Basic Information
  productName: '',
  productCategory: '',
  totalQuantityKg: 0,
  pricePerKg: 0,
  
  // Step 2: Delivery Information
  availabilityDate: '',
  expiryDate: '',
  deliveryRegion: '',
  
  // Step 3: Preview
  // All data from previous steps
})

const router = useRouter()

// Mock product categories
const categories = [
  { id: 'vegetables', name: 'صیفی‌جات' },
  { id: 'fruits', name: 'میوه‌ها' },
  { id: 'herbs', name: 'سبزیجات' },
  { id: 'nuts', name: 'خشکبار' }
]

// Mock regions
const regions = [
  { id: 'tehran', name: 'تهران' },
  { id: 'esfahan', name: 'اصفهان' },
  { id: 'mashhad', name: 'مشهد' },
  { id: 'tabriz', name: 'تبریز' }
]

// Navigation functions
const nextStep = () => {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const submitForm = () => {
  // In a real app, this would send data to the server
  console.log('Form submitted:', formData)
  // Redirect to loads list after submission
  router.push('/baham/provider/loads')
}

// Validation functions
const isStep1Valid = () => {
  return formData.productName && formData.productCategory && 
         formData.totalQuantityKg > 0 && formData.pricePerKg > 0
}

const isStep2Valid = () => {
  return formData.availabilityDate && formData.expiryDate && formData.deliveryRegion
}
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseHeading as="h1" size="xl" weight="medium">
          ثبت بار جدید
        </BaseHeading>
        <BaseText size="sm" class="text-muted-400 mt-1">
          ثبت بار جدید برای فروش در پلتفرم
        </BaseText>
      </template>
      
      <template #right>
        <BaseButton 
          @click="$router.back()" 
          color="muted" 
          variant="pastel"
        >
          <Icon name="ph:x" class="size-4" />
          <span>بستن</span>
        </BaseButton>
      </template>
      
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between relative">
          <div class="absolute top-1/2 left-0 right-0 h-1 bg-muted-200 dark:bg-muted-700 -z-10"></div>
          <div 
            class="absolute top-1/2 left-0 h-1 bg-primary-500 -z-10 transition-all duration-300"
            :style="{ width: `${(currentStep - 1) * 50}%` }"
          ></div>
          
          <div 
            v-for="step in totalSteps" 
            :key="step"
            class="flex flex-col items-center relative z-10"
          >
            <div 
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep === step 
                  ? 'bg-primary-500 text-white' 
                  : step < currentStep 
                    ? 'bg-success-500 text-white' 
                    : 'bg-white dark:bg-muted-800 border-2 border-muted-300 dark:border-muted-600 text-muted-500'
              ]"
            >
              <Icon 
                v-if="step < currentStep" 
                name="ph:check" 
                class="size-5" 
              />
              <span v-else>{{ step }}</span>
            </div>
            <span class="mt-2 text-xs text-muted-500 dark:text-muted-400">
              <template v-if="step === 1">اطلاعات پایه</template>
              <template v-if="step === 2">اطلاعات تحویل</template>
              <template v-if="step === 3">پیش‌نمایش</template>
            </span>
          </div>
        </div>
      </div>
      
      <!-- Step 1: Basic Information -->
      <TairoFormGroup v-if="currentStep === 1">
        <template #label>
          <BaseHeading as="h2" size="lg" weight="medium">
            مرحله ۱: اطلاعات پایه
          </BaseHeading>
          <BaseText size="sm" class="text-muted-400 mt-1">
            اطلاعات اصلی بار را وارد کنید
          </BaseText>
        </template>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            v-model="formData.productName"
            label="نام محصول"
            placeholder="مثال: سیب زمینی مرغوب"
            icon="ph:package"
            :classes="{
              wrapper: 'w-full'
            }"
          />
          
          <BaseSelect
            v-model="formData.productCategory"
            label="دسته‌بندی"
            icon="ph:tag"
            :classes="{
              wrapper: 'w-full'
            }"
          >
            <option value="">انتخاب دسته‌بندی</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </BaseSelect>
          
          <BaseInput
            v-model.number="formData.totalQuantityKg"
            label="مقدار کل (کیلوگرم)"
            type="number"
            placeholder="مثال: 1000"
            icon="ph:scale"
            :classes="{
              wrapper: 'w-full'
            }"
          />
          
          <BaseInput
            v-model.number="formData.pricePerKg"
            label="قیمت هر کیلو (تومان)"
            type="number"
            placeholder="مثال: 5000"
            icon="ph:currency-circle-dollar"
            :classes="{
              wrapper: 'w-full'
            }"
          />
        </div>
        
        <div class="flex justify-between mt-8">
          <BaseButton 
            @click="$router.back()" 
            color="muted" 
            variant="pastel"
          >
            انصراف
          </BaseButton>
          <BaseButton 
            @click="nextStep" 
            :disabled="!isStep1Valid()"
            color="primary" 
            variant="solid"
            :class="!isStep1Valid() ? 'opacity-50 cursor-not-allowed' : ''"
          >
            مرحله بعد
            <Icon name="ph:arrow-right" class="size-4" />
          </BaseButton>
        </div>
      </TairoFormGroup>
      
      <!-- Step 2: Delivery Information -->
      <TairoFormGroup v-if="currentStep === 2">
        <template #label>
          <BaseHeading as="h2" size="lg" weight="medium">
            مرحله ۲: اطلاعات تحویل
          </BaseHeading>
          <BaseText size="sm" class="text-muted-400 mt-1">
            زمان و مکان تحویل بار را مشخص کنید
          </BaseText>
        </template>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            v-model="formData.availabilityDate"
            label="تاریخ آماده‌سازی"
            type="date"
            icon="ph:calendar"
            :classes="{
              wrapper: 'w-full'
            }"
          />
          
          <BaseInput
            v-model="formData.expiryDate"
            label="تاریخ انقضا"
            type="date"
            icon="ph:hourglass"
            :classes="{
              wrapper: 'w-full'
            }"
          />
          
          <div class="md:col-span-2">
            <BaseSelect
              v-model="formData.deliveryRegion"
              label="منطقه تحویل"
              icon="ph:map-pin"
              :classes="{
                wrapper: 'w-full'
              }"
            >
              <option value="">انتخاب منطقه</option>
              <option v-for="region in regions" :key="region.id" :value="region.id">
                {{ region.name }}
              </option>
            </BaseSelect>
          </div>
        </div>
        
        <div class="flex justify-between mt-8">
          <BaseButton 
            @click="prevStep" 
            color="muted" 
            variant="pastel"
          >
            <Icon name="ph:arrow-left" class="size-4" />
            مرحله قبل
          </BaseButton>
          <BaseButton 
            @click="nextStep" 
            :disabled="!isStep2Valid()"
            color="primary" 
            variant="solid"
            :class="!isStep2Valid() ? 'opacity-50 cursor-not-allowed' : ''"
          >
            مرحله بعد
            <Icon name="ph:arrow-right" class="size-4" />
          </BaseButton>
        </div>
      </TairoFormGroup>
      
      <!-- Step 3: Preview and Publish -->
      <TairoFormGroup v-if="currentStep === 3">
        <template #label>
          <BaseHeading as="h2" size="lg" weight="medium">
            مرحله ۳: پیش‌نمایش و انتشار
          </BaseHeading>
          <BaseText size="sm" class="text-muted-400 mt-1">
            اطلاعات وارد شده را بررسی کنید
          </BaseText>
        </template>
        
        <BaseCard rounded="sm" class="p-6 mb-6">
          <BaseHeading as="h3" size="md" weight="medium" class="mb-4">
            اطلاعات بار
          </BaseHeading>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
                نام محصول
              </BaseText>
              <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
                {{ formData.productName }}
              </BaseHeading>
            </div>
            
            <div>
              <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
                دسته‌بندی
              </BaseText>
              <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
                {{ categories.find(c => c.id === formData.productCategory)?.name || '-' }}
              </BaseHeading>
            </div>
            
            <div>
              <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
                مقدار کل
              </BaseText>
              <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
                {{ formData.totalQuantityKg }} کیلوگرم
              </BaseHeading>
            </div>
            
            <div>
              <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
                قیمت هر کیلو
              </BaseText>
              <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
                {{ formData.pricePerKg.toLocaleString('fa-IR') }} تومان
              </BaseHeading>
            </div>
            
            <div>
              <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
                تاریخ آماده‌سازی
              </BaseText>
              <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
                {{ formData.availabilityDate || '-' }}
              </BaseHeading>
            </div>
            
            <div>
              <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
                تاریخ انقضا
              </BaseText>
              <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
                {{ formData.expiryDate || '-' }}
              </BaseHeading>
            </div>
            
            <div class="md:col-span-2">
              <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
                منطقه تحویل
              </BaseText>
              <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
                {{ regions.find(r => r.id === formData.deliveryRegion)?.name || '-' }}
              </BaseHeading>
            </div>
          </div>
        </BaseCard>
        
        <BaseMessage color="info" class="mb-6">
          <Icon name="ph:info" class="size-5" />
          <div class="ms-2">
            <BaseHeading as="h4" size="sm" weight="medium">
              نکته مهم
            </BaseHeading>
            <BaseText size="sm">
              پس از انتشار، این بار در بازار برای خریداران قابل مشاهده خواهد بود. 
              می‌توانید در هر زمان قبل از انقضا بار را ویرایش یا حذف کنید.
            </BaseText>
          </div>
        </BaseMessage>
        
        <div class="flex justify-between">
          <BaseButton 
            @click="prevStep" 
            color="muted" 
            variant="pastel"
          >
            <Icon name="ph:arrow-left" class="size-4" />
            مرحله قبل
          </BaseButton>
          <div class="flex gap-3">
            <BaseButton 
              @click="$router.push('/baham/provider/loads')" 
              color="muted" 
              variant="pastel"
            >
              ذخیره پیش‌نویس
            </BaseButton>
            <BaseButton 
              @click="submitForm" 
              color="success" 
              variant="solid"
            >
              <Icon name="ph:check" class="size-4" />
              انتشار بار
            </BaseButton>
          </div>
        </div>
      </TairoFormGroup>
    </TairoContentWrapper>
  </div>
</template>