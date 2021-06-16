<template>
  <div class="flex justify-around px-2 pb-2 mb-2">
    <!-- <LeaderboardTab :leaderboard="leaderboard" /> -->
    <div
      class="leaderboard-tab flex-1 text-center"
      v-for="tab in tabs"
      :key="tab.text"
      @click="selectTab(tab)"
    >
      <span class="">{{ tab.text }}</span>
    </div>
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
    selectedTab: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
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
  methods: {
    selectTab(tab) {
      this.$emit('selectTabEvent', tab.text)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.tab-active {
  background-color: $purple;
}
</style>
