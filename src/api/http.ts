import apiClient from './config'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

// Generic type for API responses
type ApiResponse<T> = {
  data: T
  status: number
  statusText: string
  headers: any
}

// Error handler function
const handleError = (error: any): never => {
  // Log the error to console (as specified in requirements)
  console.error('API Error:', error)

  // You can add more sophisticated error handling here later
  // For example, showing notifications, redirecting to error pages, etc.

  // Re-throw the error so the calling code can handle it if needed
  throw error
}

// GET request wrapper
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await apiClient.get(url, config)
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }
  } catch (error) {
    return handleError(error)
  }
}

// POST request wrapper
export const post = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config)
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }
  } catch (error) {
    return handleError(error)
  }
}

// PUT request wrapper
export const put = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config)
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }
  } catch (error) {
    return handleError(error)
  }
}

// PATCH request wrapper
export const patch = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, config)
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }
  } catch (error) {
    return handleError(error)
  }
}

// DELETE request wrapper
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await apiClient.delete(url, config)
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }
  } catch (error) {
    return handleError(error)
  }
}

// Export a default object with all methods for convenience
export default {
  get,
  post,
  put,
  patch,
  delete: del,
}
