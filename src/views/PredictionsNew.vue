<template>
  <PredictionSwiper :matches="missingPredictions" />
</template>

<script>
import PredictionSwiper from '@/components/PredictionSwiper'

export default {
  components: { PredictionSwiper },

  props: {
    competitionId: {
      type: Number,
      default: 1,
      required: false,
    },
  },

  async mounted() {
    this.fetchMatches()
  },

  data() {
    return {
      loading: false,
      matches: [],
    }
  },

  computed: {
    missingPredictions() {
      return this.matches.filter(
        m => !('prediction' in m) && m.status === 'upcoming'
      )
    },
  },

  methods: {
    async fetchMatches() {
      this.loading = true
      this.matches = await this.$store.dispatch('matches/fetchMatches', {
        competitionId: this.competitionId,
      })
      this.loading = false
    },
  },
}
</script>
