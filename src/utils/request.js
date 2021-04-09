import axios from 'axios'
import { config } from '@/constants'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: config.authUrl,
  timeout: 5000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  serviceConfig => {
    const authHeaders = store.getters['auth/headers']
    serviceConfig.headers = { ...serviceConfig.headers, ...authHeaders }
    return serviceConfig
  },
  error => {
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      console.warn(response)
    }
    return response
  },
  error => {
    if (error.response.status === 401) {
      store.dispatch('auth/logOut')
    }
    console.warn(error)
    return Promise.reject(error)
  }
)

export default service
