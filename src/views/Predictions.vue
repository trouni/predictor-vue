<template>
  <div class="pb-24">

    <!-- ─── Viewing another user's predictions ─── -->
    <div v-if="userId" class="px-4 pt-4 mb-6">
      <button
        @click="$router.go(-1)"
        class="flex items-center gap-1.5 text-sm font-medium mb-6 transition-opacity hover:opacity-70 focus:outline-none"
        style="color: rgba(255,255,255,0.7)"
      >
        <BaseIcon name="chevron-left" />
        Back to Rankings
      </button>
      <p class="text-center font-medium mb-3" style="color: rgba(255,255,255,0.6)">
        Predictions made by
      </p>
      <LeaderboardRanking :userRankings="[user]" class="m-auto max-w-xs" />
    </div>

    <!-- ─── Current user: action banner ─── -->
    <div v-else class="px-4 pt-4 mb-6">

      <!-- Has unpredicted matches -->
      <div
        v-if="nextMissingMatch"
        class="rounded-2xl overflow-hidden shadow-xl"
        style="background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.78))"
      >
        <div class="px-5 pt-4 pb-3">
          <div class="flex items-stretch justify-between gap-3">
            <div>
              <p
                class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5"
                >Up Next</p>
              <p class="font-bold text-gray-800 text-base leading-tight flex items-center">
                <TeamBadge options="h-10 w-10 mr-1 border-blue" :flag="nextMissingMatch.teamHome.badgeUrl" />
                vs
                <TeamBadge options="h-10 w-10 ml-1 border-blue" :flag="nextMissingMatch.teamAway.badgeUrl" />
              </p>
            </div>
            <div class="flex flex-col justify-between items-end">
              <span
                class="flex-shrink-0 text-xs font-bold text-white rounded-full px-2.5 py-1 shadow-sm"
                style="background: linear-gradient(135deg, #fa5151, #c0392b)"
              >
                {{ missingPredictions.length }} remaining
              </span>
              <p
                v-if="timeLeftForPrediction"
                class="text-sm font-normal"
                :class="
                  timeLeftForPrediction < 86400 * 1000
                    ? 'text-red-500'
                    : 'text-gray-500'
                "
              >
                {{ formatDuration(timeLeftForPrediction) }} till kickoff
              </p>
            </div>
          </div>

        </div>
        <div class="px-5 pb-4">
          <BaseLink
            :to="{ name: 'predict' }"
            class="flex w-full items-center justify-center gap-1.5 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-opacity hover:opacity-90"
            style="background: linear-gradient(135deg, #fa5151, #c0392b)"
          >
            Predict now
            <BaseIcon name="arrow-right" />
          </BaseLink>
        </div>
      </div>

      <!-- All predictions made -->
      <div
        v-else
        class="rounded-2xl px-5 py-4 flex items-center gap-4"
        style="background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.78))"
      >
        <div
          class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow"
          style="background: linear-gradient(135deg, #0cf574, #6690b7)"
        >
          <BaseIcon name="check" class="text-white fa-lg" />
        </div>
        <div class="flex-1">
          <p class="font-bold text-gray-800 text-base">All predictions in!</p>
          <p class="text-sm text-gray-500">You've predicted all upcoming matches.</p>
        </div>
        <BaseLink
          :to="{ name: 'edit_predictions' }"
          class="flex-shrink-0 text-xs font-semibold text-gray-500 border border-gray-300 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Edit
        </BaseLink>
      </div>

    </div>

    <!-- ─── Tabs ─── -->
    <div class="px-4 mb-1">
      <div
        class="flex rounded-2xl p-1 gap-1"
        style="background: rgba(0,0,0,0.15)"
      >
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="changeTab(tab)"
          class="flex-1 py-2 px-3 rounded-xl text-sm font-semibold capitalize transition-all duration-200 focus:outline-none"
          :class="selectedTab === tab
            ? 'bg-tab text-white shadow-sm'
            : 'text-white/60 hover:text-white/80'"
        >
          {{ tab }}
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
import TeamBadge from '@/components/TeamBadge'
import { mapGetters, mapActions } from 'vuex'
import { authComputed } from '@/store/helpers'
import { pluralize, formatDate, formatDuration } from '@/utils/helpers'
import groupBy from 'lodash/groupBy'

export default {
  name: 'Predictions',

  components: { EmptyState, MatchesGrouping, LeaderboardRanking, TeamBadge },

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
      timeLeftForPrediction: null,
    }
  },

  async mounted() {
    if (this.userId) {
      this.user = await this.fetchUser({ userId: this.userId })
      const upcomingIndex = this.tabs.indexOf('upcoming')
      this.tabs.splice(upcomingIndex, 1)
      this.selectedTab = this.tabs[0]
    }
    await this.fetchMatches({ userId: this.userId })
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
    timeLeftForPrediction: {
      handler(newValue) {
        if (newValue >= 0) {
          setTimeout(() => {
            this.timeLeftForPrediction = this.getTimeLeftForPrediction()
          }, 1000)
        }
      },
      immediate: true,
    },
  },

  computed: {
    ...authComputed,
    ...mapGetters({ matches: 'matches/matches' }),
    hasPastMatches() {
      return this.matches.some(m => m.status === 'finished')
    },
    hasUpcomingPredictions() {
      return this.matches.some(m => m.status === 'upcoming' && 'prediction' in m)
    },
    missingPredictions() {
      return this.matches.filter(
        m => !('prediction' in m) && m.status === 'upcoming'
      )
    },
    nextMissingMatch() {
      void this.timeLeftForPrediction
      const now = new Date()
      const upcoming = this.missingPredictions.filter(
        m => new Date(m.kickoffTime) > now
      )
      if (!upcoming.length) return null
      return upcoming.reduce((prev, curr) =>
        new Date(prev.kickoffTime) < new Date(curr.kickoffTime) ? prev : curr
      )
    },
    groupedMatches() {
      if (this.selectedTab === 'past') return this.pastMatches()
      if (this.selectedTab === 'ongoing') return this.ongoingMatches()
      return this.upcomingMatches()
    },
  },

  methods: {
    ...mapActions({
      fetchMatches: 'matches/fetchMatches',
      fetchUser: 'users/fetchUser',
    }),
    pluralize,
    formatDuration,
    changeTab(tabName) {
      this.selectedTab = tabName
    },
    ongoingMatches() {
      return [{
        matches: groupBy(
          this.matches
            .filter(m => m.status === 'started')
            .sort((m1, m2) => new Date(m1.kickoffTime) - new Date(m2.kickoffTime)),
          m => formatDate(new Date(m.kickoffTime))
        ),
      }]
    },
    pastMatches() {
      return [{
        matches: groupBy(
          this.matches
            .filter(m => m.status === 'finished')
            .sort((m1, m2) => new Date(m2.kickoffTime) - new Date(m1.kickoffTime)),
          m => formatDate(new Date(m.kickoffTime))
        ),
      }]
    },
    upcomingMatches() {
      return [{
        matches: groupBy(
          this.matches
            .filter(m => m.status === 'upcoming' && 'prediction' in m)
            .sort((m1, m2) => new Date(m1.kickoffTime) - new Date(m2.kickoffTime)),
          m => formatDate(new Date(m.kickoffTime))
        ),
      }]
    },
    getTimeLeftForPrediction() {
      const now = new Date()
      const upcoming = this.missingPredictions.filter(
        m => new Date(m.kickoffTime) > now
      )
      if (!upcoming.length) return null
      const nextMatch = upcoming.reduce((prev, curr) =>
        new Date(prev.kickoffTime) < new Date(curr.kickoffTime) ? prev : curr
      )
      return new Date(nextMatch.kickoffTime) - now
    },
  },
}
</script>

<style lang="scss" scoped>
.bg-tab {
  background-color: rgba(255, 255, 255, 0.2);
}
.border-blue {
  border-color: #6690b7;
}
</style>
