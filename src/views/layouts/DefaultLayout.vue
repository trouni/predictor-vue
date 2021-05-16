<template>
  <div>
    <Header />
    <main>
      <RouterView :key="$route.fullPath"></RouterView>
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
