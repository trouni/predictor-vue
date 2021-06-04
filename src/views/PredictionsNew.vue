<template>
  <PredictionSwiper :matches="missingPredictions" />
</template>

<script>
import PredictionSwiper from '@/components/PredictionSwiper'

export default {
  components: { PredictionSwiper },

  async mounted() {
    await this.fetchMatches()
    this.$emit('init')
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
      this.matches = await this.$store.dispatch('matches/fetchMatches')
      this.loading = false
    },
  },
}
</script>
