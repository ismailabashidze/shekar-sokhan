<script setup lang="ts">
definePageMeta({
  title: 'Test Posts Collection',
  layout: 'sidebar',
});

const nuxtApp = useNuxtApp();
const pb = nuxtApp.$pb;
const testResults = ref<any[]>([]);

const testPocketBase = async () => {
  console.log('🧪 Testing PocketBase connection...');

  const results = [];

  // Test 1: Check PocketBase instance
  results.push({
    test: 'PocketBase Instance',
    result: !!pb,
    details: pb ? 'Available' : 'Not Available',
  });

  // Test 2: Check auth store
  results.push({
    test: 'Auth Store',
    result: !!pb.authStore,
    details: pb.authStore
      ? {
          isValid: pb.authStore.isValid,
          model: pb.authStore.model ? 'User logged in' : 'No user',
          token: pb.authStore.token ? 'Token present' : 'No token',
        }
      : 'Not Available',
  });

  // Test 3: Check PocketBase collections
  try {
    console.log('📋 Checking available collections...');
    const collections = await pb.send('/api/collections', {
      method: 'GET',
    });
    results.push({
      test: 'Collections List',
      result: true,
      details: collections?.items?.map((c: any) => c.name) || 'No collections found',
    });
  }
  catch (err) {
    results.push({
      test: 'Collections List',
      result: false,
      details: err,
    });
  }

  // Test 4: Try to get posts collection info
  try {
    console.log('📝 Checking posts collection...');
    const postsCollection = await pb.send('/api/collections/posts', {
      method: 'GET',
    });
    results.push({
      test: 'Posts Collection Info',
      result: true,
      details: postsCollection,
    });
  }
  catch (err) {
    results.push({
      test: 'Posts Collection Info',
      result: false,
      details: err,
    });
  }

  // Test 5: Try to get posts records
  try {
    console.log('📄 Checking posts records...');
    const postsRecords = await pb.collection('posts').getList(1, 5);
    results.push({
      test: 'Posts Records',
      result: true,
      details: {
        totalItems: postsRecords.totalItems,
        itemsCount: postsRecords.items?.length || 0,
        items: postsRecords.items?.map((item: any) => ({
          id: item.id,
          title: item.title,
          status: item.status,
          created: item.created,
        })) || [],
      },
    });
  }
  catch (err) {
    results.push({
      test: 'Posts Records',
      result: false,
      details: err,
    });
  }

  // Test 6: Try usePosts composable
  try {
    console.log('🔧 Testing usePosts composable...');
    const { posts, loading, error, getPosts } = usePosts();

    await getPosts({
      page: 1,
      perPage: 5,
      filters: { status: 'published' },
    });

    results.push({
      test: 'usePosts Composable',
      result: true,
      details: {
        loading: loading.value,
        error: error.value,
        postsCount: posts.value?.length || 0,
        posts: posts.value?.map((post: any) => ({
          id: post.id,
          title: post.title,
          status: post.status,
        })) || [],
      },
    });
  }
  catch (err) {
    results.push({
      test: 'usePosts Composable',
      result: false,
      details: err,
    });
  }

  testResults.value = results;
  console.log('🧪 Test Results:', results);
};

onMounted(() => {
  testPocketBase();
});
</script>

<template>
  <div>
    <BasePageHeading
      title="Test Posts Collection"
      subtitle="Testing PocketBase connection and posts collection"
    />

    <div class="pb-20">
      <BaseCard class="p-6">
        <div class="mb-6">
          <BaseButton
            color="primary"
            @click="testPocketBase"
          >
            Run Tests Again
          </BaseButton>
        </div>

        <div class="space-y-4">
          <div
            v-for="result in testResults"
            :key="result.test"
            class="rounded-lg border p-4"
            :class="result.result ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'"
          >
            <div class="mb-2 flex items-center gap-2">
              <Icon
                :name="result.result ? 'ph:check-circle' : 'ph:warning-circle'"
                :class="result.result ? 'text-green-600' : 'text-red-600'"
                class="size-5"
              />
              <h3 class="font-medium">
                {{ result.test }}
              </h3>
            </div>

            <div class="text-sm text-gray-600">
              <pre class="whitespace-pre-wrap">{{ JSON.stringify(result.details, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
