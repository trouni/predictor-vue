<template>
  <div class="flex items-stretch fixed w-80 top-1/2 -translate-y-1/2 opacity-90 w-full left-1/2 -translate-x-1/2 rounded-lg overflow-hidden drop-shadow-2xl bg-white">
    <div class="w-1/5 flex items-center justify-center bg-gradient">
      <BaseIcon name="fa-info-circle" class="fa-2x text-white"></BaseIcon>
    </div>
    <div class="p-3">
      <h4 class="font-bold mb-3">Swipe to make a prediction</h4>
      <ul>
        <li class="flex items-center gap-1"><BaseIcon name="fa-arrow-left"></BaseIcon><BaseIcon name="fa-arrow-right"></BaseIcon><p class="ml-1">for the winning team</p></li>
        <li v-if='match.groupId' class="flex items-center gap-1"><BaseIcon name="fa-arrow-up"></BaseIcon><BaseIcon name="fa-arrow-down"></BaseIcon><p class="ml-1">for a draw</p></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    match: Object,
  }
}
</script>

<style lang="scss">
@import '@/styles';

.bg-gradient {
  background: linear-gradient(167.4deg, $purple 0%, $teal 88.73%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
