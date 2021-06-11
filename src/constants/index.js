export const config = {
  environment: process.env.NODE_ENV || 'development',
  apiURL: process.env.VUE_APP_API_URL,
  cloudName: process.env.VUE_APP_CLOUD_NAME,
  analyticsID: process.env.VUE_APP_ANALYTICS_ID,
}
