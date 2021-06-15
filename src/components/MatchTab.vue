<template>
  <div class="header-container" @click="selectTab">
      <p>{{ text }}</p>
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
