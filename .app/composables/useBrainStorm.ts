export interface BrainStormBase {
  user: string;
  mainChallenge: string;
  title: string;
  stage: string;
  status?: 'draft' | 'in_progress' | 'completed' | 'archived';
  researchDomain?: string[] | Record<string, any>;
  keywords?: string[];
  focusLevel?: 'applied' | 'theoretical' | 'interdisciplinary' | 'mixed';
  whQuestions?: Record<string, any>;
  swotData?: Record<string, any>;
  list?: Record<string, any>[];
  lastAccessed?: string;
}

export interface BrainStorm extends BrainStormBase {
  id: string;
  created: string;
  updated: string;
}

export interface BrainStormCreateData extends BrainStormBase {}

export interface BrainStormUpdateData extends Partial<BrainStormBase> {
  id: string;
}

export interface BrainStormFilters {
  user?: string;
  status?: string;
  stage?: string;
  focusLevel?: string;
  search?: string;
  keywords?: string[];
}

export interface BrainStormListOptions {
  page?: number;
  perPage?: number;
  sort?: string;
  filters?: BrainStormFilters;
}

export function useBrainStorm() {
  const nuxtApp = useNuxtApp();
  const toaster = useToaster();
  const { user } = useUser();

  // State
  const brainStorms = ref<BrainStorm[]>([]);
  const currentBrainStorm = ref<BrainStorm | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const totalPages = ref(0);
  const totalItems = ref(0);

  // Helper function to build filter string
  const buildFilterString = (filters: BrainStormFilters = {}) => {
    const conditions: string[] = [];

    if (filters.user) {
      conditions.push(`user = "${filters.user}"`);
    }

    if (filters.status) {
      conditions.push(`status = "${filters.status}"`);
    }

    if (filters.stage) {
      conditions.push(`stage = "${filters.stage}"`);
    }

    if (filters.focusLevel) {
      conditions.push(`focusLevel = "${filters.focusLevel}"`);
    }

    if (filters.search) {
      const searchTerm = filters.search.replace(/"/g, '\\"');
      conditions.push(`(title ~ "${searchTerm}" || mainChallenge ~ "${searchTerm}")`);
    }

    if (filters.keywords && filters.keywords.length > 0) {
      const keywordConditions = filters.keywords
        .map(keyword => `keywords ~ "${keyword.replace(/"/g, '\\"')}"`)
        .join(' || ');
      conditions.push(`(${keywordConditions})`);
    }

    return conditions.join(' && ');
  };

  // Helper function to prepare form data
  const prepareFormData = (brainStormData: BrainStormCreateData | BrainStormUpdateData) => {
    const formData = new FormData();

    Object.entries(brainStormData).forEach(([key, value]) => {
      if (key === 'researchDomain') {
        // Handle researchDomain as both array and object
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        }
 else {
          formData.append(key, JSON.stringify(value || {}));
        }
      }
 else if (key === 'whQuestions' || key === 'swotData') {
        formData.append(key, JSON.stringify(value || {}));
      }
 else if (key === 'keywords' || key === 'list') {
        formData.append(key, JSON.stringify(value || []));
      }
 else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    return formData;
  };

  // Get all brainstorm sessions with pagination and filters
  const getBrainStorms = async (options: BrainStormListOptions = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const { page = 1, perPage = 10, sort = '-created', filters = {} } = options;

      const filterString = buildFilterString(filters);

      const result = await nuxtApp.$pb.collection('brainstorm_sessions').getList(page, perPage, {
        filter: filterString || undefined,
        sort,
        expand: 'user',
      });

      brainStorms.value = result.items as BrainStorm[];
      totalPages.value = result.totalPages;
      totalItems.value = result.totalItems;

      return result;
    }
 catch (e: any) {
      error.value = e.message || 'خطا در دریافت جلسات طوفان فکری';
      console.error('Error fetching brainstorm sessions:', e);
      toaster.show({
        title: 'خطا',
        message: e.message || 'خطا در دریافت جلسات طوفان فکری',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    }
 finally {
      loading.value = false;
    }
  };

  // Get a single brainstorm session by ID
  const getBrainStorm = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const result = await nuxtApp.$pb.collection('brainstorm_sessions').getOne(id, {
        expand: 'user',
      });

      currentBrainStorm.value = result as BrainStorm;
      return result;
    }
 catch (e: any) {
      error.value = e.message || 'خطا در دریافت جلسه طوفان فکری';
      console.error('Error fetching brainstorm session:', e);
      toaster.show({
        title: 'خطا',
        message: e.message || 'خطا در دریافت جلسه طوفان فکری',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    }
 finally {
      loading.value = false;
    }
  };

  // Create a new brainstorm session
  const createBrainStorm = async (brainStormData: BrainStormCreateData) => {
    loading.value = true;
    error.value = null;

    try {
      const formData = prepareFormData(brainStormData);

      const result = await nuxtApp.$pb.collection('brainstorm_sessions').create(formData);

      brainStorms.value.unshift(result as BrainStorm);
      toaster.show({
        title: 'موفقیت',
        message: 'جلسه طوفان فکری با موفقیت ایجاد شد',
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
      });

      return result;
    }
 catch (e: any) {
      error.value = e.message || 'خطا در ایجاد جلسه طوفان فکری';
      console.error('Error creating brainstorm session:', e);
      toaster.show({
        title: 'خطا',
        message: e.message || 'خطا در ایجاد جلسه طوفان فکری',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
      throw e;
    }
 finally {
      loading.value = false;
    }
  };

  // Update an existing brainstorm session
  const updateBrainStorm = async (brainStormData: BrainStormUpdateData) => {
    loading.value = true;
    error.value = null;

    try {
      const { id, ...updateData } = brainStormData;
      const formData = prepareFormData(updateData);

      const result = await nuxtApp.$pb.collection('brainstorm_sessions').update(id, formData);

      // Update in local state
      const index = brainStorms.value.findIndex(item => item.id === id);
      if (index !== -1) {
        brainStorms.value[index] = result as BrainStorm;
      }

      if (currentBrainStorm.value?.id === id) {
        currentBrainStorm.value = result as BrainStorm;
      }

      // toaster.show({
      //   title: 'موفقیت',
      //   message: 'جلسه طوفان فکری با موفقیت به‌روزرسانی شد',
      //   color: 'success',
      //   icon: 'ph:check-circle',
      //   closable: true,
      // });

      return result;
    }
 catch (e: any) {
      error.value = e.message || 'خطا در به‌روزرسانی جلسه طوفان فکری';
      console.error('Error updating brainstorm session:', e);
      toaster.show({
        title: 'خطا',
        message: e.message || 'خطا در به‌روزرسانی جلسه طوفان فکری',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
      throw e;
    }
 finally {
      loading.value = false;
    }
  };

  // Delete a brainstorm session
  const deleteBrainStorm = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      await nuxtApp.$pb.collection('brainstorm_sessions').delete(id);

      // Remove from local state
      brainStorms.value = brainStorms.value.filter(item => item.id !== id);

      if (currentBrainStorm.value?.id === id) {
        currentBrainStorm.value = null;
      }

      toaster.show({
        title: 'موفقیت',
        message: 'جلسه طوفان فکری با موفقیت حذف شد',
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
      });

      return true;
    }
 catch (e: any) {
      error.value = e.message || 'خطا در حذف جلسه طوفان فکری';
      console.error('Error deleting brainstorm session:', e);
      toaster.show({
        title: 'خطا',
        message: e.message || 'خطا در حذف جلسه طوفان فکری',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
      throw e;
    }
 finally {
      loading.value = false;
    }
  };

  // Get brainstorm sessions by user
  const getUserBrainStorms = async (userId: string, options: Omit<BrainStormListOptions, 'filters'> = {}) => {
    return getBrainStorms({
      ...options,
      filters: {
        user: userId,
        ...options.filters,
      },
    });
  };

  // Get brainstorm sessions by status
  const getBrainStormsByStatus = async (status: string, options: Omit<BrainStormListOptions, 'filters'> = {}) => {
    return getBrainStorms({
      ...options,
      filters: {
        status,
        ...options.filters,
      },
    });
  };

  // Get brainstorm sessions by stage
  const getBrainStormsByStage = async (stage: string, options: Omit<BrainStormListOptions, 'filters'> = {}) => {
    return getBrainStorms({
      ...options,
      filters: {
        stage,
        ...options.filters,
      },
    });
  };

  // Update last accessed timestamp
  const updateLastAccessed = async (id: string) => {
    try {
      await updateBrainStorm({
        id,
        lastAccessed: new Date().toISOString(),
      });
    }
 catch (e) {
      console.error('Error updating last accessed:', e);
    }
  };

  // Clear current brainstorm session
  const clearCurrentBrainStorm = () => {
    currentBrainStorm.value = null;
  };

  // Reset error state
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    brainStorms: readonly(brainStorms),
    currentBrainStorm: readonly(currentBrainStorm),
    loading: readonly(loading),
    error: readonly(error),
    totalPages: readonly(totalPages),
    totalItems: readonly(totalItems),

    // CRUD operations
    getBrainStorms,
    getBrainStorm,
    createBrainStorm,
    updateBrainStorm,
    deleteBrainStorm,

    // Specialized queries
    getUserBrainStorms,
    getBrainStormsByStatus,
    getBrainStormsByStage,

    // Utility functions
    updateLastAccessed,
    clearCurrentBrainStorm,
    clearError,
  };
}
