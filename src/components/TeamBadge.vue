<template>
  <div
    :class="[
      'shadow-inner-lg rounded-full  flex items-center justify-center overflow-hidden bg-contain',
      highlight,
      options,
    ]"
    :style="`background-image: url(${flag}); background-size: cover; background-position: center;`"
  >
    <p v-if="psScore" class="score-badge select-none">
      {{ etScore }}<small>({{ psScore }})</small>
    </p>
    <p v-else-if="etScore" class="score-badge select-none">{{ etScore }}</p>
    <p v-else class="score-badge select-none">{{ score }}</p>
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

.score-badge {
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

small {
  font-size: 0.5em;
}
</style>
