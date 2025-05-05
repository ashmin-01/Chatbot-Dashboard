<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '../api/http'

// Types for our data
interface Post {
  id: number
  title: string
  body: string
  userId: number
}

// State management
const posts = ref<Post[]>([])
const loading = ref(false)
const error = ref('')
const newPost = ref<Partial<Post>>({
  title: '',
  body: '',
  userId: 1,
})
const selectedPostId = ref<number | null>(null)

// Fetch posts on component mount
onMounted(async () => {
  await fetchPosts()
})

// GET example - Fetch all posts
async function fetchPosts() {
  loading.value = true
  error.value = ''
  try {
    const response = await http.get<Post[]>('/posts')
    posts.value = response.data
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch posts'
    console.error('Error fetching posts:', err)
  } finally {
    loading.value = false
  }
}

// POST example - Create a new post
async function createPost() {
  if (!newPost.value.title || !newPost.value.body) {
    error.value = 'Title and body are required'
    return
  }

  loading.value = true
  error.value = ''
  try {
    const response = await http.post<Post>('/posts', newPost.value)
    // In a real app, the server would return the new post with an ID
    // For JSONPlaceholder, we'll add it to our local state manually
    posts.value.unshift({
      ...(newPost.value as Post),
      id: response.data.id || Date.now(), // Use the returned ID or generate one
    })
    // Reset the form
    newPost.value = {
      title: '',
      body: '',
      userId: 1,
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to create post'
    console.error('Error creating post:', err)
  } finally {
    loading.value = false
  }
}

// DELETE example - Delete a post
async function deletePost(id: number) {
  loading.value = true
  error.value = ''
  try {
    await http.delete<{}>(`/posts/${id}`)
    // Remove the post from our local state
    posts.value = posts.value.filter((post) => post.id !== id)
  } catch (err: any) {
    error.value = err.message || 'Failed to delete post'
    console.error('Error deleting post:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="api-example">
    <h1 class="text-2xl font-bold mb-6">API Example Page</h1>

    <!-- Error display -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Create post form -->
    <div class="bg-background-soft p-4 rounded-lg shadow mb-6">
      <h2 class="text-xl font-semibold mb-4">Create New Post</h2>
      <form @submit.prevent="createPost" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium mb-1">Title</label>
          <input
            id="title"
            v-model="newPost.title"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter post title"
          />
        </div>
        <div>
          <label for="body" class="block text-sm font-medium mb-1">Content</label>
          <textarea
            id="body"
            v-model="newPost.body"
            rows="4"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter post content"
          ></textarea>
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"
          :disabled="loading"
        >
          {{ loading ? 'Creating...' : 'Create Post' }}
        </button>
      </form>
    </div>

    <!-- Posts list -->
    <div class="bg-background-soft p-4 rounded-lg shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Posts</h2>
        <button
          @click="fetchPosts"
          class="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"
          :disabled="loading"
        >
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <div v-if="loading && !posts.length" class="text-center py-8">Loading posts...</div>

      <div v-else-if="!posts.length" class="text-center py-8">
        No posts found. Create one above!
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="post in posts"
          :key="post.id"
          class="border border-border p-4 rounded-md hover:bg-background-mute transition-colors"
        >
          <h3 class="text-lg font-medium mb-2">{{ post.title }}</h3>
          <p class="mb-4">{{ post.body }}</p>
          <div class="flex justify-end">
            <button
              @click="deletePost(post.id)"
              class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              :disabled="loading"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
