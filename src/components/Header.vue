<template>
  <div class="header-container">
    <div class="d-flex justify-content-center">
      <img
        v-if="img"
        alt="football graphic"
        :src="require('../assets/' + img)"
        class="header-img"
      />
      <h1 v-if="title"> {{ title }}</h1>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
    },
    img: {
      type: String,
      required: false,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.header-container {
  padding: $spacer;
  color: $white;
}

.justify-content-center {
  justify-content: center;
}

.d-flex {
  display: flex;
  align-items: center;
}

.header-img {
  width: 24px;
  height: 24px;
}

h1 {
  color: $white;
}

img {
  margin-right: $spacer;
}

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) {
  .header-container {
    padding: $spacer * 2;
  }
  .header-img {
    width: 36px;
    height: 36px;
  }
}
</style>
