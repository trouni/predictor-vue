<template>
  <div>
    <Header />
    <main>
      <RouterView :key="$route.fullPath"></RouterView>
    </main>
    <NavBar />
  </div>
</template>

<script>
import Header from '@/components/Header'
import NavBar from '@/components/NavBar'

export default {
  components: { Header, NavBar },
}
</script>
