<template>
  <div class="d-flex justify-content">
    <div class="mx-5">
      <BaseIcon
        name="angle-left"
        v-if="availableLeft()"
        @click.native="
          setSelectedLeaderboard(
            leaderboards[leaderboards.indexOf(leaderboard) - 1].id
          )
        "
      />
    </div>
    <h3> {{ leaderboard.name }} </h3>
    <div class="mx-5">
      <BaseIcon
        name="angle-right"
        v-if="availableRight()"
        @click.native="
          setSelectedLeaderboard(
            leaderboards[leaderboards.indexOf(leaderboard) + 1].id
          )
        "
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      leaderboards: this.$store.getters['leaderboards/leaderboards'],
      leaderboard: this.$store.getters['leaderboards/currentLeaderboard'],
      leaderboardId: this.$store.getters['leaderboards/currentLeaderboardId'],
    }
  },
  methods: {
    async setSelectedLeaderboard(id) {
      console.log(id)
      this.$store.dispatch('leaderboards/selectLeaderboard', id)
      this.leaderboard = this.leaderboards.find(
        leaderboard => leaderboard.id === id
      )
    },
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

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) {
  .justify-content {
    justify-content: center;
  }
}
</style>
