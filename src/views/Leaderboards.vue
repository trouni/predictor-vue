<template>
  <div>
    <ShareButton :password="leaderboard.password" />
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
import ShareButton from '@/components/ShareButton'

export default {
  components: { LeaderboardCard, ShareButton },

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
      leaderboard: this.$store.getters['leaderboards/currentLeaderboard'],
      leaderboardId: this.$store.getters['leaderboards/currentLeaderboardId'],
    }
  },

  methods: {
    async fetchLeaderboards() {
      this.loading = true
      this.leaderboards = await this.$store.dispatch(
        'leaderboards/fetchLeaderboards',
        this.competitionId
      )
      this.leaderboardId = this.$store.getters[
        'leaderboards/currentLeaderboardId'
      ]
      this.leaderboard = this.$store.getters['leaderboards/currentLeaderboard']
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
