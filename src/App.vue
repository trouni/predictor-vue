<template>
  <div id="app">
    <NavBar></NavBar>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'

export default {
  name: 'App',
  components: { NavBar },
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
@import '@/styles';
*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  background: $color-body-bg;
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
