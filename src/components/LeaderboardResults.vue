<template>
  <div>
    <!-- ─── Group filter chips ─── -->
    <div v-if="groupFilters.length > 1" class="px-4 mb-1 overflow-x-auto scrollbar-hide">
      <div class="flex gap-2 w-max">
        <button
          v-for="filter in groupFilters"
          :key="filter.key"
          @click="selectedGroup = filter.key"
          class="py-1 px-3 rounded-full text-xs font-semibold transition-all duration-200 focus:outline-none whitespace-nowrap"
          :class="selectedGroup === filter.key
            ? 'text-white chip-active'
            : 'text-white/50 chip-inactive'"
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
      const roundLabel = n => {
        if (n >= 7) return 'Final'
        if (n === 6) return '3rd Place'
        if (n === 5) return 'Semi-Final'
        if (n === 4) return 'Quarter-Final'
        if (n === 3) return 'Round of 16'
        if (n === 2) return 'Round of 32'
        return `Round ${n}`
      }
      const seen = new Map()
      this.resultMatches.forEach(m => {
        if (m.groupId && !seen.has(`g:${m.groupId}`))
          seen.set(`g:${m.groupId}`, { key: `g:${m.groupId}`, label: m.groupName })
        else if (!m.groupId && m.roundNumber && !seen.has(`r:${m.roundNumber}`))
          seen.set(`r:${m.roundNumber}`, { key: `r:${m.roundNumber}`, label: roundLabel(m.roundNumber) })
      })
      if (seen.size <= 1) return []
      const groups = [...seen.values()].filter(f => f.key.startsWith('g:')).sort((a, b) => a.label.localeCompare(b.label))
      const rounds = [...seen.values()].filter(f => f.key.startsWith('r:')).sort((a, b) => Number(a.key.slice(2)) - Number(b.key.slice(2)))
      return [{ key: null, label: 'All' }, ...groups, ...rounds]
    },
    matchesWithResults() {
      return groupBy(this.applyGroupFilter(this.resultMatches), m => formatDate(new Date(m.kickoffTime)))
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

  methods: {
    applyGroupFilter(matches) {
      if (!this.selectedGroup) return matches
      if (this.selectedGroup.startsWith('g:')) {
        const id = this.selectedGroup.slice(2)
        return matches.filter(m => String(m.groupId) === id)
      }
      if (this.selectedGroup.startsWith('r:')) {
        const num = Number(this.selectedGroup.slice(2))
        return matches.filter(m => !m.groupId && m.roundNumber === num)
      }
      return matches
    },
  },
}
</script>


<style lang="scss" scoped>
@import "@/styles";
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
  &::-webkit-scrollbar { display: none; }
}
</style>
