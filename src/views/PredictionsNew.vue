<template>
  <PredictionSwiper :matches="missingPredictions" @predict="setPrediction" />
</template>

<script>
import PredictionSwiper from '@/components/PredictionSwiper'

export default {
  components: { PredictionSwiper },

  async mounted() {
    this.fetchMatches()
  },

  data() {
    return {
      loading: false,
      matches: [],
    }
  },

  watch: {
    missingPredictions(newValue) {
      if (!newValue.length) this.$router.push({ path: '/matches' })
    },
  },

  computed: {
    missingPredictions() {
      return this.matches
        .filter(m => !('prediction' in m) && m.status === 'upcoming')
        .sort(
          (match1, match2) =>
            new Date(match1.kickoffTime) - new Date(match2.kickoffTime)
        )
    },
  },

  methods: {
    async fetchMatches() {
      this.loading = true
      this.matches = await this.$store.dispatch('matches/fetchMatches')
      this.loading = false
    },
    async setPrediction({ matchId, choice }) {
      this.loading = true
      const matchIndex = this.matches.findIndex(match => match.id === matchId)
      const prediction = await this.$store.dispatch(`matches/setPrediction`, {
        match: this.matches[matchIndex],
        choice,
      })
      this.$set(this.matches[matchIndex], 'prediction', prediction)
      this.loading = false
    },
  },
}
</script>
