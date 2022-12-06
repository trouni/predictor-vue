<template>
  <div
    :class="[
      'rounded-2xl text-center my-5 mx-2 p-2 shadow bg-white transition border-6 duration-300 relative',
      borderStyle,
    ]"
  >
    <p class="border-b pt-2 mt-2 pb-4 mb-4 text-gray-500">{{ matchDate }}</p>
    <div class="flex align justify-evenly items-center">
      <PredictionChoiceTeam
        class="w-1/3"
        :team="match.teamHome"
        :status="status('home')"
        :clickable="false"
        :greyOut="greyOutOrNot('home')"
      />
      <div
        v-if="match.groupId"
        class="flex flex-col my-2 items-center justify-start px-3 h-full w-1/3"
      >
        <p class="mb-1 h-8 leading-none flex items-center text-sm"></p>
        <div class="flex-grow">
          <PredictionChoiceDraw
            :greyOut="greyOutOrNot('draw')"
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
        :greyOut="greyOutOrNot('away')"
        @click.native="setPrediction('away')"
      />
    </div>
    <CornerPoints v-if="finished" :correct="correctPrediction" />
    <div class="mt-5">
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
import CornerPoints from './CornerPoints'
import { formatTime, homeTeamWon, awayTeamWon } from '@/utils/helpers'

export default {
  components: {
    PredictionChoiceTeam,
    PredictionChoiceDraw,
    CornerPoints,
    MatchPredictions,
  },

  props: {
    match: {
      type: Object,
      required: true,
    },
    selectable: {
      type: Boolean,
      default: true,
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

  methods: {
    greyOutOrNot(column) {
      if (this.match.status === 'started') {
        return false
      }
      return column !== this.matchResult
    },
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
      if (this.match.status === 'finished') {
        if (this.matchResult === choice) {
          return 'correct'
        } else if (
          this.match.prediction &&
          this.match.prediction.choice === choice
        ) {
          return 'wrong'
        } else {
          return 'default'
        }
      } else {
        return 'default'
      }
    },
    formatTime,
    homeTeamWon,
    awayTeamWon,
  },

  computed: {
    matchResult() {
      if (this.homeTeamWon(this.match)) {
        return 'home'
      } else if (this.awayTeamWon(this.match)) {
        return 'away'
      } else {
        return 'draw'
      }
    },
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
            (this.match.teamAway.score > this.match.teamHome.score ||
              this.match.teamAway.etScore > this.match.teamHome.etScore ||
              this.match.teamAway.psScore > this.match.teamHome.psScore)) ||
          (this.match.prediction.choice === 'home' &&
            (this.match.teamAway.score < this.match.teamHome.score ||
              this.match.teamAway.etScore < this.match.teamHome.etScore ||
              this.match.teamAway.psScore < this.match.teamHome.psScore)))
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
