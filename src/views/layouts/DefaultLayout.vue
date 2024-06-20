<template>
  <div class="bg-body flex flex-col items-stretch h-screen overscroll-none">
    <TopNav />
    <Header :title="title" :img="img">
      <component v-if="subHeader" :is="subHeader" ref="subHeader" />
    </Header>
    <div class="flex justify-center w-full h-full overflow-scroll">
      <main
        class="bg-wrapper overflow-y-auto rounded-t-lg flex-grow pb-20 sm:pb-0 relative max-w-screen-md"
        ref="main"
      >
        <transition>
          <RouterView
            v-show="$store.getters.DOMLoaded && componentInitialized"
            class="h-full"
            :key="$route.fullPath"
            @init="componentInitialized = true"
          ></RouterView>
        </transition>
        <div
          v-if="!$store.getters.DOMLoaded || !componentInitialized"
          class="flex justify-center items-center h-full w-full"
        >
          <BaseSpinner class="text-gray-600" />
        </div>
      </main>
    </div>
    <FooterNav class="sm:hidden" />
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
    const { title, img, subHeader } = this.$route.meta
    return {
      componentInitialized: false,
      title: title,
      img: img,
      subHeader: subHeader,
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
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.67) 68.96%
  );
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.6s ease-out;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>
