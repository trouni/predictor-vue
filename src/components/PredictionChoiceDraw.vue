<template>
  <div
    :class="[
      'flex flex-col py-2 px-3 h-full rounded-full shadow-inner-md',
      backgroundStyle,
      highlightStyle,
      clickableStyle,
      opacityStyle,
    ]"
  >
    <span class="uppercase text-sm leading-none text-white select-none">
      DRAW
    </span>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: 'default',
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    greyOut: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    backgroundStyle() {
      return this.status === 'selected' ? 'bg-blue-500 draw-selected' : 'bg-gray-400'
    },
    highlightStyle() {
      return this.status === 'selected' ? '' : `border-6 border-prediction-${this.status}`
    },
    opacityStyle() {
      if (this.greyOut) {
        return 'opacity-40'
      } else if (this.clickable) {
        return 'opacity-80'
      } else {
        return 'opacity-100'
      }
    },
    clickableStyle() {
      return this.clickable ? 'cursor-pointer' : 'cursor-default'
    },
  },
}
</script>

<style lang="scss">
.draw-selected {
  box-shadow:
    0 0 10px 3px rgba(59, 130, 246, 0.7),
    0 0 24px 8px rgba(102, 144, 183, 0.35);
}
</style>
