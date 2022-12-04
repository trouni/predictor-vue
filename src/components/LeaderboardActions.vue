<template>
  <div class="pb-20">
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
          text: 'Invite players',
          icon: 'user-plus',
          action: 'invite',
        },
        {
          text: 'Leave this leaderboard',
          icon: 'sign-out-alt',
          action: 'leave',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
</style>
