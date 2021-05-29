<template>
  <div
    :class="[
      'flex flex-col py-2 px-3 h-full rounded-full shadow-inner-md bg-gray-400',
      highlightStyle,
      clickableStyle,
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
  },

  computed: {
    highlightStyle() {
      return `border-6 border-prediction-${this.status}`
    },
    clickableStyle() {
      return this.clickable ? 'cursor-pointer' : 'cursor-default'
    },
  },
}
</script>
