<template>
  <div>
    <LeaderboardRanking
      v-for="(user, index) in leaderboard.users"
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
}
</script>
