<template>
  <div class="flex justify-around">
    <!-- <LeaderboardTab :leaderboard="leaderboard" /> -->
    <div class="leaderboard-tab" v-for="tab in tabs">{{ tab.text }}</div>
  </div>
</template>

<script>
export default {
  props: {
    userId: {
      type: Number,
      required: false,
    },
    leaderboard: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedTab: 'all',
      tabs: [
        {
          text: 'All',
          name: 'Leaderboard',
        },
        {
          text: 'A',
          name: 'Group A',
        },
        {
          text: 'B',
          name: 'Group B',
        },
        {
          text: 'C',
          name: 'Group C',
        },
        {
          text: 'D',
          name: 'Group D',
        },
        {
          text: 'E',
          name: 'Group E',
        },
        {
          text: 'F',
          name: 'Group F',
        },
        {
          text: 'G',
          name: 'Group G',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped></style>
