<script setup lang="ts">
const demoPie = reactive(useDemoPie())

function useDemoPie() {
  const { success, danger } = useTailwindColors()
  const height = 335
  const type = 'pie'

  const options = {
    dataLabels: {
      style: {
        fontSize: '12px',
        weight: 500,
      },
    },
    colors: [danger.value, success.value],
    labels: ['پرسیده نشده', 'پرسیده شده'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 315,
            toolbar: {
              show: false,
            },
          },
          legend: {
            position: 'top',
          },
        },
      },
    ],
    legend: {
      position: 'right',
      horizontalAlign: 'center',
    },
  }

  const series = shallowRef([44, 55])

  return {
    type,
    height,
    options,
    series,
  }
}
</script>

<template>
  <div class="relative">
    <BaseCard class="p-6">
      <AddonApexcharts v-bind="demoPie" />
    </BaseCard>
  </div>
</template>
