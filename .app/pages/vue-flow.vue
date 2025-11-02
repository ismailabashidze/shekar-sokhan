<template>
  <div class="h-screen w-full">
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
</template>

<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { Background } from '@vue-flow/background';
import type { Node, Edge, Connection } from '@vue-flow/core';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

const { onConnect, addEdges } = useVueFlow();

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

const onNodeClick = (event: any) => {
  console.log('Node clicked:', event.node);
};

const onEdgeClick = (event: any) => {
  console.log('Edge clicked:', event.edge);
};

const onConnectHandler = (connection: Connection) => {
  addEdges([connection]);
};

onConnect(onConnectHandler);

useHead({
  title: 'Vue Flow - نمونه',
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
