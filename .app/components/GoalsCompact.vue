<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    color?:
      | 'success'
      | 'info'
      | 'warning'
      | 'danger'
      | 'primary'
      | 'lime'
      | 'sky'
  }>(),
  {
    color: 'success',
  },
)

const todos = [
  {
    id: 0,
    title: 'Call Mr. Markstrom',
    description: 'Review the project initial wireframes',
    completed: true,
  },
  {
    id: 1,
    title: 'Finish wireframes',
    description: 'Make all requested changes and publish',
    completed: false,
  },
  {
    id: 2,
    title: 'Update timesheets',
    description: 'Update all the team timesheets',
    completed: false,
  },
  {
    id: 3,
    title: 'Request payout',
    description: 'Send project invoice to client',
    completed: false,
  },
  {
    id: 4,
    title: 'Approve components',
    description: 'Review complete design system',
    completed: true,
  },
]

const tasks = ref<string[]>(['Option 0', 'Option 1', 'Option 2'])
const { goals, getGoals } = useGoal()

const progressFaText = (p: string) => {
  if (p == 'not started') {
    return 'هنوز آغاز نشده است'
  }
  else if (p == 'initialized') {
    return 'مقدار دهی اولیه'
  }
  else if (p == 'in progress') {
    return 'در حال انجام'
  }
  else if (p == 'completed') {
    return 'انجام شده'
  }
  else if (p == 'closed') {
    return 'بسته شده'
  }
  return 'Unknown'
}
const progressFaColor = (p: string) => {
  if (p == 'not started') {
    return 'primary'
  }
  else if (p == 'initialized') {
    return 'primary'
  }
  else if (p == 'in progress') {
    return 'info'
  }
  else if (p == 'completed') {
    return 'success'
  }
  else if (p == 'closed') {
    return 'danger'
  }
  return 'default'
}
onMounted(async () => {
  await getGoals()
  goals.value = goals.value.map((g) => {
    return {
      ...g,
      ...g.expand.generalTherapicGoal,
    }
  })
})
</script>

<template>
  <div class="mb-2 space-y-6">
    <div
      v-for="task in goals"
      :key="task.id"
      class="flex items-center gap-3"
    >
      <BaseCheckboxAnimated
        v-model="tasks"
        color="success"
        :value="`Option ${task.id}`"
      />
      <div>
        <BaseHeading
          as="h4"
          size="sm"
          weight="light"
          lead="tight"
          class="text-muted-800 dark:text-white"
        >
          <span>{{ task.titleFa }}</span>
        </BaseHeading>
        <BaseParagraph size="xs">
          <div>{{ task.shortDescriptionFa }}</div>
          <span class="text-muted-400">
            <BaseTag
              rounded="md"
              variant="solid"
              :color="progressFaColor(task.progress)"
              size="sm"
              class="mt-2"
            >
              {{ progressFaText(task.progress) }}
            </BaseTag>
          </span>
        </BaseParagraph>
      </div>
    </div>
  </div>
</template>
