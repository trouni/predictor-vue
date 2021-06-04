<template>
  <PredictionSwiper :matches="missingPredictions" @predict="setPrediction" />
</template>

<script>
import PredictionSwiper from '@/components/PredictionSwiper'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { PredictionSwiper },

  async mounted() {
    if (this.matches.length) this.$emit('init')

    await this.fetchMatches()
    this.$emit('init')
  },

  data() {
    return {
      loading: false,
    }
  },

  watch: {
    missingPredictions(newValue) {
      if (!newValue.length) this.$router.push({ path: '/matches' })
    },
  },

  computed: {
    ...mapGetters({ matches: 'matches/matches' }),
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
    ...mapActions({
      fetchMatches: 'matches/fetchMatches',
      setPrediction: 'matches/setPrediction',
    }),
  },
}
</script>
