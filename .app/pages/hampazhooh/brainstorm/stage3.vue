<script setup lang="ts">
  interface EvaluationCriteria {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: 'primary' | 'info' | 'success' | 'warning' | 'danger';
  }

  interface Idea {
    id: string;
    title: string;
    description: string;
    scores: Record<string, number>;
    totalScore: number;
    category?: string;
  }

  interface Tool {
    title: string;
    description: string;
    icon: string;
    color: 'primary' | 'info' | 'success';
  }

  definePageMeta({
    title: 'مرحله ۳: ساختاردهی و ارزیابی',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();
  const toaster = useToaster();
  const { streamChat } = useOpenRouter();

  const evaluationCriteria: EvaluationCriteria[] = [
    {
      id: 'innovation',
      title: 'نوآوری',
      description: 'آیا ایده جدید یا ترکیبی نو است؟',
      icon: 'ph:rocket-launch',
      color: 'primary',
    },
    {
      id: 'feasibility',
      title: 'قابلیت اجرا',
      description: 'آیا با منابع و زمان موجود قابل پیاده‌سازی است؟',
      icon: 'ph:checks',
      color: 'info',
    },
    {
      id: 'alignment',
      title: 'هماهنگی با اهداف',
      description: 'آیا با اهداف پروژه/دانشجو/سازمان همسو است؟',
      icon: 'ph:target',
      color: 'success',
    },
    {
      id: 'impact',
      title: 'پتانسیل تأثیر',
      description: 'آیا می‌تواند به دانش یا عمل تأثیر بگذارد؟',
      icon: 'ph:chart-line-up',
      color: 'warning',
    },
    {
      id: 'scalability',
      title: 'قابلیت تعمیم',
      description: 'آیا نتایج قابل تعمیم به سایر زمینه‌ها هستند؟',
      icon: 'ph:arrows-out',
      color: 'danger',
    },
  ];

  const tools: Tool[] = [
    {
      title: 'ماتریس ارزیابی ایده',
      description: 'ارزیابی ایده‌ها بر اساس معیارهای مشخص و مقایسه آن‌ها',
      icon: 'ph:table',
      color: 'primary',
    },
    {
      title: 'نقشهٔ ذهنی',
      description: 'ایجاد یک نقشه بصری از مفاهیم و ارتباطات آن‌ها برای درک بهتر ایده‌ها',
      icon: 'ph:tree-structure',
      color: 'info',
    },
    {
      title: 'کارت‌های ایده',
      description: 'دسته‌بندی ایده‌ها بر اساس نوع رویکرد یا حوزه',
      icon: 'ph:cards',
      color: 'success',
    },
  ];

  const ideas = ref<Idea[]>([
    {
      id: '1',
      title: 'بررسی تأثیر فناوری بر رفتار',
      description: 'مطالعه چگونگی تأثیر فناوری‌های نوین بر الگوهای رفتاری انسان',
      scores: {},
      totalScore: 0,
    },
    {
      id: '2',
      title: 'تحلیل تعاملات مجازی',
      description: 'بررسی الگوهای تعاملی در محیط‌های مجازی و شبکه‌های اجتماعی',
      scores: {},
      totalScore: 0,
    },
    {
      id: '3',
      title: 'عوامل موثر بر بهره‌وری',
      description: 'شناسایی و تحلیل عوامل کلیدی موثر بر بهره‌وری و سلامت روان',
      scores: {},
      totalScore: 0,
    },
  ]);

  const selectedIdea = ref<string | null>(null);
  const evaluationMode = ref<'matrix' | 'concept-map' | 'cards'>('matrix');

  // Mind Map State
  const showMindMapModal = ref(false);
  const mindMapNodes = ref<Array<{ id: string; label: string; x: number; y: number }>>([]);
  const mindMapConnections = ref<Array<{ from: string; to: string }>>([]);
  const mindMapLoading = ref(false);

  // Vue Flow Data
  const flowNodes = ref<Node[]>([]);
  const flowEdges = ref<Edge[]>([]);
  const flowLoading = ref(false);

  const updateScore = (ideaId: string, criteriaId: string, score: number) => {
    const idea = ideas.value.find(i => i.id === ideaId);
    if (idea) {
      idea.scores[criteriaId] = score;
      idea.totalScore = Object.values(idea.scores).reduce((sum, val) => sum + val, 0);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'success';
    if (score >= 5) return 'warning';
    if (score >= 3) return 'info';
    return 'muted';
  };

  const sortedIdeas = computed(() => {
    return [...ideas.value].sort((a, b) => b.totalScore - a.totalScore);
  });

  const selectIdea = (ideaId: string) => {
    selectedIdea.value = ideaId;
  };

  const saveAndContinue = () => {
    router.push('/hampazhooh/brainstorm/stage4');
  };

  const goBack = () => {
    router.push('/hampazhooh/brainstorm/stage2');
  };

  const exportEvaluation = () => {
    // Implementation for exporting evaluation
  };

  // Mind Map Functions
  const openMindMap = () => {
    if (ideas.value.length === 0) {
      toaster.show({
        title: 'هشدار',
        message: 'ابتدا حداقل یک ایده وارد کنید.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    // Initialize Vue Flow with main concepts if empty
    if (flowNodes.value.length === 0) {
      const mainIdea = ideas.value[0];
      flowNodes.value = [
        {
          id: 'main',
          type: 'default',
          position: { x: 400, y: 200 },
          label: mainIdea.title,
          style: { backgroundColor: '#10b981', color: 'white' },
        },
      ];

      // Add other ideas as nodes
      ideas.value.slice(1, 4).forEach((idea, index) => {
        const angle = ((index + 1) / 4) * 2 * Math.PI;
        const x = 400 + 200 * Math.cos(angle);
        const y = 200 + 200 * Math.sin(angle);

        flowNodes.value.push({
          id: `idea-${idea.id}`,
          type: 'default',
          position: { x, y },
          label: idea.title,
          style: { backgroundColor: '#3b82f6', color: 'white' },
        });

        flowEdges.value.push({
          id: `main-${idea.id}`,
          source: 'main',
          target: `idea-${idea.id}`,
          type: 'smoothstep',
        });
      });

      flowEdges.value = [];
    }

    showMindMapModal.value = true;
  };

  async function generateMindMapSuggestions() {
    mindMapLoading.value = true;
    try {
      const topIdeas = sortedIdeas.value.slice(0, 3).map(idea => idea.title).join(', ');
      const prompt = `بر اساس ایده‌های برتر زیر، ۵ مفهوم کلیدی مرتبط را پیشنهاد دهید که باید در نقشه ذهنی قرار گیرند:

ایده‌های برتر: ${topIdeas}

فقط لیست مفاهیم را با خط تیره بنویسید، بدون توضیحات اضافی:
- مفهوم ۱
- مفهوم ۲
...`;

      const messages = [{ role: 'user', content: prompt }];
      let result = '';

      await new Promise<void>((resolve, reject) => {
        streamChat(messages, {}, (chunk) => {
          if (chunk) {
            result += chunk;
          }
        })
          .then(resolve)
          .catch(reject);
      });

      // Parse suggestions and add as nodes
      const concepts = result
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());

      // Add nodes in a circle around the main area
      const centerX = 400;
      const centerY = 300;
      const radius = 250;

      concepts.forEach((concept, index) => {
        const angle = (index / concepts.length) * 2 * Math.PI;
        const nodeId = `concept-${Date.now()}-${index}`;

        mindMapNodes.value.push({
          id: nodeId,
          label: concept,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        });

        // Connect to main idea if it exists
        if (flowNodes.value.length > 0) {
          mindMapConnections.value.push({
            from: 'main',
            to: nodeId,
          });
        }
      });

      toaster.show({
        title: 'موفقیت',
        message: `${concepts.length} مفهوم جدید به نقشه ذهنی اضافه شد.`,
        color: 'success',
        icon: 'ph:check-circle',
      });
    }
  catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در تولید پیشنهادات.',
      color: 'danger',
      icon: 'ph:warning',
    });
  }
  finally {
    mindMapLoading.value = false;
  }
  }

  const addMindMapNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      label: 'مفهوم جدید',
      x: 400 + Math.random() * 200 - 100,
      y: 300 + Math.random() * 200 - 100,
    };
    mindMapNodes.value.push(newNode);
  };

  const removeMindMapNode = (nodeId: string) => {
    mindMapNodes.value = mindMapNodes.value.filter(n => n.id !== nodeId);
    mindMapConnections.value = mindMapConnections.value.filter(c => c.from !== nodeId && c.to !== nodeId);
  };

  const exportMindMapAsMarkdown = () => {
    const mainIdea = ideas.value[0]?.title || 'ایده‌ها';
    let markdown = `# نقشه ذهنی: ${mainIdea}\n\n`;
    markdown += '## مفاهیم کلیدی\n\n';

    // Add ideas
    ideas.value.forEach((idea) => {
      markdown += `- ${idea.title} (امتیاز: ${idea.totalScore})\n`;
    });

    // Add concepts
    mindMapNodes.value.forEach((node) => {
      markdown += `- ${node.label}\n`;
    });

    markdown += '\n## ارتباطات\n\n';
    mindMapConnections.value.forEach((conn) => {
      const fromNode = [...ideas.value.map(i => ({ ...i, id: `idea-${i.id}`, label: i.title })), ...mindMapNodes.value].find(n => n.id === conn.from);
      const toNode = [...ideas.value.map(i => ({ ...i, id: `idea-${i.id}`, label: i.title })), ...mindMapNodes.value].find(n => n.id === conn.to);
      if (fromNode && toNode) {
        markdown += `- ${fromNode.label} → ${toNode.label}\n`;
      }
    });

    // Download as file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mind-map.md';
    a.click();
    URL.revokeObjectURL(url);

    toaster.show({
      title: 'موفقیت',
      message: 'نقشه ذهنی دانلود شد.',
      color: 'success',
      icon: 'ph:check-circle',
    });
  };

  // Vue Flow Functions
  const onFlowNodeClick = (event: any) => {
    console.log('Flow node clicked:', event.node);
  };

  const onFlowEdgeClick = (event: any) => {
    console.log('Flow edge clicked:', event.edge);
  };

  const onFlowConnect = (connection: any) => {
    console.log('Flow connected:', connection);
  };

  // Get VueFlow instance once
  const { fitView } = useVueFlow();

  // Auto-layout function
  const autoLayoutNodes = () => {
    if (flowNodes.value.length === 0) return;

    const centerX = 400;
    const centerY = 200;
    const radius = 150;

    flowNodes.value = flowNodes.value.map((node, index) => {
      if (node.id === 'main') {
        return { ...node, position: { x: centerX, y: centerY } };
      }

      // Arrange other nodes in a circle around main
      const angle = (index / (flowNodes.value.length - 1)) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return { ...node, position: { x, y } };
    });

    // Recenter view after layout
    nextTick(() => {
      fitView({ padding: 0.2 });
    });
  };

  async function generateFlowMindMap() {
    flowLoading.value = true;
    try {
      // Collect all available information from page
      const topIdeas = sortedIdeas.value.slice(0, 3);
      const allData = {
        ideas: topIdeas,
        evaluationCriteria: evaluationCriteria,
      };

      const prompt = `بر اساس ایده‌های ارزیابی شده زیر، یک نقشه ذهنی ساده و واضح تولید کنید:

ایده‌های برتر: ${topIdeas.map(idea => `${idea.title} (امتیاز: ${idea.totalScore})`).join(', ')}

پاسخ را حتماً به صورت JSON برگردانید با ساختار زیر:

{
  "nodes": [
    {"id": "main", "label": "ایده اصلی", "type": "default", "position": {"x": 400, "y": 200}},
    {"id": "idea1", "label": "ایده دوم", "type": "default", "position": {"x": 150, "y": 100}},
    {"id": "idea2", "label": "ایده سوم", "type": "default", "position": {"x": 650, "y": 100}},
    {"id": "criteria", "label": "معیارهای ارزیابی", "type": "default", "position": {"x": 200, "y": 300}},
    {"id": "connections", "label": "ارتباطات", "type": "default", "position": {"x": 600, "y": 300}}
  ],
  "edges": [
    {"id": "e-main-idea1", "source": "main", "target": "idea1", "type": "smoothstep"},
    {"id": "e-main-idea2", "source": "main", "target": "idea2", "type": "smoothstep"},
    {"id": "e-main-criteria", "source": "main", "target": "criteria", "type": "smoothstep", "label": "ارزیابی"},
    {"id": "e-main-connections", "source": "main", "target": "connections", "type": "smoothstep", "animated": true, "label": "ارتباطات"}
  ]
}

قوانین مهم:
1. فقط ۵ گره اصلی برای سادگی و خوانایی
2. فقط ۴ ارتباط مستقیم به گره اصلی  
3. برچسب‌ها کوتاه و واضح
4. فقط اطلاعات کلیدی و مهم را نمایش دهید
5. موقعیت‌ها با فاصله مناسب از هم برای خوانایی بهتر
6. ساختار متوازن و قرینه برای زیبایی بصری
7. فقط JSON برگردانید`;

      const messages = [{ role: 'user', content: prompt }];
      let result = '';

      await new Promise<void>((resolve, reject) => {
        streamChat(messages, {}, (chunk) => {
          if (chunk) {
            result += chunk;
          }
        })
          .then(resolve)
          .catch(reject);
      });

      // Parse JSON response
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const mindMapJson = JSON.parse(jsonMatch[0]);

          if (mindMapJson.nodes && Array.isArray(mindMapJson.nodes)) {
            flowNodes.value = mindMapJson.nodes.map((node: any) => {
              // Determine node color based on its role
              let style = { backgroundColor: '#6b7280', color: 'white', border: '2px solid #374151' };

              if (node.id === 'main') {
                style = {
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: '3px solid #059669',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  fontSize: '16px',
                  fontWeight: 'bold',
                };
              }
 else if (node.id.includes('idea')) {
                style = {
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: '2px solid #2563eb',
                };
              }
 else if (node.id.includes('criteria')) {
                style = {
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: '2px solid #7c3aed',
                };
              }
 else if (node.id.includes('connection')) {
                style = {
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: '2px solid #d97706',
                };
              }

              return {
                ...node,
                style,
                data: {
                  ...node.data,
                  label: node.label,
                },
              };
            });
          }

          if (mindMapJson.edges && Array.isArray(mindMapJson.edges)) {
            flowEdges.value = mindMapJson.edges.map((edge: any) => ({
              ...edge,
              style: {
                strokeWidth: edge.animated ? 3 : 2,
                stroke: edge.animated ? '#10b981' : '#6b7280',
              },
              labelStyle: {
                fill: '#374151',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '2px 6px',
                borderRadius: '4px',
              },
              markerEnd: {
                type: 'arrowclosed',
                color: edge.animated ? '#10b981' : '#6b7280',
              },
            }));
          }
        }
      }
 catch (parseError) {
        console.error('Error parsing mind map JSON:', parseError);

        // Create simple fallback nodes with better spacing
        const fallbackNodes = [
          {
            id: 'main',
            type: 'default',
            position: { x: 400, y: 200 },
            label: topIdeas[0]?.title || 'ایده اصلی',
            style: {
              backgroundColor: '#10b981',
              color: 'white',
              border: '3px solid #059669',
              fontSize: '16px',
              fontWeight: 'bold',
            },
          },
        ];

        // Add idea nodes
        topIdeas.slice(1, 3).forEach((idea, index) => {
          const positions = [
            { x: 150, y: 100 },
            { x: 650, y: 100 },
          ];
          if (positions[index]) {
            fallbackNodes.push({
              id: `idea-${index + 1}`,
              type: 'default',
              position: positions[index],
              label: idea.title,
              style: { backgroundColor: '#3b82f6', color: 'white', border: '2px solid #2563eb' },
            });
          }
        });

        // Add criteria node
        fallbackNodes.push({
          id: 'criteria',
          type: 'default',
          position: { x: 200, y: 300 },
          label: 'معیارهای ارزیابی',
          style: { backgroundColor: '#8b5cf6', color: 'white', border: '2px solid #7c3aed' },
        });

        // Add connections node
        fallbackNodes.push({
          id: 'connections',
          type: 'default',
          position: { x: 600, y: 300 },
          label: 'ارتباطات',
          style: { backgroundColor: '#06b6d4', color: 'white', border: '2px solid #0891b2' },
        });

        // Create simple edges
        const fallbackEdges = [
          { id: 'e-main-idea1', source: 'main', target: 'idea-1', type: 'smoothstep' },
          { id: 'e-main-idea2', source: 'main', target: 'idea-2', type: 'smoothstep' },
          { id: 'e-main-criteria', source: 'main', target: 'criteria', type: 'smoothstep', label: 'ارزیابی' },
          { id: 'e-main-connections', source: 'main', target: 'connections', type: 'smoothstep', animated: true, label: 'ارتباطات' },
        ];

        flowNodes.value = fallbackNodes;
        flowEdges.value = fallbackEdges;
      }

      toaster.show({
        title: 'موفقیت',
        message: `نقشه ذهنی جامع با ${flowNodes.value.length} مفهوم و ${flowEdges.value.length} ارتباط تولید شد.`,
        color: 'success',
        icon: 'ph:check-circle',
      });
    }
  catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در تولید نقشه ذهنی.',
      color: 'danger',
      icon: 'ph:warning',
    });
  }
  finally {
    flowLoading.value = false;
  }
  }

  import { VueFlow, useVueFlow } from '@vue-flow/core';
  import { Controls } from '@vue-flow/controls';
  import { MiniMap } from '@vue-flow/minimap';
  import { Background } from '@vue-flow/background';
  import type { Node, Edge, Connection } from '@vue-flow/core';

  import '@vue-flow/core/dist/style.css';
  import '@vue-flow/core/dist/theme-default.css';
  import '@vue-flow/controls/dist/style.css';
  import '@vue-flow/minimap/dist/style.css';
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4">
          <BaseButton
            color="muted"
            shape="curved"
            size="sm"
            @click="goBack"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-4" />
            مرحله قبل
          </BaseButton>
          <div class="flex-1">
            <div class="mb-2 flex items-center gap-3">
              <div class="bg-success-500 shadow-success-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg">
                <Icon name="ph:funnel" class="size-6 text-white" />
              </div>
              <div>
                <div class="text-success-500 mb-1 text-xs font-semibold uppercase tracking-wider">
                  مرحله ۳
                </div>
                <BaseHeading
                  as="h1"
                  size="2xl"
                  weight="bold"
                  class="text-gray-900 dark:text-white"
                >
                  ساختاردهی و ارزیابی
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">
                  Convergent Structuring & Evaluation
                </BaseParagraph>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <!-- Introduction -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="mb-3 text-gray-900 dark:text-white"
            >
              هدف این مرحله
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 leading-relaxed">
              در این مرحله، ایده‌های پراکنده را فیلتر، دسته‌بندی و اولویت‌بندی می‌کنیم. هدف تبدیل ایده‌های خلاقانه به طرح‌های پژوهشی قابل اجرا و شناسایی رویکردهای پژوهشی مناسب است.
            </BaseParagraph>
          </div>

          <!-- Key Features -->
          <div class="dark:border-muted-700 dark:bg-muted-900/50 rounded-xl border border-gray-100 bg-gray-50 p-6">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="mb-4 text-gray-900 dark:text-white"
            >
              فعالیت‌های کلیدی
            </BaseHeading>
            <div class="grid gap-4 sm:grid-cols-3">
              <div class="flex items-start gap-3">
                <Icon name="ph:funnel-fill" class="text-success-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    فیلتر کردن
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    انتخاب ایده‌های قابل اجرا
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:stack-fill" class="text-success-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    دسته‌بندی
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    گروه‌بندی بر اساس موضوع
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:ranking-fill" class="text-success-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    اولویت‌بندی
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    ترتیب براساس ارزش
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Evaluation Criteria -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="mb-2 text-gray-900 dark:text-white"
            >
              معیارهای ارزیابی
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              هر ایده را بر اساس این پنج معیار کلیدی ارزیابی کنید (از ۱ تا ۱۰)
            </BaseParagraph>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div
              v-for="criteria in evaluationCriteria"
              :key="criteria.id"
              class="dark:border-muted-700 dark:bg-muted-900/30 rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div
                :class="[
                  'mb-3 flex size-12 items-center justify-center rounded-xl',
                  `bg-${criteria.color}-500/10`,
                ]"
              >
                <Icon
                  :name="criteria.icon"
                  :class="[`text-${criteria.color}-500`, 'size-6']"
                />
              </div>
              <div class="text-muted-800 mb-2 text-sm font-semibold dark:text-white">
                {{ criteria.title }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-xs leading-relaxed">
                {{ criteria.description }}
              </div>
            </div>
          </div>
        </div>

        <!-- Evaluation Matrix -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <BaseHeading
                as="h2"
                size="xl"
                weight="semibold"
                class="text-gray-900 dark:text-white"
              >
                ماتریس ارزیابی ایده‌ها
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 mt-1">
                به هر ایده امتیاز دهید و نتایج را مشاهده کنید
              </BaseParagraph>
            </div>
            <BaseButton
              color="muted"
              shape="curved"
              size="sm"
              @click="exportEvaluation"
            >
              <Icon name="ph:download-simple" class="ml-2 size-4" />
              دانلود
            </BaseButton>
          </div>

          <!-- Matrix Table -->
          <div class="overflow-x-auto">
            <div class="min-w-[800px]">
              <!-- Header Row -->
              <div class="dark:border-muted-700 dark:bg-muted-900/50 mb-2 grid grid-cols-7 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div class="col-span-2 text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                  ایده
                </div>
                <div
                  v-for="criteria in evaluationCriteria"
                  :key="criteria.id"
                  class="text-center text-xs font-semibold uppercase text-gray-600 dark:text-gray-400"
                >
                  {{ criteria.title }}
                </div>
              </div>

              <!-- Idea Rows -->
              <div class="space-y-2">
                <div
                  v-for="idea in ideas"
                  :key="idea.id"
                  class="dark:border-muted-700 dark:bg-muted-900/30 grid grid-cols-7 items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 transition-all duration-200 hover:shadow-md"
                >
                  <!-- Idea Title -->
                  <div class="col-span-2">
                    <div class="text-muted-800 mb-1 text-sm font-semibold dark:text-white">
                      {{ idea.title }}
                    </div>
                    <div class="text-muted-500 line-clamp-2 text-xs">
                      {{ idea.description }}
                    </div>
                  </div>

                  <!-- Score Inputs -->
                  <div
                    v-for="criteria in evaluationCriteria"
                    :key="criteria.id"
                    class="flex justify-center"
                  >
                    <BaseInput
                      :model-value="idea.scores[criteria.id] || 0"
                      type="number"
                      min="0"
                      max="10"
                      shape="curved"
                      :classes="{ input: 'h-10 w-16 text-center' }"
                      @update:model-value="(val) => updateScore(idea.id, criteria.id, Number(val))"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ranked Results -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="mb-2 text-gray-900 dark:text-white"
            >
              نتایج رتبه‌بندی شده
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              ایده‌ها بر اساس امتیاز کل مرتب شده‌اند
            </BaseParagraph>
          </div>

          <div class="space-y-4">
            <div
              v-for="(idea, index) in sortedIdeas"
              :key="idea.id"
              class="dark:border-muted-700 dark:bg-muted-900/30 group relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:shadow-lg"
            >
              <!-- Rank Badge -->
              <div class="absolute left-4 top-4">
                <div
                  :class="[
                    'flex size-10 items-center justify-center rounded-full font-bold text-white shadow-lg',
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-muted-500',
                  ]"
                >
                  {{ index + 1 }}
                </div>
              </div>

              <div class="mr-16">
                <div class="mb-3 flex items-start justify-between">
                  <div class="flex-1">
                    <BaseHeading
                      as="h3"
                      size="lg"
                      weight="semibold"
                      class="mb-2 text-gray-900 dark:text-white"
                    >
                      {{ idea.title }}
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                      {{ idea.description }}
                    </BaseParagraph>
                  </div>
                  <div class="mr-4 text-left">
                    <div class="text-muted-500 mb-1 text-xs">
                      امتیاز کل
                    </div>
                    <div
                      :class="[
                        'text-3xl font-bold',
                        idea.totalScore >= 40 ? 'text-success-500' : idea.totalScore >= 25 ? 'text-warning-500' : 'text-muted-400',
                      ]"
                    >
                      {{ idea.totalScore }}
                    </div>
                    <div class="text-muted-500 text-xs">
                      از ۵۰
                    </div>
                  </div>
                </div>

                <!-- Score Breakdown -->
                <div class="flex flex-wrap gap-2">
                  <BaseTag
                    v-for="criteria in evaluationCriteria"
                    :key="criteria.id"
                    :color="getScoreColor(idea.scores[criteria.id] || 0)"
                    size="sm"
                    shape="full"
                  >
                    {{ criteria.title }}: {{ idea.scores[criteria.id] || 0 }}
                  </BaseTag>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tools Section -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="mb-2 text-gray-900 dark:text-white"
            >
              ابزارهای پیشنهادی
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              ابزارهای دیگر برای ساختاردهی بهتر ایده‌ها
            </BaseParagraph>
          </div>

          <div class="grid gap-6 lg:grid-cols-3">
            <div
              v-for="tool in tools"
              :key="tool.title"
              :class="[
                'dark:border-muted-700 dark:bg-muted-900/30 group overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:shadow-lg',
                tool.title.includes('نقشه') ? 'cursor-pointer' : ''
              ]"
              @click="tool.title.includes('نقشه') ? openMindMap() : null"
            >
              <div
                :class="[
                  'mb-4 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                  `bg-${tool.color}-500/10`,
                ]"
              >
                <Icon
                  :name="tool.icon"
                  :class="[`text-${tool.color}-500`, 'size-6']"
                />
              </div>
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
                {{ tool.title }}
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                {{ tool.description }}
              </BaseParagraph>
            </div>
          </div>
        </div>

        <!-- Tips Box -->
        <div class="bg-success-500/10 dark:bg-success-500/20 border-success-500/20 mb-8 rounded-2xl border-2 p-6">
          <div class="flex items-start gap-4">
            <div class="bg-success-500 flex size-12 shrink-0 items-center justify-center rounded-xl">
              <Icon name="ph:lightbulb-fill" class="size-6 text-white" />
            </div>
            <div class="flex-1">
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-3 text-gray-900 dark:text-white"
              >
                نکات مهم برای این مرحله
              </BaseHeading>
              <ul class="text-muted-700 dark:text-muted-200 space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-success-500 mt-1 size-4 shrink-0" />
                  <span>هنگام امتیازدهی، واقع‌بین باشید اما خوش‌بین. محدودیت‌ها را در نظر بگیرید.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-success-500 mt-1 size-4 shrink-0" />
                  <span>ایده‌های با امتیاز پایین را حذف نکنید - ممکن است در آینده مفید باشند.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-success-500 mt-1 size-4 shrink-0" />
                  <span>می‌توانید چند ایده را ترکیب کنید تا ایده‌ای قوی‌تر ایجاد کنید.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-success-500 mt-1 size-4 shrink-0" />
                  <span>از دیگران نظر بخواهید - دیدگاه خارجی می‌تواند ارزیابی را بهبود دهد.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center justify-between">
          <BaseButton
            color="muted"
            shape="curved"
            size="lg"
            @click="goBack"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-5" />
            مرحله قبل
          </BaseButton>
          <BaseButton
            color="warning"
            shape="curved"
            size="lg"
            class="shadow-warning-500/30 shadow-lg"
            @click="saveAndContinue"
          >
            ذخیره و ادامه
            <Icon name="ph:arrow-left" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Mind Map Modal -->
    <TairoModal
      :open="showMindMapModal"
      size="6xl"
      @close="showMindMapModal = false"
    >
      <template #header>
        <div class="flex items-center justify-between p-6 pb-0">
          <div class="flex items-center gap-3">
            <div class="bg-info-500 flex size-12 items-center justify-center rounded-xl">
              <Icon name="ph:tree-structure" class="size-6 text-white" />
            </div>
            <div>
              <BaseHeading
                as="h2"
                size="xl"
                weight="bold"
              >
                نقشه ذهنی ایده‌ها
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">
                مفاهیم کلیدی و ارتباطات ایده‌ها
              </BaseParagraph>
            </div>
          </div>
          <div class="flex gap-2">
            <BaseButton
              color="muted"
              shape="curved"
              size="sm"
              @click="autoLayoutNodes"
            >
              <Icon name="ph:arrows-out" class="ml-2 size-4" />
              مرتب‌سازی خودکار
            </BaseButton>
            <BaseButton
              color="info"
              shape="curved"
              :disabled="flowLoading"
              @click="generateFlowMindMap"
            >
              <Icon
                v-if="!flowLoading"
                name="ph:sparkle"
                class="ml-2 size-4"
              />
              <Icon
                v-else
                name="svg-spinners:90-ring-with-bg"
                class="ml-2 size-4"
              />
              تولید با هوش مصنوعی
            </BaseButton>
            <BaseButton
              color="muted"
              shape="curved"
              @click="exportMindMapAsMarkdown"
            >
              <Icon name="ph:download-simple" class="ml-2 size-4" />
              دانلود
            </BaseButton>
          </div>
        </div>
      </template>

      <div class="p-8">
        <!-- Vue Flow Container -->
        <div class="h-[70vh] w-full p-4">
          <VueFlow
            v-model:nodes="flowNodes"
            v-model:edges="flowEdges"
            :default-zoom="0.8"
            :min-zoom="0.1"
            :max-zoom="4"
            :fit-view-on-init="true"
            class="rtl-flow"
            @node-click="onFlowNodeClick"
            @edge-click="onFlowEdgeClick"
            @connect="onFlowConnect"
          >
            <Controls />
            <MiniMap />
            <Background pattern-color="#aaa" :gap="20" />
          </VueFlow>
        </div>

        <!-- Node Count -->
        <div class="text-muted-600 dark:text-muted-400 mt-4 text-center text-sm">
          <Icon name="ph:tree-structure" class="ml-2 inline-block size-4" />
          تعداد مفاهیم: {{ flowNodes.length }} | ارتباطات: {{ flowEdges.length }}
        </div>
      </div>
    </TairoModal>
  </div>
</template>

<style>
  .rtl-flow {
    direction: ltr;
  }

  .vue-flow__controls {
    direction: ltr;
  }

  .vue-flow__minimap {
    direction: ltr;
  }

  /* Improve node spacing and readability */
  .vue-flow__node {
    font-family: inherit !important;
    font-size: 14px !important;
    text-align: center !important;
  }

  .vue-flow__edge-label {
    font-size: 12px !important;
    font-weight: 600 !important;
    background: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 4px !important;
    padding: 2px 8px !important;
  }

  /* Better edge styling */
  .vue-flow__edge-path {
    stroke-width: 2px !important;
  }

  .vue-flow__edge-path.animated {
    stroke-width: 3px !important;
  }
</style>
