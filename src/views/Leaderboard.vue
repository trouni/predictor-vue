<!-- FYI: Not being used currently -->
<template>
  <div>
    <LeaderboardGroupSelector />
    <LeaderboardGroup
      v-if="displayGroup"
      :leaderboard="leaderboard"
      :group="displayGroup"
    />
    <LeaderboardRanking v-else :leaderboard="leaderboard" />
  </div>
</template>

<script>
import LeaderboardGroupSelector from '@/components/LeaderboardGroupSelector'
import LeaderboardGroup from '@/components/LeaderboardGroup'
import LeaderboardRanking from '@/components/LeaderboardRanking'

export default {
  components: {
    LeaderboardGroupSelector,
    LeaderboardGroup,
    LeaderboardRanking,
  },

  data() {
    return {
      displayGroup: null,
      leaderboard: {}, // TODO: Fetch leaderboard
    }
  },
}
</script>
