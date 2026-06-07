<template>
  <div
    :class="[
      'flex flex-col py-2 px-3 h-full rounded-full',
      highlightStyle,
      clickableStyle,
      opacityStyle,
    ]"
  >
    <span class="uppercase text-sm leading-none font-black select-none">
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
      if (this.status === 'selected') {
        return 'draw-selected'
      } else if (this.status === 'correct' || this.status === 'wrong') {
        return `text-white prediction-${this.status} border-prediction-${this.status} border-4`
      }
      return 'border-2 bg-gray-500 text-white/50 shadow-inner-md'
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
  box-shadow: 0 0 0 5px #ffff, 0 0 14px 5px #fffc;
  background-color: #ffff;
  color: #44637f;
}
.prediction-correct {
  background-color: rgb(132, 204, 22);
}
.prediction-wrong {
  background-color: rgb(248, 113, 113);
}
</style>
