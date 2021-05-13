<template>
  <ul class="container">
    <NavBarRoutes :routes="persistentNavRoutes" />
    <NavBarRoutes v-if="loggedIn" :routes="loggedInNavRoutes" />
    <NavBarRoutes v-else :routes="loggedOutNavRoutes" />
  </ul>
</template>

<script>
import { authComputed } from '@/store/helpers'
import NavBarRoutes from './NavBarRoutes'

export default {
  components: { NavBarRoutes },

  data() {
    return {
      persistentNavRoutes: [
        {
          name: 'home',
          title: 'Home',
        },
        {
          name: 'competition',
          params: { id: 1 },
          title: 'Competition',
        },
      ],
      loggedInNavRoutes: [
        {
          name: 'profile',
          title: 'Profile',
        },
        {
          name: 'matches',
          title: 'Matches',
        },
        {
          name: 'logout',
          title: 'Log out',
        },
      ],
      loggedOutNavRoutes: [
        {
          name: 'login',
          title: 'Log in',
        },
      ],
    }
  },
  computed: {
    ...authComputed,
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';

.container {
  padding: 0;
  margin: 0 0 $size-grid-padding;
  text-align: center;
  list-style-type: none;
  a {
    display: inline-block;
    margin-right: $size-grid-padding;
  }
}
</style>
