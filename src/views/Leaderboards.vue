<template>
  <div>
    <LeaderboardCard
      v-for="leaderboard in leaderboards"
      :key="leaderboard.id"
      :leaderboard="leaderboard"
    />
  </div>
</template>

<script>
import LeaderboardCard from '@/components/LeaderboardCard'

export default {
  components: { LeaderboardCard },

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
    this.fetchLeaderboards()
  },

  data() {
    return {
      loading: false,
      leaderboards: [],
    }
  },

  methods: {
    async fetchLeaderboards() {
      this.loading = true
      this.leaderboards = await this.$store.dispatch(
        'leaderboards/fetchLeaderboards',
        this.competitionId
      )
      this.loading = false
    },
  },
}
</script>
