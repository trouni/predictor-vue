<template>
  <div
    :class="['cursor-pointer', 'flex-1', 'flex', 'justify-center']"
    @click="selectTab"
  >
    <h3
      :class="[
        'text-center',
        'uppercase',
        'font-normal',
        'text-base',
        'leading-7',
        tabStyle,
      ]"
      >{{ text }}</h3
    >
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
  computed: {
    tabStyle() {
      return this.selected ? 'selected-tab' : 'opacity-50'
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.selected-tab {
  border-bottom: 2px solid $purple;
  transition: border-bottom 0.2s ease-in-out;
}
</style>
