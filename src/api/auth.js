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

export function resetPassword(email) {
  return request({
    baseURL: config.apiURL,
    url: '/auth/password',
    method: 'post',
    data: { email, redirect_url: `${process.env.VUE_APP_HOST}/reset-password` },
  })
}

export function updatePassword({ password, confirmation }) {
  return request({
    baseURL: config.apiURL,
    url: '/auth/password',
    method: 'patch',
    data: { password, password_confirmation: confirmation },
  })
}
