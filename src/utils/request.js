import axios from 'axios'
import { config } from '@/constants'
import store from '@/store'
import NProgress from 'nprogress/nprogress'

// create an axios instance
const service = axios.create({
  baseURL: config.authUrl,
  timeout: 15000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  serviceConfig => {
    NProgress.start()
    const authHeaders = store.getters['auth/headers']
    serviceConfig.headers = { ...serviceConfig.headers, ...authHeaders }
    return serviceConfig
  },
  error => {
    NProgress.done()
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    NProgress.done()
    if (response.status < 200 || response.status >= 300) console.warn(response)

    // Seems like cached requests don't generate new tokens.
    // Need to check first if a new access token has been provided.
    if (response.headers['access-token'])
      store.dispatch('auth/updateHeaders', response.headers)
    return response
  },
  error => {
    NProgress.done()
    console.warn(error)
    if (
      store.getters['auth/loggedIn'] &&
      error.response &&
      error.response.status === 401
    )
      store.dispatch('auth/logOut')

    console.warn(error)
    return Promise.reject(error)
  }
)

export default service
