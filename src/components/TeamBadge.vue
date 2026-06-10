<template>
  <div
    :class="[
      'shadow-inner-lg rounded-full  flex items-center justify-center overflow-hidden bg-contain',
      highlight,
      options,
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
    options: { type: String, default: 'h-20 w-20' },
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
          return 'border-4 border-prediction-correct'
        case 'wrong':
          return 'border-4 border-prediction-wrong'
        case 'selected':
          return 'badge-selected'
        default:
          return 'border-2 border-prediction-default'
      }
    },
  },
}
</script>

<style lang="scss">
.badge-selected {
  box-shadow:
    0 0 0 5px #ffff,
    0 0 14px 5px #fffc
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
