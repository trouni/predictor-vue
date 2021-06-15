<template>
  <div class="header-container">
      <p> {{ text }}</p>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: false,
    },
    selected: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
// @import '@/styles';

</style>
