<template>
  <div id="app">
    <RouterView :key="$route.fullPath"></RouterView>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss">
// Normalize default styles across browsers,
// https://necolas.github.io/normalize.css/
@import '~normalize.css/normalize.css';
// Style loading bar between pages.
// https://github.com/rstacruz/nprogress
@import '~nprogress/nprogress.css';
// Style variables and utilities from src/styles.
@import './assets/tailwind.css';
@import '@/styles';
*,
*::before,
*::after {
  // Deactivate text selection on mobile
  @apply select-none md:select-auto;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  -ms-user-drag: none;
  user-drag: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
input,
textarea {
  @apply select-text;
}
html {
  // Fix the page to avoid overscroll on mobile app
  @apply fixed md:static w-screen md:w-auto h-screen md:h-auto;
}
body {
  background: $color-body-bg;
  overscroll-behavior: none;
}
#app {
  @extend %typography-small;
}
// ===
// Base element styles
// ===
// a,
// a:visited {
//   color: $color-link-text;
// }
h1 {
  @extend %typography-xxlarge;
}
h2 {
  @extend %typography-xlarge;
}
h3 {
  @extend %typography-large;
}
h4 {
  @extend %typography-medium;
}
h5,
h6 {
  @extend %typography-small;
}
// ===
// Vendor
// ===
#nprogress .bar {
  background: $color-link-text;
}
</style>
