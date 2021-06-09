<template>
  <div class="flex justify-between p-2">
    <LeaderboardAction
      v-for="(button, index) in buttons"
      :key="index"
      :leaderboard="leaderboard"
      :text="button.text"
      :icon="button.icon"
      :path="button.path"
      :action="button.action"
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
      buttons: [
        {
          text: 'Invite',
          icon: 'Matches',
          action: 'invite',
        },
        {
          text: 'Leave',
          icon: 'sign-out-alt',
          action: 'leave',
        },
        {
          text: 'New',
          icon: 'plus',
          path: 'new_leaderboard',
          action: 'new_leaderboard',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
</style>
