<template>
  <div
    :class="[
      'shadow-inner-lg rounded-full h-20 w-20 flex items-center justify-center overflow-hidden bg-contain',
      highlight,
    ]"
    :style="`background-image: url(${flag}); background-size: cover; background-position: center;`"
  >
    <p v-if="psScore" class="text-glow text-4xl select-none">{{ etScore }}<small>({{ psScore }})</small></p>
    <p v-else-if="etScore" class="text-glow text-4xl select-none">{{ etScore }}</p>
    <p v-else class="text-glow text-4xl select-none">{{ score }}</p>
  </div>
</template>

<script>
export default {
  props: {
    flag: String,
    score: Number,
    etScore: Number,
    psScore: Number,
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
          return 'border-6 border-prediction-correct'
        case 'wrong':
          return 'border-6 border-prediction-wrong'
        case 'selected':
          return 'badge-selected'
        default:
          return 'border-6 border-prediction-default'
      }
    },
  },
}
</script>

<style lang="scss">
.badge-selected {
  box-shadow:
    0 0 0 5px #3b82f6,
    0 0 14px 5px rgba(59, 130, 246, 0.65),
    0 0 30px 12px rgba(102, 144, 183, 0.35);
}

.text-glow {
  text-shadow: -0.07em -0.07em 0.04em #fffc, 0 -0.07em 0.04em #fffc,
    0.07em -0.07em 0.04em #fffc, 0.07em 0 0.04em #fffc,
    0.07em 0.07em 0.04em #fffc, 0 0.07em 0.04em #fffc,
    -0.07em 0.07em 0.04em #fffc, -0.07em 0 0.04em #fffc;
}
small {
  font-size: 0.5em;
}
</style>
