<template>
  <div v-if="leaderboards.length" class="mt-2">
    <!-- Multiple leaderboards: tab strip -->
    <div  class="flex overflow-x-auto hide-scrollbar px-5 gap-1">

      <button
        v-for="lb in leaderboards"
        :key="lb.id"
        @click="selectLeaderboard(lb.id)"
        class="flex-shrink-0 text-sm pb-3 px-2 mr-2 border-b-2 whitespace-nowrap transition-all duration-150 focus:outline-none"
        :style="isActive(lb.id)
          ? 'border-color: #fa5151; color: white; font-weight: 600'
          : 'border-color: transparent; color: rgba(255,255,255,0.38)'"
      >
        {{ lb.name }}
      </button>

      <!-- ＋ New leaderboard pill at the far end -->
      <BaseLink
        :to="{ name: 'new_leaderboard' }"
        class="flex-shrink-0 flex items-center gap-1 self-start mt-0.5 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80 whitespace-nowrap"
        style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.45)"
      >
        <BaseIcon name="plus" style="font-size: 0.6rem" />
        New
      </BaseLink>

    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LeaderboardSubHeader',

  computed: {
    ...mapGetters({
      leaderboards: 'leaderboards/leaderboards',
      currentLeaderboard: 'leaderboards/currentLeaderboard',
    }),
  },

  methods: {
    ...mapActions({
      selectLeaderboard: 'leaderboards/selectLeaderboard',
    }),
    isActive(id) {
      return this.currentLeaderboard && this.currentLeaderboard.id === id
    },
  },
}
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
