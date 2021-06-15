<template>
  <div class="cursor-pointer flex-1" :id="text" @click="selectTab">
    <h3 class="text-center uppercase font-normal">{{ text }}</h3>
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
