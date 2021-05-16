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
          fontAwesomeClass: 'home'
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
          fontAwesomeClass: 'futbol',
        },
        {
          name: 'leaderboards',
          params: { id: 1 },
          title: 'Leaderboards',
          fontAwesomeClass: 'trophy'
        },
        // TODO: Move below items to hamburger menu
        {
          name: 'profile',
          title: 'Profile',
          fontAwesomeClass: 'user'
        },
        {
          name: 'logout',
          title: 'Log out',
          fontAwesomeClass: 'sign-out-alt'
        },
      ],
      loggedOutNavRoutes: [
        {
          name: 'login',
          title: 'Log in',
          fontAwesomeClass: 'sign-in-alt'
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
  padding: 0 16px;
  margin: 0 0 1.3rem;
  text-align: center;
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  font-size: 1.5em;
  a {
    display: inline-block;
  }
}

// TODO: Hide when non-mobile
// @media (min-width: 768px) {
//   #footer-nav {
//     display: none;
//   }
// }

</style>
