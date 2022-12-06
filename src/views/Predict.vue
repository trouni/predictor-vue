<template>
  <PredictionSwiper :matches="missingPredictions" @remove="removeMatch" class="p-4" />
</template>

<script>
import PredictionSwiper from '@/components/PredictionSwiper'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { PredictionSwiper },

  mounted() {
    this.fetchMatches()
    this.$emit('init')
  },

  props: {
    allMatches: { type: Boolean, default: false },
  },

  watch: {
    missingPredictions(newValue) {
      if (!newValue.length) this.$router.push({ name: 'predictions' })
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
