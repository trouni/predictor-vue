<template>
  <div class="rounded-2xl text-center my-5 mx-2 p-2 bg-white shadow">
    <div class="flex align justify-evenly">
      <PredictionChoiceTeam
        class="w-1/3"
        :team="match.teamHome"
        :status="status('home')"
        @click.native="setPrediction('home')"
      />
      <div
        class="flex flex-col my-2 items-center justify-start px-3 h-full w-1/3"
      >
        <p class="mb-1 h-8 leading-none flex items-center text-sm">vs</p>
        <div class="flex-grow">
          <PredictionChoiceDraw
            :status="status('draw')"
            @click.native="setPrediction('draw')"
          />
        </div>
      </div>
      <PredictionChoiceTeam
        class="w-1/3"
        :team="match.teamAway"
        :status="status('away')"
        @click.native="setPrediction('away')"
      />
    </div>
    <p class="text-xs text-gray-400">{{ matchDate }}</p>
  </div>
</template>

<script>
import PredictionChoiceTeam from './PredictionChoiceTeam'
import PredictionChoiceDraw from './PredictionChoiceDraw'

export default {
  components: { PredictionChoiceTeam, PredictionChoiceDraw },

  props: {
    match: {
      type: Object,
      required: true,
    },
  },

  methods: {
    async setPrediction(choice) {
      this.loading = true
      const prediction = await this.$store.dispatch(`matches/setPrediction`, {
        match: this.match,
        choice,
      })
      this.$set(this.match, 'prediction', prediction)
      this.loading = false
    },
    status(choice) {
      // TODO: Remove the next statement once `prediction.correct` has been added to the API
      if (
        this.match.status === 'finished' &&
        'prediction' in this.match &&
        'choice' in this.match.prediction
      ) {
        this.match.prediction.correct =
          (this.match.prediction.choice === 'draw' &&
            this.match.teamAway.score === this.match.teamHome.score) ||
          (this.match.prediction.choice === 'away' &&
            this.match.teamAway.score > this.match.teamHome.score) ||
          (this.match.prediction.choice === 'home' &&
            this.match.teamAway.score < this.match.teamHome.score)
      }
      // END

      if (
        'prediction' in this.match &&
        this.match.prediction.choice === choice
      ) {
        if ('correct' in this.match.prediction) {
          return this.match.prediction.correct ? 'correct' : 'wrong'
        } else {
          return 'selected'
        }
      } else {
        return 'default'
      }
    },
  },

  computed: {
    matchDate() {
      if (this.match.status === 'finished') {
        return 'Full Time'
      } else if (this.match.status === 'started') {
        return 'In Progress'
      } else {
        return new Date(this.match.kickoffTime).toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
    },
  },
}
</script>

<style lang="scss"></style>
