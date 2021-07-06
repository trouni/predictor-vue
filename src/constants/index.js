export const config = {
  environment: process.env.NODE_ENV || 'development',
  apiURL: process.env.VUE_APP_API_URL,
  cloudName: process.env.VUE_APP_CLOUD_NAME,
  vapidPublicKey:
    process.env.VUE_APP_VAPID_PUB_KEY ||
    'BBFIfyZSrg4mxfQ3d9YaLQm1KZ9yxbmVK-L34GuNfhNYzIUPJjMb4o1zFBmKHr60nfNHsXRO_xlxh1DIpZUKPJQ',
}
