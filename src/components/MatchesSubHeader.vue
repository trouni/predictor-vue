<template>
  <div class="flex items-center justify-between sm:justify-center">
    <div class="mx-5">
      <!-- <BaseIcon name="angle-left" /> -->
    </div>
    <h3> Group Stage </h3>
    <div class="mx-5">
      <!-- <BaseIcon name="angle-right" /> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    }
  },

  methods: {
    onSwipeLeft() {},
    onSwipeRight() {},
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
h3 {
  margin: ($spacer / 2);
  color: $white;
  font-weight: lighter;
}
</style>
