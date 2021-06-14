<template>
  <div
    :class="[
      'rounded-2xl text-center my-5 mx-2 p-2 shadow bg-white transition border-6 duration-300 relative',
      borderStyle,
    ]"
  >
    <div class="flex align justify-evenly">
      <PredictionChoiceTeam
        class="w-1/3"
        :team="match.teamHome"
        :status="status('home')"
        :clickable="!disabled"
        @click.native="setPrediction('home')"
      />
      <div
        class="flex flex-col my-2 items-center justify-start px-3 h-full w-1/3"
      >
        <p class="mb-1 h-8 leading-none flex items-center text-sm">vs</p>
        <div class="flex-grow">
          <PredictionChoiceDraw
            :status="status('draw')"
            :clickable="!disabled"
            @click.native="setPrediction('draw')"
          />
        </div>
      </div>
      <PredictionChoiceTeam
        class="w-1/3"
        :team="match.teamAway"
        :status="status('away')"
        :clickable="!disabled"
        @click.native="setPrediction('away')"
      />
    </div>
    <CornerPoints v-if="finished" :correct="correctPrediction" :number="3" />
    <p class="text-xs text-gray-400">{{ matchDate }}</p>
  </div>
</template>

<script>
import PredictionChoiceTeam from './PredictionChoiceTeam'
import PredictionChoiceDraw from './PredictionChoiceDraw'
import CornerPoints from './CornerPoints'
import { formatTime } from '@/utils/helpers'

export default {
  components: { PredictionChoiceTeam, PredictionChoiceDraw, CornerPoints },

  props: {
    match: {
      type: Object,
      required: true,
    },
    selectable: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    async setPrediction(choice) {
      if (this.disabled) return

      this.loading = true
      const prediction = await this.$store.dispatch(`matches/setPrediction`, {
        match: this.match,
        choice,
      })
      this.$set(this.match, 'prediction', prediction)
      this.loading = false
    },
    status(choice) {
      if (this.madePrediction && this.match.prediction.choice === choice) {
        if (this.match.status === 'finished') {
          return this.correctPrediction ? 'correct' : 'wrong'
        } else {
          return 'selected'
        }
      } else {
        return 'default'
      }
    },
    formatTime,
  },

  computed: {
    disabled() {
      return !this.selectable || this.loading
    },
    finished() {
      return this.match.status === 'finished'
    },
    matchDate() {
      if (this.match.status === 'finished') {
        return 'Full Time'
      } else if (this.match.status === 'started') {
        return 'In Progress'
      } else {
        return 'Kick-off at ' + this.formatTime(this.match.kickoffTime)
      }
    },
    madePrediction() {
      return 'prediction' in this.match
    },
    correctPrediction() {
      return (
        this.match.status === 'finished' &&
        this.madePrediction &&
        ((this.match.prediction.choice === 'draw' &&
          this.match.teamAway.score === this.match.teamHome.score) ||
          (this.match.prediction.choice === 'away' &&
            this.match.teamAway.score > this.match.teamHome.score) ||
          (this.match.prediction.choice === 'home' &&
            this.match.teamAway.score < this.match.teamHome.score))
      )
    },
    borderStyle() {
      if (this.match.status === 'finished') {
        // Game finished - Prediction is either right or wrong/missing
        return this.correctPrediction
          ? 'border-prediction-correct border-opacity-20'
          : 'border-prediction-wrong border-opacity-20'
      } else if (this.match.status === 'upcoming' && !this.madePrediction) {
        // Game upcoming and no prediction made
        return 'border-prediction-default'
      } else {
        // Game upcoming and prediction already made
        return 'border-white'
      }
    },
  },
}
</script>
