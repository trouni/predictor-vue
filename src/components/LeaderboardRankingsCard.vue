<template>
  <div>
    <LeaderboardRanking
      v-for="{ position, points } in ranks"
      :key="position"
      :userRankings="rankedUsers.filter(user => user.rank === position)"
      :position="position"
      :link-predictions="true"
      :points="points"
      class="mt-1"
    />
    <!-- Placeholder for when the currentUser hasn't made any predictions -->
    <LeaderboardRanking
      v-if="!isCurrentUserRanked"
      :key="-1"
      :userRankings="[
        {
          id: currentUser.id,
          name: currentUser.name,
          userId: currentUser.id,
          points: '-',
        },
      ]"
      :position="'-'"
      :link-predictions="false"
      class="mt-1"
    />
    <LeaderboardActions :leaderboard="leaderboard" />
  </div>
</template>
<script>
import LeaderboardRanking from '@/components/LeaderboardRanking'
import LeaderboardActions from '@/components/LeaderboardActions'
import { mapGetters } from 'vuex'

export default {
  components: { LeaderboardRanking, LeaderboardActions },
  props: {
    leaderboard: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({ currentUser: 'auth/currentUser' }),
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
    isCurrentUserRanked() {
      return this.rankedUsers.some(user => user.userId === this.currentUser.id)
    }
  },
}
</script>
