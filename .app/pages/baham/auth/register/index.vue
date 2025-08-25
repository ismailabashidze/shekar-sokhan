<script setup lang="ts">
definePageMeta({
  title: 'ثبت نام - با هم',
  layout: 'empty'
})

useHead({
  title: 'ثبت نام - با هم',
  meta: [
    { name: 'description', content: 'ثبت نام در پلتفرم با هم' }
  ]
})

const roles = [
  { 
    id: 'buyer', 
    name: 'خریدار', 
    icon: 'ph:shopping-cart-duotone',
    description: 'محصولات تازه و با کیفیت را با قیمت مناسب بخرید',
    color: 'primary'
  },
  { 
    id: 'distributor', 
    name: 'توزیع‌کننده', 
    icon: 'ph:truck-duotone',
    description: 'به عنوان واسطه بین تولیدکنندگان و مصرف‌کنندگان فعالیت کنید',
    color: 'success'
  },
  { 
    id: 'provider', 
    name: 'ارائه‌دهنده', 
    icon: 'ph:plant-duotone',
    description: 'محصولات خود را به بازار عرضه کنید',
    color: 'info'
  }
]
</script>

<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted-100 dark:bg-muted-900">
    <div class="sm:mx-auto sm:w-full sm:max-w-4xl">
      <div class="flex justify-center mb-8">
        <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-20 items-center justify-center">
          <Icon name="ph:user-plus-duotone" class="text-primary-500 size-10" />
        </div>
      </div>
      <BaseHeading
        tag="h1"
        size="3xl"
        weight="bold"
        lead="tight"
        class="text-center text-muted-800 dark:text-white mb-4"
      >
        ایجاد حساب کاربری
      </BaseHeading>
      <BaseParagraph size="lg" class="text-center text-muted-600 dark:text-muted-300 mb-16">
        نقش خود را برای ثبت نام انتخاب کنید
      </BaseParagraph>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <BaseCard 
          v-for="role in roles" 
          :key="role.id"
          rounded="xl" 
          elevated
          class="dark:!bg-muted-900 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer text-center border border-muted-200 dark:border-muted-800 flex flex-col h-full"
          @click="$router.push(`/baham/auth/register/${role.id}`)"
        >
          <div class="flex justify-center mb-6">
            <div 
              :class="`nui-mask nui-mask-hexed bg-${role.color}-500/10 flex size-20 items-center justify-center`"
            >
              <Icon 
                :name="role.icon" 
                :class="`text-${role.color}-500 size-10`" 
              />
            </div>
          </div>
          <BaseHeading tag="h3" size="xl" weight="semibold" class="mb-4">
            {{ role.name }}
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-8 leading-relaxed flex-grow">
            {{ role.description }}
          </BaseParagraph>
          <BaseButton 
            :color="role.color" 
            size="lg"
            class="w-full py-3"
            @click.stop="$router.push(`/baham/auth/register/${role.id}`)"
          >
            ثبت نام {{ role.name }}
          </BaseButton>
        </BaseCard>
      </div>
      
      <div class="mt-12">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-muted-200 dark:border-muted-700" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-muted-100 dark:bg-muted-900 px-4 py-1 text-muted-500 dark:text-muted-400 rounded-full">
              یا
            </span>
          </div>
        </div>

        <div class="mt-8">
          <BaseParagraph size="sm" class="text-center text-muted-600 dark:text-muted-400">
            قبلاً حساب کاربری دارید؟
            <NuxtLink to="/baham/auth/login" class="font-medium text-primary-600 hover:text-primary-500 underline">
              ورود به حساب کاربری
            </NuxtLink>
          </BaseParagraph>
        </div>
      </div>
    </div>
  </div>
</template>