<template>
  <div class="d-flex justify-content">
    <div class="mx-5">
      <BaseIcon
        name="angle-left"
        v-if="previousLeaderboard"
        @click.native="setSelectedLeaderboard(previousLeaderboard.id)"
      />
    </div>
    <h3> {{ leaderboard.name }} </h3>
    <div class="mx-5">
      <BaseIcon
        name="angle-right"
        v-if="nextLeaderboard"
        @click.native="setSelectedLeaderboard(nextLeaderboard.id)"
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
      leaderboard: 'leaderboards/currentLeaderboard',
      previousLeaderboard: 'leaderboards/previousLeaderboard',
      nextLeaderboard: 'leaderboards/nextLeaderboard',
    }),
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
