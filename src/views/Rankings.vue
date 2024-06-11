<template>
  <SnapNavigationLayout
    :items="leaderboards"
    ref="snapNav"
    @change-item="handleChangeItem"
  >
    <template v-slot:item="{ item: leaderboard }">
      <LeaderboardRankingsCard
        :leaderboard="leaderboard"
        :key="leaderboard.id"
      />
    </template>
  </SnapNavigationLayout>
</template>

<script>
import LeaderboardRankingsCard from '@/components/LeaderboardRankingsCard'
import SnapNavigationLayout from '@/views/layouts/SnapNavigationLayout.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { LeaderboardRankingsCard, SnapNavigationLayout },

  props: {
    userId: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      isInitialLoad: true,
    }
  },
  async mounted() {
    if (this.currentLeaderboard) this.$emit('init')
    await this.fetchLeaderboards()
    const index = this.leaderboards.findIndex(l => l.id === this.currentLeaderboard.id)
    // sets where the currentLeaderboard is
    this.currentIndex = index
    this.$emit('init')
    this.$refs.snapNav.goToPage(index)
  },

  computed: {
    ...mapGetters({
      currentLeaderboard: 'leaderboards/currentLeaderboard',
      leaderboards: 'leaderboards/leaderboards',
    }),
  },
  watch: {
    currentLeaderboard(leaderboard) {
      const index = this.leaderboards.findIndex(l => l.id === leaderboard.id)
      this.$refs.snapNav.goToPage(index)
    },
  },
  methods: {
    ...mapActions({
      selectLeaderboard: 'leaderboards/selectLeaderboard',
      fetchLeaderboards: 'leaderboards/fetchLeaderboards',
      joinLeaderboard: 'leaderboards/joinLeaderboard',
    }),
    handleChangeItem(index) {
      if (this.currentIndex === index) {
        // says it's done loading when the change index hits the currentLeaderboard index
        this.isInitialLoad = false
      }
      if (!this.isInitialLoad) {
        // updates current leaderboard when not loading the page
        this.changeLeaderboard(index)
      }
    },
    changeLeaderboard(index) {
      this.selectLeaderboard(this.leaderboards[index].id)
    },
  },
}
</script>
