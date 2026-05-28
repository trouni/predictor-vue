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
        v-if="missingPredictions.length"
        class="rounded-2xl overflow-hidden shadow-xl"
        style="background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.78))"
      >
        <div class="flex items-center gap-4 px-5 py-4">
          <!-- Icon / count badge -->
          <div
            class="flex-shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white shadow-md"
            style="background: linear-gradient(135deg, #fa5151, #c0392b)"
          >
            <span class="text-2xl font-black leading-none">{{ missingPredictions.length }}</span>
            <span class="text-xs font-medium opacity-80 leading-none mt-0.5">left</span>
          </div>

          <!-- Text block -->
          <div class="flex-1 min-w-0">
            <p class="font-bold text-gray-800 text-base leading-tight">
              {{ pluralize(missingPredictions.length, 'match', 'matches') }} to predict
            </p>
            <p
              v-if="timeLeftForPrediction"
              class="text-sm font-mono font-semibold mt-0.5"
              :class="timeLeftForPrediction < 86400 * 1000 ? 'text-red-500' : 'text-gray-500'"
            >
              {{ formatDuration(timeLeftForPrediction) }} until next kickoff
            </p>
          </div>

          <!-- CTA -->
          <BaseLink
            :to="{ name: 'predict' }"
            class="flex-shrink-0 flex items-center gap-1.5 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-opacity hover:opacity-90"
            style="background: linear-gradient(135deg, #fa5151, #c0392b)"
          >
            Predict
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
            ? 'bg-white text-gray-800 shadow-sm'
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
    <div v-if="selectedTab === 'past' && !hasPastMatches" class="rounded-sm text-center py-4 px-8 results-placeholder">
      <p class="flex items-center flex-col justify-center text-center text-lg my-3 text-white/60">
        <BaseIcon name="stopwatch" class="fa-2x" />
        <span class="pt-3">No matches completed yet.</span>
      </p>
    </div>

  </div>
</template>

<script>
import MatchesGrouping from '@/components/MatchesGrouping'
import LeaderboardRanking from '@/components/LeaderboardRanking'
import { mapGetters, mapActions } from 'vuex'
import { authComputed } from '@/store/helpers'
import { pluralize, formatDate, formatDuration } from '@/utils/helpers'
import groupBy from 'lodash/groupBy'

export default {
  name: 'Predictions',

  components: { MatchesGrouping, LeaderboardRanking },

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
    missingPredictions() {
      return this.matches.filter(
        m => !('prediction' in m) && m.status === 'upcoming'
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
          this.matches.filter(m => m.status === 'started'),
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
          this.matches.filter(m => m.status === 'upcoming' && 'prediction' in m),
          m => formatDate(new Date(m.kickoffTime))
        ),
      }]
    },
    getTimeLeftForPrediction() {
      if (!this.missingPredictions.length) return null
      const nextMatch = this.missingPredictions.reduce((prev, curr) =>
        new Date(prev.kickoffTime) < new Date(curr.kickoffTime) ? prev : curr
      )
      return Math.abs(new Date(nextMatch.kickoffTime) - new Date())
    },
  },
}
</script>
