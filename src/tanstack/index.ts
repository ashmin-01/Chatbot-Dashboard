import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import type { VueQueryPluginOptions } from '@tanstack/vue-query'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global default options for queries
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1, // Only retry failed queries once
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    },
    mutations: {
      // Global default options for mutations
      retry: 1, // Only retry failed mutations once
    },
  },
})

// Plugin options
const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClient,
}

export { queryClient, vueQueryPluginOptions, VueQueryPlugin }
