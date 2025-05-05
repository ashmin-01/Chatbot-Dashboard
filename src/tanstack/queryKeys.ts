import { type Post, type User, type Comment } from './types'

// Query keys for better cache management
export const queryKeys = {
  posts: ['posts'] as const,
  post: (id: number) => ['post', id] as const,
  users: ['users'] as const,
  user: (id: number) => ['user', id] as const,
  comments: (postId: number) => ['comments', postId] as const,
}