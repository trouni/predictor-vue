<template>
  <PredictionSwiper
    :loading="loading"
    :matches="missingPredictions"
    @remove="removeMatch"
  />
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
    this.loading = false
  },

  props: {
    allMatches: { type: Boolean, default: false },
  },

  data() {
    return {
      loading: true,
    }
  },

  watch: {
    missingPredictions(newValue, oldValue) {
      if (!newValue.length && oldValue.length)
        this.$router.push({ path: '/matches' })
    },
  },

  computed: {
    ...mapGetters({ matches: 'matches/matches' }),
    missingPredictions() {
      return this.matches
        .filter(
          m =>
            m.status === 'upcoming' &&
            ((this.allMatches && !m.removed) || !('prediction' in m))
        )
        .sort(
          (match1, match2) =>
            new Date(match1.kickoffTime) - new Date(match2.kickoffTime)
        )
    },
  },

  methods: {
    ...mapActions({
      fetchMatches: 'matches/fetchMatches',
    }),
    removeMatch(match) {
      const index = this.matches.findIndex(m => m.id === match.id)
      this.$set(this.matches[index], 'removed', true)
    },
  },
}
</script>
