<template>
  <div>
    <!-- ─── Group filter chips ─── -->
    <div
      v-if="groupFilters.length > 1"
      class="px-4 mb-1 overflow-x-auto scrollbar-hide"
    >
      <div class="flex gap-2 w-max">
        <button
          v-for="filter in groupFilters"
          :key="filter.key"
          @click="selectedGroup = filter.key"
          class="py-1 px-3 rounded-full text-xs font-semibold transition-all duration-200 focus:outline-none whitespace-nowrap"
          :class="
            selectedGroup === filter.key
              ? 'text-white chip-active'
              : 'text-white/50 chip-inactive'
          "
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

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
import {
  formatDate,
  buildGroupFilters,
  applyGroupFilter,
} from '@/utils/helpers'
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

  data() {
    return {
      selectedGroup: null,
    }
  },

  computed: {
    ...mapGetters({
      matches: 'matches/matches',
      currentUser: 'auth/currentUser',
    }),
    resultMatches() {
      return this.matches
        .filter(m => m.status === 'finished' || m.status === 'started')
        .sort((m1, m2) => new Date(m2.kickoffTime) - new Date(m1.kickoffTime))
    },
    groupFilters() {
      return buildGroupFilters(this.resultMatches)
    },
    matchesWithResults() {
      return groupBy(
        applyGroupFilter(this.resultMatches, this.selectedGroup),
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
                .map(userId =>
                  userId === this.currentUser.id
                    ? this.rankedUsers.find(u => u.userId === userId)
                    : this.topUsers.find(u => u.userId === userId)
                )
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

  methods: {},
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.results-placeholder p {
  color: rgba(255, 255, 255, 0.38);
}
.chip-active {
  background-color: rgba(255, 255, 255, 0.18);
}
.chip-inactive {
  background-color: rgba(255, 255, 255, 0.06);
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
