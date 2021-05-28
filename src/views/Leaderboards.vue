<template>
  <div>
    <LeaderboardCard
      :key="leaderboard.id"
      :leaderboard="leaderboard"
      v-if="leaderboards.length > 0"
    />
    <p v-else class="placeholder-text">
      Join or create a leaderboard to get started!
    </p>
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
    leaderboardId: {
      type: Number,
    },
  },

  async mounted() {
    this.fetchLeaderboards()
  },

  data() {
    return {
      loading: false,
      leaderboards: [],
      leaderboard: null,
    }
  },

  methods: {
    async fetchLeaderboards() {
      this.loading = true
      this.leaderboards = await this.$store.dispatch(
        'leaderboards/fetchLeaderboards',
        this.competitionId
      )
      this.leaderboard = this.leaderboards.find(
        leaderboard => leaderboard.id === this.leaderboardId
      )
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.placeholder-text {
  color: $purple;
  text-align: center;
}
</style>
