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
          photoKey: currentUser.photoKey || currentUser.photo_key,
          points: userRank ? userRank.points : '-',
          position: userRank ? userRank.rank : null,
        },
      ]"
      :points="userRank ? userRank.points : '-'"
      :position="userRank ? userRank.rank : null"
      :padding-start="true"
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
    sortedUsers: function () {
      return this.leaderboard.users.slice().sort((a, b) => b.points - a.points)
    },
    isCurrentUserRanked() {
      return this.rankedUsers.some(user => user.userId === this.currentUser.id && user.rank <= this.lastRank)
    },
    lastRank() {
      if (this.rankedUsers.length === 0) return 0

      if (
        this.leaderboard.rankingsTopN &&
        this.leaderboard.users.length >=  this.leaderboard.rankingsTopN
      ) {
        return this.rankedUsers[this.leaderboard.rankingsTopN].rank
      } else if (this.leaderboard.rankingsTopN) {
        return this.rankedUsers[ this.leaderboard.users.length - 1].rank
      } else {
        return this.rankedUsers[this.rankedUsers.length - 1].rank
      }
    },
    ranks() {
      return this.rankedUsers.reduce((accumulator, u) => {
        if (
          !accumulator.find(rank => rank.position === u.rank) &&
          u.rank <= this.lastRank
        ) {
          accumulator.push({ position: u.rank, points: u.points })
        }
        return accumulator
      }, [])
    },
    userRank() {
      return this.sortedUsers.find(rank => rank.userId === this.currentUser.id)
    },
  },
}
</script>
