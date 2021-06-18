<template>
  <div>
    <LeaderboardRanking
      v-for="(user, index) in rankedUsers"
      :key="user.id"
      :user="user"
      :position="user.rank"
      :link-predictions="true"
      :class="{ tie: index && user.rank === rankedUsers[index - 1].rank }"
    />
  </div>
</template>

<script>
import LeaderboardRanking from '@/components/LeaderboardRanking'
import uniq from 'lodash/uniq'

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
    uniqScores() {
      return uniq(this.sortedUsers.map(u => u.points))
    },
    sortedUsers: function () {
      return this.leaderboard.users.slice().sort((a, b) => b.points - a.points)
    },
  },
}
</script>
