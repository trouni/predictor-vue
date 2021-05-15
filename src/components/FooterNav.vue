<template>
  <div id="footer-nav">
    <ul class="container">
      <NavBarRoutes :routes="persistentNavRoutes" />
      <NavBarRoutes v-if="loggedIn" :routes="loggedInNavRoutes" />
      <NavBarRoutes v-else :routes="loggedOutNavRoutes" />
    </ul>
  </div>
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
        // {
        //   name: 'competition',
        //   params: { id: 1 },
        //   title: 'Competition',
        // },
      ],
      loggedInNavRoutes: [
        {
          name: 'matches',
          title: 'Matches',
        },
        {
          name: 'leaderboards',
          params: { id: 1 },
          title: 'Leaderboards',
        },
        // TODO: Move below items to hamburger menu
        {
          name: 'profile',
          title: 'Profile',
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

#footer-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
}

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
