<template>
  <div class="py-8">
    <LeaderboardAction
      v-for="(button, index) in buttons"
      :key="index"
      :leaderboard="leaderboard"
      :text="button.text"
      :icon="button.icon"
      :to="button.to"
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
          text: 'Invite players',
          icon: 'user-plus',
          action: 'invite',
        },
        {
          text: 'Leave this leaderboard',
          icon: 'sign-out-alt',
          action: 'leave',
        },
        {
          text: 'Create a leaderboard',
          icon: 'plus-square',
          to: { name: 'new_leaderboard' },
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
</style>
