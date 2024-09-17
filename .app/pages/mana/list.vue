<script setup lang="ts">
// import { User } from '~/composables/user'

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
const { user, getAllUsers, removeUser, getAllUsersDetailsWithUsers } = useUser()
const toaster = useToaster()
onMounted(async () => {
  users.value = await getAllUsersDetailsWithUsers()
})
const selectedToRemove = ref()
const isRemoveModalOpen = ref(false)
const removeLoading = ref(false)

const goToConversation = (u: User) => {
  user.value = u
  navigateTo('/mana/chat')
}
const gotoAnalysis = (u) => {
  // user.value = u
  navigateTo(`/mana/analysis?userDetailsId=${u.id}`)
}
const goToThoughts = (u: User) => {
  user.value = u
  navigateTo(`/mana/thoughts?userId=${u.id}`)
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
  users.value = await getAllUsersDetailsWithUsers()
}

</script>

<template>
  <TairoFlexTable>
    <template #header>
      <TairoFlexTableHeading type="stable">
        <div class="flex items-center">
          <BaseCheckbox
            v-model="selectAll"
            shape="rounded"
            class="text-primary-500"
          />
        </div>
      </TairoFlexTableHeading>

      <TairoFlexTableHeading type="stable">
        آواتار
      </TairoFlexTableHeading>

      <TairoFlexTableHeading type="stable">
        نام وارد شده
      </TairoFlexTableHeading>

      <TairoFlexTableHeading type="stable">
        اقدامات
      </TairoFlexTableHeading>
    </template>

    <TairoFlexTableRow
      v-for="u in users"
      :key="u.id"
      shape="rounded"
    >
      <TairoFlexTableCell type="stable" data-content="Selection">
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
        <BaseAvatar
          :src="`/img/avatars/${(new Date(u.created).getTime() % 8) + 1}.svg`"
          size="sm"
        />
      </TairoFlexTableCell>

      <TairoFlexTableCell type="stable" data-content="Rate">
        <span class="font-medium">{{
          u.name
        }}</span>
      </TairoFlexTableCell>
      <TairoFlexTableCell type="shrink" data-content="Actions">
        <div class="flex scale-90 flex-wrap gap-x-1 gap-y-2">
          <BaseButtonIcon
            color="primary"
            shape="full"
            @click="goToThoughts(u)"
          >
            <Icon name="carbon:block-storage" class="size-5" />
          </BaseButtonIcon>
          <BaseButtonIcon
            color="primary"
            shape="full"
            @click="goToConversation(u)"
          >
            <Icon name="ph:chat-circle-text" class="size-5" />
          </BaseButtonIcon>

          <BaseButtonIcon
            color="muted"
            shape="full"
            @click="gotoAnalysis(u)"
          >
            <Icon name="ph:clipboard" class="size-5" />
          </BaseButtonIcon>
          <BaseButtonIcon
            color="danger"
            shape="full"
            @click="openRemoveModal(u)"
          >
            <Icon name="ph:trash" class="size-5" />
          </BaseButtonIcon>
        </div>
      </TairoFlexTableCell>
    </TairoFlexTableRow>
  </TairoFlexTable>
  <!-- Modal component -->
  <TairoModal
    :open="isRemoveModalOpen"
    size="sm"
    @close="closeRemoveModal"
  >
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
          >
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
            :loading="removeLoading"
            @click="removeConversation()"
          >
            تایید
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>
</template>
