import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
// Create a base axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/dashboard', // Using JSONPlaceholder as our dummy API
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // You can add auth tokens here
    // const token = localStorage.getItem('auth_token')
    // if (token) {
    //   config.headers = {
    //     ...config.headers,
    //     Authorization: `Bearer ${token}`
    //   }
    // }
    return config
  },
  (error: AxiosError) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can do global response handling here
    return response
  },
  (error: AxiosError) => {
    console.error('Response error:', error)
    // Handle specific error status codes
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 401:
          console.error('Unauthorized access')
          // Handle unauthorized (e.g., redirect to login)
          break
        case 403:
          console.error('Forbidden access')
          // Handle forbidden
          break
        case 404:
          console.error('Resource not found')
          // Handle not found
          break
        case 500:
          console.error('Server error')
          // Handle server error
          break
        default:
          console.error(`Unexpected error: ${status}`)
      }
    } else if (error.request) {
      console.error('No response received:', error.request)
    }
    return Promise.reject(error)
  },
)

export default apiClient
