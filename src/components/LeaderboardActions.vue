<template>
  <div class="flex justify-between p-2">
    <LeaderboardAction
      v-for="(action, index) in actions"
      :key="index"
      :leaderboard="leaderboard"
      :text="action.text"
      :icon="action.icon"
      :path="action.path"
    />
  </div>
</template>

<script>
import LeaderboardAction from '@/components/LeaderboardAction'

export default {
  components: { LeaderboardAction },

  props: {
    leaderboard: {
      type: Object,
      default: null,
      required: false,
    },
  },
  data() {
    return {
      actions: [
        {
          text: 'Share',
          icon: 'Matches',
        },
        {
          text: 'Leave',
          icon: 'sign-out-alt',
          path: 'new_leaderboard',
        },
        {
          text: 'Add',
          icon: 'plus',
          path: 'new_leaderboard',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
</style>
