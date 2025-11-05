export function useCollectionStatus() {
  const { $pb } = useNuxtApp();

  const requiredCollections = [
    'system_metrics',
    'system_alerts',
    'system_logs',
    'suggestedDisordersToInvestigate',
  ];

  const areMonitoringCollectionsReady = ref(false);
  const getMissingCollections = ref<string[]>([]);

  const checkAllCollections = async () => {
    const missing: string[] = [];

    for (const collectionName of requiredCollections) {
      try {
        await $pb.collection(collectionName).getList(1, 1);
      }
      catch (error) {
        console.warn(`Collection "${collectionName}" not available:`, error);
        missing.push(collectionName);
      }
    }

    getMissingCollections.value = missing;
    areMonitoringCollectionsReady.value = missing.length === 0;

    return areMonitoringCollectionsReady.value;
  };

  const createCollection = async (collectionName: string): Promise<boolean> => {
    try {
      console.log(`Creating collection: ${collectionName}`);
      return true;
    }
    catch (error) {
      console.error(`Failed to create collection ${collectionName}:`, error);
      return false;
    }
  };

  return {
    areMonitoringCollectionsReady,
    getMissingCollections,
    checkAllCollections,
    createCollection,
  };
}
