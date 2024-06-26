<template>
  <div class="p-4 pb-20">
    <div v-if="userId" class="mb-12">
      <p @click="() => $router.go(-1)">
        <BaseIcon name="chevron-left" /> Back to Rankings
      </p>
      <p class="text-center text-xl font-normal m-3">Predictions made by</p>
      <LeaderboardRanking :userRankings="[user]" class="m-auto max-w-xs" />
    </div>
    <div v-else class="flex items-center justify-center my-8">
      <div
        v-if="missingPredictions.length"
        class="rounded-sm text-center py-4 px-8 shadow bg-white"
      >
        <p
          v-if="timeLeftForPrediction"
          class="text-2xl font-mono"
          :class="{ 'text-red-500': timeLeftForPrediction < 86400 * 1000 }"
        >
          {{ formatDuration(timeLeftForPrediction) }}
        </p>
        <p class="flex items-center justify-center text-center text-lg my-3">
          {{ pluralize(missingPredictions.length, 'match', 'matches') }} left to
          predict
        </p>
        <BaseButton class="uppercase text-center mb-2">
          <BaseLink :to="{ name: 'predict' }" class="md:text-lg p-3">
            <BaseIcon name="arrow-circle-right" class="mr-3" />Make your
            predictions
          </BaseLink>
        </BaseButton>
      </div>
      <div v-else class="flex flex-col items-center justify-center pb-8">
        <p class="flex items-center justify-center lg:text-center text-lg mb-5 gap-2 px-4 w-full md:w-auto leading-none">
          <BaseIcon name="circle-check" class="fa-2x" />
          <small>You've made predictions for all upcoming matches!</small>
        </p>
        <BaseButton class="uppercase text-center secondary small">
          <BaseLink :to="{ name: 'edit_predictions' }">
            <BaseIcon name="redo-alt" class="mr-3" />Update your predictions
          </BaseLink>
        </BaseButton>
      </div>
    </div>
    <div class="flex justify-around">
      <MatchTab
        v-for="tab in tabs"
        :key="tab"
        :text="tab"
        :selected="selectedTab == tab"
        @selectTabEvent="changeTab"
      />
    </div>
    <MatchesGrouping
      v-for="(group, index) in groupedMatches"
      :key="index"
      :matches="group.matches"
    />
  </div>
</template>

<script>
import MatchesGrouping from '@/components/MatchesGrouping'
import LeaderboardRanking from '@/components/LeaderboardRanking'
import MatchTab from '@/components/MatchTab'
import { mapGetters, mapActions } from 'vuex'
import { authComputed } from '@/store/helpers'
import { pluralize, formatDate, formatDuration } from '@/utils/helpers'
import groupBy from 'lodash/groupBy'

export default {
  name: 'Matches',

  components: { MatchesGrouping, LeaderboardRanking, MatchTab },

  props: {
    userId: {
      type: Number,
      required: false,
    },
  },

  async mounted() {
    if (this.userId) {
      this.user = await this.fetchUser({ userId: this.userId })
      // Removing 'UPCOMING' for other users' pages
      const upcomingIndex = this.tabs.indexOf('upcoming')
      this.tabs.splice(upcomingIndex, 1)
      this.selectedTab = this.tabs[0]
    }
    await this.fetchMatches({ userId: this.userId })
    if (Object.keys(this.ongoingMatches()[0].matches).length === 0) {
      // Removing 'ONGOING' tab because no ongoing games'
      const ongoingIndex = this.tabs.indexOf('ongoing')
      this.tabs.splice(ongoingIndex, 1)
      this.selectedTab = this.tabs[0]
    }
    this.$emit('init')
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
    missingPredictions() {
      return this.matches.filter(
        m => !('prediction' in m) && m.status === 'upcoming'
      )
    },
    groupedMatches() {
      if (this.selectedTab == 'past') {
        return this.pastMatches()
      } else if (this.selectedTab == 'ongoing') {
        return this.ongoingMatches()
      } else {
        return this.upcomingMatches()
      }
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
      return [
        {
          matches: groupBy(
            this.matches.filter(m => m.status === 'started'),
            m => formatDate(new Date(m.kickoffTime))
          ),
        },
      ]
    },
    pastMatches() {
      return [
        {
          matches: groupBy(
            this.matches
              .filter(m => m.status === 'finished')
              .sort(
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
            this.matches.filter(
              m => m.status === 'upcoming' && 'prediction' in m
            ),
            m => formatDate(new Date(m.kickoffTime))
          ),
        },
      ]
    },
    getTimeLeftForPrediction() {
      if (!this.missingPredictions.length) return null
      else {
        const nextMatch = this.missingPredictions.reduce((prev, curr) => {
            return new Date(prev.kickoffTime) < new Date(curr.kickoffTime) ? prev : curr
        })
        return Math.abs(new Date(nextMatch.kickoffTime) - new Date())
      }
    },
  },
}
</script>
