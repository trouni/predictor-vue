<template>
  <div
    class="result-card rounded-2xl my-3 mx-3 bg-white shadow-md overflow-hidden relative transition-all duration-300"
    :class="cardBorderClass"
  >

    <!-- Status bar at top -->
    <div
      class="flex items-center justify-between px-4 py-2.5 border-b border-gray-100"
      :class="statusBarClass"
    >
      <span class="text-xs font-semibold uppercase tracking-wider" :class="statusTextClass">
        {{ matchDate }}
      </span>

      <!-- User's outcome badge (only once game is finished and prediction was made) -->
      <span
        v-if="finished && madePrediction"
        class="text-xs font-bold px-2.5 py-1 rounded-full"
        :class="correctPrediction
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-500'"
      >
        {{ correctPrediction ? '✓ Correct' : '✗ Wrong' }}
      </span>
      <span
        v-else-if="finished && !madePrediction"
        class="text-xs text-gray-400"
      >
        No prediction
      </span>
      <span
        v-else-if="!finished"
        class="flex items-center gap-1 text-xs font-medium text-orange-500"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
        Live
      </span>
    </div>

    <!-- Teams row -->
    <div class="flex items-center justify-around px-2 pt-0 pb-4">
      <PredictionChoiceTeam
        class="w-1/3"
        :team="match.teamHome"
        :status="status('home')"
        :clickable="false"
        :greyOut="greyOutOrNot('home')"
      />

      <!-- Draw (group stage only) -->
      <div
        v-if="match.groupId"
        class="flex flex-col items-center justify-center px-2 w-1/3"
      >
        <PredictionChoiceDraw
          :greyOut="greyOutOrNot('draw')"
          :status="status('draw')"
          :clickable="false"
        />
      </div>

      <!-- VS divider for knockout rounds -->
      <div v-else class="w-1/6 flex items-center justify-center">
        <span class="text-gray-300 text-sm font-light">VS</span>
      </div>

      <PredictionChoiceTeam
        class="w-1/3"
        :team="match.teamAway"
        :status="status('away')"
        :clickable="false"
        :greyOut="greyOutOrNot('away')"
      />
    </div>

    <!-- Group's picks section -->
    <div v-if="predictions" class="border-t border-gray-100">
      <!-- Section label -->
      <div class="flex items-center gap-2 px-4 pt-3 pb-1">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Group picks</span>
      </div>

      <MatchPredictions
        :predictions="predictions"
        :match="match"
        :result="matchResult"
        :currentUserId="currentUserId"
      />
    </div>

  </div>
</template>

<script>
import PredictionChoiceTeam from './PredictionChoiceTeam'
import PredictionChoiceDraw from './PredictionChoiceDraw'
import MatchPredictions from './MatchPredictions'
import { formatTime, homeTeamWon, awayTeamWon } from '@/utils/helpers'

export default {
  name: 'ResultCard',

  components: {
    PredictionChoiceTeam,
    PredictionChoiceDraw,
    MatchPredictions,
  },

  props: {
    match: {
      type: Object,
      required: true,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    predictions: {
      type: Object,
      required: false,
    },
    currentUserId: {
      type: Number,
      required: true,
    },
  },

  computed: {
    matchResult() {
      if (this.homeTeamWon(this.match)) return 'home'
      if (this.awayTeamWon(this.match)) return 'away'
      return 'draw'
    },
    finished() {
      return this.match.status === 'finished'
    },
    madePrediction() {
      return 'prediction' in this.match
    },
    correctPrediction() {
      if (!this.finished || !this.madePrediction) return false
      const c = this.match.prediction.choice
      return (
        (c === 'draw' && this.match.teamAway.score === this.match.teamHome.score) ||
        (c === 'away' && this.awayTeamWon(this.match)) ||
        (c === 'home' && this.homeTeamWon(this.match))
      )
    },
    matchDate() {
      if (this.finished) return 'Full Time'
      if (this.match.status === 'started') return 'In Progress'
      return 'Kick-off at ' + this.formatTime(this.match.kickoffTime)
    },
    statusBarClass() {
      if (this.finished && this.madePrediction) {
        return this.correctPrediction ? 'bg-green-50' : 'bg-red-50'
      }
      if (this.match.status === 'started') return 'bg-orange-50'
      return 'bg-gray-50'
    },
    statusTextClass() {
      if (this.finished) return 'text-gray-500'
      if (this.match.status === 'started') return 'text-orange-600'
      return 'text-gray-400'
    },
    // Left border color based on prediction outcome
    cardBorderClass() {
      if (this.finished && this.madePrediction) {
        return this.correctPrediction
          ? 'border-l-4 border-prediction-correct'
          : 'border-l-4 border-prediction-wrong'
      }
      if (this.match.status === 'started') return 'border-l-4 border-orange-400'
      return ''
    },
  },

  methods: {
    greyOutOrNot(column) {
      if (this.match.status === 'started') return false
      return column !== this.matchResult
    },
    status(choice) {
      if (!this.finished) return 'default'
      if (this.matchResult === choice) return 'correct'
      if (this.match.prediction?.choice === choice) return 'wrong'
      return 'default'
    },
    formatTime,
    homeTeamWon,
    awayTeamWon,
  },
}
</script>

<style lang="scss" scoped>
.result-card {
  border-left-width: 4px;
}
</style>
