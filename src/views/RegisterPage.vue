<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value
})

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (!passwordsMatch.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  try {
    isLoading.value = true
    // TODO: Implement actual registration logic here
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call
    router.push('/login')
  } catch (error) {
    errorMessage.value = 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

</script>
<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-background-soft">
    <div class="max-w-md w-full mx-4 space-y-10 bg-background p-10 rounded-xl shadow-lg border border-border transition-all">

      <!-- العنوان -->
      <div class="mb-8">
        <h2 class="text-center text-3xl font-extrabold text-heading">Create your account</h2>
        <p class="mt-4 text-center text-sm text-text-soft">
          Or
          <router-link to="/login" class="font-medium text-primary hover:text-primary-hover">
            sign in to your account
          </router-link>
        </p>
      </div>

      <!-- الفورم -->
      <form class="space-y-8" @submit.prevent="handleRegister">
        <div class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-text mb-2">Full Name</label>
            <input
              id="name"
              v-model="name"
              name="name"
              type="text"
              required
              class="block w-full px-4 py-3 border border-border placeholder-text-soft text-text rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background-soft"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-text mb-2">Email address</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="block w-full px-4 py-3 border border-border placeholder-text-soft text-text rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background-soft"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-text mb-2">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="block w-full px-4 py-3 border border-border placeholder-text-soft text-text rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background-soft"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-text mb-2">Confirm Password</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              name="confirm-password"
              type="password"
              required
              class="block w-full px-4 py-3 border border-border placeholder-text-soft text-text rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background-soft"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <!-- زر الإنشاء -->
        <div class="pt-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-log-in-button focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                v-if="!isLoading"
                class="h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ isLoading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>

        <!-- رسالة الخطأ -->
        <div v-if="errorMessage" class="pt-4 text-sm text-center text-danger">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>
