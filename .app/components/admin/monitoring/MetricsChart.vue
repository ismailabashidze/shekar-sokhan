<template>
  <div class="w-full" :style="{ height: `${height}px` }">
    <canvas
      ref="chartCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      class="size-full"
    />
  </div>
</template>

<script setup lang="ts">
import type { SystemMetrics } from '~/composables/useNotificationMonitoring';

interface Props {
  data: SystemMetrics[];
  metric: keyof SystemMetrics;
  color: string;
  height: number;
}

const props = defineProps<Props>();

const chartCanvas = ref<HTMLCanvasElement>();
const canvasWidth = ref(800);
const canvasHeight = ref(300);

const drawChart = () => {
  if (!chartCanvas.value || !props.data.length) return;

  const canvas = chartCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Chart margins
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Get data values
  const values = props.data.map((d) => {
    const value = d[props.metric];
    return typeof value === 'number' ? value : 0;
  });

  if (values.length === 0) return;

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  // Draw grid lines
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;

  // Horizontal grid lines
  for (let i = 0; i <= 5; i++) {
    const y = margin.top + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(margin.left, y);
    ctx.lineTo(margin.left + chartWidth, y);
    ctx.stroke();
  }

  // Vertical grid lines
  const xStep = chartWidth / Math.max(values.length - 1, 1);
  for (let i = 0; i < values.length; i++) {
    const x = margin.left + xStep * i;
    ctx.beginPath();
    ctx.moveTo(x, margin.top);
    ctx.lineTo(x, margin.top + chartHeight);
    ctx.stroke();
  }

  // Draw Y-axis labels
  ctx.fillStyle = '#6b7280';
  ctx.font = '12px system-ui';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  for (let i = 0; i <= 5; i++) {
    const value = maxValue - (valueRange / 5) * i;
    const y = margin.top + (chartHeight / 5) * i;
    const label = formatAxisValue(value);
    ctx.fillText(label, margin.left - 10, y);
  }

  // Draw X-axis labels (time)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const labelStep = Math.max(1, Math.floor(values.length / 6));
  for (let i = 0; i < values.length; i += labelStep) {
    const x = margin.left + xStep * i;
    const timestamp = props.data[i]?.timestamp;
    if (timestamp) {
      const label = formatTimeLabel(timestamp);
      ctx.fillText(label, x, margin.top + chartHeight + 10);
    }
  }

  // Draw the line
  if (values.length > 1) {
    ctx.strokeStyle = props.color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < values.length; i++) {
      const x = margin.left + xStep * i;
      const normalizedValue = (values[i] - minValue) / valueRange;
      const y = margin.top + chartHeight - (normalizedValue * chartHeight);

      if (i === 0) {
        ctx.moveTo(x, y);
      }
      else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw points
    ctx.fillStyle = props.color;
    for (let i = 0; i < values.length; i++) {
      const x = margin.left + xStep * i;
      const normalizedValue = (values[i] - minValue) / valueRange;
      const y = margin.top + chartHeight - (normalizedValue * chartHeight);

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Fill area under the line
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = props.color;
    ctx.beginPath();

    // Start from bottom left
    ctx.moveTo(margin.left, margin.top + chartHeight);

    // Draw line to first point
    const firstNormalizedValue = (values[0] - minValue) / valueRange;
    const firstY = margin.top + chartHeight - (firstNormalizedValue * chartHeight);
    ctx.lineTo(margin.left, firstY);

    // Draw the line
    for (let i = 0; i < values.length; i++) {
      const x = margin.left + xStep * i;
      const normalizedValue = (values[i] - minValue) / valueRange;
      const y = margin.top + chartHeight - (normalizedValue * chartHeight);
      ctx.lineTo(x, y);
    }

    // Close the area
    const lastX = margin.left + xStep * (values.length - 1);
    ctx.lineTo(lastX, margin.top + chartHeight);
    ctx.lineTo(margin.left, margin.top + chartHeight);

    ctx.fill();
    ctx.globalAlpha = 1;
  }
};

const formatAxisValue = (value: number): string => {
  if (props.metric.includes('rate') || props.metric.includes('score')) {
    return `${Math.round(value)}%`;
  }
  else if (props.metric.includes('time') || props.metric.includes('latency')) {
    return `${Math.round(value)}ms`;
  }
  else if (props.metric.includes('memory') || props.metric.includes('usage')) {
    return `${Math.round(value)}MB`;
  }
  return Math.round(value).toString();
};

const formatTimeLabel = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// Watch for data changes and redraw
watch(() => props.data, drawChart, { deep: true });
watch(() => props.metric, drawChart);
watch(() => props.color, drawChart);

// Handle resize
const handleResize = () => {
  nextTick(() => {
    drawChart();
  });
};

onMounted(() => {
  nextTick(() => {
    drawChart();
  });

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
