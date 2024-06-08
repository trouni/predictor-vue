<template>
  <div
    id="footer-nav"
    class="h-20 shadow-2xl z-[100]"
    :class="{ 'bg-gradient': !transparent }"
  >
    <ul class="footer-container flex h-full items-center">
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
  props: {
    transparent: Boolean,
  },
  data() {
    return {
      persistentNavRoutes: [
        // {
        //   name: 'competition',
        //   params: { id: 1 },
        //   title: 'Competition',
        // },
      ],
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
          name: 'home',
          title: 'Home',
          fontAwesomeClass: 'home',
        },
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
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';

#footer-nav {
  &.bg-gradient {
    background: linear-gradient(167.4deg, #3e3b7d 0%, #6690b7 88.73%);
  }
  position: fixed;
  bottom: 0;
  width: 100%;
}

.footer-container {
  text-align: center;
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  font-size: 1.7em;
  a {
    display: inline-block;
  }
}

// TODO: Hide when desktop
@media (min-width: 640px) {
  #footer-nav {
    display: none;
  }
}
</style>
