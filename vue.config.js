module.exports = {
  appleMobileWebAppCapable: 'yes',
  iconPaths: {
    favicon32: '/favicon-32x32.png',
    favicon16: '/favicon-16x16.png',
    appleTouchIcon: '/apple-touch-icon-152x152.png',
    maskIcon: '/safari-pinned-tab.svg',
    msTileImage: '/mstile-150x150.png',
  },
  manifestOptions: {
    name: 'Octacle',
    short_name: 'Octacle',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: '#29275c',
    background_color: '#29275c',
    start_url: 'https://www.octacle.app/matches',
    display: 'standalone',
    orientation: 'portrait',
    scope_url: 'https://www.octacle.app/',
    intent_filters: {
      scope_url_scheme: 'https',
      scope_url_host: 'www.octacle.app',
      scope_url_path: '/',
    },
  },
}
