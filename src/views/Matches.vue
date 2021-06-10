<template>
  <div class="pb-20">
    <div v-if="!viewingOwnMatches" class="mb-12">
      <p class="text-center text-xl font-normal m-3">Predictions made by</p>
      <LeaderboardRanking :user="user" class="m-auto max-w-xs" />
    </div>
    <div v-else class="flex justify-center items-center my-8">
      <BaseButton
        v-if="missingPredictions.length"
        class="uppercase text-center m-5"
      >
        <BaseLink :to="{ path: '/predictions' }">
          Make your predictions
        </BaseLink>
      </BaseButton>
      <BaseButton v-else class="uppercase text-center m-5">
        <BaseLink :to="{ path: '/predictions/edit' }">
          Update your predictions
        </BaseLink>
      </BaseButton>
    </div>
    <MatchesGrouping
      v-for="group in groupedMatches"
      :key="group.title"
      :title="group.title"
      :matches="group.matches"
    />
  </div>
</template>

<script>
import MatchesGrouping from '@/components/MatchesGrouping'
import LeaderboardRanking from '@/components/LeaderboardRanking'
import { mapGetters, mapActions } from 'vuex'
import { authComputed } from '@/store/helpers'
import { formatDate } from '@/utils/helpers'
import groupBy from 'lodash/groupBy'

export default {
  name: 'Matches',

  components: { MatchesGrouping, LeaderboardRanking },

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
    }
  },

  watch: {
    matches(newValue) {
      if (newValue.length) this.$emit('init')
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
      return [
        {
          title: 'Ongoing Matches',
          matches: groupBy(
            this.matches.filter(m => m.status === 'ongoing'),
            m => formatDate(new Date(m.kickoffTime))
          ),
        },
        {
          title: 'Upcoming Matches',
          matches: groupBy(
            this.matches.filter(
              m => m.status === 'upcoming' && 'prediction' in m
            ),
            m => formatDate(new Date(m.kickoffTime))
          ),
        },
        {
          title: 'Past Matches',
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
  },

  methods: {
    ...mapActions({
      fetchMatches: 'matches/fetchMatches',
      fetchUser: 'users/fetchUser',
    }),
  },
}
</script>
