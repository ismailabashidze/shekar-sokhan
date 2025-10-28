import { ref } from 'vue';
import { useNuxtApp } from '#app';

export interface DeedCategory {
  id?: string;
  title: string;
  difficulty: 'simple' | 'medium' | 'hard';
  timeRequired: 'below_15' | '15_to_60' | 'above_60';
  tags: string[];
  icon: string;
  created?: string;
  updated?: string;
}

export const useDeedCategory = () => {
  const nuxtApp = useNuxtApp();

  const category = ref<DeedCategory>({
    title: '',
    difficulty: 'simple',
    timeRequired: 'below_15',
    tags: [],
    icon: 'ph:heart',
  });

  const createCategory = async () => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated');
    }

    try {
      const data = {
        title: category.value.title,
        difficulty: category.value.difficulty,
        timeRequired: category.value.timeRequired,
        tags: category.value.tags,
        icon: category.value.icon,
      };

      return await nuxtApp.$pb.collection('category_deeds').create(data);
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled');
        return false;
      }
      console.error('Error creating category:', error);
      throw error;
    }
  };

  const getCategories = async () => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated');
    }

    try {
      const records = await nuxtApp.$pb.collection('category_deeds').getFullList({
        sort: 'created',
        batch: 200,
      });
      return records as DeedCategory[];
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled');
        return [];
      }
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, data: Partial<DeedCategory>) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated');
    }

    try {
      return await nuxtApp.$pb.collection('category_deeds').update(id, data);
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled');
        return null;
      }
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated');
    }

    try {
      await nuxtApp.$pb.collection('category_deeds').delete(id);
      return true;
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled');
        return false;
      }
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  return {
    category,
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
  };
};
