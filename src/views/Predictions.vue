<template>
  <div class="pb-24">
    <!-- ─── Viewing another user's predictions ─── -->
    <div v-if="userId" class="px-4 pt-4 mb-6">
      <button
        @click="$router.go(-1)"
        class="flex items-center gap-1.5 text-sm font-medium mb-6 transition-opacity hover:opacity-70 focus:outline-none"
        style="color: rgba(255, 255, 255, 0.7)"
      >
        <BaseIcon name="chevron-left" />
        Back to Rankings
      </button>
      <p
        class="text-center font-medium mb-3"
        style="color: rgba(255, 255, 255, 0.6)"
      >
        Predictions made by
      </p>
      <LeaderboardRanking :userRankings="[user]" class="m-auto max-w-xs" />
    </div>

    <!-- ─── Current user: inline predict flow or all-done state ─── -->
    <div v-else class="px-4 pt-4 mb-6">
      <div
        v-if="pendingMatches.length"
        class="predict-spotlight rounded-2xl p-4"
      >
        <PredictCard
          :matches="pendingMatches"
          :remove-on-save="true"
          @predicted="removeFromPending"
        />
      </div>
    </div>

    <!-- ─── Tabs ─── -->
    <div class="px-4 mb-1">
      <div
        class="flex rounded-2xl p-1 gap-1"
        style="background: rgba(0, 0, 0, 0.15)"
      >
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="changeTab(tab)"
          class="flex-1 py-2 px-3 rounded-xl text-sm font-semibold capitalize transition-all duration-200 focus:outline-none"
          :class="
            selectedTab === tab
              ? 'bg-tab text-white shadow-sm'
              : 'text-white/60 hover:text-white/80'
          "
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- ─── Group filter chips ─── -->
    <div
      v-if="groupFilters.length > 1"
      class="px-4 mt-2 mb-1 overflow-x-auto scrollbar-hide"
    >
      <div class="flex gap-2 w-max">
        <button
          v-for="filter in groupFilters"
          :key="filter.key === null ? '__all__' : filter.key"
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

    <!-- ─── Match list ─── -->
    <MatchesGrouping
      v-for="(group, index) in groupedMatches"
      :key="index"
      :matches="group.matches"
    />

    <!-- ─── No past matches placeholder ─── -->
    <EmptyState
      v-if="selectedTab === 'upcoming' && !hasUpcomingPredictions"
      icon="bullseye"
      title="No predictions yet"
      subtitle="Your predictions will appear here."
    />

    <!-- ─── No past matches placeholder ─── -->
    <EmptyState
      v-if="selectedTab === 'past' && !hasPastMatches"
      icon="stopwatch"
      title="No results yet"
      subtitle="Completed matches will appear here once the whistle blows."
    />
  </div>
</template>

<script>
import EmptyState from '@/components/EmptyState'
import MatchesGrouping from '@/components/MatchesGrouping'
import LeaderboardRanking from '@/components/LeaderboardRanking'
import PredictCard from '@/components/PredictCard'
import { mapGetters, mapActions } from 'vuex'
import { authComputed } from '@/store/helpers'
import {
  formatDate,
  buildGroupFilters,
  applyGroupFilter,
} from '@/utils/helpers'
import groupBy from 'lodash/groupBy'

export default {
  name: 'Predictions',

  components: { EmptyState, MatchesGrouping, LeaderboardRanking, PredictCard },

  props: {
    userId: {
      type: Number,
      required: false,
    },
  },

  data() {
    return {
      loading: false,
      user: {
        userId: null,
        name: null,
        points: null,
      },
      selectedTab: 'ongoing',
      tabs: ['ongoing', 'upcoming', 'past'],
      selectedGroup: null,
      pendingSnapshot: null,
    }
  },

  async mounted() {
    if (this.userId) {
      this.user = await this.fetchUser({ userId: this.userId })
      const upcomingIndex = this.tabs.indexOf('upcoming')
      this.tabs.splice(upcomingIndex, 1)
      this.selectedTab = this.tabs[0]
    }
    const matches = await this.fetchMatches({ userId: this.userId })
    if (!this.userId) {
      this.pendingSnapshot = matches
        .filter(m => m.status === 'upcoming' && !('prediction' in m))
        .sort((a, b) => new Date(a.kickoffTime) - new Date(b.kickoffTime))
    }
    if (Object.keys(this.ongoingMatches()[0].matches).length === 0) {
      const ongoingIndex = this.tabs.indexOf('ongoing')
      this.tabs.splice(ongoingIndex, 1)
      this.selectedTab = this.tabs[0]
    }
    this.$emit('init')
  },

  watch: {
    matches(newValue) {
      if (newValue.length) this.$emit('init')
    },
  },

  computed: {
    ...authComputed,
    ...mapGetters({ matches: 'matches/matches' }),
    pendingMatches() {
      if (this.pendingSnapshot !== null) return this.pendingSnapshot
      return this.matches
        .filter(m => m.status === 'upcoming' && !('prediction' in m))
        .sort((a, b) => new Date(a.kickoffTime) - new Date(b.kickoffTime))
    },
    hasPastMatches() {
      return this.matches.some(m => m.status === 'finished')
    },
    hasUpcomingPredictions() {
      return this.matches.some(
        m => m.status === 'upcoming' && 'prediction' in m
      )
    },
    groupedMatches() {
      if (this.selectedTab === 'past') return this.pastMatches()
      if (this.selectedTab === 'ongoing') return this.ongoingMatches()
      return this.upcomingMatches()
    },
    tabMatches() {
      if (this.selectedTab === 'ongoing')
        return this.matches.filter(m => m.status === 'started')
      if (this.selectedTab === 'past')
        return this.matches.filter(m => m.status === 'finished')
      return this.matches.filter(
        m => m.status === 'upcoming' && 'prediction' in m
      )
    },
    groupFilters() {
      return buildGroupFilters(this.tabMatches)
    },
  },

  methods: {
    ...mapActions({
      fetchMatches: 'matches/fetchMatches',
      fetchUser: 'users/fetchUser',
    }),
    removeFromPending(matchId) {
      const source = this.pendingSnapshot ?? this.pendingMatches
      this.pendingSnapshot = source.filter(m => m.id !== matchId)
    },
    changeTab(tabName) {
      this.selectedTab = tabName
      this.selectedGroup = null
    },
    ongoingMatches() {
      return [
        {
          matches: groupBy(
            applyGroupFilter(
              this.matches.filter(m => m.status === 'started'),
              this.selectedGroup
            ).sort(
              (m1, m2) => new Date(m1.kickoffTime) - new Date(m2.kickoffTime)
            ),
            m => formatDate(new Date(m.kickoffTime))
          ),
        },
      ]
    },
    pastMatches() {
      return [
        {
          matches: groupBy(
            applyGroupFilter(
              this.matches.filter(m => m.status === 'finished'),
              this.selectedGroup
            ).sort(
              (m1, m2) => new Date(m2.kickoffTime) - new Date(m1.kickoffTime)
            ),
            m => formatDate(new Date(m.kickoffTime))
          ),
        },
      ]
    },
    upcomingMatches() {
      return [
        {
          matches: groupBy(
            applyGroupFilter(
              this.matches.filter(
                m => m.status === 'upcoming' && 'prediction' in m
              ),
              this.selectedGroup
            ).sort(
              (m1, m2) => new Date(m1.kickoffTime) - new Date(m2.kickoffTime)
            ),
            m => formatDate(new Date(m.kickoffTime))
          ),
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.bg-tab {
  background-color: rgba(255, 255, 255, 0.2);
}
.chip-active {
  background-color: rgba(255, 255, 255, 0.18);
}
.chip-inactive {
  background-color: rgba(255, 255, 255, 0.06);
}
.predict-spotlight {
  border: 1.5px solid rgba(12, 245, 116, 0.45);
  box-shadow: 0 0 24px rgba(12, 245, 116, 0.2),
    0 0 60px rgba(12, 245, 116, 0.08);
  background: rgba(12, 245, 116, 0.04);
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
