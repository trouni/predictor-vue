<template>
  <div>
    <LeaderboardRanking
      v-for="(user, index) in sortedUsers"
      :key="user.id"
      :user="user"
      :position="index"
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
    sortedUsers: function () {
      function compare(a, b) {
        if (a.points < b.points) return 1
        if (a.points > b.points) return -1
        return 0
      }
      return this.leaderboard.users.slice().sort(compare)
    },
  },
}
</script>
