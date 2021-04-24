<template>
  <div>
    <h1>Matches</h1>
    <p v-if="competitionId">Competition {{ competitionId }}</p>
    <p v-if="userId">User {{ userId }}</p>
    <p>{{ matches }}</p>
  </div>
</template>

<script>
export default {
  props: {
    competitionId: {
      type: Number,
      default: null,
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
