<template>
  <div
    ref="predictionsBar"
    class="w-full h-6 rounded-md border-gray-300 border mt-5 flex overflow-hidden"
  >
    <div
      ref="teamHome"
      :class="['min-w-[2.5em] h-full', rightSideBorderIfStarted]"
    >
      <div
        class="text-sm text-glow font-semibold text-gray-600 w-full h-full flex items-center justify-center"
      >
        {{ percentageHomeWin }}
      </div>
    </div>

    <div
      v-if="match.groupId"
      ref="draw"
      :class="['min-w-[2.5em] h-full border-gray-300 border-r border-l']"
    >
      <div
        class="text-sm text-glow font-semibold text-gray-600 w-full h-full flex items-center justify-center uppercase"
      >
        {{ percentageDraw }}
      </div>
    </div>
    <div ref="teamAway" class="min-w-[2.5em] h-full flex-auto">
      <div
        class="text-sm text-glow font-semibold text-gray-600 w-full h-full flex items-center justify-center"
      >
        {{ percentageAwayWin }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    match: {
      type: Object,
      required: true,
    },
    predictions: {
      type: Object,
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
  },

  mounted() {
    if (this.$refs.teamHome) {
      this.$refs.teamHome.style.width = this.percentageHomeWin
      this.$refs.teamHome.classList.add(
        this.result === 'home' ? 'bg-prediction-correct' : 'bg-gray-100'
      )
    }
    if (this.$refs.draw) {
      this.$refs.draw.style.width = this.percentageDraw
      this.$refs.draw.classList.add(
        this.result === 'draw' ? 'bg-prediction-correct' : 'bg-gray-100'
      )
    }
    if (this.$refs.teamAway) {
      this.$refs.teamAway.style.width = this.percentageAwayWin
      this.$refs.teamAway.classList.add(
        this.result === 'away' ? 'bg-prediction-correct' : 'bg-gray-100'
      )
    }
  },

  methods: {
    calculatePercentage(numOfPredictions) {
      return Math.round(
        (numOfPredictions / this.totalNumberOfUserPredictions) * 100
      )
    },
    hasPredictions(column) {
      return Object.keys(this.predictions).includes(column)
    },
  },

  computed: {
    rightSideBorderIfStarted() {
      if (this.match.status === 'started') {
        return 'border-r border-gray-300'
      } else return ''
    },
    totalNumberOfUserPredictions() {
      return Object.keys(this.predictions).reduce((acc, key) => {
        return acc + this.predictions[key].length
      }, 0)
    },
    percentageHomeWin() {
      if (!this.hasPredictions('home')) return '0%'
      return `${this.calculatePercentage(this.predictions.home.length)}%`
    },
    percentageAwayWin() {
      if (!this.hasPredictions('away')) return '0%'
      return `${this.calculatePercentage(this.predictions.away.length)}%`
    },
    percentageDraw() {
      if (!this.hasPredictions('draw')) return '0%'
      return `${this.calculatePercentage(this.predictions.draw.length)}%`
    },
  },
}
</script>
