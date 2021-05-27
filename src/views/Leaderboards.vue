<template>
  <div>
    <LeaderboardCard
      :key="leaderboards[0].id"
      :leaderboard="leaderboards[0]"
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

<style lang="scss" scoped>
@import '@/styles';
.placeholder-text {
  color: $purple;
  text-align: center;
}
</style>
