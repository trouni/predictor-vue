<template>
  <div>
    <Header />
    <main>
      <div id="wrapper-main" class="p-4">
        <RouterView :key="$route.fullPath"></RouterView>
      </div>
    </main>
    <FooterNav />
  </div>
</template>

<script>
import Header from '@/components/Header'
import FooterNav from '@/components/FooterNav'

export default {
  components: { Header, FooterNav },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
#wrapper-main {
  background: linear-gradient(
    155.48deg,
    rgba(255, 255, 255, 0.87) 0%,
    $white 68.96%
  );
  border-radius: 30px 30px 0px 0px;
}
</style>
