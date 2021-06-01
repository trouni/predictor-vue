<template>
  <div class="action-pill">
    <BaseLink v-if="path" :to="{ name: path }">
      <span class="mr-1">{{ text }} </span><BaseIcon :name="icon" />
    </BaseLink>

    <ShareButton v-else :password="leaderboard.password" />
  </div>
</template>

<script>
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
