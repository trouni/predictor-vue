<template>
  <div id="footer-nav" class="h-16 shadow-2xl">
    <ul class="footer-container flex h-full items-center">
      <NavBarRoutes :routes="persistentNavRoutes" />
      <div
        v-if="loggedIn"
        @click="goBack"
        class="text-gray-600 flex-grow h-full no-underline cursor-pointer"
      >
        <li class="flex h-full w-full items-center justify-center">
          <BaseIcon name="chevron-left" />
        </li>
      </div>
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
        // {
        //   name: 'competition',
        //   params: { id: 1 },
        //   title: 'Competition',
        // },
      ],
      loggedInNavRoutes: [
        {
          path: '/matches',
          title: 'Matches',
          fontAwesomeClass: 'futbol',
        },
        {
          path: '/leaderboards',
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
  background-color: $white;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: none;
}

.footer-container {
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
@media (min-width: 100px) and (max-width: 575px) {
  #footer-nav {
    display: block;
  }
}
</style>
