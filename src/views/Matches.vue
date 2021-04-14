<template>
  <div>
    <h1>Matches</h1>
    <p v-if="competitionId">Competition {{ competitionId }}</p>
    <p v-if="userId">User {{ userId }}</p>
    <BaseObjectPreview
      v-for="match in matches"
      :key="match.id"
      :object="matches"
    />
  </div>
</template>

<script>
import store from '@/store'

export default {
  props: {
    competitionId: {
      type: Number,
      default: null,
      required: false,
    },
    userId: {
      type: Number,
      required: true,
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
      const filters = { userId: this.userId }
      if (this.competitionId) filters['competitionId'] = this.competitionId
      this.matches = await store.dispatch('matches/fetchMatches', filters)
      this.loading = false
    },
  },
}
</script>
