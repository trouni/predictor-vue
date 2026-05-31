<template>
  <div class="flex flex-col pb-24">

    <!-- Results content -->
    <div class="flex-1 pt-4">
      <transition name="results-fade" mode="out-in">
        <LeaderboardResults
          v-if="currentLeaderboard"
          :key="currentLeaderboard.id"
          :leaderboard="currentLeaderboard"
        />
        <div v-else class="flex justify-center py-16">
          <BaseSpinner />
        </div>
      </transition>
    </div>

  </div>
</template>

<script>
import LeaderboardResults from '@/components/LeaderboardResults'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Results',

  components: { LeaderboardResults },

  async mounted() {
    if (this.currentLeaderboard) this.$emit('init')
    await this.fetchLeaderboards()
    await this.fetchMatches()
    this.$emit('init')
  },

  computed: {
    ...mapGetters({
      currentLeaderboard: 'leaderboards/currentLeaderboard',
      leaderboards: 'leaderboards/leaderboards',
    }),
  },

  methods: {
    ...mapActions({
      selectLeaderboard: 'leaderboards/selectLeaderboard',
      fetchLeaderboards: 'leaderboards/fetchLeaderboards',
      fetchMatches: 'matches/fetchMatches',
    }),
  },
}
</script>

<style scoped>
.results-fade-enter-active,
.results-fade-leave-active {
  transition: opacity 0.2s ease;
}
.results-fade-enter,
.results-fade-leave-to {
  opacity: 0;
}
</style>
