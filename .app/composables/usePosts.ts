export interface PostBase {
  title: string
  description: string
  secretMessage?: string
  goals?: string
  excerpt?: string
  contentLong: string
  category: string
  tags?: string[]
  slug?: string
  publishDate: string
  readTime?: number
  featuredImage?: File | null
  isFeatured?: boolean
  allowComments?: boolean
  status?: 'draft' | 'published' | 'archived' | 'scheduled'
  contentLengthTarget?: number
  seoTitle?: string
  seoDescription?: string
  keywords?: string[]
  viewCount?: number
  likeCount?: number
}

export interface Post extends PostBase {
  id: string
  created: string
  updated: string
  author: string
}

export interface PostCreateData extends PostBase {
  author: string
}

export interface PostUpdateData extends Partial<PostBase> {
  id: string
}

export interface PostFilters {
  category?: string
  status?: string
  author?: string
  featured?: boolean
  search?: string
  tags?: string[]
}

export interface PostListOptions {
  page?: number
  perPage?: number
  sort?: string
  filters?: PostFilters
}

export function usePosts() {
  const nuxtApp = useNuxtApp()
  const toaster = useToaster()
  const { user } = useUser()

  // State
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalPages = ref(0)
  const totalItems = ref(0)

  // Helper function to build filter string
  const buildFilterString = (filters: PostFilters = {}) => {
    const conditions: string[] = []

    if (filters.category) {
      conditions.push(`category = "${filters.category}"`)
    }

    if (filters.status) {
      conditions.push(`status = "${filters.status}"`)
    }

    if (filters.author) {
      conditions.push(`author = "${filters.author}"`)
    }

    if (filters.featured !== undefined) {
      conditions.push(`isFeatured = ${filters.featured}`)
    }

    if (filters.search) {
      const searchTerm = filters.search.replace(/"/g, '\\"')
      conditions.push(`(title ~ "${searchTerm}" || description ~ "${searchTerm}" || contentLong ~ "${searchTerm}")`)
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagConditions = filters.tags.map(tag => `tags ~ "${tag.replace(/"/g, '\\"')}"`).join(' || ')
      conditions.push(`(${tagConditions})`)
    }

    return conditions.join(' && ')
  }

  // Helper function to prepare form data
  const prepareFormData = (postData: PostCreateData | PostUpdateData) => {
    const formData = new FormData()

    Object.entries(postData).forEach(([key, value]) => {
      if (key === 'featuredImage' && value instanceof File) {
        formData.append(key, value)
      } else if (key === 'tags' || key === 'keywords') {
        formData.append(key, JSON.stringify(value || []))
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    return formData
  }

  // Get all posts with pagination and filters
  const getPosts = async (options: PostListOptions = {}) => {
    loading.value = true
    error.value = null

    try {
      const {
        page = 1,
        perPage = 10,
        sort = '-created',
        filters = {}
      } = options

      const filterString = buildFilterString(filters)

      const result = await nuxtApp.$pb.collection('posts').getList(page, perPage, {
        filter: filterString || undefined,
        sort,
        expand: 'author'
      })

      posts.value = result.items as Post[]
      totalPages.value = result.totalPages
      totalItems.value = result.totalItems

      return result
    } catch (e: any) {
      error.value = e.message || 'خطا در دریافت مقالات'
      console.error('Error fetching posts:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Get single post by ID
  const getPost = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const post = await nuxtApp.$pb.collection('posts').getOne(id, {
        expand: 'author'
      })

      currentPost.value = post as Post
      return post
    } catch (e: any) {
      error.value = e.message || 'خطا در دریافت مقاله'
      console.error('Error fetching post:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Get post by slug
  const getPostBySlug = async (slug: string) => {
    loading.value = true
    error.value = null

    try {
      const result = await nuxtApp.$pb.collection('posts').getList(1, 1, {
        filter: `slug = "${slug}"`,
        expand: 'author'
      })

      if (result.items.length === 0) {
        throw new Error('مقاله پیدا نشد')
      }

      currentPost.value = result.items[0] as Post
      return result.items[0]
    } catch (e: any) {
      error.value = e.message || 'خطا در دریافت مقاله'
      console.error('Error fetching post by slug:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Create new post
  const createPost = async (postData: PostCreateData) => {
    loading.value = true
    error.value = null

    try {
      // Set author to current user if not provided
      if (!postData.author && user.value?.id) {
        postData.author = user.value.id
      }

      // Set default status if not provided
      if (!postData.status) {
        postData.status = 'draft'
      }

      const formData = prepareFormData(postData)
      const newPost = await nuxtApp.$pb.collection('posts').create(formData)

      // Add to local state
      posts.value.unshift(newPost as Post)

      toaster.show({
        title: 'موفقیت',
        message: 'مقاله با موفقیت ایجاد شد',
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
      })

      return newPost
    } catch (e: any) {
      error.value = e.message || 'خطا در ایجاد مقاله'
      console.error('Error creating post:', e)
      
      toaster.show({
        title: 'خطا',
        message: error.value,
        color: 'danger', 
        icon: 'ph:warning',
        closable: true,
      })

      throw e
    } finally {
      loading.value = false
    }
  }

  // Update existing post
  const updatePost = async (postData: PostUpdateData) => {
    loading.value = true
    error.value = null

    try {
      if (!postData.id) {
        throw new Error('شناسه مقاله الزامی است')
      }

      const formData = prepareFormData(postData)
      const updatedPost = await nuxtApp.$pb.collection('posts').update(postData.id, formData)

      // Update local state
      const index = posts.value.findIndex(p => p.id === postData.id)
      if (index !== -1) {
        posts.value[index] = updatedPost as Post
      }

      if (currentPost.value?.id === postData.id) {
        currentPost.value = updatedPost as Post
      }

      toaster.show({
        title: 'موفقیت',
        message: 'مقاله با موفقیت به‌روزرسانی شد',
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
      })

      return updatedPost
    } catch (e: any) {
      error.value = e.message || 'خطا در به‌روزرسانی مقاله'
      console.error('Error updating post:', e)
      
      toaster.show({
        title: 'خطا',
        message: error.value,
        color: 'danger',
        icon: 'ph:warning', 
        closable: true,
      })

      throw e
    } finally {
      loading.value = false
    }
  }

  // Delete post
  const deletePost = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await nuxtApp.$pb.collection('posts').delete(id)

      // Remove from local state
      posts.value = posts.value.filter(p => p.id !== id)

      if (currentPost.value?.id === id) {
        currentPost.value = null
      }

      toaster.show({
        title: 'موفقیت',
        message: 'مقاله با موفقیت حذف شد',
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
      })

      return true
    } catch (e: any) {
      error.value = e.message || 'خطا در حذف مقاله'
      console.error('Error deleting post:', e)
      
      toaster.show({
        title: 'خطا',
        message: error.value,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      })

      throw e
    } finally {
      loading.value = false
    }
  }

  // Get published posts (for public view)
  const getPublishedPosts = async (options: PostListOptions = {}) => {
    return getPosts({
      ...options,
      filters: {
        ...options.filters,
        status: 'published'
      }
    })
  }

  // Get featured posts
  const getFeaturedPosts = async (options: PostListOptions = {}) => {
    return getPosts({
      ...options,
      filters: {
        ...options.filters,
        featured: true,
        status: 'published'
      }
    })
  }

  // Get posts by category
  const getPostsByCategory = async (category: string, options: PostListOptions = {}) => {
    return getPosts({
      ...options,
      filters: {
        ...options.filters,
        category,
        status: 'published'
      }
    })
  }

  // Search posts
  const searchPosts = async (query: string, options: PostListOptions = {}) => {
    return getPosts({
      ...options,
      filters: {
        ...options.filters,
        search: query
      }
    })
  }

  // Get user's posts
  const getUserPosts = async (userId?: string, options: PostListOptions = {}) => {
    const authorId = userId || user.value?.id
    if (!authorId) {
      throw new Error('شناسه کاربر الزامی است')
    }

    return getPosts({
      ...options,
      filters: {
        ...options.filters,
        author: authorId
      }
    })
  }

  // Increment view count
  const incrementViewCount = async (id: string) => {
    try {
      const post = await nuxtApp.$pb.collection('posts').getOne(id)
      const newViewCount = (post.viewCount || 0) + 1
      
      await nuxtApp.$pb.collection('posts').update(id, {
        viewCount: newViewCount
      })

      // Update local state if current post
      if (currentPost.value?.id === id) {
        currentPost.value.viewCount = newViewCount
      }

      // Update in posts array
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value[index].viewCount = newViewCount
      }

    } catch (e: any) {
      console.error('Error incrementing view count:', e)
    }
  }

  // Toggle like (increment/decrement like count)
  const toggleLike = async (id: string) => {
    try {
      const post = await nuxtApp.$pb.collection('posts').getOne(id)
      const newLikeCount = Math.max(0, (post.likeCount || 0) + 1)
      
      await nuxtApp.$pb.collection('posts').update(id, {
        likeCount: newLikeCount
      })

      // Update local state
      if (currentPost.value?.id === id) {
        currentPost.value.likeCount = newLikeCount
      }

      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value[index].likeCount = newLikeCount
      }

      return newLikeCount
    } catch (e: any) {
      console.error('Error toggling like:', e)
      throw e
    }
  }

  // Clear state
  const clearPosts = () => {
    posts.value = []
    currentPost.value = null
    error.value = null
  }

  return {
    // State
    posts: readonly(posts),
    currentPost: readonly(currentPost),
    loading: readonly(loading),
    error: readonly(error),
    totalPages: readonly(totalPages),
    totalItems: readonly(totalItems),

    // CRUD Operations
    getPosts,
    getPost,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,

    // Specialized queries
    getPublishedPosts,
    getFeaturedPosts,
    getPostsByCategory,
    searchPosts,
    getUserPosts,

    // Interactions
    incrementViewCount,
    toggleLike,

    // Utilities
    clearPosts,
  }
} 