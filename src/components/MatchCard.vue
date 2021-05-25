<template>
  <div class="bg-match-card rounded-2xl text-center m-3">
    <div class="flex align justify-evenly">
      <PredictionChoiceTeam :team="match.teamHome" class="w-1/3" />
      <div class="flex flex-col my-2 items-center justify-start px-3 h-full">
        <p class="mb-1 h-8 leading-none flex items-center text-sm">vs</p>
        <div class="flex-grow">
          <PredictionChoiceDraw class="w-1/3" />
        </div>
      </div>
      <PredictionChoiceTeam :team="match.teamAway" class="w-1/3" />
    </div>
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

<style lang="scss"></style>
