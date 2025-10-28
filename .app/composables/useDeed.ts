import { useNuxtApp } from '#app';

export interface Deed {
  emoji: string;
  title: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  type: 'family' | 'society' | 'spiritual';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  author: User;
  approvedBy: string;
  approvedAt: string;
  views: number;
  completions: number;
  tags: string[];
  difficulty: 'simple' | 'moderate' | 'hard';
  timeRequired: 'below_15' | 'between_15_60' | 'more_60';
}

interface DeedFilters {
  search?: string;
  type?: string;
  difficulty?: string;
  selectedTypes?: string[];
  selectedDifficulties?: string[];
  page?: number;
  perPage?: number;
  status?: string;
}

interface DeedResponse {
  items: Deed[];
  total: number;
}

export const useDeed = () => {
  const nuxtApp = useNuxtApp();

  const getDeed = async (id: string) => {
    if (!nuxtApp.$pb.authStore.isValid)
      throw new Error('User not authenticated');

    try {
      return await nuxtApp.$pb.collection('deeds').getOne(id, {
        expand: 'author,approvedBy',
      });
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled');
        return null;
      }
      throw error;
    }
  };

  const getDeeds = async (filters: DeedFilters = {}): Promise<DeedResponse> => {
    if (!nuxtApp.$pb.authStore.isValid)
      throw new Error('User not authenticated');

    try {
      const filterConditions = [];

      // Add search filter
      if (filters.search)
        filterConditions.push(`(title ~ "${filters.search}" || description ~ "${filters.search}")`);

      // Add type filter from dropdown
      if (filters.type && filters.type !== 'all')
        filterConditions.push(`type = "${filters.type}"`);

      // Add difficulty filter from dropdown
      if (filters.difficulty && filters.difficulty !== 'all')
        filterConditions.push(`difficulty = "${filters.difficulty}"`);

      // Add selected types from checkboxes (if no dropdown type is selected)
      if (!filters.type && filters.selectedTypes?.length) {
        const typeConditions = filters.selectedTypes.map(type => `type = "${type}"`).join(' || ');
        filterConditions.push(`(${typeConditions})`);
      }

      // Add selected difficulties from checkboxes (if no dropdown difficulty is selected)
      if (!filters.difficulty && filters.selectedDifficulties?.length) {
        const difficultyConditions = filters.selectedDifficulties.map(diff => `difficulty = "${diff}"`).join(' || ');
        filterConditions.push(`(${difficultyConditions})`);
      }

      // Add status filter
      if (filters.status)
        filterConditions.push(`status = "${filters.status}"`);

      const queryParams: Record<string, any> = {
        sort: '-created',
        expand: 'author,approvedBy',
      };

      if (filterConditions.length > 0)
        queryParams.filter = filterConditions.join(' && ');

      // Add pagination parameters
      const page = filters.page || 1;
      const perPage = filters.perPage || 5;

      // For getting total counts, use getFullList
      if (perPage === 1 && page === 1) {
        const fullList = await nuxtApp.$pb.collection('deeds').getFullList({
          ...queryParams,
        });
        return {
          items: fullList,
          total: fullList.length,
        };
      }

      // Get paginated list
      const resultList = await nuxtApp.$pb.collection('deeds').getList(
        page,
        perPage,
        queryParams,
      );

      return {
        items: resultList.items,
        total: resultList.totalItems,
      };
    }
    catch (error: any) {
      console.error('PocketBase error:', error);
      if (error?.isAbort) {
        console.log('Request was cancelled');
        return { items: [], total: 0 };
      }
      throw error;
    }
  };

  const getApprovedDeeds = async (filters: DeedFilters = {}): Promise<DeedResponse> => {
    return getDeeds({
      ...filters,
      status: 'approved',
    });
  };

  const createDeed = async (data: Partial<Deed>) => {
    if (!nuxtApp.$pb.authStore.isValid)
      throw new Error('User not authenticated');

    try {
      return await nuxtApp.$pb.collection('deeds').create({
        ...data,
        author: nuxtApp.$pb.authStore.model.id,
        status: 'draft',
        views: 0,
        completions: 0,
      });
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled');
        return null;
      }
      throw error;
    }
  };

  const updateDeed = async (id: string, data: Partial<Deed>) => {
    if (!nuxtApp.$pb.authStore.isValid)
      throw new Error('User not authenticated');

    try {
      return await nuxtApp.$pb.collection('deeds').update(id, data);
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled');
        return null;
      }
      throw error;
    }
  };

  const deleteDeed = async (id: string) => {
    if (!nuxtApp.$pb.authStore.isValid)
      throw new Error('User not authenticated');

    try {
      await nuxtApp.$pb.collection('deeds').delete(id);
      return true;
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled');
        return false;
      }
      throw error;
    }
  };

  const approveDeed = async (id: string) => {
    if (!nuxtApp.$pb.authStore.isValid)
      throw new Error('User not authenticated');

    try {
      return await nuxtApp.$pb.collection('deeds').update(id, {
        status: 'approved',
        approvedBy: nuxtApp.$pb.authStore.model.id,
        approvedAt: new Date().toISOString(),
      });
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled');
        return null;
      }
      throw error;
    }
  };

  const rejectDeed = async (id: string) => {
    if (!nuxtApp.$pb.authStore.isValid)
      throw new Error('User not authenticated');

    try {
      const result = await nuxtApp.$pb.collection('deeds').update(id, {
        status: 'rejected',
        approvedBy: nuxtApp.$pb.authStore.model.id,
        approvedAt: new Date().toISOString(),
      });

      if (!result) throw new Error('خطا در تغییر وضعیت عمل نیک');
      return result;
    }
    catch (error: any) {
      console.error('Error in rejectDeed:', error);
      if (error?.isAbort) {
        console.log('Request was cancelled');
        return null;
      }
      throw error;
    }
  };

  return {
    getDeed,
    getDeeds,
    getApprovedDeeds,
    createDeed,
    updateDeed,
    deleteDeed,
    approveDeed,
    rejectDeed,
  };
};
