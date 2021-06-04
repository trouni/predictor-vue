<template>
  <div class="flex items-center justify-between sm:justify-center">
    <div class="mx-5">
      <BaseIcon
        name="angle-left"
        v-if="previousLeaderboard"
        @click.native="selectLeaderboard(previousLeaderboard.id)"
      />
    </div>
    <h3 v-if="leaderboard"> {{ leaderboard.name }} </h3>
    <div class="mx-5">
      <BaseIcon
        name="angle-right"
        v-if="nextLeaderboard"
        @click.native="selectLeaderboard(nextLeaderboard.id)"
      />
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
  margin: ($spacer / 2);
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
