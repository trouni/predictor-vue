<template>
  <div class="content">
    <TopNav />
    <Header :title="$route.meta.title" :img="$route.meta.img">
      <component :is="$route.meta.subHeader" />
    </Header>
    <main id="wrapper-main">
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
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.content {
  background: linear-gradient(167.4deg, $purple 0%, $teal 88.73%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 100vh;
}

#wrapper-main {
  background: linear-gradient(
    155.48deg,
    rgba(255, 255, 255, 0.87) 0%,
    $white 68.96%
  );
  border-radius: 30px 30px 0px 0px;
  flex-grow: 1;
}
</style>
