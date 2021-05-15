<template>
  <div>
    <!-- TODO: Implement match/prediction card -->
    <PredictionChoiceTeam :team="match.teamHome" />
    <PredictionChoiceDraw />
    <PredictionChoiceTeam :team="match.teamAway" />
    <small>
      {{ new Date(match.kickoffTime).toLocaleDateString() }}
    </small>
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
      this.matches = await this.$store.dispatch(`matches/setPrediction`, {
        match: this.match,
        choice,
      })
      this.loading = false
    },
  },
}
</script>
