<template>
  <div
    :class="[
      'flex flex-col py-2 px-3 h-full rounded-full shadow-inner-md bg-gray-400',
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
    highlightStyle() {
      return `border-6 border-prediction-${this.status}`
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
