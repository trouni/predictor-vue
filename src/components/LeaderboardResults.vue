<template>
  <div>
    <MatchesGrouping
      :matches="matchesWithResults"
      :selectable="false"
      :predictions="predictions"
      :results="true"
    />
    <EmptyState
      v-if="matchesEmpty"
      icon="stopwatch"
      title="No results yet"
      subtitle="Completed matches will appear here once the whistle blows."
    />
  </div>
</template>

<script>
import groupBy from 'lodash/groupBy'
import { formatDate } from '@/utils/helpers'
import { mapGetters } from 'vuex'
import MatchesGrouping from '@/components/MatchesGrouping'
import EmptyState from '@/components/EmptyState'

export default {
  components: { MatchesGrouping, EmptyState },

  props: {
    leaderboard: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters({
      matches: 'matches/matches',
      currentUser: 'auth/currentUser',
    }),
    matchesWithResults() {
      return groupBy(
        this.matches
          .filter(m => m.status === 'finished' || m.status === 'started')
          .sort(
            (m1, m2) => new Date(m2.kickoffTime) - new Date(m1.kickoffTime)
          ),
        m => formatDate(new Date(m.kickoffTime))
      )
    },
    predictions() {
      const predictions = {}
      Object.values(this.matchesWithResults).forEach(dayMatches => {
        dayMatches.forEach(match => {
          const results = {}
          Object.keys(this.leaderboard.results[match.id] ?? {}).forEach(
            choice => {
              results[choice] = this.leaderboard.results[match.id][choice]
                .map(userId => userId === this.currentUser.id ? this.rankedUsers.find(u => u.userId === userId) : this.topUsers.find(u => u.userId === userId))
                .filter(user => user !== undefined) // Filter out undefined values
            }
          )
          predictions[match.id] = results
        })
      })
      return predictions
    },
    sortedUsers: function () {
      return this.leaderboard.users.slice().sort((a, b) => b.points - a.points)
    },
    rankedUsers() {
      return this.sortedUsers.map(u => {
        u.rank = this.sortedUsers.findIndex(usr => u.points === usr.points) + 1
        return u
      })
    },
    topUsers() {
      if (this.leaderboard.rankingsTopN) {
        return this.rankedUsers.slice(0, this.leaderboard.rankingsTopN)
      }
      return this.rankedUsers
    },
    matchesEmpty() {
      return Object.keys(this.matchesWithResults).length === 0
    },
  },
}
</script>


<style lang="scss" scoped>
@import "@/styles";
.results-placeholder p {
  color: rgba(255, 255, 255, 0.38);
}
</style>
