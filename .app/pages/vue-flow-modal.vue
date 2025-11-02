<template>
  <div class="p-8">
    <div class="mx-auto max-w-2xl">
      <div class="mb-8 text-center">
        <h1 class="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-200">
          Vue Flow Modal Example
        </h1>
        <p class="mb-6 text-gray-600 dark:text-gray-400">
          Click the button below to open an interactive flow chart in a modal
        </p>

        <BaseButton
          color="primary"
          rounded="lg"
          class="h-11 w-full sm:w-auto"
          @click="showFlowModal = true"
        >
          <Icon name="lucide:git-branch" class="ml-2 size-5" />
          Open Flow Chart
        </BaseButton>

        <BaseButton
          color="secondary"
          rounded="lg"
          class="mr-2 h-11 w-full sm:w-auto"
          @click="showTestModal = true"
        >
          <Icon name="lucide:test-tube" class="ml-2 size-5" />
          Test
        </BaseButton>
      </div>

      <!-- Flow Chart Modal -->
      <TairoModal
        :open="showFlowModal"
        size="full"
        @close="showFlowModal = false"
      >
        <template #header>
          <div class="flex w-full items-center justify-between p-4">
            <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
              Vue Flow Chart
            </h3>
            <BaseButtonClose @click="showFlowModal = false" />
          </div>
        </template>

        <div class="relative w-full" style="height: calc(100vh - 200px);">
          <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            :default-zoom="0.8"
            :min-zoom="0.1"
            :max-zoom="4"
            class="rtl-flow"
            @node-click="onNodeClick"
            @edge-click="onEdgeClick"
            @connect="onConnect"
          >
            <Controls />
            <MiniMap />
            <Background pattern-color="#aaa" :gap="20" />

            <template #node-custom="{ data }">
              <div class="custom-node rounded-lg border-2 border-blue-500 bg-white px-4 py-2 shadow-lg dark:bg-gray-800">
                <div class="font-semibold text-gray-800 dark:text-gray-200">
                  {{ data.label }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ data.description }}
                </div>
              </div>
            </template>
          </VueFlow>
        </div>
      </TairoModal>

      <!-- Test Modal -->
      <TairoModal
        :open="showTestModal"
        size="md"
        @close="showTestModal = false"
      >
        <template #header>
          <div class="flex w-full items-center justify-between p-4 sm:p-5">
            <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
              Test Modal
            </h3>
            <BaseButtonClose @click="showTestModal = false" />
          </div>
        </template>

        <div class="p-4 sm:p-5">
          <BaseParagraph class="mb-4">
            This is a simple test modal to demonstrate the Tairo modal functionality.
          </BaseParagraph>

          <div class="flex justify-end space-x-3">
            <BaseButton
              color="muted"
              rounded="lg"
              @click="showTestModal = false"
            >
              Cancel
            </BaseButton>
            <BaseButton
              color="primary"
              rounded="lg"
              @click="showTestModal = false"
            >
              Confirm
            </BaseButton>
          </div>
        </div>
      </TairoModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VueFlow } from '@vue-flow/core';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { Background } from '@vue-flow/background';
import type { Node, Edge, Connection } from '@vue-flow/core';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

const showFlowModal = ref(false);
const showTestModal = ref(false);

const onNodeClick = (event: any) => {
  console.log('Node clicked:', event.node);
};

const onEdgeClick = (event: any) => {
  console.log('Edge clicked:', event.edge);
};

const onConnect = (connection: any) => {
  console.log('Connected:', connection);
};

const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'default',
    position: { x: 100, y: 100 },
    label: 'شروع',
    style: { backgroundColor: '#10b981', color: 'white' },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 300, y: 100 },
    data: {
      label: 'پردازش',
      description: 'در حال پردازش داده‌ها',
    },
  },
  {
    id: '3',
    type: 'default',
    position: { x: 500, y: 100 },
    label: 'تصمیم',
    style: { backgroundColor: '#f59e0b', color: 'white' },
  },
  {
    id: '4',
    type: 'default',
    position: { x: 200, y: 250 },
    label: 'مسیر الف',
    style: { backgroundColor: '#3b82f6', color: 'white' },
  },
  {
    id: '5',
    type: 'default',
    position: { x: 400, y: 250 },
    label: 'مسیر ب',
    style: { backgroundColor: '#3b82f6', color: 'white' },
  },
  {
    id: '6',
    type: 'default',
    position: { x: 300, y: 400 },
    label: 'پایان',
    style: { backgroundColor: '#ef4444', color: 'white' },
  },
]);

const edges = ref<Edge[]>([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    label: 'شروع',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    label: 'بررسی',
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    label: 'بله',
    animated: true,
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    type: 'smoothstep',
    label: 'خیر',
    animated: true,
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
    type: 'smoothstep',
    label: 'ادامه',
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    label: 'ادامه',
  },
]);

useHead({
  title: 'Vue Flow Modal - نمونه',
});
</script>

<style>
.rtl-flow {
  direction: ltr;
}

.custom-node {
  min-width: 120px;
  text-align: center;
}

.vue-flow__controls {
  direction: ltr;
}

.vue-flow__minimap {
  direction: ltr;
}
</style>
