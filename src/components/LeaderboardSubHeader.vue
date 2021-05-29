<template>
  <div class="d-flex justify-content">
    <div class="mx-5">
      <BaseIcon
        name="angle-left"
        v-if="availableLeft"
        @click.native="setSelectedLeaderboard(previousLeaderboard)"
      />
    </div>
    <h3> {{ leaderboard.name }} </h3>
    <div class="mx-5">
      <BaseIcon
        name="angle-right"
        v-if="availableRight"
        @click.native="setSelectedLeaderboard(nextLeaderboard)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async setSelectedLeaderboard(id) {
      this.$store.dispatch('leaderboards/selectLeaderboard', id)
    },
  },

  computed: {
    ...mapGetters({
      leaderboards: 'leaderboards/leaderboards',
      leaderboard: 'leaderboards/currentLeaderboard',
      leaderboardId: 'leaderboards/currentLeaderboardId',
    }),
    availableLeft() {
      return (
        this.leaderboards.length !== 1 &&
        this.leaderboards[0] !== this.leaderboard
      )
    },
    availableRight() {
      return (
        this.leaderboards.length !== 1 &&
        this.leaderboards[this.leaderboards.length - 1] !== this.leaderboard
      )
    },
    previousLeaderboard() {
      return this.leaderboards[this.leaderboards.indexOf(this.leaderboard) - 1]
        .id
    },
    nextLeaderboard() {
      return this.leaderboards[this.leaderboards.indexOf(this.leaderboard) + 1]
        .id
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.justify-content {
  justify-content: space-between;
}

.d-flex {
  display: flex;
  align-items: center;
}

.mx-5 {
  margin: 0 16px;
}

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

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) {
  .justify-content {
    justify-content: center;
  }
}
</style>
