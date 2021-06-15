<template>
  <div class="pb-20">
    <div v-if="!viewingOwnMatches" class="mb-12">
      <p class="text-center text-xl font-normal m-3">Predictions made by</p>
      <LeaderboardRanking :user="user" class="m-auto max-w-xs" />
    </div>
    <div v-else class="flex items-center justify-center my-8">
      <div
        v-if="missingPredictions.length"
        class="rounded-2xl text-center py-8 px-8 shadow bg-white"
      >
        <p class="flex items-center justify-center text-center text-lg mb-5">
          {{ pluralize(missingPredictions.length, 'match', 'matches') }} left to
          predict!
        </p>
        <BaseButton class="uppercase text-center">
          <BaseLink :to="{ path: '/predictions' }" class="md:text-lg p-3">
            <BaseIcon name="arrow-circle-right" class="mr-3" />Make your
            predictions
          </BaseLink>
        </BaseButton>
      </div>
      <div v-else class="rounded-2xl text-center py-8 px-8 shadow bg-white">
        <p class="flex items-center justify-center text-center text-lg mb-5">
          <span class="text-5xl">🥳</span> You've made predictions for all
          upcoming matches!
        </p>
        <BaseButton class="uppercase text-center">
          <BaseLink :to="{ path: '/predictions/edit' }" class="md:text-lg p-3">
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
import { pluralize, formatDate } from '@/utils/helpers'
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
    if (!this.viewingOwnMatches) {
      this.user = await this.fetchUser({ userId: this.userId })
    }
    await this.fetchMatches({ userId: this.userId })
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
      selectedTab: 'upcoming',
      tabs: ['ongoing', 'upcoming', 'past'],
    }
  },

  watch: {
    matches(newValue) {
      if (newValue.length) this.$emit('init')
      if (this.ongoingMatches.length > 0) console.log('ongoing games')
    },
  },

  computed: {
    ...authComputed,
    ...mapGetters({ matches: 'matches/matches' }),
    viewingOwnMatches() {
      return this.currentUser.userId === this.userId
    },
    missingPredictions() {
      return this.matches.filter(
        m => !('prediction' in m) && m.status === 'upcoming'
      )
    },
    groupedMatches() {
      if (this.selectedTab == 'past') {
        return this.pastMatches()
      } else if (this.selectedTab == 'ongoing') {
        const matches = this.ongoingMatches()
        if (matches.length === 0) {
          const tabIndex = this.tabs.indexOf('ongoing')
          this.tabs.splice(tabIndex, 1)
        }
        return matches
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
    changeTab(tabName) {
      this.selectedTab = tabName
    },
    ongoingMatches() {
      return [
        {
          // title: 'Ongoing Matches',
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
          // title: 'Past Matches',
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
          // title: 'Upcoming Matches',
          matches: groupBy(
            this.matches.filter(
              m => m.status === 'upcoming' && 'prediction' in m
            ),
            m => formatDate(new Date(m.kickoffTime))
          ),
        },
      ]
    },
  },
}
</script>
