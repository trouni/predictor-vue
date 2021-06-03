<template>
  <div class="bg-body flex flex-col items-stretch h-screen overscroll-none">
    <TopNav />
    <Header :title="title" :img="img">
      <component v-if="subHeader" :is="subHeader" />
    </Header>
    <main class="bg-wrapper overflow-y-auto rounded-t-3xl flex-grow">
      <div class="p-4 pb-12">
        <RouterView :key="$route.fullPath"></RouterView>
      </div>
    </main>
    <FooterNav />
  </div>
</template>

<script>
import TopNav from '@/components/TopNav'
import Header from '@/components/Header'
import FooterNav from '@/components/FooterNav'
import LeaderboardSubHeader from '@/components/LeaderboardSubHeader'
import MatchesSubHeader from '@/components/MatchesSubHeader'

export default {
  components: {
    Header,
    FooterNav,
    TopNav,
    LeaderboardSubHeader,
    MatchesSubHeader,
  },
  data() {
    return {
      leaderboards: [],
      leaderboard: null,
      title: this.$route.meta.title,
      img: this.$route.meta.img,
      subHeader: this.$route.meta.subHeader,
    }
  },
}
</script>

<style lang="scss">
@import '@/styles';
.bg-body {
  background: linear-gradient(167.4deg, $purple 0%, $teal 88.73%);
}

.bg-wrapper {
  background: linear-gradient(
    155.48deg,
    rgba(255, 255, 255, 0.87) 0%,
    $white 68.96%
  );
}
</style>
