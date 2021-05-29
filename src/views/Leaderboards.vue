<template>
  <div>
    <div class="flex justify-between px-2 pb-2 actions">
      <BaseLink :to="{ name: 'new_leaderboard' }">
        <BaseIcon name="plus" />
      </BaseLink>
      <ShareButton :password="leaderboard.password" />
    </div>
    <LeaderboardCard
      :key="leaderboard.id"
      :leaderboard="leaderboard"
      v-if="leaderboard"
    />
    <p v-else class="placeholder-text">
      Join or create a leaderboard to get started!
    </p>
  </div>
</template>

<script>
import LeaderboardCard from '@/components/LeaderboardCard'
import ShareButton from '@/components/ShareButton'
import { mapGetters, mapActions } from 'vuex'
// mapGetters is used to import Getters from your store into your component
// There are also similar mapState, mapActions, mapMutations methods.

export default {
  components: { LeaderboardCard, ShareButton },

  props: {
    competitionId: {
      type: Number,
      default: null,
      required: false,
    },
    userId: {
      type: Number,
      required: false,
    },
  },

  async mounted() {
    this.fetchLeaderboards(this.competitionId)
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
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.placeholder-text {
  color: $purple;
  text-align: center;
}
.actions {
  // color: $white;
  // position: absolute;
  // top: 0;
  // right: 0;
  // width: 100%;
}
</style>
