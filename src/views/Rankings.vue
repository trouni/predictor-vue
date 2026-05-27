<template>
  <div class="flex flex-col pb-24">

    <!-- Rankings content -->
    <div class="flex-1 px-4 pt-4">
      <transition name="leaderboard-fade" mode="out-in">
        <LeaderboardRankingsCard
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
import LeaderboardRankingsCard from '@/components/LeaderboardRankingsCard'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Rankings',

  components: { LeaderboardRankingsCard },

  async mounted() {
    if (this.currentLeaderboard) this.$emit('init')
    await this.fetchLeaderboards()
    this.$emit('init')
  },

  computed: {
    ...mapGetters({
      currentLeaderboard: 'leaderboards/currentLeaderboard',
    }),
  },

  methods: {
    ...mapActions({
      fetchLeaderboards: 'leaderboards/fetchLeaderboards',
    }),
  },
}
</script>

<style scoped>
.leaderboard-fade-enter-active,
.leaderboard-fade-leave-active {
  transition: opacity 0.2s ease;
}
.leaderboard-fade-enter,
.leaderboard-fade-leave-to {
  opacity: 0;
}
</style>
