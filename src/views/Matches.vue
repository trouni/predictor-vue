<template>
  <div>
    <PredictionSwiper :cards="matches" />
  </div>
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
    userId: {
      type: Number,
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

  methods: {
    async fetchMatches() {
      this.loading = true
      const filters = {}
      if (this.userId) filters['userId'] = this.userId
      if (this.competitionId) filters['competitionId'] = this.competitionId
      this.matches = await this.$store.dispatch('matches/fetchMatches', filters)
      this.loading = false
    },
  },
}
</script>
