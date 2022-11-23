<template>
  <div>
    <LeaderboardRanking
      v-for="{ position, points } in ranks"
      :key="position"
      :users="rankedUsers.filter(user => user.rank === position)"
      :position="position"
      :link-predictions="true"
      :points="points"
      class="mt-1"
    />
  </div>
</template>

<script>
import LeaderboardRanking from '@/components/LeaderboardRanking'

export default {
  components: { LeaderboardRanking },

  props: {
    leaderboard: {
      type: Object,
      required: true,
    },
  },
  computed: {
    rankedUsers() {
      return this.sortedUsers.map(u => {
        u.rank = this.sortedUsers.findIndex(usr => u.points === usr.points) + 1
        return u
      })
    },
    ranks() {
      return this.rankedUsers.reduce((accumulator, u) => {
        if (!accumulator.find(rank => rank.position === u.rank)) {
          accumulator.push({ position: u.rank, points: u.points })
        }
        return accumulator
      }, [])
    },
    sortedUsers: function () {
      return this.leaderboard.users.slice().sort((a, b) => b.points - a.points)
    },
  },
}
</script>
