<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import { useTherapistsMessages } from '@/composables/therapistsMessages';

definePageMeta({
  title: 'گزارش خطر آسیب به خود',
  layout: 'empty',
});

useHead({ htmlAttrs: { dir: 'rtl' } });

const route = useRoute();
const nuxtApp = useNuxtApp();
const toaster = useToaster();
const { role } = useUser();
const { getMessages, getMessagesForAdmin } = useTherapistsMessages();
const { getMessageAnalysis } = useMessageAnalysis();

const isAdmin = computed(() => role.value === 'admin');

const loading = ref(false);
const error = ref<string | null>(null);
const session = ref<any>(null);
const analyzedMessages = ref<any[]>([]);

const NA_RISK_SCORE = -1;

const baseRiskLevels = {
  na: { key: 'na', score: NA_RISK_SCORE, label: 'نامشخص (N/A)', tag: 'warning' as const },
  none: { key: 'none', score: 0, label: 'بدون خطر', tag: 'success' as const },
  low: { key: 'low', score: 1, label: 'ریسک کم', tag: 'info' as const },
  medium: { key: 'medium', score: 2, label: 'ریسک متوسط', tag: 'warning' as const },
  high: { key: 'high', score: 3, label: 'ریسک بالا', tag: 'danger' as const },
  critical: { key: 'critical', score: 4, label: 'بحرانی', tag: 'danger' as const },
};

const riskSynonyms: Record<string, keyof typeof baseRiskLevels> = {
  na: 'na',
  norisk: 'none',
  safe: 'none',
  minimal: 'low',
  mild: 'low',
  slight: 'low',
  elevated: 'medium',
  moderate: 'medium',
  mediumrisk: 'medium',
  significant: 'high',
  veryhigh: 'high',
  severe: 'critical',
  extreme: 'critical',
  crisis: 'critical',
};

const normalizedRiskMap = computed(() => {
  const map = new Map<string, typeof baseRiskLevels[keyof typeof baseRiskLevels]>();
  Object.entries(baseRiskLevels).forEach(([key, value]) => {
    map.set(key, value);
  });
  Object.entries(riskSynonyms).forEach(([alias, target]) => {
    map.set(alias, baseRiskLevels[target]);
  });
  return map;
});

const fallbackRisk = baseRiskLevels.na;

const mapRiskValue = (value?: string | null) => {
  if (!value) return fallbackRisk;
  const normalized = value.toString().trim().toLowerCase().replace(/[^a-z]/g, '');
  return normalizedRiskMap.value.get(normalized) || fallbackRisk;
};

const formatDate = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const formatTime = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const translateIndicatorType = (type?: string | null) => {
  if (!type) return 'شاخص';

  const translations: Record<string, string> = {
    suicidal_ideation: 'افکار خودکشی',
    previous_attempt: 'اقدام قبلی',
    self_harm: 'آسیب به خود',
    plan: 'برنامه خودکشی',
    means: 'ابزار خودکشی',
    intent: 'قصد خودکشی',
    recklessness: 'بی‌پروایی',
    giving_away_possessions: 'اهدای اموال',
    saying_goodbye: 'خداحافظی',
    substance_abuse: 'سوء مصرف مواد',
    hopelessness: 'ناامیدی',
    depression: 'افسردگی',
    anxiety: 'اضطراب',
    isolation: 'انزوا',
    trauma: 'تروما',
    loss: 'از دست دادن',
    crisis: 'بحران',
    impulsivity: 'تکانشگری',
    aggression: 'پرخاشگری',
    psychosis: 'روان‌پریشی',
    emotional_pain: 'درد عاطفی',
    worthlessness: 'احساس بی‌ارزشی',
    burden: 'احساس بار بودن',
    sleep_disturbance: 'اختلال خواب',
    agitation: 'تحریک‌پذیری',
    withdrawal: 'کناره‌گیری',
    mood_changes: 'تغییرات خلقی',
  };

  const normalized = type.toLowerCase().trim().replace(/[\s_-]+/g, '_');
  return translations[normalized] || type;
};

const processedMessages = computed(() => {
  return analyzedMessages.value
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((message) => {
      const risk = mapRiskValue(message.analysis?.suicideRiskEvaluation);
      return {
        ...message,
        risk,
        indicatorCount: message.analysis?.suicideIndicators?.length || 0,
      };
    });
});

const overallRisk = computed(() => {
  return processedMessages.value.reduce((highest, message) => {
    return message.risk.score > highest.score ? message.risk : highest;
  }, fallbackRisk);
});

const totalIndicators = computed(() => {
  return processedMessages.value.reduce((sum, message) => {
    return sum + (message.analysis?.suicideIndicators?.length || 0);
  }, 0);
});

const riskCounts = computed(() => {
  return processedMessages.value.reduce<Record<string, number>>((acc, message) => {
    const key = message.risk.label;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
});

const latestRiskDescription = computed(() => {
  const last = processedMessages.value.at(-1);
  return last?.analysis?.suicideRiskDescription || 'توضیحی برای خطر ارائه نشده است.';
});

// Enhanced risk summary based on highest risk level and its occurrences
const riskSummary = computed(() => {
  const riskLevelCounts: Record<string, { risk: typeof baseRiskLevels[keyof typeof baseRiskLevels]; count: number; descriptions: string[] }> = {};

  processedMessages.value.forEach((message) => {
    const riskKey = message.risk.key;
    if (!riskLevelCounts[riskKey]) {
      riskLevelCounts[riskKey] = {
        risk: message.risk,
        count: 0,
        descriptions: [],
      };
    }
    riskLevelCounts[riskKey].count++;
    if (message.analysis?.suicideRiskDescription) {
      riskLevelCounts[riskKey].descriptions.push(message.analysis.suicideRiskDescription);
    }
  });

  // Find highest risk level
  const sortedRisks = Object.values(riskLevelCounts).sort((a, b) => b.risk.score - a.risk.score);
  const highestRisk = sortedRisks[0] || { risk: fallbackRisk, count: 0, descriptions: [] };

  // Generate comprehensive summary
  let summary = '';

  if (highestRisk.risk.key === 'na') {
    summary = `در طول این جلسه، ${highestRisk.count} پیام وجود دارد که سطح خطر آن‌ها قابل ارزیابی نبوده است. این می‌تواند به دلیل عدم وجود نشانه‌های واضح یا داده‌های ناکافی برای تحلیل باشد.`;
  }
  else if (highestRisk.risk.key === 'none') {
    summary = `بررسی این جلسه نشان می‌دهد که در ${highestRisk.count} پیام، هیچ نشانه خطری برای خودکشی یا آسیب به خود شناسایی نشده است. این یک نشانه مثبت است.`;
  }
  else {
    const riskLevelText = highestRisk.risk.label;
    const percentage = Math.round((highestRisk.count / processedMessages.value.length) * 100);

    summary = `بالاترین سطح خطر شناسایی شده در این جلسه "${riskLevelText}" است که در ${highestRisk.count} پیام (${percentage}٪ از کل پیام‌ها) مشاهده شده است. `;

    // Add critical indicator information
    const criticalIndicatorTypes = new Set<string>();
    processedMessages.value.forEach((msg) => {
      if (msg.risk.score >= highestRisk.risk.score) {
        (msg.analysis?.suicideIndicators || []).forEach((ind: any) => {
          if (ind?.indicatorType) {
            criticalIndicatorTypes.add(translateIndicatorType(ind.indicatorType));
          }
        });
      }
    });

    if (criticalIndicatorTypes.size > 0) {
      const indicatorsList = Array.from(criticalIndicatorTypes).slice(0, 5).join('، ');
      summary += `شاخص‌های شناسایی شده شامل: ${indicatorsList}${criticalIndicatorTypes.size > 5 ? ' و موارد دیگر' : ''} می‌باشد. `;
    }

    // Add latest description if available
    if (highestRisk.descriptions.length > 0) {
      const latestDesc = highestRisk.descriptions[highestRisk.descriptions.length - 1];
      summary += `\n\nآخرین توضیح تحلیل: ${latestDesc}`;
    }
  }

  return summary;
});

const indicatorEntries = computed(() => {
  const items: Array<{ level: string; levelLabel: string; message: string; text: string; reasoning: string; timestamp: string }> = [];
  processedMessages.value.forEach((message) => {
    (message.analysis?.suicideIndicators || []).forEach((indicator: any) => {
      const level = indicator?.dangerousnessLevel?.toString().toLowerCase() || 'unknown';
      console.log('level');
      console.log(level);

      const levelLabel = level === 'critical'
        ? 'بحرانی'
        : level === 'high'
          ? 'بالا'
          : level === 'medium'
            ? 'متوسط'
            : level === 'moderate'
              ? 'متوسط'
              : level === 'low'
                ? 'کم'
                : 'نامشخص';
      items.push({
        level,
        levelLabel,
        message: message.text,
        text: indicator?.indicatorText || 'بدون متن',
        reasoning: indicator?.reasoning || 'بدون توضیح',
        timestamp: message.timestamp,
      });
    });
  });
  return items;
});

const indicatorsByPriority = computed(() => {
  const priorityOrder = ['critical', 'high', 'medium', 'moderate', 'low', 'unknown'];
  return [...indicatorEntries.value].sort((a, b) => {
    return priorityOrder.indexOf(a.level) - priorityOrder.indexOf(b.level);
  });
});

const { primary } = useTailwindColors();

const riskColors = computed<Record<string, string>>(() => ({
  na: '#fbbf24',
  none: '#22c55e',
  low: '#22c55e',
  medium: '#f97316',
  high: '#ef4444',
  critical: '#9333ea',
  fallback: primary.value || '#2563eb',
}));

const chartScoreForRisk = (risk: { key: string; score: number }) => {
  if (risk.key === 'na') return 0;
  if (risk.key === 'critical') return 3;
  if (risk.score === NA_RISK_SCORE) return 0;
  return Math.min(risk.score, 3);
};

const riskChartSeries = computed(() => {
  const fallbackColor = riskColors.value.fallback;

  return [
    {
      name: 'سطح خطر',
      data: processedMessages.value.map((message, index) => {
        const risk = message.risk;
        const pointColor = colorForRisk(risk) || fallbackColor;

        return {
          x: index,
          y: chartScoreForRisk(risk),
          riskKey: risk.key,
          riskLabel: risk.label,
          timestamp: message.timestamp,
          risk,
          fillColor: pointColor,
          marker: {
            size: 12,
            fillColor: pointColor,
            strokeColor: '#111827',
            strokeWidth: 2,
          },
        };
      }),
    },
  ];
});

const riskChartCategories = computed(() => {
  return processedMessages.value.map(message => formatTime(message.timestamp));
});

const riskScoreLabel = (score: number, riskKey?: string) => {
  if (riskKey === 'na' || score === NA_RISK_SCORE) return 'نامشخص';
  if (riskKey === 'critical') return 'بحرانی';
  if (score === 3) return 'ریسک بالا';
  if (score === 2) return 'ریسک متوسط';
  if (score === 1) return 'ریسک کم';
  if (score <= 0) return 'بدون خطر';
  return 'بدون خطر';
};

const colorForRisk = (risk: { key: string; score: number }) => {
  const normalizedKey = risk.key || 'fallback';
  const mapped = riskColors.value[normalizedKey];
  if (mapped) return mapped;

  if (risk.score >= 4) return riskColors.value.critical;
  if (risk.score === 3) return riskColors.value.high;
  if (risk.score === 2) return riskColors.value.medium;
  if (risk.score === 1) return riskColors.value.low;
  return riskColors.value.none;
};

const getRiskIcon = (risk: { key: string; score: number }) => {
  if (risk.key === 'na') return 'ph:warning-duotone';
  return 'ph:heartbeat-duotone';
};

const getRiskBgColor = (risk: { key: string; score: number }) => {
  if (risk.key === 'na') return 'bg-yellow-100 dark:bg-yellow-900/30';
  return '';
};

const getRiskTextColor = (risk: { key: string; score: number }) => {
  if (risk.key === 'na') return 'text-yellow-700 dark:text-yellow-300';
  return '';
};

const chartRef = ref<any>(null);

const applyRiskLabelStyles = (chartInstance: any) => {
  const labels = chartInstance.el.querySelectorAll<HTMLElement>('.apexcharts-datalabel');
  const seriesData = chartInstance?.w?.config?.series?.[0]?.data || [];

  labels.forEach((label) => {
    const indexAttr = label.getAttribute('data:realIndex');
    if (indexAttr == null) return;

    const point = seriesData[Number(indexAttr)];
    const riskKey = point?.riskKey || 'none'

      ;['na', 'none', 'low', 'medium', 'high', 'critical'].forEach((key) => {
      label.classList.remove(`${key}-risk-label`);
    });

    label.classList.add(`${riskKey}-risk-label`);

    if (riskKey === 'na') {
      label.style.transform = 'translate(-50%, calc(-130% - 12px))';
    }
    else {
      label.style.transform = '';
    }
  });
};

const riskChartOptions = computed(() => {
  const seriesData = riskChartSeries.value[0]?.data || [];

  const fallbackColor = riskColors.value.fallback;
  const markerColors = seriesData.map((point: any) =>
    colorForRisk(point?.risk || fallbackRisk) || fallbackColor,
  );

  const bandWidths = seriesData.map((point: any, index: number) => {
    const prev = seriesData[index - 1];
    const next = seriesData[index + 1];

    const left = prev ? (point.x - prev.x) / 2 : next ? (next.x - point.x) / 2 : 0.5;
    const right = next ? (next.x - point.x) / 2 : prev ? (point.x - prev.x) / 2 : left;

    return {
      left: isFinite(left) && left > 0 ? left : 0.5,
      right: isFinite(right) && right > 0 ? right : 0.5,
    };
  });

  const unknownAnnotations = seriesData
    .map((point: any, index: number) => {
      if (point?.riskKey !== 'na') {
        return null;
      }

      const { left, right } = bandWidths[index] || { left: 0.5, right: 0.5 };

      return {
        x: point.x - left,
        x2: point.x + right,
        fillColor: '#fef3c7',
        opacity: 0.3,
        borderColor: 'transparent',
        label: { show: false },
      };
    })
    .filter(Boolean);

  const minX = seriesData.length ? Math.min(...seriesData.map((point: any) => point.x)) : 0;
  const maxX = seriesData.length ? Math.max(...seriesData.map((point: any) => point.x)) : 0;

  return ({
    chart: {
      type: 'scatter',
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: false },
      events: {
        mounted: (chart: any) => {
          setTimeout(() => {
            applyRiskLabelStyles(chart);
          }, 100);
        },
        updated: (chart: any) => {
          setTimeout(() => {
            applyRiskLabelStyles(chart);
          }, 100);
        },
      },
    },
    stroke: {
      curve: 'straight',
      width: 0,
      colors: ['transparent'],
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    markers: {
      size: seriesData.length ? 12 : 0,
      strokeWidth: seriesData.length ? 2 : 0,
      strokeColors: '#111827',
      discrete: seriesData.map((point: any, index: number) => ({
        seriesIndex: 0,
        dataPointIndex: index,
        fillColor: colorForRisk(point?.risk || fallbackRisk) || fallbackColor,
        strokeColor: '#111827',
        size: 12,
      })),
      hover: {
        size: seriesData.length ? 14 : 0,
        sizeOffset: 2,
      },
    },
    grid: {
      strokeDashArray: 6,
      borderColor: '#E5E7EB',
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0],
      formatter: (val: number, opts?: any) => {
        const point = opts?.w?.config?.series?.[opts?.seriesIndex]?.data?.[opts?.dataPointIndex];
        if (point?.riskKey === 'na') {
          return '⚠️ نامشخص';
        }
        return riskScoreLabel(val, point?.riskKey);
      },
      style: {
        fontSize: '12px',
        fontFamily: 'IRANSansX, sans-serif',
        colors: seriesData.map(() => '#1F2937'),
        fontWeight: seriesData.map(() => 600),
      },
      background: {
        borderRadius: 8,
        padding: 10,
        enabled: true,
        foreColor: '#1F2937',
        borderWidth: 0,
        borderColor: 'transparent',
        opacity: 1,
        dropShadow: {
          enabled: true,
          top: 2,
          left: 2,
          blur: 3,
          opacity: 0.2,
        },
      },
    },
    colors: markerColors.length ? markerColors : [fallbackColor],
    xaxis: {
      type: 'numeric',
      min: minX,
      max: maxX,
      tickAmount: seriesData.length > 1 ? Math.min(seriesData.length - 1, 6) : 1,
      labels: {
        formatter: (val: number) => {
          const index = Math.round(val);
          return riskChartCategories.value[index] || '';
        },
        style: {
          fontFamily: 'IRANSansX, sans-serif',
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 3,
      tickAmount: 3,
      labels: {
        formatter: (val: number) => {
          if (val === 3) return 'ریسک بالا';
          if (val === 2) return 'ریسک متوسط';
          if (val === 1) return 'ریسک کم';
          if (val === 0) return 'بدون خطر';
          return '';
        },
        style: {
          fontFamily: 'IRANSansX, sans-serif',
          fontSize: '12px',
          colors: ['#1F2937'],
        },
      },
    },
    tooltip: {
      enabled: true,
      shared: false,
      followCursor: true,
      intersect: false,
      custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
        const point = w?.config?.series?.[seriesIndex]?.data?.[dataPointIndex];
        const val = point?.y ?? series[seriesIndex][dataPointIndex];
        const label = riskScoreLabel(val, point?.riskKey);
        const isNA = point?.riskKey === 'na';

        return `
        <div class="apexcharts-tooltip-custom ${isNA ? 'na-tooltip' : 'normal-tooltip'
          }" style="
          padding: 12px 16px;
          background: ${isNA ? '#fef3c7' : '#ffffff'};
          border: 2px solid ${isNA ? '#f59e0b' : colorForRisk(point?.risk || fallbackRisk)};
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-family: IRANSansX, sans-serif;
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            color: ${isNA ? '#854d0e' : '#1F2937'};
            font-weight: 700;
            font-size: 13px;
          ">
            <span style="font-size: 16px;">${isNA ? '⚠️' : '❤️'}</span>
            <span>${label}</span>
          </div>
          ${isNA
? `
            <div style="
              font-size: 11px;
              color: #92400e;
              background: #fde68a;
              padding: 6px 8px;
              border-radius: 6px;
              margin-top: 6px;
            ">
              داده‌های کافی برای تحلیل وجود ندارد
            </div>
          `
: ''}
          <div style="
            margin-top: 8px;
            font-size: 11px;
            color: ${isNA ? '#92400e' : '#6B7280'};
          ">
            زمان: ${formatTime(point?.timestamp)}
          </div>
        </div>
      `;
      },
    },
    annotations: {
      xaxis: unknownAnnotations as any,
    },
  });
});

const loadData = async (sessionId: string) => {
  if (!sessionId) {
    error.value = 'شناسه جلسه معتبر نیست.';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const sessionRecord = await nuxtApp.$pb.collection('sessions').getOne(sessionId, {
      expand: 'therapist',
    });
    session.value = sessionRecord;

    const rawMessages = isAdmin.value
      ? await getMessagesForAdmin(sessionId)
      : await getMessages(sessionId);

    const enrichedMessages = await Promise.all(
      rawMessages.map(async (message: any) => {
        if (message.type !== 'sent' || !message.message_analysis) {
          return {
            ...message,
            analysis: null,
            timestamp: message.time || message.created,
          };
        }

        try {
          const analysisData = await getMessageAnalysis(message.message_analysis);
          return {
            ...message,
            analysis: {
              suicideRiskEvaluation: analysisData?.suicideRiskEvaluation || null,
              suicideRiskDescription: analysisData?.suicideRiskDescription || '',
              suicideIndicators: analysisData?.suicideIndicators || [],
            },
            timestamp: message.time || message.created,
          };
        }
        catch (analysisError) {
          console.error('Error loading analysis', analysisError);
          return {
            ...message,
            analysis: null,
            timestamp: message.time || message.created,
          };
        }
      }),
    );

    analyzedMessages.value = enrichedMessages.filter(message => message.analysis);
  }
  catch (err: any) {
    console.error('Error loading risk data:', err);
    error.value = 'امکان دریافت اطلاعات این جلسه وجود ندارد.';
    toaster.show({
      title: 'خطا',
      message: 'خطا در دریافت اطلاعات جلسه',
      color: 'danger',
      icon: 'ph:warning-circle-duotone',
      closable: true,
    });
  }
  finally {
    loading.value = false;
  }
};

onMounted(() => {
  const sessionId = route.query.sessionId as string;
  loadData(sessionId);
});

watch(
  () => route.query.sessionId,
  (newId) => {
    if (typeof newId === 'string') {
      loadData(newId);
    }
  },
);

const goBack = () => {
  navigateTo('/darmana/therapists/sessions');
};

const hasData = computed(() => processedMessages.value.length > 0);

// Aggregate all unique indicator types across all messages
const allIndicatorTags = computed(() => {
  const tagsMap = new Map<string, { type: string; count: number; label: string }>();

  processedMessages.value.forEach((message) => {
    (message.analysis?.suicideIndicators || []).forEach((indicator: any) => {
      const type = indicator?.indicatorType;
      if (type) {
        if (tagsMap.has(type)) {
          tagsMap.get(type)!.count++;
        }
        else {
          tagsMap.set(type, {
            type,
            count: 1,
            label: translateIndicatorType(type),
          });
        }
      }
    });
  });

  // Sort by count (descending) and then by label
  return Array.from(tagsMap.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.label.localeCompare(b.label, 'fa');
  });
});

// Most important indicators (high priority)
const criticalIndicators = ['suicidal_ideation', 'previous_attempt', 'self_harm', 'plan', 'means', 'intent', 'recklessness', 'giving_away_possessions', 'saying_goodbye', 'substance_abuse'];

const priorityIndicatorTags = computed(() => {
  return allIndicatorTags.value.filter(tag => criticalIndicators.includes(tag.type));
});

const otherIndicatorTags = computed(() => {
  return allIndicatorTags.value.filter(tag => !criticalIndicators.includes(tag.type));
});

const getIndicatorColor = (type: string) => {
  if (criticalIndicators.includes(type)) {
    return 'danger';
  }
  return 'warning';
};

// Pie chart data for risk distribution
const riskPieChartSeries = computed(() => {
  const counts: number[] = [];
  const labels: string[] = [];

  // Get risk counts sorted by severity (highest first)
  const sortedRisks = Object.entries(riskCounts.value)
    .map(([label, count]) => {
      // Find the risk level for this label
      const riskLevel = Object.values(baseRiskLevels).find(r => r.label === label);
      return { label, count, score: riskLevel?.score ?? -2 };
    })
    .sort((a, b) => b.score - a.score);

  sortedRisks.forEach(({ label, count }) => {
    labels.push(label as string);
    counts.push(count as number);
  });

  return { series: counts, labels };
});

const riskPieChartOptions = computed(() => {
  const colors: string[] = [];

  riskPieChartSeries.value.labels.forEach((label) => {
    const riskLevel = Object.values(baseRiskLevels).find(r => r.label === label);
    if (riskLevel) {
      colors.push(riskColors.value[riskLevel.key] || riskColors.value.fallback);
    }
  });

  return {
    chart: {
      type: 'donut',
      fontFamily: 'IRANSansX, sans-serif',
    },
    labels: riskPieChartSeries.value.labels,
    colors: colors,
    legend: {
      show: true,
      position: 'bottom' as const,
      fontFamily: 'IRANSansX, sans-serif',
      fontSize: '12px',
      labels: {
        colors: '#6B7280',
      },
      markers: {
        width: 12,
        height: 12,
        radius: 3,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Math.round(val)}%`,
      style: {
        fontSize: '14px',
        fontFamily: 'IRANSansX, sans-serif',
        fontWeight: 600,
        colors: ['#ffffff'],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.5,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontFamily: 'IRANSansX, sans-serif',
              color: '#6B7280',
            },
            value: {
              show: true,
              fontSize: '20px',
              fontFamily: 'IRANSansX, sans-serif',
              fontWeight: 700,
              color: '#111827',
              formatter: (val: string) => val,
            },
            total: {
              show: true,
              label: 'مجموع پیام‌ها',
              fontSize: '12px',
              fontFamily: 'IRANSansX, sans-serif',
              color: '#6B7280',
              formatter: () => processedMessages.value.length.toString(),
            },
          },
        },
      },
    },
    tooltip: {
      enabled: true,
      style: {
        fontFamily: 'IRANSansX, sans-serif',
      },
      y: {
        formatter: (val: number) => `${val} پیام`,
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 280,
          },
          legend: {
            position: 'bottom' as const,
          },
        },
      },
    ],
  };
});
</script>

<template>
  <div>
    <div class="bg-muted-100 dark:bg-muted-900 min-h-screen">
      <div class="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-danger-100 dark:bg-danger-500/20 flex size-12 items-center justify-center rounded-2xl">
              <Icon name="ph:pulse-duotone" class="text-danger-500 size-6" />
            </div>
            <div>
              <BaseHeading
                tag="h1"
                size="lg"
                weight="medium"
                class="text-muted-900 dark:text-white"
              >
                گزارش خطر آسیب به خود
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 mt-1">
                بررسی تحلیلی روند خطر در طول جلسه و شاخص‌های هشدار دهنده استخراج شده از پیام‌های کاربر
              </BaseParagraph>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <BaseButton
              color="muted"
              shape="curved"
              class="gap-2"
              @click="goBack"
            >
              <Icon name="ph:arrow-right" class="size-4" />
              بازگشت به جلسات
            </BaseButton>
          </div>
        </div>

        <BaseCard
          v-if="loading"
          shape="curved"
          class="p-8"
        >
          <div class="flex flex-col items-center gap-4">
            <BasePlaceload class="h-6 w-40 rounded" />
            <BasePlaceload class="h-4 w-64 rounded" />
            <BasePlaceload class="h-64 w-full rounded" />
          </div>
        </BaseCard>

        <BaseCard
          v-else-if="error"
          shape="curved"
          class="p-8"
        >
          <div class="flex flex-col items-center gap-3 text-center">
            <Icon name="ph:warning-circle-duotone" class="text-danger-500 size-10" />
            <BaseHeading tag="h2" size="md">
              {{ error }}
            </BaseHeading>
            <BaseButton
              color="primary"
              shape="curved"
              @click="goBack"
            >
              بازگشت
            </BaseButton>
          </div>
        </BaseCard>

        <div v-else>
          <div v-if="session" class="grid gap-4 lg:grid-cols-3">
            <BaseCard shape="curved" class="col-span-2 p-6">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <BaseHeading
                    tag="h2"
                    size="md"
                    class="text-muted-900 dark:text-white"
                  >
                    {{ session.expand?.therapist?.name || 'جلسه درمانی' }}
                  </BaseHeading>
                  <div class="text-muted-500 mt-2 flex items-center gap-2 text-sm">
                    <Icon name="ph:calendar-duotone" class="size-4" />
                    <span>{{ formatDate(session.created) }}</span>
                    <span class="text-muted-400">·</span>
                    <span>{{ session.session_type === 'therapic' ? 'جلسه درمانی' : 'جلسه آموزشی' }}</span>
                  </div>
                </div>
                <div
                  v-if="overallRisk.key === 'na'"
                  class="flex items-center gap-2 rounded-xl bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                >
                  <Icon name="ph:warning-duotone" class="size-4" />
                  <span>{{ overallRisk.label }}</span>
                </div>
                <BaseTag
                  v-else
                  :color="overallRisk.tag"
                  shape="curved"
                  size="md"
                >
                  <div class="flex items-center gap-2 px-3 py-1">
                    <Icon name="ph:heartbeat-duotone" class="size-4" />
                    <span>{{ overallRisk.label }}</span>
                  </div>
                </BaseTag>
              </div>

              <div class="mt-6 grid gap-4 sm:grid-cols-3">
                <div class="bg-muted-50 dark:bg-muted-800 rounded-2xl p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-muted-500 text-xs">پیام‌های دارای تحلیل</span>
                    <Icon name="ph:chat-dots-duotone" class="text-primary-500 size-4" />
                  </div>
                  <p class="text-muted-900 mt-3 text-2xl font-semibold dark:text-white">
                    {{ processedMessages.length }}
                  </p>
                </div>
                <div class="bg-muted-50 dark:bg-muted-800 rounded-2xl p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-muted-500 text-xs">مجموع شاخص‌های هشدار</span>
                    <Icon name="ph:warning-circle-duotone" class="text-danger-500 size-4" />
                  </div>
                  <p class="text-muted-900 mt-3 text-2xl font-semibold dark:text-white">
                    {{ totalIndicators }}
                  </p>
                </div>
                <div class="bg-muted-50 dark:bg-muted-800 rounded-2xl p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-muted-500 text-xs">وضعیت جلسه</span>
                    <Icon name="ph:clipboard-text-duotone" class="text-info-500 size-4" />
                  </div>
                  <p class="text-muted-900 mt-3 text-base font-medium dark:text-white">
                    {{ session.status === 'done'
                      ? 'تکمیل شده'
                      : session.status === 'inprogress'
                        ? 'در حال انجام'
                        : session.status === 'closed'
                          ? 'بسته شده'
                          : 'نامشخص' }}
                  </p>
                </div>
              </div>

              <!-- Pie Chart for Risk Distribution -->
              <div v-if="riskPieChartSeries.series.length > 0" class="border-muted-200 dark:border-muted-700 mt-6 border-t pt-6">
                <div class="mb-4 flex items-center gap-2">
                  <Icon name="ph:chart-pie-duotone" class="text-primary-500 size-5" />
                  <BaseHeading
                    tag="h3"
                    size="xs"
                    class="text-muted-800 dark:text-muted-200"
                  >
                    توزیع سطوح خطر در پیام‌ها
                  </BaseHeading>
                </div>
                <div class="flex justify-center">
                  <AddonApexcharts
                    type="donut"
                    :height="280"
                    :series="riskPieChartSeries.series"
                    :options="riskPieChartOptions"
                  />
                </div>
              </div>
            </BaseCard>

            <BaseCard shape="curved" class="p-6">
              <div class="flex flex-col gap-4">
                <div>
                  <div class="mb-3 flex items-center gap-2">
                    <Icon name="ph:clipboard-text-duotone" class="text-primary-500 size-5" />
                    <BaseHeading
                      tag="h3"
                      size="sm"
                      class="text-muted-900 dark:text-white"
                    >
                      جمع‌بندی خطر
                    </BaseHeading>
                  </div>
                  <BaseParagraph size="sm" class="text-muted-500 whitespace-pre-line leading-6">
                    {{ riskSummary }}
                  </BaseParagraph>
                </div>

                <div class="border-muted-200 dark:border-muted-700 border-t pt-4">
                  <div class="text-muted-600 dark:text-muted-400 mb-3 text-xs font-semibold">
                    توزیع سطوح خطر در جلسه:
                  </div>
                  <div class="space-y-2 text-sm">
                    <div
                      v-for="(count, label) in riskCounts"
                      :key="label"
                      class="bg-muted-50 dark:bg-muted-800 flex items-center justify-between rounded-xl p-3"
                    >
                      <span class="text-muted-600 dark:text-muted-300">{{ label }}</span>
                      <div class="flex items-center gap-2">
                        <span class="text-muted-900 font-semibold dark:text-white">{{ count }}</span>
                        <span class="text-muted-400 text-xs">پیام</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>

          <BaseCard
            v-if="hasData"
            shape="curved"
            class="mt-6 p-6"
          >
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <BaseHeading
                    tag="h3"
                    size="sm"
                    class="text-muted-900 dark:text-white"
                  >
                    روند خطر در طول جلسه
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-500 mt-1">
                    نمایش سطح خطر ارزیابی شده برای هر پیام در گذر زمان
                  </BaseParagraph>
                </div>
                <div
                  v-if="overallRisk.key === 'na'"
                  class="flex items-center gap-2 rounded-xl bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                >
                  <Icon name="ph:warning-duotone" class="size-4" />
                  {{ overallRisk.label }} (داده ناکافی)
                </div>
                <BaseTag
                  v-else
                  :color="overallRisk.tag"
                  shape="smooth"
                  size="sm"
                >
                  <div class="flex items-center gap-2 px-3 py-1">
                    <Icon name="ph:trend-up-duotone" class="size-4" />
                    {{ overallRisk.label }}
                  </div>
                </BaseTag>
              </div>
              <AddonApexcharts
                type="line"
                :height="320"
                :series="riskChartSeries"
                :options="riskChartOptions"
              />
            </div>
          </BaseCard>

          <!-- Indicator Tags Summary Card -->
          <BaseCard
            v-if="allIndicatorTags.length"
            shape="curved"
            class="mt-6 p-6"
          >
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <div>
                  <BaseHeading
                    tag="h3"
                    size="sm"
                    class="text-muted-900 dark:text-white"
                  >
                    شاخص‌های تشخیص داده‌شده
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-500 mt-1">
                    خلاصه تمام شاخص‌های خطر شناسایی شده در طول جلسه
                  </BaseParagraph>
                </div>
                <BaseTag
                  color="primary"
                  shape="curved"
                  size="sm"
                >
                  <div class="flex items-center gap-2 px-3 py-1">
                    <Icon name="ph:tag-duotone" class="size-4" />
                    {{ allIndicatorTags.length }} نوع شاخص
                  </div>
                </BaseTag>
              </div>

              <!-- Priority Indicators -->
              <div v-if="priorityIndicatorTags.length" class="space-y-3">
                <div class="flex items-center gap-2">
                  <Icon name="ph:warning-circle-duotone" class="text-danger-500 size-5" />
                  <span class="text-danger-700 dark:text-danger-400 text-sm font-semibold">شاخص‌های با اولویت بالا</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="tag in priorityIndicatorTags"
                    :key="tag.type"
                    class="bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800 flex items-center gap-2 rounded-xl border px-3 py-2"
                  >
                    <Icon name="ph:shield-warning-duotone" class="text-danger-600 dark:text-danger-400 size-5" />
                    <div class="flex flex-col">
                      <span class="text-danger-900 dark:text-danger-100 text-sm font-semibold">{{ tag.label }}</span>
                      <span class="text-danger-600 dark:text-danger-400 text-xs">{{ tag.count }} مورد</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Other Indicators -->
              <div v-if="otherIndicatorTags.length" class="space-y-3">
                <div class="flex items-center gap-2">
                  <Icon name="ph:info-duotone" class="text-warning-500 size-5" />
                  <span class="text-warning-700 dark:text-warning-400 text-sm font-semibold">سایر شاخص‌ها</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="tag in otherIndicatorTags"
                    :key="tag.type"
                    class="bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800 flex items-center gap-2 rounded-xl border px-3 py-2"
                  >
                    <Icon name="ph:tag-duotone" class="text-warning-600 dark:text-warning-400 size-4" />
                    <div class="flex flex-col">
                      <span class="text-warning-900 dark:text-warning-100 text-sm font-medium">{{ tag.label }}</span>
                      <span class="text-warning-600 dark:text-warning-400 text-xs">{{ tag.count }} مورد</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>

          <BaseCard
            v-if="indicatorEntries.length"
            shape="curved"
            class="mt-6 p-6"
          >
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <BaseHeading
                  tag="h3"
                  size="sm"
                  class="text-muted-900 dark:text-white"
                >
                  شاخص‌های هشداردهنده (جزئیات)
                </BaseHeading>
                <BaseTag
                  color="danger"
                  shape="curved"
                  size="sm"
                >
                  <div class="flex items-center gap-2 px-3 py-1">
                    <Icon name="ph:warning-duotone" class="size-4" />
                    {{ indicatorEntries.length }} شاخص
                  </div>
                </BaseTag>
              </div>

              <div class="grid gap-4 lg:grid-cols-2">
                <div
                  v-for="(indicator, index) in indicatorsByPriority"
                  :key="index"
                  class="border-muted-200 dark:border-muted-700 rounded-2xl border p-4"
                >
                  <div class="flex items-center justify-between">
                    <BaseTag
                      :color="indicator.level === 'critical' ? 'danger' : indicator.level === 'high' ? 'danger' : indicator.level === 'medium' ? 'warning' : indicator.level === 'moderate' ? 'warning' : 'info'"
                      shape="curved"
                      size="sm"
                    >
                      <div class="flex items-center gap-2 px-2 py-1">
                        <Icon name="ph:activity-duotone" class="size-4" />
                        {{ indicator.levelLabel }}
                      </div>
                    </BaseTag>
                    <span class="text-muted-400 text-xs">{{ formatTime(indicator.timestamp) }}</span>
                  </div>

                  <p class="text-muted-900 mt-3 text-sm font-medium leading-6 dark:text-white">
                    {{ indicator.text }}
                  </p>
                  <BaseParagraph size="xs" class="text-muted-500 mt-2 leading-6">
                    {{ indicator.reasoning }}
                  </BaseParagraph>
                  <div
                    class="border-muted-200 dark:border-muted-700 bg-muted-50 dark:bg-muted-800 mt-4 rounded-xl border p-3 text-xs"
                  >
                    <span class="text-muted-500">بخشی از پیام:</span>
                    <p class="text-muted-800 dark:text-muted-200 mt-2 leading-6">
                      {{ indicator.message }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>

          <BaseCard
            v-if="hasData"
            shape="curved"
            class="mt-6 p-6"
          >
            <div class="flex flex-col gap-5">
              <div class="flex flex-col gap-1">
                <BaseHeading
                  tag="h3"
                  size="sm"
                  class="text-muted-900 dark:text-white"
                >
                  پیام‌ها و ارزیابی خطر
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-500">
                  جزئیات ارزیابی انجام شده برای هر پیام کاربر به همراه توضیحات تکمیلی و شاخص‌ها
                </BaseParagraph>
              </div>

              <div class="space-y-4">
                <div
                  v-for="message in processedMessages"
                  :key="message.id"
                  class="border-muted-200 dark:border-muted-700 rounded-2xl border p-4"
                >
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div class="text-muted-400 flex items-center gap-2 text-xs">
                        <Icon name="ph:clock-duotone" class="size-4" />
                        <span>{{ formatDate(message.timestamp) }}</span>
                        <span>·</span>
                        <span>{{ formatTime(message.timestamp) }}</span>
                      </div>
                      <p class="text-muted-900 mt-2 text-sm leading-7 dark:text-white">
                        {{ message.text }}
                      </p>
                    </div>

                    <div
                      v-if="message.risk.key === 'na'"
                      class="flex items-center gap-2 rounded-xl bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                    >
                      <Icon name="ph:warning-duotone" class="size-4" />
                      <span>{{ message.risk.label }}</span>
                    </div>
                    <BaseTag
                      v-else
                      :color="message.risk.tag"
                      shape="curved"
                      size="sm"
                    >
                      <div class="flex items-center gap-2 px-3 py-1">
                        <Icon name="ph:heartbeat-duotone" class="size-4" />
                        <span>{{ message.risk.label }}</span>
                      </div>
                    </BaseTag>
                  </div>

                  <div
                    v-if="message.analysis?.suicideRiskDescription"
                    class="bg-muted-50 dark:bg-muted-800 mt-3 rounded-xl p-3 text-xs leading-6"
                  >
                    <span class="text-muted-500">توضیح تحلیل:</span>
                    <p class="text-muted-700 dark:text-muted-200 mt-2">
                      {{ message.analysis.suicideRiskDescription }}
                    </p>
                  </div>

                  <div v-if="message.analysis?.suicideIndicators?.length" class="mt-3">
                    <div class="text-muted-500 mb-2 text-xs">
                      شاخص‌های تشخیص داده‌شده:
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <BaseTag
                        v-for="(indicator, idx) in message.analysis.suicideIndicators"
                        :key="idx"
                        :color="indicator?.dangerousnessLevel === 'high' ? 'danger' : indicator?.dangerousnessLevel === 'medium' ? 'warning' : 'info'"
                        shape="rounded"
                        size="sm"
                      >
                        <div class="flex items-center gap-2 px-2 py-1">
                          <Icon name="ph:shield-check-duotone" class="size-4" />
                          <span>{{ translateIndicatorType(indicator?.indicatorType) || 'شاخص' }}</span>
                        </div>
                      </BaseTag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>

          <BaseCard
            v-else
            shape="curved"
            class="mt-6 p-8 text-center"
          >
            <div class="flex flex-col items-center gap-3">
              <Icon name="ph:chat-slash-duotone" class="text-muted-300 size-12" />
              <BaseHeading
                tag="h3"
                size="sm"
                class="text-muted-700 dark:text-muted-300"
              >
                تحلیلی برای این جلسه ثبت نشده است
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">
                برای نمایش گزارش خطر نیاز است پیام‌های کاربر تحلیل شده و نتایج مربوط به خطر آسیب به خود در سیستم ذخیره
                شده باشند.
              </BaseParagraph>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.apexcharts-datalabels) {
  pointer-events: none;
}

:deep(.apexcharts-datalabel) {
  transition: all 0.3s ease;
}

:deep(.apexcharts-datalabel-label) {
  fill: #1F2937 !important;
}

:deep(.apexcharts-datalabel-value) {
  fill: #1F2937 !important;
}

/* NA Risk Label Styling - Full yellow rectangular background */
:deep(.na-risk-label) {
  background: #fbbf24 !important;
  border: 2px solid #f59e0b !important;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3) !important;
  transform: translate(-50%, calc(-100% - 12px)) !important;
}

:deep(.na-risk-label .apexcharts-datalabel-label),
:deep(.na-risk-label .apexcharts-datalabel-value) {
  fill: #78350f !important;
  font-weight: 700 !important;
}

:deep(.none-risk-label),
:deep(.low-risk-label) {
  background: #22c55e !important;
  border: 2px solid #16a34a !important;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3) !important;
}

:deep(.none-risk-label .apexcharts-datalabel-label),
:deep(.none-risk-label .apexcharts-datalabel-value),
:deep(.low-risk-label .apexcharts-datalabel-label),
:deep(.low-risk-label .apexcharts-datalabel-value) {
  fill: #ffffff !important;
  font-weight: 700 !important;
}

:deep(.medium-risk-label) {
  background: #f97316 !important;
  border: 2px solid #ea580c !important;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3) !important;
}

:deep(.medium-risk-label .apexcharts-datalabel-label),
:deep(.medium-risk-label .apexcharts-datalabel-value) {
  fill: #ffffff !important;
  font-weight: 700 !important;
}

:deep(.high-risk-label) {
  background: #ef4444 !important;
  border: 2px solid #dc2626 !important;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3) !important;
}

:deep(.high-risk-label .apexcharts-datalabel-label),
:deep(.high-risk-label .apexcharts-datalabel-value) {
  fill: #ffffff !important;
  font-weight: 700 !important;
}

:deep(.critical-risk-label) {
  background: #9333ea !important;
  border: 2px solid #7e22ce !important;
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.3) !important;
}

:deep(.critical-risk-label .apexcharts-datalabel-label),
:deep(.critical-risk-label .apexcharts-datalabel-value) {
  fill: #ffffff !important;
  font-weight: 700 !important;
}

/* Enhanced line styling for better visibility */
:deep(.apexcharts-line-series .apexcharts-series) {
  transition: all 0.3s ease;
}

/* Tooltip custom styling */
:deep(.apexcharts-tooltip-custom) {
  font-family: 'IRANSansX', sans-serif !important;
}

/* Make NA markers more distinctive */
:deep(.apexcharts-marker) {
  transition: all 0.2s ease;
}

:deep(.apexcharts-marker:hover) {
  transform: scale(1.2);
}
</style>
