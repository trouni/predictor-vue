<template>
  <div id="top-nav">
    <p>LOGO</p>
    <ul class="top-nav-container">
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
          fontAwesomeClass: 'home',
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
          fontAwesomeClass: 'trophy',
        },
        {
          name: 'profile',
          title: 'Profile',
          fontAwesomeClass: 'user',
        },
      ],
      loggedOutNavRoutes: [
        {
          name: 'login',
          title: 'Log in',
          fontAwesomeClass: 'sign-in-alt',
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

#top-nav {
  background-color: $purple;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacer;
  color: white;
  height: 64px;
  a {
    opacity: 0.7;
    margin: $spacer * 2;
    color: white;
  }
  .active {
    opacity: 1;
  }
  a:hover {
    opacity: 1;
  }
}

.top-nav-container {
  padding: 0 $size-grid-padding;
  text-align: center;
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5em;
  a {
    display: inline-block;
  }
}

// TODO: Hide when mobile
// @media (min-width: 768px) {
//   #footer-nav {
//     display: none;
//   }
// }
</style>
