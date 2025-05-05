<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  usePosts,
  usePost,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useComments,
} from '../tanstack/queries'

// State for post selection and form inputs
const selectedPostId = ref<number | null>(null)
const newPostForm = ref({
  title: '',
  body: '',
  userId: 1,
})
const updatePostForm = ref({
  title: '',
  body: '',
})

// Fetch all posts using TanStack Query
const {
  data: posts,
  isLoading: postsLoading,
  error: postsError,
  refetch: refetchPosts,
} = usePosts()

// Fetch a single post when selectedPostId changes
const {
  data: selectedPost,
  isLoading: postLoading,
  error: postError,
} = usePost(
  computed(() => selectedPostId.value || 0),
  {},
)

// Fetch comments for the selected post
const { data: comments, isLoading: commentsLoading } = useComments(
  computed(() => selectedPostId.value || 0),
)

// Mutations for creating, updating, and deleting posts
const createPostMutation = useCreatePost()
const updatePostMutation = useUpdatePost()
const deletePostMutation = useDeletePost()

// Computed property to check if we can show post details
const canShowPostDetails = computed(() => selectedPostId.value !== null)

// Handle post selection
function selectPost(id: number) {
  selectedPostId.value = id

  // We'll let the watcher handle pre-filling the form
  // The form will be updated when selectedPost is available
}

// Watch for changes to selectedPost and update the form
watch(
  () => selectedPost.value,
  (newPost) => {
    if (newPost) {
      updatePostForm.value.title = newPost.title
      updatePostForm.value.body = newPost.body
    }
  },
)

// Handle creating a new post
async function handleCreatePost() {
  if (!newPostForm.value.title || !newPostForm.value.body) return

  try {
    await createPostMutation.mutateAsync({
      title: newPostForm.value.title,
      body: newPostForm.value.body,
      userId: newPostForm.value.userId,
    })

    // Reset form after successful creation
    newPostForm.value.title = ''
    newPostForm.value.body = ''
  } catch (error) {
    console.error('Error creating post:', error)
  }
}

// Handle updating a post
async function handleUpdatePost() {
  if (!selectedPostId.value || !updatePostForm.value.title || !updatePostForm.value.body) return

  try {
    await updatePostMutation.mutateAsync({
      id: selectedPostId.value,
      title: updatePostForm.value.title,
      body: updatePostForm.value.body,
      userId: selectedPost.value?.userId || 1,
    })
  } catch (error) {
    console.error('Error updating post:', error)
  }
}

// Handle deleting a post
async function handleDeletePost() {
  if (!selectedPostId.value) return

  try {
    await deletePostMutation.mutateAsync(selectedPostId.value)
    selectedPostId.value = null
  } catch (error) {
    console.error('Error deleting post:', error)
  }
}
</script>

<template>
  <div class="tanstack-api-container">
    <h1 class="text-2xl font-bold mb-6">TanStack Query Example</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Posts List Section -->
      <div class="bg-background-soft p-4 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Posts</h2>
          <button
            @click="refetchPosts"
            class="px-3 py-1 bg-primary text-white rounded hover:bg-primary-hover"
          >
            Refresh
          </button>
        </div>

        <div v-if="postsLoading" class="py-4 text-center">Loading posts...</div>

        <div v-else-if="postsError" class="py-4 text-center text-red-500">Error loading posts</div>

        <ul v-else class="divide-y divide-border overflow-y-auto max-h-[400px]">
          <li
            v-for="post in posts"
            :key="post.id"
            class="py-2 px-1 cursor-pointer hover:bg-background-mute transition-colors"
            :class="{ 'bg-primary/10': selectedPostId === post.id }"
            @click="selectPost(post.id)"
          >
            <h3 class="font-medium truncate">{{ post.title }}</h3>
            <p class="text-sm text-text-light truncate">{{ post.body }}</p>
          </li>
        </ul>
      </div>

      <!-- Post Details Section -->
      <div class="bg-background-soft p-4 rounded-lg shadow">
        <template v-if="canShowPostDetails">
          <div v-if="postLoading" class="py-4 text-center">Loading post details...</div>

          <div v-else-if="postError" class="py-4 text-center text-red-500">
            Error loading post details
          </div>

          <div v-else-if="selectedPost">
            <h2 class="text-xl font-semibold mb-4">Post Details</h2>

            <div class="mb-6">
              <h3 class="text-lg font-medium">{{ selectedPost.title }}</h3>
              <p class="mt-2">{{ selectedPost.body }}</p>
            </div>

            <!-- Update Post Form -->
            <div class="mb-6 p-4 bg-background rounded-lg">
              <h3 class="text-lg font-medium mb-3">Update Post</h3>

              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Title</label>
                <input
                  v-model="updatePostForm.title"
                  type="text"
                  class="w-full p-2 border border-border rounded bg-background"
                />
              </div>

              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Body</label>
                <textarea
                  v-model="updatePostForm.body"
                  class="w-full p-2 border border-border rounded bg-background min-h-[100px]"
                ></textarea>
              </div>

              <div class="flex space-x-2">
                <button
                  @click="handleUpdatePost"
                  class="px-3 py-2 bg-primary text-white rounded hover:bg-primary-hover"
                  :disabled="updatePostMutation.isPending"
                >
                  {{ updatePostMutation.isPending ? 'Updating...' : 'Update Post' }}
                </button>

                <button
                  @click="handleDeletePost"
                  class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  :disabled="deletePostMutation.isPending"
                >
                  {{ deletePostMutation.isPending ? 'Deleting...' : 'Delete Post' }}
                </button>
              </div>
            </div>

            <!-- Comments Section -->
            <div>
              <h3 class="text-lg font-medium mb-2">Comments</h3>

              <div v-if="commentsLoading" class="py-2 text-center">Loading comments...</div>

              <ul v-else-if="comments && comments.length > 0" class="divide-y divide-border">
                <li v-for="comment in comments" :key="comment.id" class="py-2">
                  <p class="font-medium">{{ comment.name }}</p>
                  <p class="text-sm text-text-light">{{ comment.email }}</p>
                  <p class="mt-1">{{ comment.body }}</p>
                </li>
              </ul>

              <p v-else class="py-2 text-center text-text-light">
                No comments found for this post.
              </p>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="py-8 text-center text-text-light">Select a post to view details</div>
        </template>
      </div>
    </div>

    <!-- Create Post Form -->
    <div class="mt-8 bg-background-soft p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Create New Post</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <input
            v-model="newPostForm.title"
            type="text"
            class="w-full p-2 border border-border rounded bg-background"
            placeholder="Enter post title"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Body</label>
          <textarea
            v-model="newPostForm.body"
            class="w-full p-2 border border-border rounded bg-background min-h-[80px]"
            placeholder="Enter post content"
          ></textarea>
        </div>
      </div>

      <div class="mt-4">
        <button
          @click="handleCreatePost"
          class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
          :disabled="createPostMutation.isPending"
        >
          {{ createPostMutation.isPending ? 'Creating...' : 'Create Post' }}
        </button>
      </div>
    </div>
  </div>
</template>
