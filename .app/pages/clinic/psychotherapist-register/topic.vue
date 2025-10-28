<script setup lang="ts">
import type { Invite, StepData } from '../../../types';

definePageMeta({
  preview: {
    title: 'انتخاب موضوع - گام 2',
    description: 'انتخاب موضوعات می تواند به تشخیص و فرایند صحبت کمک کند',
    categories: ['layouts', 'wizards', 'forms'],
    src: '/img/screens/layouts-invite-permissions.png',
    srcDark: '/img/screens/layouts-invite-permissions-dark.png',
    order: 37,
    new: true,
  },
});
useHead({
  title: 'انتخاب سوپروایزر',
});

const {
  data: request,
  currentStepId,
  loading,
  errors,
  getPrevStep,
  steps,
  checkPreviousSteps,
} = useMultiStepForm<Invite, StepData>();

onBeforeMount(checkPreviousSteps);
</script>

<template>
  <div class="w-full">
    <div class="space-y-2">
      <BaseHeading
        as="h2"
        size="2xl"
        weight="medium"
        class="md:!3xl text-muted-800 dark:text-white"
      >
        {{ steps[currentStepId].meta.title }}
      </BaseHeading>
      <BaseParagraph
        size="sm"
        class="text-muted-500 dark:text-muted-400 max-w-sm"
      >
        {{ steps[currentStepId].meta.subtitle }}
      </BaseParagraph>
    </div>

    <div class="w-full max-w-md">
      <div class="w-full space-y-4">
        <div class="w-full">
          <form class="mx-auto w-full">
            <div v-if="errors.fields.selectedSupervisor" class="text-danger-500 my-2 text-center">
              {{ errors.fields.selectedSupervisor }}
            </div>
            <fieldset class="w-full space-y-6">
              <div class="grid gap-6 sm:grid-cols-2">
                <BaseRadioHeadless
                  v-model="request.selectedSupervisor"
                  name="supervisor"
                  value="team_member_1"
                >
                  <BaseCard
                    shape="rounded"
                    class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                  >
                    <div class="flex w-full items-center gap-2">
                      <BaseAvatar src="/img/avatars/10.svg" />

                      <div>
                        <BaseHeading
                          as="h4"
                          size="sm"
                          weight="medium"
                          lead="none"
                        >
                          Kendra Wilson
                        </BaseHeading>

                        <BaseText
                          size="xs"
                          class="text-muted-400"
                        >
                          Software Engineer
                        </BaseText>
                      </div>

                      <div class="child text-muted-300 ms-auto">
                        <div
                          class="size-3 rounded-full bg-current"
                        />
                      </div>
                    </div>
                  </BaseCard>
                </BaseRadioHeadless>

                <BaseRadioHeadless
                  v-model="request.selectedSupervisor"
                  name="supervisor"
                  value="team_member_2"
                >
                  <BaseCard
                    shape="rounded"
                    class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                  >
                    <div class="flex w-full items-center gap-2">
                      <BaseAvatar src="/img/avatars/16.svg" />

                      <div>
                        <BaseHeading
                          as="h4"
                          size="sm"
                          weight="medium"
                          lead="none"
                        >
                          Hermann Mayer
                        </BaseHeading>

                        <BaseText
                          size="xs"
                          class="text-muted-400"
                        >
                          Sales Manager
                        </BaseText>
                      </div>

                      <div class="child text-muted-300 ms-auto">
                        <div
                          class="size-3 rounded-full bg-current"
                        />
                      </div>
                    </div>
                  </BaseCard>
                </BaseRadioHeadless>

                <BaseRadioHeadless
                  v-model="request.selectedSupervisor"
                  name="supervisor"
                  value="team_member_3"
                >
                  <BaseCard
                    shape="rounded"
                    class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                  >
                    <div class="flex w-full items-center gap-2">
                      <BaseAvatar src="/img/avatars/25.svg" />

                      <div>
                        <BaseHeading
                          as="h4"
                          size="sm"
                          weight="medium"
                          lead="none"
                        >
                          Melany Lawright
                        </BaseHeading>

                        <BaseText
                          size="xs"
                          class="text-muted-400"
                        >
                          HR Manager
                        </BaseText>
                      </div>

                      <div class="child text-muted-300 ms-auto">
                        <div
                          class="size-3 rounded-full bg-current"
                        />
                      </div>
                    </div>
                  </BaseCard>
                </BaseRadioHeadless>

                <BaseRadioHeadless
                  v-model="request.selectedSupervisor"
                  name="supervisor"
                  value="team_member_4"
                >
                  <BaseCard
                    shape="rounded"
                    class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                  >
                    <div class="flex w-full items-center gap-2">
                      <BaseAvatar src="/img/avatars/10.svg" />

                      <div>
                        <BaseHeading
                          as="h4"
                          size="sm"
                          weight="medium"
                          lead="none"
                        >
                          Kendra Wilson
                        </BaseHeading>

                        <BaseText
                          size="xs"
                          class="text-muted-400"
                        >
                          Software Engineer
                        </BaseText>
                      </div>

                      <div class="child text-muted-300 ms-auto">
                        <div
                          class="size-3 rounded-full bg-current"
                        />
                      </div>
                    </div>
                  </BaseCard>
                </BaseRadioHeadless>

                <BaseRadioHeadless
                  v-model="request.selectedSupervisor"
                  name="supervisor"
                  value="team_member_5"
                >
                  <BaseCard
                    shape="rounded"
                    class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                  >
                    <div class="flex w-full items-center gap-2">
                      <BaseAvatar src="/img/avatars/16.svg" />

                      <div>
                        <BaseHeading
                          as="h4"
                          size="sm"
                          weight="medium"
                          lead="none"
                        >
                          Hermann Mayer
                        </BaseHeading>

                        <BaseText
                          size="xs"
                          class="text-muted-400"
                        >
                          Sales Manager
                        </BaseText>
                      </div>

                      <div class="child text-muted-300 ms-auto">
                        <div
                          class="size-3 rounded-full bg-current"
                        />
                      </div>
                    </div>
                  </BaseCard>
                </BaseRadioHeadless>

                <BaseRadioHeadless
                  v-model="request.selectedSupervisor"
                  name="supervisor"
                  value="team_member_6"
                >
                  <BaseCard
                    shape="rounded"
                    class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                  >
                    <div class="flex w-full items-center gap-2">
                      <BaseAvatar src="/img/avatars/25.svg" />

                      <div>
                        <BaseHeading
                          as="h4"
                          size="sm"
                          weight="medium"
                          lead="none"
                        >
                          Melany Lawright
                        </BaseHeading>

                        <BaseText
                          size="xs"
                          class="text-muted-400"
                        >
                          HR Manager
                        </BaseText>
                      </div>

                      <div class="child text-muted-300 ms-auto">
                        <div
                          class="size-3 rounded-full bg-current"
                        />
                      </div>
                    </div>
                  </BaseCard>
                </BaseRadioHeadless>
                <BaseRadioHeadless
                  v-model="request.selectedSupervisor"
                  name="supervisor"
                  value="team_member_7"
                >
                  <BaseCard
                    shape="rounded"
                    class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                  >
                    <div class="flex w-full items-center gap-2">
                      <BaseAvatar src="/img/avatars/10.svg" />

                      <div>
                        <BaseHeading
                          as="h4"
                          size="sm"
                          weight="medium"
                          lead="none"
                        >
                          Kendra Wilson
                        </BaseHeading>

                        <BaseText
                          size="xs"
                          class="text-muted-400"
                        >
                          Software Engineer
                        </BaseText>
                      </div>

                      <div class="child text-muted-300 ms-auto">
                        <div
                          class="size-3 rounded-full bg-current"
                        />
                      </div>
                    </div>
                  </BaseCard>
                </BaseRadioHeadless>

                <BaseRadioHeadless
                  v-model="request.selectedSupervisor"
                  name="supervisor"
                  value="team_member_8"
                >
                  <BaseCard
                    shape="rounded"
                    class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                  >
                    <div class="flex w-full items-center gap-2">
                      <BaseAvatar src="/img/avatars/16.svg" />

                      <div>
                        <BaseHeading
                          as="h4"
                          size="sm"
                          weight="medium"
                          lead="none"
                        >
                          Hermann Mayer
                        </BaseHeading>

                        <BaseText
                          size="xs"
                          class="text-muted-400"
                        >
                          Sales Manager
                        </BaseText>
                      </div>

                      <div class="child text-muted-300 ms-auto">
                        <div
                          class="size-3 rounded-full bg-current"
                        />
                      </div>
                    </div>
                  </BaseCard>
                </BaseRadioHeadless>
              </div>
            </fieldset>
          </form>
        </div>
      </div>

      <div class="mt-4 flex gap-4">
        <BaseButton
          v-if="currentStepId > 0"
          :to="loading ? undefined : getPrevStep()?.to"
          :disabled="!getPrevStep()"
          size="lg"
          class="w-full"
        >
          <span>بازگشت</span>
        </BaseButton>
        <BaseButton
          type="submit"
          color="primary"
          size="lg"
          class="w-full"
        >
          <span>ادامه</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>
