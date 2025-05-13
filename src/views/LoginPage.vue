<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  try {
    isLoading.value = true
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push('/dashboard')
  } catch (e) {
    errorMessage.value = 'Invalid credentials'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-background-soft">
    <div class="max-w-md w-full mx-4 space-y-10 bg-background p-10 rounded-xl shadow-lg border border-border">

      <!-- headline -->
      <div class="mb-30">
        <h2 class="text-center text-3xl font-extrabold text-heading">
          Sign in to your account
        </h2>
        <p class="mt-4 text-center text-sm text-text-soft">
          Or
          <router-link to="/register" class="font-medium text-primary hover:text-primary-hover">
            create a new account
          </router-link>
        </p>
      </div>

      <!-- form -->
      <form class="  space-y-1" @submit.prevent="handleLogin">
        <div class="space-y-6">
          <!-- email -->
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

          <!-- pass -->
          <div>
            <label for="password" class="block text-sm font-medium text-text mb-2">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="block w-full px-4 py-3 border border-border placeholder-text-soft text-text rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background-soft"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <!--remember me and forgot the pass -->
        <div class="flex items-center justify-between mt-6">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-10 w-4 text-primary focus:ring-primary border-border rounded bg-background-soft"
            />
            <label for="remember-me" class="ml-2 block text-sm text-text">Remember me</label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary hover:text-primary-hover">Forgot your password?</a>
          </div>
        </div>

        <!-- log in button-->
        <div class="pt-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-log-in-button hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
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
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <!--  error messgae -->
        <div v-if="errorMessage" class="pt-4 text-sm text-center text-danger">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>
