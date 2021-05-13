import request from '@/utils/request'
import { config } from '@/constants'

export function logIn(credentials) {
  return request({
    baseURL: config.apiURL,
    url: '/auth/sign_in',
    method: 'post',
    data: credentials,
  })
}

export function logOut() {
  return request({
    baseURL: config.apiURL,
    url: '/auth/sign_out',
    method: 'delete',
  })
}

export function signUp(credentials) {
  return request({
    baseURL: config.apiURL,
    url: '/auth',
    method: 'post',
    data: credentials,
  })
}
