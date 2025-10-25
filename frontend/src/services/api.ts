import axios from 'axios'

export async function callAIService(inputData: any, token: string) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/ai/generate-questions`,
      { productData: inputData },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error calling AI service:', error.message);
    return { success: false, error: 'AI service error' };
  }
}


// Base URLs from environment variables
const API_URL = import.meta.env.VITE_API_URL;
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL;


// Regular backend API
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// AI service API
export const aiApi = axios.create({
  baseURL: AI_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth token interceptor (optional)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const endpoints = {
  products: {
    create: '/api/products',
    get: (id: string) => `/api/products/${id}`,
    list: '/api/products',
  },
  reports: {
    create: '/api/reports',
    get: (id: string) => `/api/reports/${id}`,
    list: '/api/reports',
  },
  ai: {
    generateQuestions: '/api/ai/generate-questions',
    transparencyScore: '/api/ai/transparency-score',
    analyzeProduct: '/api/ai/analyze-product',
  },
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    profile: '/api/auth/profile',
  },
}
