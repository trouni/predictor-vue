<template>
  <div class="flex items-center justify-between sm:justify-center">
    <div class="px-5" @click="selectLeaderboard(previousLeaderboard.id)">
      <BaseIcon name="angle-left" v-if="previousLeaderboard" />
    </div>
    <h3 v-if="leaderboard"> {{ leaderboard.name }} </h3>
    <div class="px-5" @click="selectLeaderboard(nextLeaderboard.id)">
      <BaseIcon name="angle-right" v-if="nextLeaderboard" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  mounted() {
    window.addEventListener('keyup', this.keyboardNav)
  },

  destroyed() {
    window.removeEventListener('keyup', this.keyboardNav)
  },

  methods: {
    ...mapActions({
      selectLeaderboard: 'leaderboards/selectLeaderboard',
    }),
    onSwipeLeft() {
      this.selectLeaderboard(this.nextLeaderboard?.id)
    },
    onSwipeRight() {
      this.selectLeaderboard(this.previousLeaderboard?.id)
    },
  },

  computed: {
    ...mapGetters({
      leaderboard: 'leaderboards/currentLeaderboard',
      previousLeaderboard: 'leaderboards/previousLeaderboard',
      nextLeaderboard: 'leaderboards/nextLeaderboard',
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
h3 {
  margin: calc($spacer / 2);
  color: $white;
  font-weight: lighter;
}
.fa-angle-left:hover {
  cursor: pointer;
}
.fa-angle-right:hover {
  cursor: pointer;
}
</style>
