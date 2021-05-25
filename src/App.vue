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
  box-sizing: border-box;
}
body {
  background: linear-gradient(167.4deg, $purple 0%, $teal 88.73%);
}
#app {
  @extend %typography-small;
}
// ===
// Base element styles
// ===
a,
a:visited {
  color: $color-link-text;
}
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
