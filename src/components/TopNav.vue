<template>
  <div id="top-nav">
    <BaseLink :to="{ name: 'home' }" class="opacity-100"
      ><img
        alt="football graphic"
        :src="require('../assets/logo.png')"
        class="logo-img"
    /></BaseLink>
    <ul class="top-nav-container">
      <NavBarRoutes v-if="loggedIn" :routes="loggedInNavRoutes" :top="true" />
      <NavBarRoutes v-else :routes="loggedOutNavRoutes" :top="true" />
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
      loggedInNavRoutes: [
      {
          name: 'predictions',
          title: 'Predict',
          fontAwesomeClass: 'bullseye',
        },
        {
          name: 'results',
          title: 'Results',
          fontAwesomeClass: 'square-poll-vertical',
        },
        {
          name: 'rankings',
          title: 'Rankings',
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
  display: none;
  justify-content: space-between;
  align-items: center;
  padding: $spacer;
  color: white;
  height: 64px;
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
    opacity: 0.7;
    margin: $spacer * 2;
    color: white;
    display: inline-block;
  }
  .active {
    opacity: 1;
  }
  a:hover {
    opacity: 1;
  }
}

.logo-img {
  width: 50px;
  opacity: 1;
  margin: $spacer * 2;
}

// TODO: Hide when mobile
@media (min-width: 640px) {
  #top-nav {
    display: flex;
  }
}
</style>
