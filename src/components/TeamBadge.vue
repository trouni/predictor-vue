<template>
  <div
    :class="[
      'shadow-inner-lg rounded-full h-20 w-20 flex items-center justify-center overflow-hidden bg-contain',
      highlight,
    ]"
    :style="`background-image: url(${flag}); background-size: cover; background-position: center;`"
  >
    <p class="text-glow text-4xl select-none">{{ score }}</p>
  </div>
</template>

<script>
export default {
  props: {
    flag: String,
    score: Number,
    status: {
      type: String,
      default: 'default',
      required: false,
    },
  },

  computed: {
    highlight() {
      switch (this.status) {
        case 'correct':
          return 'border-4 border-prediction-correct'
        case 'incorrect':
          return 'border-4 border-prediction-incorrect'
        case 'selected':
          return 'border-4 border-prediction-selected'
        default:
          return 'border-4 border-prediction-default'
      }
    },
  },
}
</script>

<style lang="scss">
.text-glow {
  text-shadow: -0.07em -0.07em 0.04em #fffc, 0 -0.07em 0.04em #fffc,
    0.07em -0.07em 0.04em #fffc, 0.07em 0 0.04em #fffc,
    0.07em 0.07em 0.04em #fffc, 0 0.07em 0.04em #fffc,
    -0.07em 0.07em 0.04em #fffc, -0.07em 0 0.04em #fffc;
}
</style>
