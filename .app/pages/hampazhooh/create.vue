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
	researchGoals: string[];
	ethicsApproval: boolean;
	necessity: string;
	importance: string;
}

definePageMeta({
	title: "ایجاد پروژه جدید",
	layout: "sidebar",
});

useHead({ htmlAttrs: { dir: "rtl" } });

const { getOrganizedCategories } = useResearcher();
const { researchCategories, toggleNode, flattenNodes, loadResearchData } = useResearcher();

const {
	createResearchProject,
	generateAISuggestions,
	suggestResearchDomain,
	suggestKeywords,
	suggestResearchGoals,
	suggestNecessity,
	suggestImportance,
} = useResearchProject();
const { user } = useUser();

const router = useRouter();
const toaster = useToaster();

const currentStep = ref(1);
const totalSteps = 5;
const isBrainstorming = ref(false);
const brainstormResults = ref("");

const formData = ref<FormData>({
	projectType: "",
	researchDomain: [],
	keywords: [],
	researchGoals: [],
	ethicsApproval: false,
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

const selectedProjectType = computed(() =>
	projectTypes.find((type) => type.id === formData.value.projectType),
);

const truncateText = (text: string, limit = 220) => {
	if (!text) return "";
	return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

const steps = computed(() => [
	{
		number: 1,
		title: "نوع پروژه",
		completed:
			currentStep.value > 1 ||
			(currentStep.value >= 1 && stepValidation.value.step1.isValid),
		isValid: stepValidation.value.step1.isValid,
	},
	{
		number: 2,
		title: "طوفان فکری",
		completed:
			currentStep.value > 2 ||
			(currentStep.value >= 2 && stepValidation.value.step2.isValid),
		isValid: stepValidation.value.step2.isValid,
	},
	{
		number: 3,
		title: "حوزه و اهداف",
		completed:
			currentStep.value > 3 ||
			(currentStep.value >= 3 && stepValidation.value.step3.isValid),
		isValid: stepValidation.value.step3.isValid,
	},
	{
		number: 4,
		title: "جزئیات پژوهش",
		completed:
			currentStep.value > 4 ||
			(currentStep.value >= 4 && stepValidation.value.step4.isValid),
		isValid: stepValidation.value.step4.isValid,
	},
	{
		number: 5,
		title: "بررسی و ثبت",
		completed: currentStep.value > 5,
		isValid: true,
	},
]);

// Enhanced validation for each step with real-time feedback
const stepValidation = computed(() => {
	return {
		step1: {
			isValid: formData.value.projectType !== "",
			message: formData.value.projectType
				? ""
				: "لطفاً نوع پروژه را انتخاب کنید",
		},
		step2: {
			isValid: true, // Step 2 has no required fields
			message: "",
		},
		step3: {
			isValid:
				formData.value.researchDomain.length > 0 &&
				formData.value.researchGoals.length > 0 &&
				formData.value.keywords.length > 0,
			message:
				formData.value.researchDomain.length === 0
					? "حداقل یک حوزه دانشی انتخاب کنید"
					: formData.value.researchGoals.length === 0
						? "حداقل یک هدف پژوهشی وارد کنید"
						: formData.value.keywords.length === 0
							? "حداقل یک کلیدواژه وارد کنید"
							: "",
		},
		step4: {
			isValid: formData.value.necessity && formData.value.importance,
			message: !formData.value.necessity
				? "ضرورت تحقیق را وارد کنید"
				: !formData.value.importance
					? "اهمیت تحقیق را وارد کنید"
					: "",
		},
	};
});

// Specific validation for step 4 fields
const step4FieldValidation = computed(() => ({
	necessity: {
		isValid:
			formData.value.necessity && formData.value.necessity.trim().length > 10,
		message: "ضرورت تحقیق باید حداقل ۱۰ کاراکتر باشد",
	},
	importance: {
		isValid:
			formData.value.importance && formData.value.importance.trim().length > 10,
		message: "اهمیت تحقیق باید حداقل ۱۰ کاراکتر باشد",
	},
}));

const canGoNext = computed(() => {
	if (currentStep.value === 1) return stepValidation.value.step1.isValid;
	if (currentStep.value === 2) return stepValidation.value.step2.isValid;
	if (currentStep.value === 3) return stepValidation.value.step3.isValid;
	if (currentStep.value === 4) return stepValidation.value.step4.isValid;
	return true;
});

const selectProjectType = (typeId: string) => {
	formData.value.projectType = typeId;
};

const validateStep4Fields = () => {
	// Force reactivity update for step 4 validation
	// This ensures real-time validation feedback
	// Validation is handled by computed properties
};

const nextStep = () => {
	if (canGoNext.value && currentStep.value < totalSteps) {
		currentStep.value++;
	} else if (!canGoNext.value) {
		// Show validation feedback
		toaster.show({
			title: "تکمیل اطلاعات",
			message:
				stepValidation[`step${currentStep.value}`].message ||
				"لطفاً تمام فیلدهای الزامی را تکمیل کنید",
			color: "warning",
			icon: "ph:warning-circle",
			closable: true,
		});
	}
};

const previousStep = () => {
	if (currentStep.value > 1) {
		currentStep.value--;
	}
};

const submitForm = async () => {
	try {
		const projectData = {
			user: user.value.id,
			projectType: formData.value.projectType,
			status: "collectingRelatedArticles",
			researchDomain: formData.value.researchDomain,
			keywords: formData.value.keywords,
			researchGoals: formData.value.researchGoals,
			ethicsApproval: formData.value.ethicsApproval,
			necessity: formData.value.necessity,
			importance: formData.value.importance,
			brainstormResults: brainstormResults.value,
		};

		await createResearchProject(projectData);

		toaster.show({
			title: "موفق",
			message: "پروژه با موفقیت ایجاد شد",
			color: "success",
			icon: "ph:check-circle-fill",
			closable: true,
		});
		router.push("/hampazhooh/projects");
	} catch (error: any) {
		toaster.show({
			title: "خطا",
			message: `خطا در ایجاد پروژه: ${error.message || "خطای ناشناخته"}`,
			color: "danger",
			icon: "ph:warning",
			closable: true,
		});
	}
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
	// Prioritize AI-generated suggestions if available
	if (aiGeneratedDomainSuggestions.value.length > 0) {
		return aiGeneratedDomainSuggestions.value.filter(
			(domain) => !formData.value.researchDomain.includes(domain)
		);
	}

	// Fallback to static suggestions from research categories
	const domains = researchDomains.value;
	const selected = formData.value.researchDomain;
	return domains
		.filter((domain) => !selected.includes(domain.name))
		.slice(0, 8)
		.map((domain) => domain.name);
});

const keywordSuggestions = computed(() => {
	// Prioritize AI-generated suggestions if available
	if (aiGeneratedKeywordSuggestions.value.length > 0) {
		return aiGeneratedKeywordSuggestions.value.filter(
			(keyword) => !formData.value.keywords.includes(keyword)
		);
	}

	// Return empty array if no AI suggestions yet
	return [];
});

const buildAiContext = () => ({
	projectType: formData.value?.projectType || "",
	researchDomain: formData.value?.researchDomain || [],
	keywords: formData.value?.keywords || [],
	researchGoals: formData.value?.researchGoals || [],
});

const ensureAiContextComplete = () => {
	const missing: string[] = [];

	if (!formData.value.projectType) {
		missing.push("نوع پروژه");
	}
	if (formData.value.researchDomain.length === 0) {
		missing.push("حوزه دانشی");
	}
	if (formData.value.keywords.length === 0) {
		missing.push("کلیدواژه");
	}
	if (formData.value.researchGoals.length === 0) {
		missing.push("هدف پژوهشی");
	}

	if (missing.length > 0) {
		toaster.show({
			title: "تکمیل اطلاعات پایه",
			message: `برای تولید متن با هوش مصنوعی، ابتدا ${missing.join(
				"، ",
			)} را تکمیل کنید.`,
			color: "warning",
			icon: "ph:warning-circle",
			closable: true,
		});
		return false;
	}

	return true;
};

const researchGoalsSuggestions = computed(() => {
	// Prioritize AI-generated suggestions if available
	if (aiGeneratedResearchGoalsSuggestions.value.length > 0) {
		return aiGeneratedResearchGoalsSuggestions.value.filter(
			(goal) => !formData.value.researchGoals.includes(goal)
		);
	}

	// Fallback to metadata-based suggestions
	if (formData.value.researchDomain.length === 0) return [];

	const goals: string[] = [];
	const allDomains = researchDomains.value;

	// Generate goals based on selected domains from formData
	formData.value.researchDomain.forEach((domainName) => {
		// Find matching domain in researchDomains
		const domain = allDomains.find((d) => d.name === domainName);
		if (domain?.metadata?.applications) {
			goals.push(...domain.metadata.applications);
		}

		// Also check in flattened nodes for deeper matches
		const flattened = flattenNodes(researchCategories.value);
		const matchedNode = flattened.find((node) => node.name === domainName);
		if (matchedNode?.metadata?.applications) {
			goals.push(...matchedNode.metadata.applications);
		}
	});

	return [...new Set(goals)].slice(0, 8).filter(
		(goal) => !formData.value.researchGoals.includes(goal)
	);
});

// AI Loading states for each field
const mainChallengeAiLoading = ref(false);
const researchDomainAiLoading = ref(false);
const researchGoalsAiLoading = ref(false);
const keywordsAiLoading = ref(false);
const focusLevelAiLoading = ref(false);
const smartCompleteLoading = ref(false);
const importanceAiLoading = ref(false);
const necessityAiLoading = ref(false);
const suggestionsLoading = ref(false);

// AI-generated domain suggestions
const aiGeneratedDomainSuggestions = ref<string[]>([]);

// AI-generated keyword suggestions
const aiGeneratedKeywordSuggestions = ref<string[]>([]);
const keywordSuggestionsLoading = ref(false);

// AI-generated research goals suggestions
const aiGeneratedResearchGoalsSuggestions = ref<string[]>([]);
const researchGoalsSuggestionsLoading = ref(false);

// Modal states
const showResearchDomainInfoModal = ref(false);
const showSelectedInterestsModal = ref(false);
const showResearchGoalsInfoModal = ref(false);
const showKeywordsInfoModal = ref(false);
const showImportanceInfoModal = ref(false);
const showNecessityInfoModal = ref(false);
const showObjectivesInfoModal = ref(false);
const showMethodologyInfoModal = ref(false);

// Search query for interests modal
const selectedInterestsSearchQuery = ref("");

// Reset search query when modal closes
watch(showSelectedInterestsModal, (isOpen) => {
	if (!isOpen) {
		selectedInterestsSearchQuery.value = "";
	}
});

// Clear AI suggestions when domains change (to keep suggestions fresh)
watch(() => formData.value.researchDomain, () => {
	// Don't clear immediately, allow user to see suggestions
	// Only clear after a delay if they want fresh suggestions
});

// Theory extraction data
const organizedCategories = computed(() => {
	// Show a curated subset of popular and relevant research categories
	const relevantCategoryIds = [
		"psychology",
		"education",
		"computer-science",
		"medicine",
		"engineering",
		"business",
		"sociology",
		"philosophy",
	];
	return getOrganizedCategories(relevantCategoryIds);
});

// Filtered categories based on search query
const filteredCategories = computed(() => {
	if (!selectedInterestsSearchQuery.value.trim()) {
		return organizedCategories.value;
	}

	const query = selectedInterestsSearchQuery.value.toLowerCase().trim();
	
	return Object.entries(organizedCategories.value)
		.map(([catId, category]) => {
			const filteredLevel3 = category.level3.filter(
				(item) =>
					item.name.toLowerCase().includes(query) ||
					item.description?.toLowerCase().includes(query) ||
					category.name.toLowerCase().includes(query)
			);

			if (filteredLevel3.length === 0) return null;

			return {
				[catId]: {
					name: category.name,
					level3: filteredLevel3,
				},
			};
		})
		.filter(Boolean)
		.reduce((acc, item) => ({ ...acc, ...item }), {});
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

const toggleResearchDomain = (domainName: string) => {
	// Update formData directly first
	const index = formData.value.researchDomain.indexOf(domainName);
	if (index > -1) {
		formData.value.researchDomain.splice(index, 1);
	} else {
		formData.value.researchDomain.push(domainName);
	}

	// Try to find and update useResearcher state if domain exists
	const domain = researchDomains.value.find((d) => d.name === domainName);
	if (domain) {
		toggleNode(domain);
	}
};

const addDomain = (domainName: string) => {
	if (domainName && !formData.value.researchDomain.includes(domainName)) {
		formData.value.researchDomain.push(domainName);

		// Also update useResearcher selection
		const domain = researchDomains.value.find((d) => d.name === domainName);
		if (domain && !domain.selected) {
			toggleNode(domain);
		}
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

const clearAllDomains = () => {
	// Clear all domains from formData
	const domainsToClear = [...formData.value.researchDomain];
	formData.value.researchDomain = [];

	// Also clear from useResearcher selection
	domainsToClear.forEach((domainName) => {
		const domain = researchDomains.value.find((d) => d.name === domainName);
		if (domain && domain.selected) {
			toggleNode(domain);
		}
	});
};

// AI Suggestion Functions with specific methods
// Research Domain Suggestion
const suggestAIFieldResearchDomain = async () => {
	researchDomainAiLoading.value = true;

	try {
		const context = {
			projectType: formData.value?.projectType || "",
			researchDomain: formData.value?.researchDomain || [],
			keywords: formData.value?.keywords || [],
			researchGoals: formData.value?.researchGoals || [],
		};

		const suggestions = await suggestResearchDomain(context);

		suggestions.forEach((suggestion: string) => {
			addDomain(suggestion);
		});

		toaster.show({
			title: "موفق",
			message: `${suggestions.length} پیشنهاد حوزه دانشی اضافه شد.`,
			color: "success",
			icon: "ph:check-circle-fill",
			closable: true,
		});
	} catch (e: any) {
		toaster.show({
			title: "خطا",
			message: `خطا در دریافت پیشنهاد حوزه دانشی: ${e.message || "خطای ناشناخته"}`,
			color: "danger",
			icon: "ph:warning",
			closable: true,
		});
	} finally {
		researchDomainAiLoading.value = false;
	}
};

// Keywords Suggestion
const suggestAIFieldKeywords = async () => {
	if (!formData.value?.researchDomain?.length) {
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

	keywordsAiLoading.value = true;

	try {
		const context = buildAiContext();

		const suggestions = await suggestKeywords(context);

		// Store suggestions for the suggestions card (before adding to form)
		aiGeneratedKeywordSuggestions.value = suggestions;

		// Filter out already selected keywords
		const newSuggestions = suggestions.filter(
			(suggestion: string) => !formData.value.keywords.includes(suggestion)
		);

		// Add new suggestions to form
		newSuggestions.forEach((suggestion: string) => {
			formData.value.keywords.push(suggestion);
		});

		toaster.show({
			title: "موفق",
			message: `${newSuggestions.length} پیشنهاد کلیدواژه اضافه شد.`,
			color: "success",
			icon: "ph:check-circle-fill",
			closable: true,
		});
	} catch (e: any) {
		toaster.show({
			title: "خطا",
			message: `خطا در دریافت پیشنهاد کلیدواژه: ${e.message || "خطای ناشناخته"}`,
			color: "danger",
			icon: "ph:warning",
			closable: true,
		});
	} finally {
		keywordsAiLoading.value = false;
	}
};

// Research Goals Suggestion
const suggestAIFieldResearchGoals = async () => {
	researchGoalsAiLoading.value = true;

	try {
		const context = buildAiContext();

		const suggestions = await suggestResearchGoals(context);

		// Store suggestions for the suggestions card (before adding to form)
		aiGeneratedResearchGoalsSuggestions.value = suggestions;

		// Filter out already selected goals
		const newSuggestions = suggestions.filter(
			(suggestion: string) => !formData.value.researchGoals.includes(suggestion)
		);

		// Add new suggestions to form
		newSuggestions.forEach((suggestion: string) => {
			addResearchGoal(suggestion);
		});

		toaster.show({
			title: "موفق",
			message: `${newSuggestions.length} پیشنهاد هدف پژوهشی اضافه شد.`,
			color: "success",
			icon: "ph:check-circle-fill",
			closable: true,
		});
	} catch (e: any) {
		toaster.show({
			title: "خطا",
			message: `خطا در دریافت پیشنهاد اهداف پژوهشی: ${e.message || "خطای ناشناخته"}`,
			color: "danger",
			icon: "ph:warning",
			closable: true,
		});
	} finally {
		researchGoalsAiLoading.value = false;
	}
};

// Necessity Suggestion
const suggestAIFieldNecessity = async () => {
	if (!ensureAiContextComplete()) {
		return;
	}

	necessityAiLoading.value = true;

	try {
		const suggestion = await suggestNecessity(buildAiContext());

		formData.value.necessity = suggestion;

		toaster.show({
			title: "موفق",
			message: "متن پیشنهادی ضرورت تحقیق اضافه شد.",
			color: "success",
			icon: "ph:check-circle-fill",
			closable: true,
		});
	} catch (e: any) {
		toaster.show({
			title: "خطا",
			message: `خطا در دریافت پیشنهاد ضرورت تحقیق: ${e.message || "خطای ناشناخته"}`,
			color: "danger",
			icon: "ph:warning",
			closable: true,
		});
	} finally {
		necessityAiLoading.value = false;
	}
};

// Importance Suggestion
const suggestAIFieldImportance = async () => {
	if (!ensureAiContextComplete()) {
		return;
	}

	importanceAiLoading.value = true;

	try {
		const suggestion = await suggestImportance(buildAiContext());

		formData.value.importance = suggestion;

		toaster.show({
			title: "موفق",
			message: "متن پیشنهادی اهمیت تحقیق اضافه شد.",
			color: "success",
			icon: "ph:check-circle-fill",
			closable: true,
		});
	} catch (e: any) {
		toaster.show({
			title: "خطا",
			message: `خطا در دریافت پیشنهاد اهمیت تحقیق: ${e.message || "خطای ناشناخته"}`,
			color: "danger",
			icon: "ph:warning",
			closable: true,
		});
	} finally {
		importanceAiLoading.value = false;
	}
};

const generateNewSuggestions = async () => {
	suggestionsLoading.value = true;

	try {
		// First, reload data to ensure we have latest domains
		await loadResearchData();

		// Get context from current form data
		const context = {
			projectType: formData.value?.projectType || "",
			researchDomain: formData.value?.researchDomain || [],
			keywords: formData.value?.keywords || [],
			researchGoals: formData.value?.researchGoals || [],
		};

		// Use AI to generate creative and related domain suggestions
		const suggestions = await suggestResearchDomain(context);

		// Filter out already selected domains
		const filteredSuggestions = suggestions.filter(
			(domain) => !formData.value.researchDomain.includes(domain)
		);

		// Store AI-generated suggestions
		aiGeneratedDomainSuggestions.value = filteredSuggestions;

		if (filteredSuggestions.length > 0) {
			toaster.show({
				title: "پیشنهادها بروزرسانی شد",
				message: `${filteredSuggestions.length} پیشنهاد خلاقانه و مرتبط تولید شد.`,
				color: "success",
				icon: "ph:check-circle-fill",
				closable: true,
			});
		} else {
			// If no new suggestions after filtering, show fallback
			const domains = researchDomains.value.map((d) => d.name);
			const fallbackSuggestions = domains
				.filter((domain) => !formData.value.researchDomain.includes(domain))
				.slice(0, 8);

			aiGeneratedDomainSuggestions.value = fallbackSuggestions;

			toaster.show({
				title: "پیشنهادها بروزرسانی شد",
				message: `${fallbackSuggestions.length} پیشنهاد جدید تولید شد.`,
				color: "success",
				icon: "ph:check-circle-fill",
				closable: true,
			});
		}
	} catch (error: any) {
		// Fallback to static suggestions on error
		await loadResearchData();
		const domains = researchDomains.value.map((d) => d.name);
		const fallbackSuggestions = domains
			.filter((domain) => !formData.value.researchDomain.includes(domain))
			.slice(0, 8);

		aiGeneratedDomainSuggestions.value = fallbackSuggestions;

		toaster.show({
			title: "پیشنهادها بروزرسانی شد",
			message: `${fallbackSuggestions.length} پیشنهاد جدید تولید شد.`,
			color: "success",
			icon: "ph:check-circle-fill",
			closable: true,
		});
	} finally {
		suggestionsLoading.value = false;
	}
};

const generateResearchGoalsSuggestions = async () => {
	if (formData.value.researchDomain.length === 0) {
		toaster.show({
			title: "هشدار",
			message: "لطفاً ابتدا حوزه دانشی را وارد کنید تا بتوانیم اهداف پژوهشی مرتبط را پیشنهاد دهیم.",
			color: "warning",
			icon: "ph:warning",
			closable: true,
		});
		return;
	}

	researchGoalsSuggestionsLoading.value = true;

	try {
		// Get context from current form data
		const context = {
			projectType: formData.value?.projectType || "",
			researchDomain: formData.value?.researchDomain || [],
			keywords: formData.value?.keywords || [],
			researchGoals: formData.value?.researchGoals || [],
		};

		// Use AI to generate research goals suggestions
		const suggestions = await suggestResearchGoals(context);

		// Filter out already selected goals
		const filteredSuggestions = suggestions.filter(
			(goal) => !formData.value.researchGoals.includes(goal)
		);

		// Store AI-generated suggestions
		aiGeneratedResearchGoalsSuggestions.value = filteredSuggestions;

		if (filteredSuggestions.length > 0) {
			toaster.show({
				title: "پیشنهادها بروزرسانی شد",
				message: `${filteredSuggestions.length} پیشنهاد هدف پژوهشی مرتبط تولید شد.`,
				color: "success",
				icon: "ph:check-circle-fill",
				closable: true,
			});
		} else {
			toaster.show({
				title: "اطلاع",
				message: "همه پیشنهادات قبلاً اضافه شده‌اند. لطفاً از دکمه 'پیشنهاد هوشمند' برای افزودن مستقیم استفاده کنید.",
				color: "info",
				icon: "ph:info",
				closable: true,
			});
		}
	} catch (error: any) {
		// Fallback to metadata-based suggestions on error
		await loadResearchData();
		
		// Get metadata-based suggestions directly (not from computed property to avoid circular reference)
		const goals: string[] = [];
		const allDomains = researchDomains.value;

		formData.value.researchDomain.forEach((domainName) => {
			const domain = allDomains.find((d) => d.name === domainName);
			if (domain?.metadata?.applications) {
				goals.push(...domain.metadata.applications);
			}

			const flattened = flattenNodes(researchCategories.value);
			const matchedNode = flattened.find((node) => node.name === domainName);
			if (matchedNode?.metadata?.applications) {
				goals.push(...matchedNode.metadata.applications);
			}
		});

		const metadataSuggestions = [...new Set(goals)]
			.slice(0, 8)
			.filter((goal) => !formData.value.researchGoals.includes(goal));

		if (metadataSuggestions.length > 0) {
			aiGeneratedResearchGoalsSuggestions.value = metadataSuggestions;
			toaster.show({
				title: "پیشنهادها بروزرسانی شد",
				message: `${metadataSuggestions.length} پیشنهاد هدف پژوهشی تولید شد.`,
				color: "success",
				icon: "ph:check-circle-fill",
				closable: true,
			});
		} else {
			toaster.show({
				title: "خطا",
				message: `خطا در تولید پیشنهادات اهداف پژوهشی: ${error.message || "خطای ناشناخته"}`,
				color: "danger",
				icon: "ph:warning",
				closable: true,
			});
		}
	} finally {
		researchGoalsSuggestionsLoading.value = false;
	}
};

const generateKeywordSuggestions = async () => {
	if (formData.value.researchDomain.length === 0) {
		toaster.show({
			title: "هشدار",
			message: "لطفاً ابتدا حوزه دانشی را وارد کنید تا بتوانیم کلیدواژه‌های مرتبط را پیشنهاد دهیم.",
			color: "warning",
			icon: "ph:warning",
			closable: true,
		});
		return;
	}

	keywordSuggestionsLoading.value = true;

	try {
		// Get context from current form data
		const context = {
			projectType: formData.value?.projectType || "",
			researchDomain: formData.value?.researchDomain || [],
			keywords: formData.value?.keywords || [],
			researchGoals: formData.value?.researchGoals || [],
		};

		// Use AI to generate keyword suggestions
		const suggestions = await suggestKeywords(context);

		// Filter out already selected keywords
		const filteredSuggestions = suggestions.filter(
			(keyword) => !formData.value.keywords.includes(keyword)
		);

		// Store AI-generated suggestions
		aiGeneratedKeywordSuggestions.value = filteredSuggestions;

		if (filteredSuggestions.length > 0) {
			toaster.show({
				title: "پیشنهادها بروزرسانی شد",
				message: `${filteredSuggestions.length} پیشنهاد کلیدواژه مرتبط تولید شد.`,
				color: "success",
				icon: "ph:check-circle-fill",
				closable: true,
			});
		} else {
			toaster.show({
				title: "اطلاع",
				message: "همه پیشنهادات قبلاً اضافه شده‌اند. لطفاً از دکمه 'پیشنهاد هوشمند' برای افزودن مستقیم استفاده کنید.",
				color: "info",
				icon: "ph:info",
				closable: true,
			});
		}
	} catch (error: any) {
		toaster.show({
			title: "خطا",
			message: `خطا در تولید پیشنهادات کلیدواژه: ${error.message || "خطای ناشناخته"}`,
			color: "danger",
			icon: "ph:warning",
			closable: true,
		});
	} finally {
		keywordSuggestionsLoading.value = false;
	}
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
                      ? step.isValid
                        ? 'border-success-500 bg-success-500 shadow-success-500/30 text-white shadow-lg'
                        : 'border-primary-500 bg-primary-500 shadow-primary-500/30 text-white shadow-lg'
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
                      @click="suggestAIFieldResearchDomain"
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
                        :disabled="suggestionsLoading"
                        class="nui-focus border-muted-200 hover:border-success-500 text-muted-700 dark:text-muted-200 hover:text-success-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-success-500 dark:hover:text-success-600 flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="generateNewSuggestions"
                      >
                        <Icon v-if="!suggestionsLoading" name="ph:lightbulb" class="size-4" />
                        <Icon v-else name="svg-spinners:90-ring-with-bg" class="size-4" />
                        <span>{{ suggestionsLoading ? 'در حال تولید...' : 'پیشنهادها' }}</span>
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
                      @click="suggestAIFieldKeywords"
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

                  <!-- Suggestions -->
                  <div
                    class="border-muted-200 dark:border-muted-700 dark:bg-muted-900/50 rounded-lg border bg-gray-50 p-3"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <div class="text-muted-600 dark:text-muted-400 text-xs font-medium">پیشنهادها:</div>
                      <button
                        type="button"
                        :disabled="keywordSuggestionsLoading || formData.researchDomain.length === 0"
                        class="nui-focus border-muted-200 hover:border-success-500 text-muted-700 dark:text-muted-200 hover:text-success-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-success-500 dark:hover:text-success-600 flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="generateKeywordSuggestions"
                      >
                        <Icon v-if="!keywordSuggestionsLoading" name="ph:lightbulb" class="size-4" />
                        <Icon v-else name="svg-spinners:90-ring-with-bg" class="size-4" />
                        <span>{{ keywordSuggestionsLoading ? 'در حال تولید...' : 'پیشنهادها' }}</span>
                      </button>
                    </div>
                    <div v-if="keywordSuggestions.length > 0" class="flex flex-wrap gap-1.5">
                      <button
                        v-for="suggestion in keywordSuggestions"
                        :key="suggestion"
                        type="button"
                        :disabled="formData.keywords.includes(suggestion)"
                        class="nui-focus border-muted-200 hover:border-warning-500 hover:bg-warning-50 text-muted-600 dark:text-muted-300 dark:border-muted-700 dark:hover:bg-warning-900/20 dark:hover:border-warning-500 rounded-full border px-3 py-1 text-xs transition-all disabled:cursor-not-allowed disabled:opacity-50"
                        @click="
                          if (!formData.keywords.includes(suggestion)) {
                            formData.keywords.push(suggestion);
                          }
                        "
                      >
                        {{ suggestion }}
                      </button>
                    </div>
                    <div v-else-if="formData.researchDomain.length === 0" class="text-muted-500 text-xs text-center py-2">
                      ابتدا حوزه دانشی را وارد کنید
                    </div>
                    <div v-else class="text-muted-500 text-xs text-center py-2">
                      روی دکمه "پیشنهادها" کلیک کنید تا کلیدواژه‌های مرتبط تولید شوند
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
                      @click="suggestAIFieldResearchGoals"
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
                      <div class="text-muted-600 dark:text-muted-400 text-xs font-medium">پیشنهادها:</div>
                      <button
                        type="button"
                        :disabled="researchGoalsSuggestionsLoading || formData.researchDomain.length === 0"
                        class="nui-focus border-muted-200 hover:border-success-500 text-muted-700 dark:text-muted-200 hover:text-success-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-success-500 dark:hover:text-success-600 flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="generateResearchGoalsSuggestions"
                      >
                        <Icon v-if="!researchGoalsSuggestionsLoading" name="ph:lightbulb" class="size-4" />
                        <Icon v-else name="svg-spinners:90-ring-with-bg" class="size-4" />
                        <span>{{ researchGoalsSuggestionsLoading ? 'در حال تولید...' : 'پیشنهادها' }}</span>
                      </button>
                    </div>
                    <div v-if="researchGoalsSuggestions.length > 0" class="flex flex-wrap gap-1.5">
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
                    <div v-else-if="formData.researchDomain.length === 0" class="text-muted-500 text-xs text-center py-2">
                      ابتدا حوزه دانشی را وارد کنید
                    </div>
                    <div v-else class="text-muted-500 text-xs text-center py-2">
                      روی دکمه "پیشنهادها" کلیک کنید تا اهداف پژوهشی مرتبط تولید شوند
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
                    <Icon 
                      :name="step4FieldValidation.necessity.isValid ? 'ph:check-circle-fill' : 'ph:warning-circle'" 
                      :class="step4FieldValidation.necessity.isValid ? 'text-success-500' : 'text-primary-500'" 
                      class="size-5" 
                    />
                    ضرورت تحقیق
                    <span 
                      v-if="!step4FieldValidation.necessity.isValid && formData.necessity" 
                      class="text-xs text-warning-500"
                    >
                      ({{ step4FieldValidation.necessity.message }})
                    </span>
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
                      @click="suggestAIFieldNecessity"
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
                  :class="{
                    'border-success-500 focus:border-success-500': step4FieldValidation.necessity.isValid,
                    'border-warning-500 focus:border-warning-500': !step4FieldValidation.necessity.isValid && formData.necessity
                  }"
                  @input="validateStep4Fields"
                />
                <BaseParagraph size="xs" class="text-muted-500 mt-1">
                  توضیح دهید که چرا این تحقیق ضروری است و چه خلاء دانشی را پر می‌کند
                </BaseParagraph>
              </div>

              <!-- Research Importance (اهمیت تحقیق) -->
              <div>
                <div class="mb-2 flex items-center justify-between">
                  <label class="text-muted-700 dark:text-muted-200 flex items-center gap-2 text-sm font-medium">
                    <Icon 
                      :name="step4FieldValidation.importance.isValid ? 'ph:check-circle-fill' : 'ph:star'" 
                      :class="step4FieldValidation.importance.isValid ? 'text-success-500' : 'text-primary-500'" 
                      class="size-5" 
                    />
                    اهمیت تحقیق
                    <span 
                      v-if="!step4FieldValidation.importance.isValid && formData.importance" 
                      class="text-xs text-warning-500"
                    >
                      ({{ step4FieldValidation.importance.message }})
                    </span>
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
                      @click="suggestAIFieldImportance"
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
                  :class="{
                    'border-success-500 focus:border-success-500': step4FieldValidation.importance.isValid,
                    'border-warning-500 focus:border-warning-500': !step4FieldValidation.importance.isValid && formData.importance
                  }"
                  @input="validateStep4Fields"
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
              </div>
            </div>
            <!-- Project Summary Card -->
            <div
              class="dark:bg-muted-900/50 dark:border-muted-700 rounded-xl border border-gray-100 bg-gray-50 p-6 mb-6"
            >
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
                      {{ projectTypes.find((t) => t.id === formData.projectType)?.title || '-' }}
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
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  class="mb-3 text-muted-800 dark:text-muted-200 flex items-center gap-2"
                >
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
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  class="mb-3 text-muted-800 dark:text-muted-200 flex items-center gap-2"
                >
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
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  class="mb-3 text-muted-800 dark:text-muted-200 flex items-center gap-2"
                >
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
                      <div
                        class="bg-success-100 dark:bg-success-900/30 flex size-6 items-center justify-center rounded-full mt-0.5"
                      >
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

              <!-- Research Necessity -->
              <div v-if="formData.necessity">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  class="mb-3 text-muted-800 dark:text-muted-200 flex items-center gap-2"
                >
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
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  class="mb-3 text-muted-800 dark:text-muted-200 flex items-center gap-2"
                >
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
                    <div
                      class="bg-warning-100 dark:bg-warning-900/30 flex size-8 items-center justify-center rounded-lg"
                    >
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
                        formData.ethicsApproval ? 'bg-success-100 text-success-600' : 'bg-muted-100 text-muted-400',
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

        <!-- Validation Message -->
        <div 
          v-if="currentStep < totalSteps && !canGoNext && stepValidation[`step${currentStep}`].message" 
          class="mt-6 rounded-xl border border-warning-200 bg-warning-50 p-4 dark:border-warning-800 dark:bg-warning-900/20"
        >
          <div class="flex items-start gap-3">
            <Icon name="ph:warning-circle" class="mt-0.5 text-warning-600 size-5" />
            <div>
              <div class="text-sm font-medium text-warning-800 dark:text-warning-200">
                لطفاً موارد زیر را تکمیل کنید:
              </div>
              <div class="text-sm text-warning-700 dark:text-warning-300 mt-1">
                {{ stepValidation[`step${currentStep}`].message }}
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
        <div class="flex items-center gap-4 p-6 pb-4">
          <div class="bg-gradient-to-br from-success-500 to-success-600 flex size-14 items-center justify-center rounded-2xl shadow-lg shadow-success-500/20">
            <Icon name="ph:lightbulb-fill" class="size-7 text-white" />
          </div>
          <div class="text-right flex-1">
            <BaseHeading as="h2" size="xl" weight="bold" class="mb-1">علایق پژوهشی منتخب</BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              مجموعه‌ای از پرطرفدارترین حوزه‌های پژوهشی برای انتخاب سریع
            </BaseParagraph>
          </div>
        </div>
      </template>

      <div class="flex flex-col max-h-[calc(100vh-200px)]">
        <!-- Sticky Search & Count Section -->
        <div class="flex-shrink-0 p-6 pb-4 space-y-4 bg-white dark:bg-muted-900 border-b border-muted-200 dark:border-muted-700">
          <!-- Search Bar -->
          <div class="relative">
            <Icon name="ph:magnifying-glass" class="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-400" />
            <BaseInput
              v-model="selectedInterestsSearchQuery"
              placeholder="جستجو در حوزه‌های پژوهشی..."
              shape="curved"
              class="pr-11"
            />
            <button
              v-if="selectedInterestsSearchQuery"
              type="button"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-400 hover:text-muted-600 dark:hover:text-muted-300 transition-colors"
              @click="selectedInterestsSearchQuery = ''"
            >
              <Icon name="ph:x" class="size-4" />
            </button>
          </div>

          <!-- Selected Count & Actions -->
          <div class="flex items-center justify-between rounded-xl bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-900/30 px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="bg-primary-500 text-white rounded-full size-8 flex items-center justify-center font-bold text-sm shadow-lg shadow-primary-500/30">
                {{ formData.researchDomain.length }}
              </div>
              <div>
                <div class="text-sm font-semibold text-gray-900 dark:text-white">
                  حوزه انتخاب شده
                </div>
                <div class="text-xs text-muted-500">
                  {{ formData.researchDomain.length === 0 ? 'هنوز حوزه‌ای انتخاب نشده' : 'حوزه‌های منتخب شما' }}
                </div>
              </div>
            </div>
            <BaseButton
              v-if="formData.researchDomain.length > 0"
              color="danger"
              shape="curved"
              size="sm"
              class="shadow-lg shadow-danger-500/20"
              @click="clearAllDomains"
            >
              <Icon name="ph:trash" class="ml-1 size-4" />
              حذف همه
            </BaseButton>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-300 dark:scrollbar-thumb-muted-700 scrollbar-track-transparent">
          <div class="p-6 pt-4 text-right">
            <!-- Categories -->
            <div>
              <div v-if="Object.keys(filteredCategories).length === 0" class="flex flex-col items-center justify-center py-12">
                <div class="bg-muted-100 dark:bg-muted-800 rounded-full size-16 flex items-center justify-center mb-4">
                  <Icon name="ph:magnifying-glass" class="size-8 text-muted-400" />
                </div>
                <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-600 dark:text-muted-400 mb-2">
                  نتیجه‌ای یافت نشد
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-500 text-center max-w-sm">
                  متأسفانه با این کلمه کلیدی هیچ حوزه پژوهشی پیدا نشد. لطفاً کلمه دیگری را امتحان کنید.
                </BaseParagraph>
              </div>

              <div v-for="(category, catId) in filteredCategories" :key="catId" class="mb-10 last:mb-0">
                <!-- Category Header -->
                <div class="flex items-center gap-3 mb-5 pb-3 border-b border-muted-200 dark:border-muted-700">
                  <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg size-9 flex items-center justify-center shadow-md shadow-primary-500/20">
                    <Icon name="ph:folder-open" class="size-5 text-white" />
                  </div>
                  <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
                    {{ category.name }}
                  </BaseHeading>
                  <div class="bg-muted-200 dark:bg-muted-700 text-muted-600 dark:text-muted-300 rounded-full px-3 py-0.5 text-xs font-medium">
                    {{ category.level3.length }} مورد
                  </div>
                </div>

                <!-- Items Grid -->
                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <BaseCard
                    v-for="item in category.level3"
                    :key="`${item.id}-${formData.researchDomain.includes(item.name)}`"
                    shape="curved"
                    :class="[
                      'group relative overflow-hidden transition-all duration-300 cursor-pointer border-2',
                      'hover:scale-[1.02] hover:shadow-xl',
                      formData.researchDomain.includes(item.name)
                        ? 'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-900/20 border-primary-400 dark:border-primary-600 ring-2 ring-primary-500/40 shadow-lg shadow-primary-500/20'
                        : 'bg-white dark:bg-muted-800 border-muted-200 dark:border-muted-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg',
                    ]"
                    @click.stop="toggleResearchDomain(item.name)"
                  >
                    <!-- Selection Indicator -->
                    <div
                      v-if="formData.researchDomain.includes(item.name)"
                      class="absolute left-3 top-3 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full size-8 flex items-center justify-center shadow-lg shadow-primary-500/40 animate-in fade-in zoom-in duration-200"
                    >
                      <Icon name="ph:check-bold" class="size-4" />
                    </div>

                    <!-- Hover indicator -->
                    <div
                      v-if="!formData.researchDomain.includes(item.name)"
                      class="absolute left-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-primary-400 dark:border-primary-600 rounded-full size-8 flex items-center justify-center"
                    >
                      <Icon name="ph:plus" class="size-4 text-primary-500 dark:text-primary-400" />
                    </div>

                    <div class="p-5 pt-7">
                      <BaseHeading 
                        as="h4" 
                        size="md" 
                        weight="semibold"
                        :class="[
                          'mb-3 transition-colors',
                          formData.researchDomain.includes(item.name)
                            ? 'text-primary-900 dark:text-primary-100'
                            : 'text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'
                        ]"
                      >
                        {{ item.name }}
                      </BaseHeading>
                      <BaseParagraph 
                        size="sm"
                        :class="[
                          'line-clamp-2 mb-3 leading-relaxed',
                          formData.researchDomain.includes(item.name)
                            ? 'text-primary-700 dark:text-primary-300'
                            : 'text-muted-600 dark:text-muted-400'
                        ]"
                      >
                        {{ item.description }}
                      </BaseParagraph>
                      
                      <!-- Selected Badge -->
                      <div
                        v-if="formData.researchDomain.includes(item.name)"
                        class="inline-flex items-center gap-1.5 bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-lg px-2.5 py-1 text-xs font-medium"
                      >
                        <Icon name="ph:check-circle-fill" class="size-3.5" />
                        <span>انتخاب شده</span>
                      </div>
                    </div>

                    <!-- Decorative gradient overlay -->
                    <div
                      v-if="formData.researchDomain.includes(item.name)"
                      class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600"
                    ></div>
                  </BaseCard>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center mt-8 pt-6 border-t border-muted-200 dark:border-muted-700">
              <div class="flex items-center gap-2 text-sm text-muted-500">
                <Icon name="ph:info" class="size-4" />
                <span>برای افزودن یا حذف حوزه‌ها، روی کارت‌ها کلیک کنید</span>
              </div>
              <div class="flex gap-3">
                <BaseButton 
                  color="muted" 
                  shape="curved" 
                  size="lg"
                  @click="showSelectedInterestsModal = false"
                >
                  بستن
                </BaseButton>
                <BaseButton 
                  color="success" 
                  shape="curved" 
                  size="lg"
                  class="shadow-lg shadow-success-500/20"
                  @click="showSelectedInterestsModal = false"
                >
                  <Icon name="ph:check" class="mr-2 size-5" />
                  تایید انتخاب
                </BaseButton>
              </div>
            </div>
          </div>
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
