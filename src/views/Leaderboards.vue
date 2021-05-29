<template>
  <div>
    <BaseIcon name="share" @click.native="copy()" />
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
    copy() {
      console.log('copy')
      const text =
        window.location.origin + '/v1/join/' + this.leaderboard.password
      console.log(text)
      const elem = document.createElement('textarea')
      elem.value = text
      document.body.appendChild(elem)
      elem.select()
      document.execCommand('copy')
      document.body.removeChild(elem)
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
