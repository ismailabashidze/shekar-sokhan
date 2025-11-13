export interface ResearchInterest {
	id: string;
	name: string;
	description: string;
	level: "beginner" | "intermediate" | "advanced" | "expert";
	priority: number;
	selected: boolean;
	type: "category" | "subcategory" | "interest";
	path: string[];
	depth: number;
	children?: ResearchInterest[];
	metadata?: {
		methodologies?: string[];
		applications?: string[];
		related_fields?: string[];
	};
}

export interface ResearchCategory {
	id: string;
	name: string;
	description: string;
	level: "beginner" | "intermediate" | "advanced" | "expert";
	priority: number;
	path: string[];
	depth: number;
	selected: boolean;
	type: "category" | "subcategory" | "interest";
	children?: ResearchInterest[];
	metadata?: {
		methodologies?: string[];
		applications?: string[];
		related_fields?: string[];
	};
}

export interface ResearcherProfile {
	id: string;
	name: string;
	field: string;
	experience: string;
	interests: ResearchInterest[];
	priorities: ResearchInterest[];
}

export interface SelectionState {
	selectedNodes: ResearchInterest[];
	expandedNodes: Set<string>;
	selectedPaths: string[][];
}

export interface HierarchicalFilterOptions {
	searchQuery: string;
	levelFilter?: string[];
	typeFilter?: string[];
	categoryFilter?: string[];
}

export const useResearcher = () => {
	// Load hierarchical data from JSON
	const researchCategories = ref<ResearchCategory[]>([]);
	const selectedInterests = ref<ResearchInterest[]>([]);
	const expandedNodes = ref<Set<string>>(new Set());
	const selectedPaths = ref<string[][]>([]);

	// Load data from JSON file
	const loadResearchData = async () => {
		try {
			const data = await import("~/data/research-categories.json");
			const processedCategories = data.categories.map((category: any) =>
				processHierarchicalNode(category, 0, []),
			);
			researchCategories.value = processedCategories;
		} catch (error) {
			console.error("Error loading research categories:", error);
		}
	};

	// Process hierarchical nodes to add path and depth information
	const processHierarchicalNode = (
		node: any,
		depth: number,
		currentPath: string[],
	): ResearchCategory => {
		const path = [...currentPath, node.id];
		const processedNode: ResearchCategory = {
			id: node.id,
			name: node.name,
			description: node.description,
			level: node.level,
			priority: node.priority,
			path,
			depth,
			selected: false,
			type: depth === 0 ? "category" : "subcategory",
		};

		if (node.children && node.children.length > 0) {
			processedNode.children = node.children.map((child: any) => ({
				...child,
				path,
				depth: depth + 1,
				type:
					depth === 0
						? "subcategory"
						: depth === 1
							? "subcategory"
							: "interest",
				selected: false,
				children: child.children
					? child.children.map((grandchild: any) => ({
							...grandchild,
							path: [...path, child.id],
							depth: depth + 2,
							type: "interest",
							selected: false,
						}))
					: undefined,
			}));
		}

		return processedNode;
	};

	const currentStep = ref(0);

	// Step-by-step wizard state
	const wizardSteps = [
		{
			id: "welcome",
			title: "خوش آمدید",
			description: "بیایید با هم علایق پژوهشی شما را شناسایی کنیم",
		},
		{
			id: "broad-categories",
			title: "حوزه‌های کلی",
			description: "کدام حوزه‌های روانشناسی برای شما جذاب‌تر هستند؟",
		},
		{
			id: "specific-interests",
			title: "علایق خاص",
			description: "در هر حوزه، به چه موضوعات خاصی علاقه‌مند هستید؟",
		},
		{
			id: "detailed-interests",
			title: "علایق جزئی",
			description: "در موضوعات انتخابی، به چه جنبه‌های خاصی علاقه‌مند هستید؟",
		},
		{
			id: "confirmation",
			title: "تایید نهایی",
			description: "علایق و اولویت‌های پژوهشی شما آماده است",
		},
	];

	const getCurrentStep = () => wizardSteps[currentStep.value];

	const nextStep = () => {
		if (currentStep.value < wizardSteps.length - 1) {
			currentStep.value++;
		}
	};

	const prevStep = () => {
		if (currentStep.value > 0) {
			currentStep.value--;
		}
	};

	const goToStep = (stepIndex: number) => {
		if (stepIndex >= 0 && stepIndex < wizardSteps.length) {
			currentStep.value = stepIndex;
		}
	};

	const toggleInterest = (interest: ResearchInterest) => {
		interest.selected = !interest.selected;
		if (interest.selected) {
			selectedInterests.value.push(interest);
		} else {
			selectedInterests.value = selectedInterests.value.filter(
				(i) => i.id !== interest.id,
			);
		}
	};

	const updatePriorities = (interests: ResearchInterest[]) => {
		selectedInterests.value = interests;
	};

	const saveResearchProfile = async (profile: ResearcherProfile) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log("Saving research profile:", profile);
	};

	// Hierarchical navigation functions
	const findNodeByPath = (
		path: string[],
		nodes: ResearchCategory[],
	): ResearchInterest | null => {
		for (const node of nodes) {
			if (node.path.join("/") === path.join("/")) {
				return node as ResearchInterest;
			}
			if (node.children) {
				const found = findNodeByPath(path, node.children as ResearchCategory[]);
				if (found) return found;
			}
		}
		return null;
	};

	const toggleNode = (node: ResearchInterest) => {
		// Toggle selection for the node
		node.selected = !node.selected;

		if (node.selected) {
			// Add to selected interests if not already present
			if (!selectedInterests.value.some((i) => i.id === node.id)) {
				selectedInterests.value.push(node);
			}
			// Add path to selected paths
			const pathStr = node.path.join("/");
			if (!selectedPaths.value.some((p) => p.join("/") === pathStr)) {
				selectedPaths.value.push([...node.path]);
			}
		} else {
			// Remove from selected interests
			selectedInterests.value = selectedInterests.value.filter(
				(i) => i.id !== node.id,
			);
			// Remove path from selected paths
			selectedPaths.value = selectedPaths.value.filter(
				(p) => p.join("/") !== node.path.join("/"),
			);
		}

		// Handle hierarchical selection (toggle all children)
		if (node.children) {
			toggleChildren(node.children, node.selected);
		}
	};

	const toggleChildren = (children: ResearchInterest[], selected: boolean) => {
		children.forEach((child) => {
			child.selected = selected;
			if (selected) {
				if (!selectedInterests.value.some((i) => i.id === child.id)) {
					selectedInterests.value.push(child);
				}
			} else {
				selectedInterests.value = selectedInterests.value.filter(
					(i) => i.id !== child.id,
				);
			}
			if (child.children) {
				toggleChildren(child.children, selected);
			}
		});
	};

	const expandNode = (nodeId: string) => {
		expandedNodes.value.add(nodeId);
	};

	const collapseNode = (nodeId: string) => {
		expandedNodes.value.delete(nodeId);
	};

	const isNodeExpanded = (nodeId: string) => {
		return expandedNodes.value.has(nodeId);
	};

	// Hierarchical filtering
	const flattenNodes = (nodes: ResearchCategory[]): ResearchInterest[] => {
		const result: ResearchInterest[] = [];
		const traverse = (items: ResearchCategory[]) => {
			items.forEach((item) => {
				result.push(item as ResearchInterest);
				if (item.children) {
					traverse(item.children as ResearchCategory[]);
				}
			});
		};
		traverse(nodes);
		return result;
	};

	const filterNodes = (
		nodes: ResearchCategory[],
		filters: HierarchicalFilterOptions,
	): ResearchInterest[] => {
		const flatNodes = flattenNodes(nodes);

		return flatNodes.filter((node) => {
			// Search query filter
			if (filters.searchQuery) {
				const searchLower = filters.searchQuery.toLowerCase();
				const matchesSearch =
					node.name.toLowerCase().includes(searchLower) ||
					node.description.toLowerCase().includes(searchLower);
				if (!matchesSearch) return false;
			}

			// Level filter
			if (filters.levelFilter && filters.levelFilter.length > 0) {
				if (!filters.levelFilter.includes(node.level)) return false;
			}

			// Type filter
			if (filters.typeFilter && filters.typeFilter.length > 0) {
				if (!filters.typeFilter.includes(node.type)) return false;
			}

			// Category filter
			if (filters.categoryFilter && filters.categoryFilter.length > 0) {
				const nodeCategory = node.path[0]; // First element of path is the root category
				if (!filters.categoryFilter.includes(nodeCategory)) return false;
			}

			return true;
		});
	};

	// Selection helpers
	const getSelectedBranches = () => {
		const branches: { [key: string]: ResearchInterest[] } = {};
		selectedInterests.value.forEach((interest) => {
			const rootCategory = interest.path[0];
			if (!branches[rootCategory]) {
				branches[rootCategory] = [];
			}
			branches[rootCategory].push(interest);
		});
		return branches;
	};

	const getSelectionSummary = () => {
		const branches = getSelectedBranches();
		const totalNodes = selectedInterests.value.length;
		const uniqueCategories = Object.keys(branches).length;
		const maxDepth = Math.max(
			...selectedInterests.value.map((i) => i.depth),
			0,
		);

		return {
			totalNodes,
			uniqueCategories,
			maxDepth,
			branches,
			categories: Object.keys(branches).map((key) => ({
				id: key,
				name: researchCategories.value.find((c) => c.id === key)?.name || key,
				count: branches[key].length,
				items: branches[key],
			})),
		};
	};

	const resetWizard = () => {
		currentStep.value = 0;
		selectedInterests.value = [];
		expandedNodes.value.clear();
		selectedPaths.value = [];

		// Reset all nodes to unselected
		const resetNodes = (nodes: ResearchCategory[]) => {
			nodes.forEach((node) => {
				(node as ResearchInterest).selected = false;
				if (node.children) {
					resetNodes(node.children as ResearchCategory[]);
				}
			});
		};
		resetNodes(researchCategories.value);
	};

	// Method to get organized categories for selected interests display
	const getOrganizedCategories = (
		selectedCategoryIds: string[] = ["philosophy", "sociology"],
	) => {
		const result: Record<string, { name: string; level3: any[] }> = {};

		researchCategories.value
			.filter((level1) => selectedCategoryIds.includes(level1.id))
			.forEach((level1) => {
				result[level1.id] = {
					name: level1.name,
					level3: [],
				};

				level1.children?.forEach((level2) => {
					level2.children?.slice(0, 3).forEach((level3) => {
						result[level1.id].level3.push(level3);
					});
				});

				// Limit to first 5 level 3 items per category
				result[level1.id].level3 = result[level1.id].level3.slice(0, 5);
			});

		return result;
	};

	// Initialize data on composable creation
	onMounted(() => {
		loadResearchData();
	});

	return {
		// Data
		researchCategories,
		selectedInterests,
		expandedNodes: readonly(expandedNodes),
		selectedPaths: readonly(selectedPaths),

		// Wizard state
		currentStep: readonly(currentStep),
		wizardSteps,
		getCurrentStep,

		// Hierarchical actions
		toggleNode,
		expandNode,
		collapseNode,
		isNodeExpanded,
		findNodeByPath,

		// Filtering
		filterNodes,
		flattenNodes,

		// Selection helpers
		getSelectedBranches,
		getSelectionSummary,

		// Wizard actions
		nextStep,
		prevStep,
		goToStep,
		toggleInterest,
		updatePriorities,
		saveResearchProfile,
		resetWizard,
		loadResearchData,

		// Organized categories for display
		getOrganizedCategories,
	};
};
