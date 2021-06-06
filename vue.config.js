module.exports = {
  pwa: {
    name: 'Octacle',
    themeColor: '#3e3b7d',

    appleMobileWebAppCapable: 'yes',

    manifestOptions: {
      scope_url: 'https://www.octacle.app/',
      intent_filters: {
        scope_url_scheme: 'https',
        scope_url_host: 'www.octacle.app',
        scope_url_path: '/',
      },
      start_url: 'https://www.octacle.app/',
      display: 'standalone',
    },
  },
}
