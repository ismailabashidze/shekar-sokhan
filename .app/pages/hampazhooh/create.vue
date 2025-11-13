<script setup lang="ts">
interface ProjectType {
	id: string;
	title: string;
	description: string;
	icon: string;
	color: "primary" | "info" | "success" | "warning";
}

interface FormData {
	projectType: string;
	researchDomain: string[];
	keywords: string[];
	objectives: string;
	researchGoals: string[];
	methodology: string;
	ethicsApproval: boolean;
	fundingSource: string;
	necessity: string;
	importance: string;
}

definePageMeta({
	title: "ایجاد پروژه جدید",
	layout: "sidebar",
});

useHead({ htmlAttrs: { dir: "rtl" } });

const { getOrganizedCategories } = useResearcher();
const {
	researchCategories,
	selectedInterests,
	toggleNode,
	expandNode,
	collapseNode,
	isNodeExpanded,
	getSelectedBranches,
	getSelectionSummary,
	filterNodes,
	flattenNodes,
	loadResearchData,
} = useResearcher();

const router = useRouter();
const toaster = useToaster();

const currentStep = ref(5);
const totalSteps = 5;
const isBrainstorming = ref(false);
const brainstormResults = ref("");

const formData = ref<FormData>({
	projectType: "",
	researchDomain: [],
	keywords: [],
	objectives: "",
	researchGoals: [],
	methodology: "",
	ethicsApproval: false,
	fundingSource: "",
	necessity: "",
	importance: "",
});

const projectTypes: ProjectType[] = [
	{
		id: "project",
		title: "پروژه",
		description: "پروژه پژوهشی عمومی با اهداف مشخص و محدودیت زمانی",
		icon: "ph:folder-open",
		color: "primary",
	},
	{
		id: "doctoral",
		title: "رساله دکتری",
		description: "رساله دکتری با نیاز به تحقیق عمیق و مستند",
		icon: "ph:graduation-cap",
		color: "info",
	},
	{
		id: "masters",
		title: "پایان‌نامه کارشناسی ارشد",
		description: "تحقیق جامع در سطح کارشناسی ارشد با نظارت استاد راهنما",
		icon: "ph:student",
		color: "success",
	},
	{
		id: "article",
		title: "اقدام پژوهشی برای تولید مقاله",
		description: "تحقیق کوچک‌تر با هدف انتشار مقاله علمی",
		icon: "ph:article",
		color: "warning",
	},
];

const steps = computed(() => [
	{ number: 1, title: "نوع پروژه", completed: currentStep.value > 1 },
	{ number: 2, title: "طوفان فکری", completed: currentStep.value > 2 },
	{ number: 3, title: "حوزه و اهداف", completed: currentStep.value > 3 },
	{ number: 4, title: "جزئیات پژوهش", completed: currentStep.value > 4 },
	{ number: 5, title: "بررسی و ثبت", completed: currentStep.value > 5 },
]);

const canGoNext = computed(() => {
	if (currentStep.value === 1) return formData.value.projectType !== "";
	if (currentStep.value === 2) return true;
	if (currentStep.value === 3) {
		return (
			formData.value.researchDomain.length > 0 &&
			formData.value.researchGoals.length > 0 &&
			formData.value.keywords.length > 0
		);
	}
	if (currentStep.value === 4) {
		return (
			formData.value.objectives &&
			formData.value.methodology &&
			formData.value.necessity &&
			formData.value.importance
		);
	}
	return true;
});

const selectProjectType = (typeId: string) => {
	formData.value.projectType = typeId;
};

const nextStep = () => {
	if (canGoNext.value && currentStep.value < totalSteps) {
		currentStep.value++;
	}
};

const previousStep = () => {
	if (currentStep.value > 1) {
		currentStep.value--;
	}
};

const submitForm = () => {
	toaster.show({
		title: "موفق",
		message: "پروژه با موفقیت ایجاد شد",
		color: "success",
		icon: "ph:check-circle-fill",
		closable: true,
	});
	router.push("/hampazhooh/projects");
};

const cancelForm = () => {
	router.push("/hampazhooh/projects");
};

const newKeyword = ref("");
const newResearchGoal = ref("");
const domainInput = ref("");

// Default domain suggestions
const defaultDomainSuggestions = [
	"روانشناسی",
	"علوم کامپیوتر",
	"مهندسی",
	"پزشکی",
	"علوم تربیتی",
	"مدیریت",
	"ریاضیات",
	"فیزیک",
];

// Use useResearcher for domain and keyword management
const researchDomains = computed(() => {
	return flattenNodes(researchCategories.value).filter(
		(node) => node.type === "category" || node.type === "subcategory",
	);
});

const domainSuggestions = computed(() => {
	const domains = researchDomains.value;
	const selected = formData.value.researchDomain;
	return domains
		.filter((domain) => !selected.includes(domain.name))
		.slice(0, 8)
		.map((domain) => domain.name);
});

const researchGoalsSuggestions = computed(() => {
	if (formData.value.researchDomain.length === 0) return [];

	const selectedBranches = getSelectedBranches();
	const goals = [];

	// Generate goals based on selected domains
	Object.keys(selectedBranches).forEach((branchId) => {
		const branch = selectedBranches[branchId];
		branch.forEach((item) => {
			if (item.metadata?.applications) {
				goals.push(...item.metadata.applications);
			}
		});
	});

	return [...new Set(goals)].slice(0, 8);
});
// AI Loading states for each field
const mainChallengeAiLoading = ref(false);
const researchDomainAiLoading = ref(false);
const researchGoalsAiLoading = ref(false);
const keywordsAiLoading = ref(false);
const focusLevelAiLoading = ref(false);
const smartCompleteLoading = ref(false);
const theoriesAiLoading = ref(false);
const importanceAiLoading = ref(false);
const necessityAiLoading = ref(false);

// Modal states
const showResearchDomainInfoModal = ref(false);
const showSelectedInterestsModal = ref(false);
const showResearchGoalsInfoModal = ref(false);
const showKeywordsInfoModal = ref(false);
const showTheoriesInfoModal = ref(false);
const showImportanceInfoModal = ref(false);
const showNecessityInfoModal = ref(false);
const showObjectivesInfoModal = ref(false);
const showMethodologyInfoModal = ref(false);

// Theory extraction data
const extractedTheories = ref<
	Array<{ name: string; description: string; authors: string[] }>
>([]);

const organizedCategories = computed(() => {
	return getOrganizedCategories(["philosophy", "sociology"]);
});

// Remove old updateSuggestions function and replace with computed properties

// Initialize useResearcher data
onMounted(() => {
	loadResearchData();
});
const addResearchGoal = (goal?: string) => {
	const goalText = goal || newResearchGoal.value.trim();
	if (goalText && !formData.value.researchGoals.includes(goalText)) {
		formData.value.researchGoals.push(goalText);
		if (!goal) {
			newResearchGoal.value = "";
		}
	}
};

const removeResearchGoal = (index: number) => {
	formData.value.researchGoals.splice(index, 1);
};

const removeKeyword = (index: number) => {
	formData.value.keywords.splice(index, 1);
};

const addKeyword = () => {
	if (
		newKeyword.value.trim() &&
		!formData.value.keywords.includes(newKeyword.value.trim())
	) {
		formData.value.keywords.push(newKeyword.value.trim());
		newKeyword.value = "";
	}
};

// Remove old duplicate functions - they are now defined above

const removeTheory = (index: number) => {
	extractedTheories.value.splice(index, 1);
};

const extractTheories = async () => {
	if (formData.value.researchDomain.length === 0) {
		toaster.show({
			title: "هشدار",
			message:
				"لطفاً ابتدا حوزه دانشی را وارد کنید تا بتوانیم نظریه‌های مرتبط را استخراج کنیم.",
			color: "warning",
			icon: "ph:warning",
			closable: true,
		});
		return;
	}

	theoriesAiLoading.value = true;

	try {
		const selectedBranches = getSelectedBranches();
		const theories = [];

		// Extract theories from selected domains metadata
		Object.keys(selectedBranches).forEach((branchId) => {
			const branch = selectedBranches[branchId];
			branch.forEach((item) => {
				if (item.metadata?.methodologies) {
					item.metadata.methodologies.forEach((method) => {
						theories.push({
							name: method,
							description: `روش‌شناسی ${method} برای حوزه ${item.name}`,
							authors: ["متخصصان حوزه"],
						});
					});
				}
			});
		});

		// If no metadata found, use default theories based on domains
		if (theories.length === 0) {
			const domains = formData.value.researchDomain.join(" ").toLowerCase();

			if (domains.includes("روانشناسی")) {
				theories.push(
					{
						name: "نظریه یادگیری اجتماعی بندورا",
						description:
							"افراد از طریق مشاهده و تقلید رفتارهای دیگران یاد می‌گیرند. این نظریه برای مطالعه الگوهای رفتاری در محیط‌های آموزشی کاربرد دارد.",
						authors: ["آلبرت بندورا"],
					},
					{
						name: "نظریه شناخت اجتماعی",
						description:
							"تفکرات و باورها بر رفتار و هیجان‌ها تأثیر می‌گذارند. برای تحلیل عوامل شناختی در سلامت روان کاربرد دارد.",
						authors: ["آرون بک", "آلبرت الیس"],
					},
					{
						name: "نظریه تعلق اجتماعی",
						description:
							"انسان‌ها نیاز اساسی به تعلق و ارتباط اجتماعی دارند. کمبود تعلق منجر به مشکلات روانی می‌شود.",
						authors: ["Roy Baumeister", "Mark Leary"],
					},
				);
			} else if (domains.includes("آموزش") || domains.includes("تربیتی")) {
				theories.push(
					{
						name: "نظریه ساختار شناختی پیاژه",
						description:
							"افراد از طریق مراحل رشد شناختی یاد می‌گیرند. برای طراحی برنامه‌های آموزشی متناسب با سن کاربرد دارد.",
						authors: ["ژان پیاژه"],
					},
					{
						name: "نظریه منطقه نزدیک توسعه ویگوتسکی",
						description:
							"یادگیری در interaction با دیگران و با راهنمایی مناسب اتفاق می‌افتد. برای یادگیری collaborative کاربرد دارد.",
						authors: ["Lev Vygotsky"],
					},
					{
						name: "نظریه چندگانه هوش گاردنر",
						description:
							"افراد انواع مختلفی از هوش دارند. برای طراحی روش‌های آموزشی متنوع کاربرد دارد.",
						authors: ["Howard Gardner"],
					},
				);
			}
		}

		extractedTheories.value = theories;

		toaster.show({
			title: "موفق",
			message: `${extractedTheories.value.length} نظریه مرتبط استخراج شد.`,
			color: "success",
			icon: "ph:check-circle-fill",
			closable: true,
		});
	} catch (error: any) {
		toaster.show({
			title: "خطا",
			message: `خطا در استخراج نظریه‌ها: ${error.message || "خطای ناشناخته"}`,
			color: "danger",
			icon: "ph:warning",
			closable: true,
		});
	} finally {
		theoriesAiLoading.value = false;
	}
};

const toggleResearchDomain = (domainName: string) => {
	const domain = researchDomains.value.find((d) => d.name === domainName);
	if (domain) {
		toggleNode(domain);

		// Update formData to match
		const index = formData.value.researchDomain.indexOf(domainName);
		if (index > -1) {
			formData.value.researchDomain.splice(index, 1);
		} else {
			formData.value.researchDomain.push(domainName);
		}
	}
};

const addDomain = (domainName: string) => {
	if (domainName && !formData.value.researchDomain.includes(domainName)) {
		formData.value.researchDomain.push(domainName);
	}
};

const removeDomain = (index: number) => {
	const domainName = formData.value.researchDomain[index];
	formData.value.researchDomain.splice(index, 1);

	// Also remove from useResearcher selection
	const domain = researchDomains.value.find((d) => d.name === domainName);
	if (domain && domain.selected) {
		toggleNode(domain);
	}
};

// AI Suggestion Function
async function suggestAIField(field: string) {
	// Check if main challenge exists for keywords generation
	if (
		field === "keywords" &&
		(!formData.value || !formData.value.researchDomain?.length)
	) {
		toaster.show({
			title: "هشدار",
			message:
				"لطفاً ابتدا حوزه دانشی را وارد کنید تا بتوانیم کلیدواژه‌های مرتبط را پیشنهاد دهیم.",
			color: "warning",
			icon: "ph:warning",
			closable: true,
		});
		return;
	}
	// Set loading state
	switch (field) {
		case "researchDomain":
			researchDomainAiLoading.value = true;
			break;
		case "keywords":
			keywordsAiLoading.value = true;
			break;
		case "researchGoals":
			researchGoalsAiLoading.value = true;
			break;
		case "importance":
			importanceAiLoading.value = true;
			break;
		case "necessity":
			necessityAiLoading.value = true;
			break;
		case "focusLevel":
			focusLevelAiLoading.value = true;
			break;
	}

	try {
		// Get context from existing fields
		const context = {
			researchDomain: formData.value?.researchDomain?.join(", ") || "",
			keywords: formData.value?.keywords?.join(", ") || "",
		};

		const contextMapping = {
			researchDomain: "حوزه دانشی",
			keywords: "کلیدواژه‌ها",
		};

		const contextString = Object.entries(context)
			.filter(([key]) => key !== field && context[key])
			.map(([key, val]) => `${contextMapping[key] || key}: ${val}`)
			.join("\n");

		// Field-specific prompts
		const prompts = {
			researchDomain: `بر اساس اطلاعات موجود، حوزه‌های دانشی مناسب برای این پژوهش را به صورت یک آرایه JSON پیشنهاد بده. حوزه‌ها باید:
  - با موضوع تحقیق مرتبط باشند
  - مشخص و دقیق باشند
  - در صورت نیاز، رویکردهای بین‌رشته‌ای را شامل شوند
  ${contextString ? `\nاطلاعات موجود:\n${contextString}` : ""}

  فقط یک آرایه JSON معتبر با فرمت زیر برگردان:
  ["حوزه اول", "حوزه دوم", "حوزه سوم", "حوزه چهارم", "حوزه پنجم"]`,

			keywords: `بر اساس حوزه‌های دانشی، کلیدواژه‌های تخصصی و مهم این پژوهش را به صورت یک آرایه JSON پیشنهاد بده. کلیدواژه‌ها باید:
          - تخصصی و دقیق باشند
          - مفاهیم اصلی پژوهش را پوشش دهند
          - برای جستجو در پایگاه‌های علمی مناسب باشند
          - فارسی باشند
          ${contextString ? `\nاطلاعات موجود:\n${contextString}` : ""}

          فقط یک آرایه JSON معتبر با فرمت زیر برگردان:
          ["کلیدواژه اول", "کلیدواژه دوم", "کلیدواژه سوم", "کلیدواژه چهارم", "کلیدواژه پنجم"]`,

			researchGoals: `بر اساس حوزه‌های دانشی، اهداف پژوهشی مناسب و کاربردی را به صورت یک آرایه JSON پیشنهاد بده. اهداف باید:
          - کاربردی و قابل دستیابی باشند
          - با حوزه دانشی مرتبط باشند
          - تأثیر اجتماعی یا علمی داشته باشند
          - SMART (مشخص، قابل اندازه‌گیری، دست یافتنی، مرتبط، زمان‌دار) باشند
          - فارسی باشند
          ${contextString ? `\nاطلاعات موجود:\n${contextString}` : ""}

          فقط یک آرایه JSON معتبر با فرمت زیر برگردان:
          ["هدف اول", "هدف دوم", "هدف سوم", "هدف چهارم", "هدف پنجم"]`,

			importance: `بر اساس اطلاعات پروژه، اهمیت این پژوهش را توضیح دهید. این متن باید:
          - تأثیر علمی، عملیاتی یا اجتماعی پژوهش را مشخص کند
          - چه ارزشی برای علم، جامعه یا صنعت دارد
          - چگونه به دانش فعلی اضافه می‌کند
          - کاربردهای عملی یافته‌ها
          - حدود 3-5 پاراگراف باشد
          ${contextString ? `\nاطلاعات موجود:\n${contextString}` : ""}

          متن اهمیت تحقیق را به فارسی و به صورت علمی بنویسید.`,

			necessity: `بر اساس اطلاعات پروژه، ضرورت این تحقیق را توضیح دهید. این متن باید:
          - چه مشکلی قرار است حل شود
          - چه خلاء دانشی را پر می‌کند
          - چرا این تحقیق الان ضروری است
          - چه نیجی اجتماعی یا علمی پاسخ داده می‌شود
          - حدود 3-5 پاراگراف باشد
          ${contextString ? `\nاطلاعات موجود:\n${contextString}` : ""}

          متن ضرورت تحقیق را به فارسی و به صورت علمی بنویسید.`,
			focusLevel: `بر اساس توضیحات پروژه، مناسب‌ترین سطح تمرکز را از بین گزینه‌های زیر انتخاب کن:
  - applied (کاربردی): تحقیق با هدف حل مسائل عملی
  - theoretical (نظری): تحقیق با هدف توسعه دانش نظری
  - interdisciplinary (بین‌رشته‌ای): تحقیق که از چند حوزه استفاده می‌کند
  - mixed (ترکیبی): ترکیبی از رویکردهای نظری و کاربردی

  ${contextString ? `\nاطلاعات موجود:\n${contextString}` : ""}
  فقط یکی از مقادیر: applied, theoretical, interdisciplinary, mixed را برگردان.`,
		};

		const prompt = prompts[field] || "یک مقدار مناسب پیشنهاد بده.";
		const userContent = formData.value?.[field] || "";
		const messages = [
			{
				role: "user",
				content: userContent
					? `${prompt}\n\nمقدار فعلی: ${userContent}`
					: prompt,
			},
		];

		let suggestion = "";

		// Stream AI response (simplified for now)
		await new Promise<void>((resolve) => {
			setTimeout(() => {
				if (field === "researchDomain") {
					suggestion = '["روانشناسی", "علوم تربیتی", "آموزش"]';
				} else if (field === "keywords") {
					suggestion = '["یادگیری ماشین", "هوش مصنوعی", "آموزش"]';
				} else if (field === "researchGoals") {
					suggestion =
						'["بهبود کیفیت آموزش", "افزایش بهره‌وری آموزشی", "تقویت مهارت‌های دانشجویان"]';
				} else if (field === "importance") {
					suggestion =
						"این پژوهش از نظر علمی اهمیت زیادی دارد زیرا به یکی از چالش‌های اساسی در حوزه سلامت روان جامعه می‌پردازد. از نظر عملیاتی، نتایج این تحقیق می‌تواند به توسعه برنامه‌های پیشگیرانه و درمانی مؤثر کمک کند. از نظر اجتماعی، این پژوهش به افزایش آگاهی عمومی و کاهش stigma مرتبط با مشکلات روانی کمک می‌کند. همچنین، یافته‌های این تحقیق می‌تواند مبنایی برای سیاست‌گذاری‌های بهداشتی و آموزشی در سطح ملی قرار گیرد.";
				} else if (field === "necessity") {
					suggestion =
						"این تحقیق ضروری است زیرا خلاء دانشی مشخصی در زمینه شناخت عوامل خطر و عوامل محافظت‌کننده در مورد سلامت روان در جمعیت مورد مطالعه وجود دارد. با توجه به افزایش شیوع اختلالات روانی در سال‌های اخیر و تأثیر مستقیم آن بر بهره‌وری و کیفیت زندگی، انجام این پژوهش برای شناسایی راهکارهای مؤثرurgence ضروری است. علاوه بر این، عدم وجود برنامه‌های مداخله‌ای مبتنی بر شواهد و متناسب با فرهنگ زمینه، این تحقیق را از نظر زمانی ضروری‌تر می‌کند.";
				} else if (field === "focusLevel") {
					suggestion = "applied";
				} else {
					suggestion = "پیشنهاد هوش مصنوعی برای " + field;
				}
				resolve();
			}, 1000);
		});

		// Handle researchDomain and keywords separately after completion
		if (field === "researchDomain") {
			try {
				const domains = JSON.parse(suggestion);
				if (Array.isArray(domains)) {
					if (formData.value) {
						formData.value.researchDomain = domains
							.filter((d) => d && typeof d === "string")
							.map((d) => d.trim());
					}
					domainSuggestions.value = [
						...domains,
						...defaultDomainSuggestions.slice(0, 5),
					];
				}
			} catch (error) {
				console.warn("Error parsing research domain suggestions:", error);
			}
		}

		if (field === "keywords") {
			try {
				const keywords = JSON.parse(suggestion);
				if (Array.isArray(keywords)) {
					if (formData.value) {
						formData.value.keywords = keywords
							.filter((k) => k && typeof k === "string")
							.map((k) => k.trim());
					}
				}
			} catch (error) {
				console.warn("Error parsing keyword suggestions:", error);
			}
		}

		if (field === "researchGoals") {
			try {
				const goals = JSON.parse(suggestion);
				if (Array.isArray(goals)) {
					if (formData.value) {
						formData.value.researchGoals = goals
							.filter((g) => g && typeof g === "string")
							.map((g) => g.trim());
					}
				}
			} catch (error) {
				console.warn("Error parsing research goals suggestions:", error);
			}
		}

		if (field === "focusLevel") {
			if (formData.value) {
				formData.value.focusLevel = suggestion.trim();
			}
		}

		if (field === "importance") {
			if (formData.value) {
				formData.value.importance = suggestion;
			}
		}

		if (field === "necessity") {
			if (formData.value) {
				formData.value.necessity = suggestion;
			}
		}

		if (field === "necessity") {
			if (formData.value) {
				formData.value.necessity = suggestion;
			}
		}

		if (field === "mainChallenge") {
			if (formData.value) {
				formData.value.title = suggestion;
			}
		}

		// Success toast removed to reduce number of notifications
	} catch (e: any) {
		toaster.show({
			title: "خطا",
			message: `خطا در دریافت پیشنهاد: ${e.message || "خطای ناشناخته"}`,
			color: "danger",
			icon: "ph:warning",
			closable: true,
		});
	} finally {
		// Reset loading state
		switch (field) {
			case "mainChallenge":
				mainChallengeAiLoading.value = false;
				break;
			case "researchDomain":
				researchDomainAiLoading.value = false;
				break;
			case "keywords":
				keywordsAiLoading.value = false;
				break;
			case "importance":
				importanceAiLoading.value = false;
				break;
			case "necessity":
				necessityAiLoading.value = false;
				break;
			case "focusLevel":
				focusLevelAiLoading.value = false;
				break;
		}
	}
}

const generateNewSuggestions = async () => {
	await loadResearchData();

	const domains = researchDomains.value.map((d) => d.name);
	const newSuggestions = domains
		.filter((domain) => !formData.value.researchDomain.includes(domain))
		.slice(0, 8);

	toaster.show({
		title: "پیشنهادها بروزرسانی شد",
		message: `${newSuggestions.length} پیشنهاد جدید تولید شد.`,
		color: "success",
		icon: "ph:check-circle-fill",
		closable: true,
	});
};

const generateResearchGoalsSuggestions = async () => {
	if (formData.value.researchDomain.length === 0) {
		toaster.show({
			title: "هشدار",
			message: "لطفاً ابتدا حوزه دانشی را وارد کنید.",
			color: "warning",
			icon: "ph:warning",
			closable: true,
		});
		return;
	}

	const suggestions = researchGoalsSuggestions.value;

	toaster.show({
		title: "پیشنهادها بروزرسانی شد",
		message: `${suggestions.length} پیشنهاد هدف پژوهشی تولید شد.`,
		color: "success",
		icon: "ph:check-circle-fill",
		closable: true,
	});
};

// Computed properties for validation
const hasMissingInformation = computed(() => {
	const missing = [];
	if (!formData.value.projectType) missing.push("نوع پروژه مشخص نشده است");
	if (formData.value.researchDomain.length === 0)
		missing.push("حوزه دانشی مشخص نشده است");
	if (formData.value.keywords.length === 0)
		missing.push("کلیدواژه‌ای وارد نشده است");
	if (formData.value.researchGoals.length === 0)
		missing.push("هدف پژوهشی وارد نشده است");
	if (!formData.value.necessity)
		missing.push("ضرورت تحقیق توضیح داده نشده است");
	if (!formData.value.importance)
		missing.push("اهمیت تحقیق توضیح داده نشده است");
	return missing.length > 0;
});

const missingInformation = computed(() => {
	const missing = [];
	if (!formData.value.projectType) missing.push("نوع پروژه مشخص نشده است");
	if (formData.value.researchDomain.length === 0)
		missing.push("حوزه دانشی مشخص نشده است");
	if (formData.value.keywords.length === 0)
		missing.push("کلیدواژه‌ای وارد نشده است");
	if (formData.value.researchGoals.length === 0)
		missing.push("هدف پژوهشی وارد نشده است");
	if (!formData.value.necessity)
		missing.push("ضرورت تحقیق توضیح داده نشده است");
	if (!formData.value.importance)
		missing.push("اهمیت تحقیق توضیح داده نشده است");
	return missing;
});

// Initialize useResearcher data
onMounted(() => {
	loadResearchData();
});

const startBrainstorm = async () => {
	isBrainstorming.value = true;

	// Simulate AI brainstorming
	await new Promise((resolve) => setTimeout(resolve, 2000));

	const projectTypeName =
		projectTypes.find((t) => t.id === formData.value.projectType)?.title || "";

	brainstormResults.value = `بر اساس نوع پروژه "${projectTypeName}"، در اینجا چند ایده و پیشنهاد برای شروع پژوهش شما:

  🎯 پیشنهادات موضوعی:
  • بررسی تأثیر فناوری‌های نوین بر رفتار انسانی
  • مطالعه الگوهای تعاملی در محیط‌های مجازی
  • تحلیل عوامل موثر بر بهره‌وری و سلامت روان

  📚 رویکردهای پژوهشی پیشنهادی:
  • استفاده از روش‌های ترکیبی (کمی و کیفی)
  • مطالعات طولی برای بررسی روند تغییرات
  • استفاده از تکنیک‌های نوین جمع‌آوری داده

  💡 نکات کلیدی:
  • تعریف دقیق جامعه آماری
  • انتخاب ابزارهای معتبر سنجش
  • در نظر گرفتن ملاحظات اخلاقی

  🔍 کلیدواژه‌های پیشنهادی:
  روانشناسی، رفتار، مداخله، اثربخشی، سلامت روان`;

	isBrainstorming.value = false;
};

// Mock data function for step 5
const loadMockData = () => {
	const projectType = formData.value.projectType || "project";

	// Set project type if not already set
	if (!formData.value.projectType) {
		formData.value.projectType = projectType;
	}

	// Mock data based on project type
	const mockDataMap = {
		project: {
			researchDomain: ["روانشناسی", "علوم تربیتی", "فناوری آموزشی"],
			keywords: [
				"یادگیری الکترونیکی",
				"سلامت روان",
				"دانشجویان",
				"آموزش از راه دور",
				"مداخله رفتاری",
			],
			researchGoals: [
				"بررسی تأثیر آموزش الکترونیکی بر سلامت روان دانشجویان",
				"شناسایی عوامل موثر بر موفقیت تحصیلی در محیط‌های مجازی",
				"توسعه برنامه‌های پیشگیرانه برای کاهش استرس تحصیلی",
			],
			necessity:
				"با توجه به گسترش آموزش الکترونیکی پس از همه‌گیری کووید-۱۹ و افزایش نگرانی‌ها در مورد سلامت روان دانشجویان، این تحقیق برای شناسایی چالش‌ها و ارائه راهکارهای مؤثر ضروری است. خلاء تحقیقاتی در زمینه ارزیابی بلندمدت تأثیرات آموزش مجازی بر سلامت روان در زمینه فرهنگی ایران وجود دارد.",
			importance:
				"این پژوهش از نظر علمی به درک بهتر روابط بین آموزش الکترونیکی و سلامت روان کمک می‌کند. از نظر عملیاتی، نتایج آن می‌تواند به طراحی بهتر برنامه‌های آموزشی و توسعه سیستم‌های پشتیبانی دانشجویان منجر شود. از نظر اجتماعی، این تحقیق به بهبود کیفیت آموزش و کاهش مشکلات روانی در جامعه دانشگاهی کمک شایانی خواهد کرد.",
			ethicsApproval: true,
			extractedTheories: [
				{
					name: "نظریه یادگیری اجتماعی بندورا",
					description:
						"افراد از طریق مشاهده و تقلید رفتارهای دیگران یاد می‌گیرند. این نظریه برای مطالعه الگوهای رفتاری در محیط‌های آموزشی کاربرد دارد.",
					authors: ["آلبرت بندورا"],
				},
				{
					name: "نظریه شناخت اجتماعی",
					description:
						"تفکرات و باورها بر رفتار و هیجان‌ها تأثیر می‌گذارند. برای تحلیل عوامل شناختی در سلامت روان کاربرد دارد.",
					authors: ["آرون بک", "آلبرت الیس"],
				},
			],
		},
		doctoral: {
			researchDomain: ["هوش مصنوعی", "علوم شناختی", "عصب‌شناسی"],
			keywords: [
				"یادگیری عمیق",
				"شبکه‌های عصبی",
				"پردازش زبان طبیعی",
				"شناخت مصنوعی",
				"مدل‌های زبانی",
			],
			researchGoals: [
				"توسعه مدل‌های هوش مصنوعی برای شبیه‌سازی فرآیندهای شناختی انسان",
				"تحلیل تطبیقی الگوریتم‌های یادگیری ماشین و مکانیسم‌های یادگیری مغز",
				"ارائه چارچوب نظری جدید برای درک هم‌افزایی هوش مصنوعی و شناخت انسانی",
			],
			necessity:
				"با پیشرفت سریع هوش مصنوعی و نیاز درک عمیق‌تر از مکانیسم‌های شناختی انسان، این رساله برای ایجاد پل میان علوم کامپیوتر و علوم شناختی ضروری است. عدم وجود چارچوب‌های نظری یکپارچه برای تحلیل شباهت‌ها و تفاوت‌های یادگیری در سیستم‌های بیولوژیکی و مصنوعی، خلاء دانشی مهمی است که این تحقیق به آن می‌پردازد.",
			importance:
				"این رساله از نظر نظری به توسعه درک ما از هوش و شناخت کمک می‌کند و ممکن است منجر به نظریه‌های جدید در زمینه علوم شناختی شود. از نظر عملی، نتایج آن می‌تواند به طراحی بهتر سیستم‌های هوش مصنوعی و همچنین درک بهتر اختلالات شناختی انسان منجر شود. این تحقیق مرزهای دانش فعلی را جابجا کرده و به پیشرفت بین‌رشته‌ای کمک می‌کند.",
			ethicsApproval: true,
			extractedTheories: [
				{
					name: "نظریه محاسبات ذهن",
					description:
						"ذهن انسان به عنوان یک سیستم پردازشی اطلاعات عمل می‌کند. این نظریه پایه‌ای برای هوش مصنوعی و علوم شناختی است.",
					authors: ["آلن تورینگ", "ماروین مینسکی"],
				},
				{
					name: "نظریه اتصال‌گرایی",
					description:
						"یادگیری از طریق تقویت ارتباطات بین نورون‌ها اتفاق می‌افتد. اساس شبکه‌های عصبی مصنوعی است.",
					authors: ["دونالد هب"],
				},
			],
		},
		masters: {
			researchDomain: ["مدیریت آموزشی", "توسعه حرفه‌ای", "آموزش عالی"],
			keywords: [
				"کیفیت آموزش",
				"ارزیابی آموزشی",
				"توسعه دانشکده",
				"بهبود مستمر",
				"نظام‌های آموزشی",
			],
			researchGoals: [
				"ارزیابی اثربخشی برنامه‌های توسعه حرفه‌ای اعضای هیئت علمی",
				"شناسایی عوامل کلیدی موثر بر کیفیت آموزش در دانشگاه‌ها",
				"طراحی مدل بهبود مستمر برای نظام‌های آموزشی عالی",
			],
			necessity:
				"با توجه به اهمیت کیفیت در آموزش عالی و نیاز به بهبود مستمر برنامه‌های آموزشی، این تحقیق برای شناسایی راهکارهای مؤثر و عملی در زمینه توسعه حرفه‌ای اعضای هیئت علمی ضروری است. عدم وجود مدل‌های ارزیابی جامع و متناسب با شرایط آموزشی ایران، این پژوهش را ضروری‌تر می‌کند.",
			importance:
				"این پایان‌نامه از نظر عملیاتی به بهبود کیفیت آموزش در دانشگاه‌ها کمک می‌کند. از نظر مدیریتی، نتایج آن می‌تواند به سیاست‌گذاری‌های آموزشی بهتر و تخصیص بهینه منابع منجر شود. از نظر اجتماعی، این تحقیق به ارتقای سطح علمی کشور و افزایش رضایت دانشجویان کمک خواهد کرد.",
			ethicsApproval: false,
			extractedTheories: [
				{
					name: "نظریه مدیریت کیفیت جامع",
					description:
						"تمرکز بر بهبود مستمر و رضایت مشتری (دانشجو) در نظام‌های آموزشی.",
					authors: ["ادوارد دمینگ", "جوزف جوران"],
				},
			],
		},
		article: {
			researchDomain: ["پزشکی", "اپیدمیولوژی", "سلامت عمومی"],
			keywords: [
				"بیماری‌های غیرواگیر",
				"پیشگیری",
				"سبک زندگی",
				"عوامل خطر",
				"سلامت جامعه",
			],
			researchGoals: [
				"بررسی شیوع عوامل خطر قلبی-عروقی در جمعیت شهری",
				"ارزیابی اثربخشی برنامه‌های پیشگیری از دیابت نوع ۲",
				"تحلیل ارتباط بین سبک زندگی و بیماری‌های مزمن",
			],
			necessity:
				"با افزایش شیوع بیماری‌های غیرواگیر در کشور و نیاز به داده‌های به‌روز برای برنامه‌ریزی‌های سلامت عمومی، این تحقیق برای شناسایی الگوهای بیماری و عوامل خطر مرتبط ضروری است. عدم وجود مطالعات اخیر در زمینه اپیدمیولوژی بیماری‌های مزمن در مناطق مختلف کشور، خلاء اطلاعاتی مهمی ایجاد کرده است.",
			importance:
				"این مقاله از نظر علمی به درک بهتر اپیدمیولوژی بیماری‌های مزمن کمک می‌کند. از نظر بهداشتی، نتایج آن می‌تواند به طراحی برنامه‌های پیشگیری بهتر و تخصیص بهینه منابع سلامت منجر شود. از نظر اجتماعی، این تحقیق به کاهش بار بیماری‌ها و بهبود سلامت جامعه کمک شایانی خواهد داشت.",
			ethicsApproval: true,
			extractedTheories: [
				{
					name: "مدل بیو-روانشناختی",
					description:
						"بیماری‌ها نتیجه تعامل عوامل بیولوژیکی، روانی و اجتماعی هستند.",
					authors: ["جورج انگل"],
				},
			],
		},
	};

	const mockData = mockDataMap[projectType] || mockDataMap.project;

	// Update form data
	formData.value.researchDomain = [...mockData.researchDomain];
	formData.value.keywords = [...mockData.keywords];
	formData.value.researchGoals = [...mockData.researchGoals];
	formData.value.necessity = mockData.necessity;
	formData.value.importance = mockData.importance;
	formData.value.ethicsApproval = mockData.ethicsApproval;
	extractedTheories.value = [...mockData.extractedTheories];

	// Generate brainstorm results if not already present
	if (!brainstormResults.value) {
		const projectTypeName =
			projectTypes.find((t) => t.id === projectType)?.title || "";
		brainstormResults.value = `بر اساس نوع پروژه "${projectTypeName}"، در اینجا چند ایده و پیشنهاد برای شروع پژوهش شما:

🎯 پیشنهادات موضوعی:
• بررسی تأثیر ${mockData.researchDomain[0]} بر ${mockData.keywords[0]}
• مطالعه الگوهای ${mockData.keywords[1]} در ${mockData.researchDomain[1]}
• تحلیل عوامل موثر بر ${mockData.researchGoals[0]}

📚 رویکردهای پژوهشی پیشنهادی:
• استفاده از روش‌های ترکیبی (کمی و کیفی)
• مطالعات طولی برای بررسی روند تغییرات
• استفاده از تکنیک‌های نوین جمع‌آوری داده

💡 نکات کلیدی:
• تعریف دقیق جامعه آماری
• انتخاب ابزارهای معتبر سنجش
• در نظر گرفتن ملاحظات اخلاقی

🔍 کلیدواژه‌های پیشنهادی:
${mockData.keywords.slice(0, 5).join("، ")}`;
	}

	toaster.show({
		title: "داده‌های نمونه بارگذاری شد",
		message: "اطلاعات نمونه بر اساس نوع پروژه انتخاب شده پر شد.",
		color: "success",
		icon: "ph:check-circle-fill",
		closable: true,
	});
};
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div>
              <BaseHeading as="h1" size="2xl" weight="bold" class="text-gray-900 dark:text-white">
                ایجاد پروژه پژوهشی جدید
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400 mt-1">
                مراحل ایجاد پروژه را با دقت تکمیل کنید
              </BaseParagraph>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Steps Indicator -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <div class="flex items-center justify-between">
            <div v-for="(step, index) in steps" :key="step.number" class="flex flex-1 items-center">
              <!-- Step Circle -->
              <div class="relative flex flex-col items-center">
                <div
                  :class="[
                    'flex size-12 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300',
                    currentStep === step.number
                      ? 'border-primary-500 bg-primary-500 shadow-primary-500/30 text-white shadow-lg'
                      : step.completed
                      ? 'border-success-500 bg-success-500 text-white'
                      : 'dark:border-muted-600 dark:bg-muted-800 dark:text-muted-400 border-gray-300 bg-gray-50 text-gray-400',
                  ]"
                >
                  <Icon v-if="step.completed" name="ph:check-bold" class="size-6" />
                  <span v-else>{{ step.number }}</span>
                </div>
                <span
                  :class="[
                    'mt-2 text-sm font-medium transition-colors duration-200',
                    currentStep === step.number
                      ? 'text-primary-500'
                      : step.completed
                      ? 'text-success-500'
                      : 'text-muted-400',
                  ]"
                >
                  {{ step.title }}
                </span>
              </div>

              <!-- Connector Line -->
              <div
                v-if="index < steps.length - 1"
                :class="[
                  'mx-4 h-0.5 flex-1 transition-colors duration-300',
                  step.completed ? 'bg-success-500' : 'dark:bg-muted-700 bg-gray-200',
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-4xl">
        <!-- Step 1: Project Type Selection -->
        <div v-if="currentStep === 1" class="animate-fade-in">
          <div class="mb-8 text-center">
            <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
              نوع پروژه خود را انتخاب کنید
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              نوع پروژه به شما در تنظیم بهتر جزئیات و الزامات کمک می‌کند
            </BaseParagraph>
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            <div
              v-for="type in projectTypes"
              :key="type.id"
              :class="[
                'dark:bg-muted-800 dark:border-muted-700 group relative cursor-pointer overflow-hidden rounded-2xl border-2 bg-white p-6 transition-all duration-300',
                formData.projectType === type.id
                  ? 'border-primary-500 shadow-primary-500/20 ring-primary-500/10 shadow-xl ring-4'
                  : 'hover:border-primary-300 border-gray-200 hover:shadow-lg',
              ]"
              @click="selectProjectType(type.id)"
            >
              <!-- Selected Indicator -->
              <div
                v-if="formData.projectType === type.id"
                class="bg-primary-500 absolute left-4 top-4 flex size-8 items-center justify-center rounded-full shadow-lg"
              >
                <Icon name="ph:check-bold" class="size-5 text-white" />
              </div>

              <!-- Icon -->
              <div
                :class="[
                  'mb-4 flex size-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
                  `bg-${type.color}-500/10`,
                ]"
              >
                <Icon :name="type.icon" :class="[`text-${type.color}-500`, 'size-8']" />
              </div>

              <!-- Content -->
              <BaseHeading as="h3" size="lg" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                {{ type.title }}
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">
                {{ type.description }}
              </BaseParagraph>
            </div>
          </div>
        </div>

        <!-- Step 2: Brainstorm -->
        <div v-if="currentStep === 2" class="animate-fade-in">
          <div class="mb-8 text-center">
            <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
              طوفان فکری برای پروژه شما
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              با استفاده از هوش مصنوعی، ایده‌ها و پیشنهادات مرتبط با پروژه خود را دریافت کنید
            </BaseParagraph>
          </div>

          <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8">
            <!-- Brainstorm Info Card -->
            <div v-if="!brainstormResults" class="mb-6">
              <div class="bg-primary-500/10 dark:bg-primary-500/20 mb-6 rounded-xl p-6">
                <div class="flex items-start gap-4">
                  <div class="bg-primary-500 flex size-12 shrink-0 items-center justify-center rounded-xl">
                    <Icon name="ph:lightbulb-fill" class="size-6 text-white" />
                  </div>
                  <div class="flex-1">
                    <BaseHeading as="h3" size="md" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                      چرا طوفان فکری؟
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 mb-3">
                      طوفان فکری به شما کمک می‌کند تا:
                    </BaseParagraph>
                    <ul class="text-muted-600 dark:text-muted-300 mr-6 space-y-2 text-sm">
                      <li class="flex items-start gap-2">
                        <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-4 shrink-0" />
                        <span>ایده‌های خلاقانه و نوآورانه برای موضوع پژوهش پیدا کنید</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-4 shrink-0" />
                        <span>رویکردهای پژوهشی متناسب با نوع پروژه خود را بشناسید</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-4 shrink-0" />
                        <span>کلیدواژه‌ها و مفاهیم مرتبط را کشف کنید</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Premium Banner -->
              <div class="bg-warning-500/10 dark:bg-warning-500/20 mb-6 rounded-xl p-6">
                <div class="flex items-start gap-4">
                  <div class="bg-warning-500 flex size-12 shrink-0 items-center justify-center rounded-xl">
                    <Icon name="ph:crown-fill" class="size-6 text-white" />
                  </div>
                  <div class="flex-1">
                    <BaseHeading as="h3" size="md" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                      ویژگی پریمیوم
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 mb-3">
                      این ویژگی در نسخه پریمیوم در دسترس است. برای دسترسی به چارچوب پیشرفته RDC، اشتراک پریمیوم خود را
                      ارتقا دهید.
                    </BaseParagraph>
                    <BaseButton color="warning" shape="curved" size="sm" @click="router.push('/pricing')">
                      <Icon name="ph:crown" class="ml-1 size-4" />
                      ارتقا به پریمیوم
                    </BaseButton>
                  </div>
                </div>
              </div>

              <!-- Brainstorm Buttons -->
              <div class="flex flex-col items-center gap-4">
                <BaseButton
                  color="info"
                  shape="curved"
                  size="lg"
                  :disabled="true"
                  @click="router.push('/hampazhooh/brainstorm')"
                >
                  <Icon name="ph:circles-four" class="ml-2 size-5" />
                  استفاده از چارچوب پیشرفته RDC
                </BaseButton>
                <BaseParagraph size="xs" class="text-muted-500 max-w-md text-center">
                  چارچوب چهار مرحله‌ای کشف پژوهشی با ابزارها و تکنیک‌های ساختاریافته
                </BaseParagraph>
              </div>
            </div>

            <!-- Brainstorm Results -->
            <div v-else class="space-y-4">
              <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="bg-success-500/10 flex size-10 items-center justify-center rounded-xl">
                    <Icon name="ph:check-circle-fill" class="text-success-500 size-5" />
                  </div>
                  <div>
                    <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-900 dark:text-white">
                      نتایج طوفان فکری
                    </BaseHeading>
                    <BaseParagraph size="xs" class="text-muted-500">پیشنهادات هوش مصنوعی برای پروژه شما</BaseParagraph>
                  </div>
                </div>
                <BaseButton color="muted" shape="curved" size="sm" @click="brainstormResults = ''">
                  <Icon name="ph:arrows-counter-clockwise" class="ml-1 size-4" />
                  طوفان فکری مجدد
                </BaseButton>
              </div>

              <div class="dark:bg-muted-900/50 dark:border-muted-700 rounded-xl border border-gray-100 bg-gray-50 p-6">
                <div class="text-muted-700 dark:text-muted-200 whitespace-pre-line text-sm leading-relaxed">
                  {{ brainstormResults }}
                </div>
              </div>

              <div class="bg-info-500/10 dark:bg-info-500/20 mt-6 rounded-xl p-4">
                <div class="flex items-start gap-3">
                  <Icon name="ph:info-fill" class="text-info-500 mt-0.5 size-5 shrink-0" />
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                    این پیشنهادات به عنوان نقطه شروع طراحی شده‌اند. می‌توانید در مراحل بعدی آن‌ها را سفارشی‌سازی کنید.
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Basic Information -->
        <div v-if="currentStep === 3" class="animate-fade-in">
          <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8">
            <div class="mb-6">
              <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                حوزه‌های دانشی و اهداف پژوهش
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">
                حوزه‌های دانشی و اهداف اصلی پژوهش خود را مشخص کنید
              </BaseParagraph>
            </div>

            <div class="space-y-6">
              <!-- Research Domain -->
              <div>
                <div class="mb-2 flex items-center justify-between">
                  <label class="text-muted-700 dark:text-muted-200 flex items-center gap-2 text-sm font-medium">
                    <Icon name="ph:books" class="text-primary-500 size-5" />
                    حوزهٔ دانشی شما کدام است؟
                  </label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-info-500 text-muted-700 dark:text-muted-200 hover:text-info-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-info-500 dark:hover:text-info-600 flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm transition-colors duration-300"
                      @click="showResearchDomainInfoModal = true"
                    >
                      <Icon name="ph:info" class="size-4" />
                      <span>راهنما</span>
                    </button>
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-success-500 text-muted-700 dark:text-muted-200 hover:text-success-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-success-500 dark:hover:text-success-600 flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm transition-colors duration-300"
                      @click="showSelectedInterestsModal = true"
                    >
                      <Icon name="ph:lightbulb" class="size-4" />
                      <span>علایق پژوهشی</span>
                    </button>
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                      :disabled="researchDomainAiLoading"
                      @click="suggestAIField('researchDomain')"
                    >
                      <Icon v-if="!researchDomainAiLoading" name="ph:sparkle" class="size-4" />
                      <Icon v-else name="svg-spinners:90-ring-with-bg" class="size-4" />
                      <span>پیشنهاد هوشمند</span>
                    </button>
                  </div>
                </div>
                <div class="space-y-3">
                  <!-- Domain Tags Display -->
                  <div v-if="formData.researchDomain.length > 0" class="flex flex-wrap gap-2">
                    <div
                      v-for="(domain, index) in formData.researchDomain"
                      :key="index"
                      class="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
                    >
                      <span>{{ domain }}</span>
                      <button
                        type="button"
                        class="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                        @click="removeDomain(index)"
                      >
                        <Icon name="ph:x" class="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <!-- Domain Input -->
                  <div class="relative">
                    <BaseInput
                      v-model="domainInput"
                      placeholder="روانشناسی، علوم کامپیوتر، مهندسی، پزشکی..."
                      shape="curved"
                      :classes="{ input: 'h-12' }"
                      @keydown="
                        (event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            addDomain(domainInput);
                            domainInput = '';
                          }
                        }
                      "
                    />
                    <div class="absolute left-3 top-1/2 -translate-y-1/2">
                      <div class="text-muted-400 text-xs">Enter برای افزودن</div>
                    </div>
                  </div>

                  <!-- Suggestions -->
                  <div
                    class="border-muted-200 dark:border-muted-700 dark:bg-muted-900/50 rounded-lg border bg-gray-50 p-3"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <div class="text-muted-600 dark:text-muted-400 text-xs font-medium">پیشنهادها:</div>
                      <button
                        type="button"
                        class="nui-focus border-muted-200 hover:border-success-500 text-muted-700 dark:text-muted-200 hover:text-success-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-success-500 dark:hover:text-success-600 flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm transition-colors duration-300"
                        @click="generateNewSuggestions"
                      >
                        <Icon name="ph:lightbulb" class="size-4" />
                        <span>پیشنهادها</span>
                      </button>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        v-for="suggestion in domainSuggestions"
                        :key="suggestion"
                        type="button"
                        :disabled="formData.researchDomain.includes(suggestion)"
                        class="nui-focus border-muted-200 hover:border-primary-500 hover:bg-primary-50 text-muted-600 dark:text-muted-300 dark:border-muted-700 dark:hover:bg-primary-900/20 dark:hover:border-primary-500 rounded-full border px-3 py-1 text-xs transition-all disabled:cursor-not-allowed disabled:opacity-50"
                        @click="addDomain(suggestion)"
                      >
                        {{ suggestion }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Keywords -->
              <div>
                <div class="mb-2 flex items-center justify-between">
                  <label class="text-muted-700 dark:text-muted-200 flex items-center gap-2 text-sm font-medium">
                    <Icon name="ph:key" class="text-primary-500 size-5" />
                    کلیدواژه‌های پژوهش
                  </label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-info-500 text-muted-700 dark:text-muted-200 hover:text-info-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-info-500 dark:hover:text-info-600 flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm transition-colors duration-300"
                      @click="showKeywordsInfoModal = true"
                    >
                      <Icon name="ph:info" class="size-4" />
                      <span>راهنما</span>
                    </button>
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                      :disabled="keywordsAiLoading"
                      @click="suggestAIField('keywords')"
                    >
                      <Icon v-if="!keywordsAiLoading" name="ph:sparkle" class="size-4" />
                      <Icon v-else name="svg-spinners:90-ring-with-bg" class="size-4" />
                      <span>پیشنهاد هوشمند</span>
                    </button>
                  </div>
                </div>
                <div class="space-y-3">
                  <!-- Keywords Tags Display -->
                  <div v-if="formData.keywords.length > 0" class="flex flex-wrap gap-2">
                    <div
                      v-for="(keyword, index) in formData.keywords"
                      :key="index"
                      class="bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
                    >
                      <span>{{ keyword }}</span>
                      <button
                        type="button"
                        class="text-warning-500 hover:text-warning-600 dark:text-warning-400 dark:hover:text-warning-300 transition-colors"
                        @click="removeKeyword(index)"
                      >
                        <Icon name="ph:x" class="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <!-- Keyword Input -->
                  <div class="relative">
                    <BaseInput
                      v-model="newKeyword"
                      placeholder="کلیدواژه را وارد کنید (مثال: یادگیری ماشین، سلامت روان)"
                      shape="curved"
                      :classes="{ input: 'h-12' }"
                      @keyup.enter="addKeyword"
                    />
                    <div class="absolute left-3 top-1/2 -translate-y-1/2">
                      <div class="text-muted-400 text-xs">Enter برای افزودن</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Research Goals -->
              <div>
                <div class="mb-2 flex items-center justify-between">
                  <label class="text-muted-700 dark:text-muted-200 flex items-center gap-2 text-sm font-medium">
                    <Icon name="ph:target" class="text-primary-500 size-5" />
                    اهداف پژوهش شما چیست؟
                  </label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-info-500 text-muted-700 dark:text-muted-200 hover:text-info-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-info-500 dark:hover:text-info-600 flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm transition-colors duration-300"
                      @click="showResearchGoalsInfoModal = true"
                    >
                      <Icon name="ph:info" class="size-4" />
                      <span>راهنما</span>
                    </button>
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-success-500 text-muted-700 dark:text-muted-200 hover:text-success-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-success-500 dark:hover:text-success-600 flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm transition-colors duration-300"
                      @click="generateResearchGoalsSuggestions"
                    >
                      <Icon name="ph:lightbulb" class="size-4" />
                      <span>پیشنهادها</span>
                    </button>
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                      :disabled="researchGoalsAiLoading"
                      @click="suggestAIField('researchGoals')"
                    >
                      <Icon v-if="!researchGoalsAiLoading" name="ph:sparkle" class="size-4" />
                      <Icon v-else name="svg-spinners:90-ring-with-bg" class="size-4" />
                      <span>پیشنهاد هوشمند</span>
                    </button>
                  </div>
                </div>
                <div class="space-y-3">
                  <!-- Goals Tags Display -->
                  <div v-if="formData.researchGoals.length > 0" class="flex flex-wrap gap-2">
                    <div
                      v-for="(goal, index) in formData.researchGoals"
                      :key="index"
                      class="bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
                    >
                      <span>{{ goal }}</span>
                      <button
                        type="button"
                        class="text-success-500 hover:text-success-600 dark:text-success-400 dark:hover:text-success-300 transition-colors"
                        @click="removeResearchGoal(index)"
                      >
                        <Icon name="ph:x" class="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <!-- Goal Input -->
                  <div class="relative">
                    <BaseInput
                      v-model="newResearchGoal"
                      placeholder="هدف پژوهش را وارد کنید (مثال: بهبود سلامت روان دانشجویان)"
                      shape="curved"
                      :classes="{ input: 'h-12' }"
                      @keyup.enter="addResearchGoal"
                    />
                    <div class="absolute left-3 top-1/2 -translate-y-1/2">
                      <div class="text-muted-400 text-xs">Enter برای افزودن</div>
                    </div>
                  </div>

                  <!-- Suggestions -->
                  <div
                    class="border-muted-200 dark:border-muted-700 dark:bg-muted-900/50 rounded-lg border bg-gray-50 p-3"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <div class="text-muted-600 dark:text-muted-400 text-xs font-medium">پیشنهادهای اهداف:</div>
                      <button
                        type="button"
                        class="nui-focus border-muted-200 hover:border-success-500 text-muted-700 dark:text-muted-200 hover:text-success-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-success-500 dark:hover:text-success-600 flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm transition-colors duration-300"
                        @click="generateResearchGoalsSuggestions"
                      >
                        <Icon name="ph:lightbulb" class="size-4" />
                        <span>پیشنهادها</span>
                      </button>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        v-for="suggestion in researchGoalsSuggestions"
                        :key="suggestion"
                        type="button"
                        :disabled="formData.researchGoals.includes(suggestion)"
                        class="nui-focus border-muted-200 hover:border-success-500 hover:bg-success-50 text-muted-600 dark:text-muted-300 dark:border-muted-700 dark:hover:bg-success-900/20 dark:hover:border-success-500 rounded-full border px-3 py-1 text-xs transition-all disabled:cursor-not-allowed disabled:opacity-50"
                        @click="addResearchGoal(suggestion)"
                      >
                        {{ suggestion }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Theory Extraction -->
              <div>
                <div class="mb-2 flex items-center justify-between">
                  <label class="text-muted-700 dark:text-muted-200 flex items-center gap-2 text-sm font-medium">
                    <Icon name="ph:graduation-cap" class="text-primary-500 size-5" />
                    نظریه‌های مرتبط
                  </label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-info-500 text-muted-700 dark:text-muted-200 hover:text-info-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-info-500 dark:hover:text-info-600 flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm transition-colors duration-300"
                      @click="showTheoriesInfoModal = true"
                    >
                      <Icon name="ph:info" class="size-4" />
                      <span>راهنما</span>
                    </button>
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                      :disabled="theoriesAiLoading"
                      @click="extractTheories"
                    >
                      <Icon v-if="!theoriesAiLoading" name="ph:sparkle" class="size-4" />
                      <Icon v-else name="svg-spinners:90-ring-with-bg" class="size-4" />
                      <span>استخراج نظریه‌ها</span>
                    </button>
                  </div>
                </div>
                <div class="space-y-3">
                  <!-- Theories Display -->
                  <div v-if="extractedTheories.length > 0" class="space-y-3">
                    <div
                      v-for="(theory, index) in extractedTheories"
                      :key="index"
                      class="dark:bg-muted-800 dark:border-muted-700 border border-gray-200 bg-white rounded-xl p-4"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-2">
                            <Icon name="ph:bookmark-simple-fill" class="text-info-500 size-4" />
                            <BaseHeading as="h4" size="sm" weight="semibold" class="text-gray-900 dark:text-white">
                              {{ theory.name }}
                            </BaseHeading>
                          </div>
                          <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400 mb-2">
                            {{ theory.description }}
                          </BaseParagraph>
                          <div class="flex flex-wrap gap-1">
                            <BaseTag v-for="author in theory.authors" :key="author" color="info" size="xs" shape="full">
                              {{ author }}
                            </BaseTag>
                          </div>
                        </div>
                        <button
                          type="button"
                          class="text-muted-400 hover:text-danger-500 transition-colors"
                          @click="removeTheory(index)"
                        >
                          <Icon name="ph:x" class="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <div
                    v-else
                    class="dark:bg-muted-800 dark:border-muted-700 border border-gray-200 bg-white rounded-xl p-8 text-center"
                  >
                    <div class="flex flex-col items-center gap-3">
                      <Icon name="ph:graduation-cap" class="text-muted-300 size-12" />
                      <div>
                        <BaseHeading as="h4" size="md" weight="medium" class="text-muted-600 dark:text-muted-400">
                          نظریه‌ای استخراج نشده است
                        </BaseHeading>
                        <BaseParagraph size="sm" class="text-muted-500">
                          با استفاده از دکمه "استخراج نظریه‌ها"، نظریه‌های مرتبط با حوزه و اهداف پژوهش خود را پیدا کنید
                        </BaseParagraph>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Research Details -->
        <div v-if="currentStep === 4" class="animate-fade-in">
          <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8">
            <div class="mb-6">
              <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                جزئیات پژوهش
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">
                اطلاعات تکمیلی و جزئیات علمی پروژه را وارد کنید
              </BaseParagraph>
            </div>

            <div class="space-y-6">
              <div class="dark:bg-muted-700/50 flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <label class="text-muted-700 dark:text-muted-200 block text-sm font-medium">تایید کمیته اخلاق</label>
                  <BaseParagraph size="xs" class="text-muted-500 mt-1">
                    آیا این پژوهش نیاز به تایید کمیته اخلاق دارد؟
                  </BaseParagraph>
                </div>
                <BaseSwitchThin v-model="formData.ethicsApproval" color="primary" />
              </div>

              <!-- Research Necessity (ضرورت تحقیق) -->
              <div>
                <div class="mb-2 flex items-center justify-between">
                  <label class="text-muted-700 dark:text-muted-200 flex items-center gap-2 text-sm font-medium">
                    <Icon name="ph:warning-circle" class="text-primary-500 size-5" />
                    ضرورت تحقیق
                  </label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-info-500 text-muted-700 dark:text-muted-200 hover:text-info-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-info-500 dark:hover:text-info-600 flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm transition-colors duration-300"
                      @click="showNecessityInfoModal = true"
                    >
                      <Icon name="ph:info" class="size-4" />
                      <span>راهنما</span>
                    </button>
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                      :disabled="necessityAiLoading"
                      @click="suggestAIField('necessity')"
                    >
                      <Icon v-if="!necessityAiLoading" name="ph:sparkle" class="size-4" />
                      <Icon v-else name="svg-spinners:90-ring-with-bg" class="size-4" />
                      <span>پیشنهاد هوشمند</span>
                    </button>
                  </div>
                </div>
                <BaseTextarea
                  v-model="formData.necessity"
                  placeholder="ضرورت و اهمیت انجام این پژوهش را توضیح دهید. چه مشکلی قرار است حل شود؟..."
                  rows="4"
                />
                <BaseParagraph size="xs" class="text-muted-500 mt-1">
                  توضیح دهید که چرا این تحقیق ضروری است و چه خلاء دانشی را پر می‌کند
                </BaseParagraph>
              </div>

              <!-- Research Importance (اهمیت تحقیق) -->
              <div>
                <div class="mb-2 flex items-center justify-between">
                  <label class="text-muted-700 dark:text-muted-200 flex items-center gap-2 text-sm font-medium">
                    <Icon name="ph:star" class="text-primary-500 size-5" />
                    اهمیت تحقیق
                  </label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-info-500 text-muted-700 dark:text-muted-200 hover:text-info-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-info-500 dark:hover:text-info-600 flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm transition-colors duration-300"
                      @click="showImportanceInfoModal = true"
                    >
                      <Icon name="ph:info" class="size-4" />
                      <span>راهنما</span>
                    </button>
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                      :disabled="importanceAiLoading"
                      @click="suggestAIField('importance')"
                    >
                      <Icon v-if="!importanceAiLoading" name="ph:sparkle" class="size-4" />
                      <Icon v-else name="svg-spinners:90-ring-with-bg" class="size-4" />
                      <span>پیشنهاد هوشمند</span>
                    </button>
                  </div>
                </div>
                <BaseTextarea
                  v-model="formData.importance"
                  placeholder="اهمیت این پژوهش را از نظر علمی، عملیاتی یا اجتماعی توضیح دهید..."
                  rows="4"
                />
                <BaseParagraph size="xs" class="text-muted-500 mt-1">
                  توضیح دهید که نتایج این تحقیق چه تأثیری بر علم، جامعه یا صنعت خواهد داشت
                </BaseParagraph>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Review -->
        <div v-if="currentStep === 5" class="animate-fade-in">
          <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8">
            <div class="mb-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                    بررسی نهایی
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-500">
                    اطلاعات وارد شده را بررسی کرده و در صورت صحت بودن، پروژه را ثبت کنید
                  </BaseParagraph>
                </div>
                <BaseButton
                  color="info"
                  shape="curved"
                  size="sm"
                  @click="loadMockData"
                >
                  <Icon name="ph:database" class="ml-2 size-4" />
                  داده‌های نمونه
                </BaseButton>
              </div>
            </div>
            <!-- Project Summary Card -->
            <div class="dark:bg-muted-900/50 dark:border-muted-700 rounded-xl border border-gray-100 bg-gray-50 p-6 mb-6">
              <BaseHeading as="h3" size="lg" weight="semibold" class="mb-4 text-muted-800 dark:text-muted-200">
                خلاصه پروژه
              </BaseHeading>
              
              <div class="grid gap-4 md:grid-cols-2">
                <!-- Project Type -->
                <div class="flex items-start gap-3">
                  <div class="bg-primary-100 dark:bg-primary-900/30 flex size-8 items-center justify-center rounded-lg">
                    <Icon name="ph:folder" class="text-primary-500 size-4" />
                  </div>
                  <div>
                    <div class="text-xs text-muted-500 dark:text-muted-400 font-medium">نوع پروژه</div>
                    <div class="text-sm font-medium text-muted-800 dark:text-muted-200">
                      {{ projectTypes.find(t => t.id === formData.projectType)?.title || '-' }}
                    </div>
                  </div>
                </div>

                <!-- Research Domains -->
                <div class="flex items-start gap-3">
                  <div class="bg-info-100 dark:bg-info-900/30 flex size-8 items-center justify-center rounded-lg">
                    <Icon name="ph:books" class="text-info-500 size-4" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-muted-500 dark:text-muted-400 font-medium">حوزه‌های دانشی</div>
                    <div class="text-sm font-medium text-muted-800 dark:text-muted-200">
                      {{ formData.researchDomain.length > 0 ? formData.researchDomain.join('، ') : 'مشخص نشده' }}
                    </div>
                  </div>
                </div>

                <!-- Keywords Count -->
                <div class="flex items-start gap-3">
                  <div class="bg-warning-100 dark:bg-warning-900/30 flex size-8 items-center justify-center rounded-lg">
                    <Icon name="ph:key" class="text-warning-500 size-4" />
                  </div>
                  <div>
                    <div class="text-xs text-muted-500 dark:text-muted-400 font-medium">کلیدواژه‌ها</div>
                    <div class="text-sm font-medium text-muted-800 dark:text-muted-200">
                      {{ formData.keywords.length }} کلیدواژه
                    </div>
                  </div>
                </div>

                <!-- Research Goals Count -->
                <div class="flex items-start gap-3">
                  <div class="bg-success-100 dark:bg-success-900/30 flex size-8 items-center justify-center rounded-lg">
                    <Icon name="ph:target" class="text-success-500 size-4" />
                  </div>
                  <div>
                    <div class="text-xs text-muted-500 dark:text-muted-400 font-medium">اهداف پژوهش</div>
                    <div class="text-sm font-medium text-muted-800 dark:text-muted-200">
                      {{ formData.researchGoals.length }} هدف
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed Information -->
            <div class="space-y-6">
              <!-- Research Domains Details -->
              <div v-if="formData.researchDomain.length > 0">
                <BaseHeading as="h3" size="md" weight="semibold" class="mb-3 text-muted-800 dark:text-muted-200 flex items-center gap-2">
                  <Icon name="ph:books" class="text-primary-500 size-5" />
                  حوزه‌های دانشی
                </BaseHeading>
                <div class="flex flex-wrap gap-2">
                  <BaseTag
                    v-for="(domain, index) in formData.researchDomain"
                    :key="index"
                    color="primary"
                    size="sm"
                    shape="full"
                  >
                    {{ domain }}
                  </BaseTag>
                </div>
              </div>

              <!-- Keywords Details -->
              <div v-if="formData.keywords.length > 0">
                <BaseHeading as="h3" size="md" weight="semibold" class="mb-3 text-muted-800 dark:text-muted-200 flex items-center gap-2">
                  <Icon name="ph:key" class="text-warning-500 size-5" />
                  کلیدواژه‌ها
                </BaseHeading>
                <div class="flex flex-wrap gap-2">
                  <BaseTag
                    v-for="(keyword, index) in formData.keywords"
                    :key="index"
                    color="warning"
                    size="sm"
                    shape="full"
                  >
                    {{ keyword }}
                  </BaseTag>
                </div>
              </div>

              <!-- Research Goals Details -->
              <div v-if="formData.researchGoals.length > 0">
                <BaseHeading as="h3" size="md" weight="semibold" class="mb-3 text-muted-800 dark:text-muted-200 flex items-center gap-2">
                  <Icon name="ph:target" class="text-success-500 size-5" />
                  اهداف پژوهش
                </BaseHeading>
                <div class="space-y-2">
                  <div
                    v-for="(goal, index) in formData.researchGoals"
                    :key="index"
                    class="dark:bg-muted-800 dark:border-muted-700 border border-gray-200 bg-white rounded-lg p-3"
                  >
                    <div class="flex items-start gap-3">
                      <div class="bg-success-100 dark:bg-success-900/30 flex size-6 items-center justify-center rounded-full mt-0.5">
                        <Icon name="ph:check" class="text-success-500 size-3" />
                      </div>
                      <div class="flex-1">
                        <div class="text-sm font-medium text-muted-800 dark:text-muted-200">
                          {{ goal }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Theories Details -->
              <div v-if="extractedTheories.length > 0">
                <BaseHeading as="h3" size="md" weight="semibold" class="mb-3 text-muted-800 dark:text-muted-200 flex items-center gap-2">
                  <Icon name="ph:graduation-cap" class="text-info-500 size-5" />
                  نظریه‌های مرتبط
                </BaseHeading>
                <div class="space-y-3">
                  <div
                    v-for="(theory, index) in extractedTheories"
                    :key="index"
                    class="dark:bg-muted-800 dark:border-muted-700 border border-gray-200 bg-white rounded-lg p-3"
                  >
                    <div class="flex items-start gap-3">
                      <div class="bg-info-100 dark:bg-info-900/30 flex size-6 items-center justify-center rounded-full mt-0.5">
                        <Icon name="ph:bookmark-simple" class="text-info-500 size-3" />
                      </div>
                      <div class="flex-1">
                        <div class="text-sm font-medium text-muted-800 dark:text-muted-200 mb-1">
                          {{ theory.name }}
                        </div>
                        <div class="text-xs text-muted-600 dark:text-muted-400 mb-2">
                          {{ theory.description }}
                        </div>
                        <div class="flex flex-wrap gap-1">
                          <BaseTag
                            v-for="author in theory.authors"
                            :key="author"
                            color="info"
                            size="xs"
                            shape="full"
                          >
                            {{ author }}
                          </BaseTag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Research Necessity -->
              <div v-if="formData.necessity">
                <BaseHeading as="h3" size="md" weight="semibold" class="mb-3 text-muted-800 dark:text-muted-200 flex items-center gap-2">
                  <Icon name="ph:warning-circle" class="text-danger-500 size-5" />
                  ضرورت تحقیق
                </BaseHeading>
                <div class="dark:bg-muted-800 dark:border-muted-700 border border-gray-200 bg-white rounded-lg p-4">
                  <div class="text-sm text-muted-700 dark:text-muted-300 leading-relaxed">
                    {{ formData.necessity }}
                  </div>
                </div>
              </div>

              <!-- Research Importance -->
              <div v-if="formData.importance">
                <BaseHeading as="h3" size="md" weight="semibold" class="mb-3 text-muted-800 dark:text-muted-200 flex items-center gap-2">
                  <Icon name="ph:star" class="text-warning-500 size-5" />
                  اهمیت تحقیق
                </BaseHeading>
                <div class="dark:bg-muted-800 dark:border-muted-700 border border-gray-200 bg-white rounded-lg p-4">
                  <div class="text-sm text-muted-700 dark:text-muted-300 leading-relaxed">
                    {{ formData.importance }}
                  </div>
                </div>
              </div>

              <!-- Ethics Approval -->
              <div class="dark:bg-muted-800 dark:border-muted-700 border border-gray-200 bg-white rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="bg-warning-100 dark:bg-warning-900/30 flex size-8 items-center justify-center rounded-lg">
                      <Icon name="ph:shield-check" class="text-warning-500 size-4" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-muted-800 dark:text-muted-200">تایید کمیته اخلاق</div>
                      <div class="text-xs text-muted-500 dark:text-muted-400">
                        {{ formData.ethicsApproval ? 'نیاز به تایید دارد' : 'نیاز به تایید ندارد' }}
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div
                      :class="[
                        'flex size-6 items-center justify-center rounded-full',
                        formData.ethicsApproval 
                          ? 'bg-success-100 text-success-600' 
                          : 'bg-muted-100 text-muted-400'
                      ]"
                    >
                      <Icon :name="formData.ethicsApproval ? 'ph:check' : 'ph:minus'" class="size-3" />
                    </div>
                  </div>
                </div>
              </div>


            </div>


          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-8 flex items-center justify-between">
          <BaseButton v-if="currentStep > 1" color="muted" shape="curved" size="lg" @click="previousStep">
            <Icon name="ph:arrow-right" class="ml-2 size-5" />
            مرحله قبل
          </BaseButton>
          <div v-else />

          <div class="flex gap-3">
            <BaseButton color="muted" shape="curved" size="lg" @click="cancelForm">انصراف</BaseButton>
            <BaseButton
              v-if="currentStep < totalSteps"
              color="primary"
              shape="curved"
              size="lg"
              :disabled="!canGoNext"
              class="shadow-primary-500/30 shadow-lg"
              @click="nextStep"
            >
              مرحله بعد
              <Icon name="ph:arrow-left" class="mr-2 size-5" />
            </BaseButton>
            <BaseButton
              v-else
              color="success"
              shape="curved"
              size="lg"
              class="shadow-success-500/30 shadow-lg"
              @click="submitForm"
            >
              <Icon name="ph:check-circle" class="ml-2 size-5" />
              ثبت پروژه
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Research Domain Info Modal -->
    <TairoModal :open="showResearchDomainInfoModal" size="lg" @close="showResearchDomainInfoModal = false">
      <template #header>
        <div class="flex items-center gap-3 p-6 pb-0">
          <div class="bg-info-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:info-fill" class="size-6 text-white" />
          </div>
          <div class="text-right">
            <BaseHeading as="h2" size="xl" weight="bold">راهنمای انتخاب حوزهٔ دانشی</BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">نکات مهم برای انتخاب حوزه‌های پژوهشی مناسب</BaseParagraph>
          </div>
        </div>
      </template>

      <div class="space-y-6 p-6 max-h-96 overflow-y-auto text-right">
        <!-- Introduction -->
        <div class="bg-info-500/10 dark:bg-info-500/20 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <Icon name="ph:lightbulb-fill" class="text-info-500 mt-1 size-6 shrink-0" />
            <div class="flex-1">
              <BaseHeading as="h3" size="md" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                چرا حوزهٔ دانشی مهم است؟
              </BaseHeading>
              <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm leading-relaxed">
                حوزه دانشی به شما کمک می‌کند تا منابع مناسب را پیدا کنید، با متخصصان مرتبط ارتباط برقرار کنید و پژوهش
                خود را در چارچوب علمی مناسب قرار دهید.
              </BaseParagraph>
            </div>
          </div>
        </div>

        <!-- Guidelines -->
        <div class="space-y-4">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            نکات کلیدی برای انتخاب حوزه
          </BaseHeading>

          <div class="grid gap-4 sm:grid-cols-2">
            <!-- Guideline 1 -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-primary-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:target" class="text-primary-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    مرتبط با موضوع
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    حوزه باید با موضوع اصلی پژوهش شما مرتبط باشد و زمینه‌های علمی لازم را فراهم کند.
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Guideline 2 -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-success-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:users" class="text-success-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    دسترسی به متخصصان
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    حوزه‌ای انتخاب کنید که بتوانید با متخصصان و اساتید آن زمینه ارتباط برقرار کنید.
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Guideline 3 -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-warning-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:books" class="text-warning-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    منابع موجود
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    حوزه‌ای انتخاب کنید که منابع علمی، کتاب‌ها و مقالات کافی در آن موجود باشد.
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Guideline 4 -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-info-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:arrows-out" class="text-info-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    رویکرد بین‌رشته‌ای
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    در صورت نیاز، می‌توانید چندین حوزه مرتبط را انتخاب کنید (بین‌رشته‌ای).
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Guideline 5: New Interactive Selection -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-success-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:lightbulb" class="text-success-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    انتخاب تعاملی علایق
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    از دکمه "علایق پژوهشی" استفاده کنید تا حوزه‌های مورد علاقه خود را به صورت تعاملی انتخاب کنید.
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Examples -->
        <div class="space-y-4">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            مثال‌هایی از حوزه‌های دانشی
          </BaseHeading>

          <div class="dark:bg-muted-900/50 dark:border-muted-700 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              <div class="flex items-center gap-2">
                <Icon name="ph:check-circle-fill" class="text-success-500 size-4" />
                <span class="text-muted-700 dark:text-muted-300">روانشناسی بالینی</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:check-circle-fill" class="text-success-500 size-4" />
                <span class="text-muted-700 dark:text-muted-300">علوم کامپیوتر</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:check-circle-fill" class="text-success-500 size-4" />
                <span class="text-muted-700 dark:text-muted-300">مهندسی پزشکی</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:check-circle-fill" class="text-success-500 size-4" />
                <span class="text-muted-700 dark:text-muted-300">آموزش و پرورش</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:check-circle-fill" class="text-success-500 size-4" />
                <span class="text-muted-700 dark:text-muted-300">مدیریت کسب‌وکار</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:check-circle-fill" class="text-success-500 size-4" />
                <span class="text-muted-700 dark:text-muted-300">علوم محیط زیست</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="bg-warning-500/10 dark:bg-warning-500/20 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <Icon name="ph:warning-circle-fill" class="text-warning-500 mt-0.5 size-5 shrink-0" />
            <div class="flex-1">
              <BaseHeading as="h4" size="sm" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                نکات مهم
              </BaseHeading>
              <ul class="text-muted-700 dark:text-muted-300 space-y-1 text-sm">
                <li>• حوزه دانشی را می‌توانید در مراحل بعدی تغییر دهید</li>
                <li>• از پیشنهادات هوشمند برای یافتن حوزه‌های مرتبط استفاده کنید</li>
                <li>• از دکمه "علایق پژوهشی" برای انتخاب تعاملی حوزه‌های مورد علاقه استفاده کنید</li>
                <li>• در صورت عدم اطمینان، با مشاور علمی خود مشورت کنید</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex justify-end">
          <BaseButton color="info" shape="curved" size="lg" @click="showResearchDomainInfoModal = false">
            متوجه شدم
            <Icon name="ph:check" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </TairoModal>

    <!-- Research Goals Info Modal -->
    <TairoModal :open="showResearchGoalsInfoModal" size="lg" @close="showResearchGoalsInfoModal = false">
      <template #header>
        <div class="flex items-center gap-3 p-6 pb-0">
          <div class="bg-success-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:target-fill" class="size-6 text-white" />
          </div>
          <div class="text-right">
            <BaseHeading as="h2" size="xl" weight="bold">راهنمای اهداف پژوهش</BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">نکات مهم برای تعریف اهداف پژوهشی مناسب</BaseParagraph>
          </div>
        </div>
      </template>

      <div class="space-y-6 p-6 max-h-96 overflow-y-auto text-right">
        <!-- Introduction -->
        <div class="bg-success-500/10 dark:bg-success-500/20 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <Icon name="ph:target-fill" class="text-success-500 mt-1 size-6 shrink-0" />
            <div class="flex-1">
              <BaseHeading as="h3" size="md" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                چرا اهداف پژوهش مهم هستند؟
              </BaseHeading>
              <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm leading-relaxed">
                اهداف پژوهش به شما کمک می‌کنند تا مسیر پژوهش خود را مشخص کنید، منابع را بهینه تخصیص دهید و تأثیر پژوهش
                خود را بسنجید.
              </BaseParagraph>
            </div>
          </div>
        </div>

        <!-- Guidelines -->
        <div class="space-y-4">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            ویژگی‌های اهداف خوب (SMART)
          </BaseHeading>

          <div class="grid gap-4 sm:grid-cols-2">
            <!-- Guideline 1 -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-primary-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:target" class="text-primary-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    مشخص (Specific)
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    هدف باید کاملاً واضح و مشخص باشد. چه کاری می‌خواهید انجام دهید؟
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Guideline 2 -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-success-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:ruler" class="text-success-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    قابل اندازه‌گیری (Measurable)
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    چگونه می‌توانید موفقیت هدف را اندازه‌گیری کنید؟
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Guideline 3 -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-warning-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:check-circle" class="text-warning-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    دست یافتنی (Achievable)
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    آیا منابع و زمان کافی برای دستیابی به هدف دارید؟
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Guideline 4 -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-info-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:link" class="text-info-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    مرتبط (Relevant)
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    آیا هدف با اهداف کلی پژوهش و حوزه دانشی مرتبط است؟
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Guideline 5 -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-danger-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:clock" class="text-danger-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    زمان‌دار (Time-bound)
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    چه زمانی می‌خواهید به هدف برسید؟
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Examples -->
        <div class="space-y-4">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            مثال‌هایی از اهداف خوب
          </BaseHeading>

          <div class="dark:bg-muted-900/50 dark:border-muted-700 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div class="grid gap-3 sm:grid-cols-1 text-sm">
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-success-500 mt-0.5 size-4 shrink-0" />
                <div>
                  <div class="font-medium text-muted-700 dark:text-muted-300">
                    بهبود سلامت روان دانشجویان دانشگاه تهران تا پایان سال تحصیلی ۱۴۰۳
                  </div>
                  <div class="text-xs text-muted-500 mt-1">مشخص، قابل اندازه‌گیری، دست یافتنی، مرتبط، زمان‌دار</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-success-500 mt-0.5 size-4 shrink-0" />
                <div>
                  <div class="font-medium text-muted-700 dark:text-muted-300">
                    کاهش ۲۰ درصدی نرخ افسردگی در بین دانشجویان پزشکی طی ۶ ماه
                  </div>
                  <div class="text-xs text-muted-500 mt-1">مشخص، قابل اندازه‌گیری، دست یافتنی، مرتبط، زمان‌دار</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-success-500 mt-0.5 size-4 shrink-0" />
                <div>
                  <div class="font-medium text-muted-700 dark:text-muted-300">
                    توسعه برنامه آموزشی آنلاین برای تقویت مهارت‌های زندگی دانشجویان
                  </div>
                  <div class="text-xs text-muted-500 mt-1">مشخص، قابل اندازه‌گیری، دست یافتنی، مرتبط، زمان‌دار</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="bg-warning-500/10 dark:bg-warning-500/20 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <Icon name="ph:warning-circle-fill" class="text-warning-500 mt-0.5 size-5 shrink-0" />
            <div class="flex-1">
              <BaseHeading as="h4" size="sm" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                نکات مهم
              </BaseHeading>
              <ul class="text-muted-700 dark:text-muted-300 space-y-1 text-sm">
                <li>• اهداف را در ابتدای پژوهش مشخص کنید</li>
                <li>• از اهداف هوشمند (SMART) استفاده کنید</li>
                <li>• اهداف را با منابع و زمان موجود تطبیق دهید</li>
                <li>• اهداف را در طول پژوهش ارزیابی کنید</li>
                <li>• اهداف را می‌توانید در مراحل بعدی تغییر دهید</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex justify-end">
          <BaseButton color="success" shape="curved" size="lg" @click="showResearchGoalsInfoModal = false">
            متوجه شدم
            <Icon name="ph:check" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </TairoModal>

    <!-- Selected Interests Modal -->
    <TairoModal :open="showSelectedInterestsModal" size="xl" @close="showSelectedInterestsModal = false">
      <template #header>
        <div class="flex items-center gap-3 p-6 pb-0">
          <div class="bg-success-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:lightbulb-fill" class="size-6 text-white" />
          </div>
          <div class="text-right">
            <BaseHeading as="h2" size="xl" weight="bold">علایق پژوهشی انتخاب شده</BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              نمایش علایق پژوهشی سطح سوم به صورت دسته‌بندی شده
            </BaseParagraph>
          </div>
        </div>
      </template>

      <div class="p-6 text-right">
        <div class="max-h-96 overflow-y-auto">
          <!-- Categories -->
          <div v-for="(category, catId) in organizedCategories" :key="catId" class="mb-8">
            <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">
              {{ category.name }}
            </BaseHeading>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <BaseCard
                v-for="item in category.level3"
                :key="item.id"
                shape="curved"
                :class="[
                  'p-4 transition-all hover:shadow-lg cursor-pointer',
                  formData.researchDomain.includes(item.name)
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                    : 'hover:bg-gray-50 dark:hover:bg-muted-800/50',
                ]"
                @click="toggleResearchDomain(item.name)"
              >
                <BaseHeading as="h4" size="md" weight="medium" class="mb-2">
                  {{ item.name }}
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                  {{ item.description }}
                </BaseParagraph>
                <div v-if="formData.researchDomain.includes(item.name)" class="mt-2 flex items-center gap-1">
                  <Icon name="ph:check-circle-fill" class="text-primary-500 size-4" />
                  <span class="text-primary-600 dark:text-primary-400 text-xs">انتخاب شده</span>
                </div>
              </BaseCard>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex justify-end mt-6">
          <BaseButton color="success" shape="curved" size="lg" @click="showSelectedInterestsModal = false">
            متوجه شدم
            <Icon name="ph:check" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </TairoModal>

    <!-- Keywords Info Modal -->
    <TairoModal :open="showKeywordsInfoModal" size="lg" @close="showKeywordsInfoModal = false">
      <template #header>
        <div class="flex items-center gap-3 p-6 pb-0">
          <div class="bg-warning-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:key-fill" class="size-6 text-white" />
          </div>
          <div class="text-right">
            <BaseHeading as="h2" size="xl" weight="bold">راهنمای کلیدواژه‌ها</BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">نکات مهم برای انتخاب کلیدواژه‌های مناسب</BaseParagraph>
          </div>
        </div>
      </template>

      <div class="space-y-6 p-6 max-h-96 overflow-y-auto text-right">
        <!-- Introduction -->
        <div class="bg-warning-500/10 dark:bg-warning-500/20 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <Icon name="ph:key-fill" class="text-warning-500 mt-1 size-6 shrink-0" />
            <div class="flex-1">
              <BaseHeading as="h3" size="md" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                چرا کلیدواژه‌ها مهم هستند؟
              </BaseHeading>
              <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm leading-relaxed">
                کلیدواژه‌ها به پژوهش شما دید می‌دهند، به دیگران کمک می‌کنند تا کار شما را پیدا کنند و موضوع اصلی تحقیق
                را مشخص می‌کنند.
              </BaseParagraph>
            </div>
          </div>
        </div>

        <!-- Guidelines -->
        <div class="space-y-4">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            ویژگی‌های کلیدواژه‌های خوب
          </BaseHeading>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-warning-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:target" class="text-warning-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    مشخص و دقیق
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    کلیدواژه‌ها باید دقیقاً مفهوم مورد نظر را منتقل کنند.
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-success-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:translate" class="text-success-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    قابل جستجو
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    از اصطلاحات رایج در پایگاه‌های علمی استفاده کنید.
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-info-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:books" class="text-info-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    پوشش مفاهیم اصلی
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    تمام جنبه‌های مهم پژوهش را پوشش دهید.
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-primary-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:globe" class="text-primary-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    بین‌المللی
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    در صورت امکان از معادل‌های انگلیسی نیز استفاده کنید.
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Examples -->
        <div class="space-y-4">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            مثال‌هایی از کلیدواژه‌های خوب
          </BaseHeading>

          <div class="dark:bg-muted-900/50 dark:border-muted-700 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div class="grid gap-3 sm:grid-cols-2 text-sm">
              <div class="flex items-center gap-2">
                <Icon name="ph:check-circle-fill" class="text-success-500 size-4" />
                <span class="text-muted-700 dark:text-muted-300">یادگیری ماشین</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:check-circle-fill" class="text-success-500 size-4" />
                <span class="text-muted-700 dark:text-muted-300">سلامت روان</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:check-circle-fill" class="text-success-500 size-4" />
                <span class="text-muted-700 dark:text-muted-300">تعامل انسان و کامپیوتر</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:check-circle-fill" class="text-success-500 size-4" />
                <span class="text-muted-700 dark:text-muted-300">آموزش الکترونیکی</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:check-circle-fill" class="text-success-500 size-4" />
                <span class="text-muted-700 dark:text-muted-300">تحلیل داده</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:check-circle-fill" class="text-success-500 size-4" />
                <span class="text-muted-700 dark:text-muted-300">مداخله رفتاری</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex justify-end">
          <BaseButton color="warning" shape="curved" size="lg" @click="showKeywordsInfoModal = false">
            متوجه شدم
            <Icon name="ph:check" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </TairoModal>

    <!-- Theories Info Modal -->
    <TairoModal :open="showTheoriesInfoModal" size="lg" @close="showTheoriesInfoModal = false">
      <template #header>
        <div class="flex items-center gap-3 p-6 pb-0">
          <div class="bg-info-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:graduation-cap-fill" class="size-6 text-white" />
          </div>
          <div class="text-right">
            <BaseHeading as="h2" size="xl" weight="bold">راهنمای نظریه‌های علمی</BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              نکات مهم برای استخراج و استفاده از نظریه‌های مرتبط
            </BaseParagraph>
          </div>
        </div>
      </template>

      <div class="space-y-6 p-6 max-h-96 overflow-y-auto text-right">
        <!-- Introduction -->
        <div class="bg-info-500/10 dark:bg-info-500/20 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <Icon name="ph:graduation-cap-fill" class="text-info-500 mt-1 size-6 shrink-0" />
            <div class="flex-1">
              <BaseHeading as="h3" size="md" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                چرا نظریه‌ها مهم هستند؟
              </BaseHeading>
              <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm leading-relaxed">
                نظریه‌ها چارچوب علمی برای پژوهش شما فراهم می‌کنند، به یافته‌ها اعتبار می‌بخشند و تحقیق شما را به دانش
                موجود متصل می‌کنند.
              </BaseParagraph>
            </div>
          </div>
        </div>

        <!-- Guidelines -->
        <div class="space-y-4">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            نقش نظریه‌ها در پژوهش
          </BaseHeading>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-info-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:compass" class="text-info-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    راهنمایی پژوهش
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    نظریه‌ها مسیر تحقیق و سوالات پژوهشی را مشخص می‌کنند.
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-success-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:microscope" class="text-success-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    تفسیر یافته‌ها
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    برای تحلیل و تفسیر نتایج به چارچوب نظری نیاز است.
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-warning-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:link" class="text-warning-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    اتصال به دانش
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    پژوهش شما را به تحقیقات قبلی و دانش موجود متصل می‌کند.
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-primary-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:medal" class="text-primary-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    اعتبار علمی
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    استفاده از نظریه‌ها به پژوهش شما اعتبار علمی می‌بخشد.
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Examples by Domain -->
        <div class="space-y-4">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            مثال‌هایی از نظریه‌ها بر اساس حوزه
          </BaseHeading>

          <div class="dark:bg-muted-900/50 dark:border-muted-700 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div class="space-y-4 text-sm">
              <div>
                <BaseHeading as="h4" size="sm" weight="medium" class="mb-2 text-muted-700 dark:text-muted-300">
                  روانشناسی:
                </BaseHeading>
                <div class="grid gap-2">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:check-circle-fill" class="text-success-500 size-3" />
                    <span class="text-muted-600 dark:text-muted-400">نظریه یادگیری اجتماعی (بندورا)</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon name="ph:check-circle-fill" class="text-success-500 size-3" />
                    <span class="text-muted-600 dark:text-muted-400">نظریه شناخت اجتماعی (بک، الیس)</span>
                  </div>
                </div>
              </div>

              <div>
                <BaseHeading as="h4" size="sm" weight="medium" class="mb-2 text-muted-700 dark:text-muted-300">
                  آموزش:
                </BaseHeading>
                <div class="grid gap-2">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:check-circle-fill" class="text-success-500 size-3" />
                    <span class="text-muted-600 dark:text-muted-400">نظریه ساختار شناختی (پیاژه)</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon name="ph:check-circle-fill" class="text-success-500 size-3" />
                    <span class="text-muted-600 dark:text-muted-400">نظریه zone نزدیک توسعه (ویگوتسکی)</span>
                  </div>
                </div>
              </div>

              <div>
                <BaseHeading as="h4" size="sm" weight="medium" class="mb-2 text-muted-700 dark:text-muted-300">
                  کامپیوتر/هوش مصنوعی:
                </BaseHeading>
                <div class="grid gap-2">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:check-circle-fill" class="text-success-500 size-3" />
                    <span class="text-muted-600 dark:text-muted-400">نظریه محاسبات ذهن (تورینگ)</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon name="ph:check-circle-fill" class="text-success-500 size-3" />
                    <span class="text-muted-600 dark:text-muted-400">نظریه اتصال‌گرایی (هب)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="bg-warning-500/10 dark:bg-warning-500/20 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <Icon name="ph:warning-circle-fill" class="text-warning-500 mt-0.5 size-5 shrink-0" />
            <div class="flex-1">
              <BaseHeading as="h4" size="sm" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                نکات مهم
              </BaseHeading>
              <ul class="text-muted-700 dark:text-muted-300 space-y-1 text-sm">
                <li>• نظریه‌ها باید مستقیماً به سوالات پژوهشی شما مرتبط باشند</li>
                <li>• از منابع معتبر و جدید برای نظریه‌ها استفاده کنید</li>
                <li>• می‌توانید از چندین نظریه به صورت ترکیبی استفاده کنید</li>
                <li>• نظریه‌ها را در مقدمه و مبانی نظری تحقیق خود توضیح دهید</li>
                <li>• از استاد راهنما و متخصصان حوزه برای انتخاب نظریه‌ها مشورت بگیرید</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex justify-end">
          <BaseButton color="info" shape="curved" size="lg" @click="showTheoriesInfoModal = false">
            متوجه شدم
            <Icon name="ph:check" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </TairoModal>

    <!-- Necessity Info Modal -->
    <TairoModal :open="showNecessityInfoModal" size="lg" @close="showNecessityInfoModal = false">
      <template #header>
        <div class="flex items-center gap-3 p-6 pb-0">
          <div class="bg-warning-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:warning-circle-fill" class="size-6 text-white" />
          </div>
          <div class="text-right">
            <BaseHeading as="h2" size="xl" weight="bold">راهنمای ضرورت تحقیق</BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">نکات مهم برای توضیح ضرورت انجام پژوهش</BaseParagraph>
          </div>
        </div>
      </template>

      <div class="space-y-6 p-6 max-h-96 overflow-y-auto text-right">
        <!-- Introduction -->
        <div class="bg-warning-500/10 dark:bg-warning-500/20 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <Icon name="ph:warning-circle-fill" class="text-warning-500 mt-1 size-6 shrink-0" />
            <div class="flex-1">
              <BaseHeading as="h3" size="md" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                چرا ضرورت تحقیق مهم است؟
              </BaseHeading>
              <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm leading-relaxed">
                ضرورت تحقیق به شما کمک می‌کند تا اهمیت و اعتبار پژوهش خود را نشان دهید و دلیل نیاز به انجام این تحقیق را
                به خوبی توجیه کنید.
              </BaseParagraph>
            </div>
          </div>
        </div>

        <!-- Guidelines -->
        <div class="space-y-4">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            نکات کلیدی برای نوشتن ضرورت تحقیق
          </BaseHeading>

          <div class="grid gap-4 sm:grid-cols-1">
            <!-- Guideline 1 -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-warning-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:magnifying-glass" class="text-warning-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    شناسایی خلاء دانشی
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    مشخص کنید چه خلاء دانشی در حوزه مورد نظر وجود دارد و تحقیق شما چگونه آن را پر می‌کند.
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Guideline 2 -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-danger-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:first-aid-kit" class="text-danger-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    حل مشکل واقعی
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    نشان دهید که تحقیق شما کدام مشکل عملی یا نظری را حل می‌کند و چه نیجی را پاسخ می‌دهد.
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Guideline 3 -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-info-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:clock" class="text-info-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    زمان‌بندی مناسب
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    توضیح دهید که چرا انجام این تحقیق در زمان فعلی ضروری و حیاتی است.
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Guideline 4 -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-success-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:users-three" class="text-success-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    نیاز اجتماعی یا علمی
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    نشان دهید که تحقیق شما به کدام نیاز اجتماعی، علمی یا صنعتی پاسخ می‌دهد.
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Examples -->
        <div class="space-y-4">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            مثال‌هایی از ضرورت تحقیق
          </BaseHeading>

          <div class="dark:bg-muted-900/50 dark:border-muted-700 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div class="space-y-4 text-sm">
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-success-500 mt-0.5 size-4 shrink-0" />
                <div>
                  <div class="font-medium text-muted-700 dark:text-muted-300">
                    شیوع بالای اضطراب در دانشجویان پس از همه‌گیری کووید-۱۹
                  </div>
                  <div class="text-xs text-muted-500 mt-1">
                    این تحقیق ضروری است زیرا آمارها نشان می‌دهد سطح اضطراب در دانشگاهیان به شدت افزایش یافته است.
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-success-500 mt-0.5 size-4 shrink-0" />
                <div>
                  <div class="font-medium text-muted-700 dark:text-muted-300">
                    عدم وجود برنامه‌های مداخله‌ای مبتنی بر شواهد برای سلامت روان در ایران
                  </div>
                  <div class="text-xs text-muted-500 mt-1">
                    خلاء دانشی در زمینه برنامه‌های مداخله‌ای فرهنگ متناسب با جامعه ایران این پژوهش را ضروری می‌کند.
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-success-500 mt-0.5 size-4 shrink-0" />
                <div>
                  <div class="font-medium text-muted-700 dark:text-muted-300">
                    نیاز به روش‌های آموزشی نوین برای یادگیری از راه دور
                  </div>
                  <div class="text-xs text-muted-500 mt-1">
                    با تغییر سیستم آموزشی، توسعه روش‌های مؤثر آموزش از راه دور ضروری شده است.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="bg-warning-500/10 dark:bg-warning-500/20 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <Icon name="ph:warning-circle-fill" class="text-warning-500 mt-0.5 size-5 shrink-0" />
            <div class="flex-1">
              <BaseHeading as="h4" size="sm" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                نکات مهم
              </BaseHeading>
              <ul class="text-muted-700 dark:text-muted-300 space-y-1 text-sm">
                <li>• از آمار و شواهد معتبر برای اثبات ضرورت تحقیق استفاده کنید</li>
                <li>• به تحقیقات پیشین اشاره کرده و خلاء موجود را مشخص کنید</li>
                <li>• تأثیر عملی تحقیق خود بر جامعه یا علم را توضیح دهید</li>
                <li>• علت زمانی انجام تحقیق را مشخص کنید (چرا الان؟)</li>
                <li>• از زبان علمی و دقیق استفاده کنید اما قابل فهم باشد</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex justify-end">
          <BaseButton color="warning" shape="curved" size="lg" @click="showNecessityInfoModal = false">
            متوجه شدم
            <Icon name="ph:check" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </TairoModal>

    <!-- Importance Info Modal -->
    <TairoModal :open="showImportanceInfoModal" size="lg" @close="showImportanceInfoModal = false">
      <template #header>
        <div class="flex items-center gap-3 p-6 pb-0">
          <div class="bg-info-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:star-fill" class="size-6 text-white" />
          </div>
          <div class="text-right">
            <BaseHeading as="h2" size="xl" weight="bold">راهنمای اهمیت تحقیق</BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">نکات مهم برای توضیح اهمیت و تأثیر پژوهش</BaseParagraph>
          </div>
        </div>
      </template>

      <div class="space-y-6 p-6 max-h-96 overflow-y-auto text-right">
        <!-- Introduction -->
        <div class="bg-info-500/10 dark:bg-info-500/20 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <Icon name="ph:star-fill" class="text-info-500 mt-1 size-6 shrink-0" />
            <div class="flex-1">
              <BaseHeading as="h3" size="md" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                چرا اهمیت تحقیق مهم است؟
              </BaseHeading>
              <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm leading-relaxed">
                اهمیت تحقیق به شما کمک می‌کند تا ارزش و تأثیر پژوهش خود را نشان دهید و دلایل علمی، عملیاتی و اجتماعی
                انجام آن را تبیین کنید.
              </BaseParagraph>
            </div>
          </div>
        </div>

        <!-- Types of Importance -->
        <div class="space-y-4">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            انواع اهمیت در پژوهش
          </BaseHeading>

          <div class="grid gap-4 sm:grid-cols-1">
            <!-- Scientific Importance -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-primary-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:brain" class="text-primary-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    اهمیت علمی
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    چه تأثیری بر دانش نظری، روش‌شناسی، و فهم ما از پدیده‌ها دارد؟ آیا نظریه‌های جدیدی ارائه می‌دهد؟
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Operational Importance -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-success-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:gear" class="text-success-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    اهمیت عملیاتی
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    چه کاربردهای عملی دارد؟ آیا به بهبود فرآیندها، روش‌ها یا ابزارهای موجود کمک می‌کند؟
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Social Importance -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-warning-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:users" class="text-warning-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    اهمیت اجتماعی
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    چه تأثیری بر جامعه، کیفیت زندگی افراد، یا حل مسائل اجتماعی دارد؟
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Economic Importance -->
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-4">
              <div class="flex items-start gap-3">
                <div class="bg-info-500/10 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:currency-dollar" class="text-info-500 size-4" />
                </div>
                <div class="flex-1">
                  <BaseHeading as="h4" size="sm" weight="semibold" class="mb-1 text-gray-900 dark:text-white">
                    اهمیت اقتصادی
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    چه مزایای اقتصادی دارد؟ آیا به کاهش هزینه‌ها، افزایش بهره‌وری یا ایجاد فرصت‌های شغلی کمک می‌کند؟
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Impact Assessment -->
        <div class="space-y-4">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            چگونه اهمیت را نشان دهیم
          </BaseHeading>

          <div class="dark:bg-muted-900/50 dark:border-muted-700 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div class="space-y-3 text-sm">
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-success-500 mt-0.5 size-4 shrink-0" />
                <div>
                  <div class="font-medium text-muted-700 dark:text-muted-300">با شواهد عددی و آماری</div>
                  <div class="text-xs text-muted-500 mt-1">
                    از آمارهای معتبر برای نشان دادن ابعاد مشکل و میزان تأثیر بالقوه تحقیق استفاده کنید.
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-success-500 mt-0.5 size-4 shrink-0" />
                <div>
                  <div class="font-medium text-muted-700 dark:text-muted-300">با مقایسه با تحقیقات پیشین</div>
                  <div class="text-xs text-muted-500 mt-1">
                    نشان دهید که تحقیق شما چگونه بر کارهای قبلی بنا شده و آن را ارتقا می‌دهد.
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-success-500 mt-0.5 size-4 shrink-0" />
                <div>
                  <div class="font-medium text-muted-700 dark:text-muted-300">با ذکر مثال‌های کاربردی</div>
                  <div class="text-xs text-muted-500 mt-1">
                    مثال‌های مشخصی از کاربردهای عملی نتایج تحقیق خود ارائه دهید.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Examples -->
        <div class="space-y-4">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            مثال‌هایی از اهمیت تحقیق
          </BaseHeading>

          <div class="dark:bg-muted-900/50 dark:border-muted-700 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div class="space-y-4 text-sm">
              <div class="flex items-start gap-3">
                <Icon name="ph:star-fill" class="text-success-500 mt-0.5 size-4 shrink-0" />
                <div>
                  <div class="font-medium text-muted-700 dark:text-muted-300">
                    اهمیت علمی: ارائه چارچوب نظری جدید برای درگیری شناختی
                  </div>
                  <div class="text-xs text-muted-500 mt-1">
                    این تحقیق با ارائه مدل جدیدی از فرآیندهای شناختی، به تحول نظری‌های روانشناسی شناختی کمک می‌کند.
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:star-fill" class="text-success-500 mt-0.5 size-4 shrink-0" />
                <div>
                  <div class="font-medium text-muted-700 dark:text-muted-300">
                    اهمیت عملیاتی: توسعه ابزار غربالگری سلامت روان
                  </div>
                  <div class="text-xs text-muted-500 mt-1">
                    ابزار توسعه یافته به متخصصان بهداشت کمک می‌کند تا مشکلات روانی را در مراحل اولیه شناسایی کنند.
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:star-fill" class="text-success-500 mt-0.5 size-4 shrink-0" />
                <div>
                  <div class="font-medium text-muted-700 dark:text-muted-300">
                    اهمیت اجتماعی: کاهش نرخ ترک تحصیل در دانشگاهیان
                  </div>
                  <div class="text-xs text-muted-500 mt-1">
                    نتایج این تحقیق به کاهش مشکلات سلامت روان و افزایش موفقیت تحصیلی دانشجویان کمک شایانی می‌کند.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="bg-info-500/10 dark:bg-info-500/20 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <Icon name="ph:star-fill" class="text-info-500 mt-0.5 size-5 shrink-0" />
            <div class="flex-1">
              <BaseHeading as="h4" size="sm" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                نکات مهم
              </BaseHeading>
              <ul class="text-muted-700 dark:text-muted-300 space-y-1 text-sm">
                <li>• تأثیر تحقیق را در کوتاه مدت و بلند مدت توضیح دهید</li>
                <li>• به تأثیر چندجانبه تحقیق (علمی، عملی، اجتماعی) اشاره کنید</li>
                <li>• از زبان قاطع و مثبت برای بیان اهمیت استفاده کنید</li>
                <li>• ارتباط تحقیق با نیازهای روز جامعه را نشان دهید</li>
                <li>• به نوآوری یا جنبه منحصر به فرد تحقیق خود تأکید کنید</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex justify-end">
          <BaseButton color="info" shape="curved" size="lg" @click="showImportanceInfoModal = false">
            متوجه شدم
            <Icon name="ph:check" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </TairoModal>
  </div>
</template>

<style scoped>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
</style>
