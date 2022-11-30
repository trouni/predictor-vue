<template>
  <SnapNavigationLayout
    :items="leaderboards"
    ref="snapNav"
    @change-item="changeLeaderboard"
    watched-tutorial-state-key="watchedResultsTutorial"
  >
    <template v-slot:item="{ item: leaderboard }"> 
      <LeaderboardResults :leaderboard="leaderboard" :key="leaderboard.id" />
    </template>
  </SnapNavigationLayout>
</template>

<script>
import LeaderboardResults from '@/components/LeaderboardResults'
import SnapNavigationLayout from '@/views/layouts/SnapNavigationLayout.vue'
import { mapGetters, mapActions } from 'vuex'
// mapGetters is used to import Getters from your store into your component
// There are also similar mapState, mapActions, mapMutations methods.

export default {
  components: { LeaderboardResults, SnapNavigationLayout },

  props: {
    userId: {
      type: Number,
      required: false,
    },
  },

  async mounted() {
    if (this.currentLeaderboard) this.$emit('init')

    await this.fetchLeaderboards()
    this.$emit('init')
  },

  computed: {
    ...mapGetters({
      currentLeaderboard: 'leaderboards/currentLeaderboard',
      leaderboards: 'leaderboards/leaderboards',
    }),
  },

  watch: {
    // This is a watcher that will fire when the leaderboard changes. We want to scroll to the
    // leaderboard that is currently selected.
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
    changeLeaderboard(index) {
      this.selectLeaderboard(this.leaderboards[index].id)
    },
  },
}
</script>
