<script setup lang="ts">
import { User } from '~/composables/user'

definePageMeta({
  title: 'لیست مشاوره ها',
  layout: 'sidebar',
  preview: {
    title: 'لیست مشاوره ها',
    description: 'لیستی از گفت و گوهای انجام شده و در حال انجام در سامانه',
    categories: ['layouts', 'lists'],
    src: '/img/screens/layouts-list-flex-1.png',
    srcDark: '/img/screens/layouts-list-flex-1-dark.png',
    order: 41,
  },
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const selected = ref([])
const selectAll = ref(false)
const users = ref<User[]>([])
const { user, getAllUsers, removeUser } = useUser()
const toaster = useToaster()
users.value = await getAllUsers()
const selectedToRemove = ref()
const isRemoveModalOpen = ref(false)
const removeLoading = ref(false)

const goToConversation = (u: User) => {
  user.value = u
  navigateTo('/mani/chat-llm')
}
const goToChart = (u: User) => {
  user.value = u
  navigateTo(`/mani/analysis?code=${u.anonymousCode}`)
}

function closeRemoveModal() {
  isRemoveModalOpen.value = false
}
function openRemoveModal(u: User) {
  selectedToRemove.value = u
  isRemoveModalOpen.value = true
}
async function removeConversation() {
  removeLoading.value = true

  await removeUser(selectedToRemove.value.id)
  removeLoading.value = false
  closeRemoveModal()
  toaster.show({
    title: 'حذف گفت و گو',
    message: 'گفت و گو با موفقیت حذف شد',
    color: 'success',
    icon: 'lucide:check',
    closable: true,
  })
  users.value = await getAllUsers()
}
</script>

<template>
  <TairoFlexTable>
    <template #header>
      <TairoFlexTableHeading type="shrink">
        <div class="flex items-center">
          <BaseCheckbox
            v-model="selectAll"
            shape="rounded"
            class="text-primary-500"
          />
        </div>
      </TairoFlexTableHeading>

      <TairoFlexTableHeading type="stable">آواتار</TairoFlexTableHeading>
      <TairoFlexTableHeading type="stable">کد اختصاصی</TairoFlexTableHeading>

      <TairoFlexTableHeading type="stable">شناسه</TairoFlexTableHeading>

      <TairoFlexTableHeading type="stable">تاریخ عضویت</TairoFlexTableHeading>

      <TairoFlexTableHeading style="width: 150px" type="stable"
        >اقدامات</TairoFlexTableHeading
      >
    </template>

    <TairoFlexTableRow v-for="u in users" :key="u.id" shape="rounded">
      <TairoFlexTableCell type="shrink" data-content="Selection">
        <div class="flex items-center">
          <BaseCheckbox
            v-model="selected"
            :value="`checkbox-${u.id}`"
            shape="rounded"
            class="text-primary-500"
          />
        </div>
      </TairoFlexTableCell>

      <TairoFlexTableCell type="stable" data-content="u">
        <div class="flex items-center">
          <BaseAvatar
            :src="`/img/avatars/${(u.anonymousCode % 8) + 1}.svg`"
            size="sm"
          />

          <!-- <div class="ms-3 leading-none">
            <h4 class="font-sans text-sm font-medium">
              {{ u.anonymousCode }}
            </h4>

            <p class="text-muted-400 font-sans text-xs font-normal">
              {{ u.role }}
            </p>
          </div> -->
        </div>
      </TairoFlexTableCell>

      <TairoFlexTableCell type="stable" data-content="Expertise" light>
        {{ u.anonymousCode }}
      </TairoFlexTableCell>

      <TairoFlexTableCell type="stable" data-content="Rate">
        <span class="font-medium">${{ u.id }}</span>
      </TairoFlexTableCell>
      <TairoFlexTableCell type="stable" data-content="Rate">
        <span class="font-medium">{{
          new Date(u.created).toLocaleDateString('fa')
        }}</span>
      </TairoFlexTableCell>
      <!-- <TairoFlexTableCell type="stable" data-content="Status">
        <BaseTag
          v-if="u.status === 'Available'"
          color="success"
          flavor="pastel"
          shape="full"
          class="font-medium"
        >
          {{ u.status }}
        </BaseTag>

        <BaseTag
          v-else-if="u.status === 'New'"
          color="info"
          flavor="pastel"
          shape="full"
          class="font-medium"
        >
          {{ u.status }}
        </BaseTag>

        <BaseTag
          v-else-if="u.status === 'Hired'"
          color="warning"
          flavor="pastel"
          shape="full"
          class="font-medium"
        >
          {{ u.status }}
        </BaseTag>
      </TairoFlexTableCell> -->

      <TairoFlexTableCell
        style="width: 150px"
        type="stable"
        data-content="Actions"
      >
        <div class="flex scale-90 gap-x-3">
          <BaseButtonIcon
            color="primary"
            shape="full"
            @click="goToConversation(u)"
          >
            <Icon name="ph:chat-circle-text" class="h-5 w-5" />
          </BaseButtonIcon>
          <BaseButtonIcon color="muted" shape="full" @click="goToChart(u)">
            <Icon name="ph:chart-line" class="h-5 w-5" />
          </BaseButtonIcon>
          <BaseButtonIcon
            color="muted"
            shape="full"
            @click="openRemoveModal(u)"
          >
            <Icon name="ph:trash" class="h-5 w-5" />
          </BaseButtonIcon>
        </div>
      </TairoFlexTableCell>
    </TairoFlexTableRow>
  </TairoFlexTable>
  <!-- Modal component -->
  <TairoModal :open="isRemoveModalOpen" size="sm" @close="closeRemoveModal">
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3
          class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white"
        >
          حذف مکالمه
        </h3>

        <BaseButtonClose @click="closeRemoveModal" />
      </div>
    </template>

    <!-- Body -->
    <div class="p-4 md:p-6">
      <div class="mx-auto w-full max-w-xs text-center">
        <div class="relative mx-auto mb-10 flex justify-center">
          <img
            src="/img/illustrations/components/button-close-icon.svg"
            class="max-w-[100px] rounded-full object-cover shadow-sm dark:border-transparent"
            alt=""
          />
        </div>

        <h3
          class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white"
        >
          حذف مکالمه
        </h3>

        <p
          class="font-alt text-muted-500 dark:text-muted-400 text-sm leading-5"
        >
          مکالمه انتخاب شده حذف خواهد شد. مطمئن هستید؟
        </p>
      </div>
    </div>

    <template #footer>
      <!-- Footer -->
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton
            color="primary"
            variant="solid"
            @click="removeConversation()"
            :loading="removeLoading"
          >
            تایید
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>
</template>
