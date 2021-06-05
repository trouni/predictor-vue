import Vue from 'vue'
import '@/plugins/fontawesome'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

Sentry.init({
  Vue,
  dsn:
    'https://52df1bed6ee547c8b22b3e60dff36f52@o480835.ingest.sentry.io/5798116',
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

// Globally register all `_base`-prefixed components
import '@/components/_globals'

import './registerServiceWorker'
import './cloudinary.js'

// Don't warn about using the dev version of Vue in development.
Vue.config.productionTip = process.env.NODE_ENV === 'production'

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
