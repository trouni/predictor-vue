<template>
  <div class="" :id="text" @click="selectTab">
    <p>{{ text }}</p>
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
  methods: {
    selectTab() {
      this.$emit('selectTabEvent', this.text)
    },
  },
}
</script>

<style lang="scss" scoped>
// @import '@/styles';
</style>
