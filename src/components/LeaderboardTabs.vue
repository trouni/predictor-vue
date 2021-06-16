<template>
  <div class="flex justify-around px-2 pb-2 mb-2">
    <!-- <LeaderboardTab :leaderboard="leaderboard" /> -->
    <div
      v-for="tab in tabs"
      :key="tab.text"
      @click="selectTab(tab)"
      class="leaderboard-tab flex-1 flex justify-center items-center cursor-pointer"
    >
      <p :class="activeStyle(tab)">{{ tab.text }}</p>
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
    activeStyle(tab) {
      return tab.text === this.selectedTab ? 'selected-tab' : ''
    },
  },
  computed: {},
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.leaderboard-tab {
  p {
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
}
.selected-tab {
  background-color: $purple;
  padding: 4px;
  color: white;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  text-align: center;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>
