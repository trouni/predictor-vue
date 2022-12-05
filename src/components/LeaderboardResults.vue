<template>
  <div>
    <MatchesGrouping
      :matches="matchesWithResults"
      :selectable="false"
      :predictions="predictions"
      :results="true"
    />
  </div>
</template>

<script>
import groupBy from 'lodash/groupBy'
import { formatDate } from '@/utils/helpers'
import { mapGetters } from 'vuex'
import MatchesGrouping from '@/components/MatchesGrouping'

export default {
  components: { MatchesGrouping },

  props: {
    leaderboard: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters({ matches: 'matches/matches' }),
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
              results[choice] = this.leaderboard.results[match.id][choice].map(
                userId => {
                  return this.leaderboard.users.find(u => u.userId === userId)
                }
              )
            }
          )
          predictions[match.id] = results
        })
      })
      return predictions
    },
  },
}
</script>
