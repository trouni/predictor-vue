<template>
  <div>
    <MatchesGrouping
      :matches="matchesWithResults"
      :selectable="false"
      :predictions="predictions"
      :results="true"
    />
    <div
      v-if="!matchesWithResults.length"
      class="rounded-sm text-center py-4 px-8 results-placeholder"
    >
      <p class="flex items-center flex-col justify-center text-center text-lg my-3">
        <BaseIcon name="stopwatch" class="fa-2x" />
        <span class="pt-3">No matches completed yet.</span>
      </p>
    </div>
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


<style lang="scss" scoped>
@import "@/styles";
.results-placeholder p {
  color: $purple;
}
</style>
