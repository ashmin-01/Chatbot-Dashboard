import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/vue-query'
import { queryClient } from './index'
import axios from 'axios'
import type { Ref } from 'vue'
import type { Post, User, Comment } from './types'

// Base URL for our dummy API
export const API_URL = 'https://jsonplaceholder.typicode.com'

// Query keys for better cache management
const queryKeys = {
  posts: ['posts'] as const,
  post: (id: number) => ['post', id] as const,
  users: ['users'] as const,
  user: (id: number) => ['user', id] as const,
  comments: (postId: number) => ['comments', postId] as const,
}

// Posts queries
export function usePosts<TData = Post[]>(
  options?: Omit<
    UseQueryOptions<Post[], Error, TData, typeof queryKeys.posts>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery<Post[], Error, TData, typeof queryKeys.posts>({
    queryKey: queryKeys.posts,
    queryFn: async () => {
      const { data } = await axios.get<Post[]>(`${API_URL}/posts`)
      return data
    },
    ...options,
  })
}

export function usePost<TData = Post>(
  id: number,
  options?: Omit<
    UseQueryOptions<Post, Error, TData, ReturnType<typeof queryKeys.post>>,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) {
  return useQuery<Post, Error, TData, ReturnType<typeof queryKeys.post>>({
    queryKey: queryKeys.post(id),
    queryFn: async () => {
      const { data } = await axios.get<Post>(`${API_URL}/posts/${id}`)
      return data
    },
    enabled: !!id,
    ...options,
  })
}

// Users queries
export function useUsers<TData = User[]>(
  options?: Omit<
    UseQueryOptions<User[], Error, TData, typeof queryKeys.users>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery<User[], Error, TData, typeof queryKeys.users>({
    queryKey: queryKeys.users,
    queryFn: async () => {
      const { data } = await axios.get<User[]>(`${API_URL}/users`)
      return data
    },
    ...options,
  })
}

export function useUser<TData = User>(
  id: number,
  options?: Omit<
    UseQueryOptions<User, Error, TData, ReturnType<typeof queryKeys.user>>,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) {
  return useQuery<User, Error, TData, ReturnType<typeof queryKeys.user>>({
    queryKey: queryKeys.user(id),
    queryFn: async () => {
      const { data } = await axios.get<User>(`${API_URL}/users/${id}`)
      return data
    },
    enabled: !!id,
    ...options,
  })
}

// Comments queries
export function useComments<TData = Comment[]>(
  postId: Ref<number>,
  options?: Omit<
    UseQueryOptions<Comment[], Error, TData, ReturnType<typeof queryKeys.comments>>,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) {
  return useQuery<Comment[], Error, TData, ReturnType<typeof queryKeys.comments>>({
    queryKey: queryKeys.comments(postId.value),
    queryFn: async () => {
      const { data } = await axios.get<Comment[]>(`${API_URL}/posts/${postId.value}/comments`)
      return data
    },
    enabled: !!postId.value,
    ...options,
  })
}

// Mutations
export function useCreatePost<TContext = unknown>(
  options?: Omit<UseMutationOptions<Post, Error, Omit<Post, 'id'>, TContext>, 'mutationFn'>,
) {
  return useMutation<Post, Error, Omit<Post, 'id'>, TContext>({
    mutationFn: async (newPost: Omit<Post, 'id'>) => {
      const { data } = await axios.post<Post>(`${API_URL}/posts`, newPost)
      return data
    },
    onSuccess: (data, variables, context) => {
      // Invalidate the posts query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })

      // Call the custom onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}

export function useUpdatePost<TContext = unknown>(
  options?: Omit<UseMutationOptions<Post, Error, Post, TContext>, 'mutationFn'>,
) {
  return useMutation<Post, Error, Post, TContext>({
    mutationFn: async ({ id, ...updatedPost }: Post) => {
      const { data } = await axios.put<Post>(`${API_URL}/posts/${id}`, updatedPost)
      return data
    },
    onSuccess: (data, variables, context) => {
      // Invalidate specific queries
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
      queryClient.invalidateQueries({ queryKey: queryKeys.post(data.id) })

      // Call the custom onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}

export function useDeletePost<TContext = unknown>(
  options?: Omit<UseMutationOptions<number, Error, number, TContext>, 'mutationFn'>,
) {
  return useMutation<number, Error, number, TContext>({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/posts/${id}`)
      return id
    },
    onSuccess: (id, variables, context) => {
      // Invalidate and remove queries
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
      queryClient.removeQueries({ queryKey: queryKeys.post(id) })

      // Call the custom onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(id, variables, context)
      }
    },
    ...options,
  })
}
