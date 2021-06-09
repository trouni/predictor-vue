<template>
  <div class="action-pill">
    <BaseLink v-if="path" :to="{ name: path }">
      <span class="mr-1">{{ text }} </span><BaseIcon :name="icon" />
    </BaseLink>
    <ShareButton
      v-else-if="action === 'invite'"
      :password="leaderboard.password"
    />
    <div v-else-if="action === 'leave'" @click="leave"
      ><span class="mr-1">{{ text }} </span><BaseIcon :name="icon" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ShareButton from '@/components/ShareButton'
export default {
  components: { ShareButton },

  props: {
    leaderboard: {
      type: Object,
      default: null,
      required: false,
    },
    text: {
      type: String,
      default: null,
      required: false,
    },
    icon: {
      type: String,
      default: null,
      required: false,
    },
    path: {
      type: String,
      default: null,
      required: false,
    },
    action: {
      type: String,
      default: null,
      required: false,
    },
  },
  methods: {
    ...mapActions({
      leaveLeaderboard: 'leaderboards/leaveLeaderboard',
    }),
    async leave() {
      console.log(this.leaderboard.id)
      // await this.leaveLeaderboard(this.leaderboard.id)
      // do what next?
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.action-pill {
  background-color: $light-gray;
  color: $purple;
  padding: $spacer / 2 $spacer * 2;
  flex: 1;
  border-radius: $spacer * 2;
  margin: $spacer $spacer / 2;
  text-align: center;
}
</style>
