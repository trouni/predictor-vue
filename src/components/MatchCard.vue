<template>
  <div>
    <!-- TODO: Implement match/prediction card -->
    <TeamThumbnail :team="match.teamHome"></TeamThumbnail>
    vs
    <TeamThumbnail :team="match.teamAway"></TeamThumbnail>
    <small>
      {{ new Date(match.kickoffTime).toLocaleDateString() }}
    </small>
  </div>
</template>

<script>
import TeamThumbnail from './TeamThumbnail'

export default {
  components: { TeamThumbnail },

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
