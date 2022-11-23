<template>
  <div>
    <LeaderboardResultsCard
      :key="leaderboard.id"
      :leaderboard="leaderboard"
      v-if="leaderboard"
    />
    <p v-else class="placeholder-text">
      Join or create a leaderboard to get started!
    </p>
    <LeaderboardActions :leaderboard="leaderboard" />
  </div>
</template>

<script>
import LeaderboardResultsCard from '@/components/LeaderboardResultsCard'
import LeaderboardActions from '@/components/LeaderboardActions'
import { mapGetters, mapActions } from 'vuex'
// mapGetters is used to import Getters from your store into your component
// There are also similar mapState, mapActions, mapMutations methods.

export default {
  components: { LeaderboardResultsCard, LeaderboardActions },

  props: {
    userId: {
      type: Number,
      required: false,
    },
  },

  async mounted() {
    if (this.leaderboard) this.$emit('init')

    await this.fetchLeaderboards()
    this.$emit('init')
  },

  // The state is managed from the store, we don't want to be reassigning these variables
  // directly in here (defeats the purpose of the store). Instead of declaring them in data (state)
  // for the component, we use computed properties.

  computed: {
    ...mapGetters({
      // This syncs the store getters to the component as computed properties. You never have to reassign
      // them within this component, any changes to them should happen at the store level.
      // We only need the current leaderboard in this component.
      leaderboard: 'leaderboards/currentLeaderboard',
    }),
  },

  methods: {
    ...mapActions({
      fetchLeaderboards: 'leaderboards/fetchLeaderboards',
      joinLeaderboard: 'leaderboards/joinLeaderboard',
    }),
  },
  data() {
    return {
      selectedTab: 'All',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.placeholder-text {
  color: $purple;
  text-align: center;
}
</style>
