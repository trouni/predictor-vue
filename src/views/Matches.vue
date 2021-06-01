<template>
  <div>
    <MatchCard
      v-for="match in matches"
      :key="match.id"
      :match="match"
      :selectable="match.status == 'upcoming'"
    />
  </div>
</template>

<script>
import MatchCard from '@/components/MatchCard'

export default {
  components: { MatchCard },

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
