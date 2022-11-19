<template>
  <div
    id="footer-nav"
    class="h-20 shadow-2xl z-50"
    :class="{ 'bg-gradient': !transparent }"
  >
    <ul class="footer-container flex h-full items-center">
      <NavBarRoutes :routes="persistentNavRoutes" />
      <div
        v-if="loggedIn"
        @click="goBack"
        class="text-white/50 flex-grow h-full no-underline cursor-pointer w-full"
      >
        <li
          class="flex h-full w-full items-center justify-center flex-col gap-1"
        >
          <BaseIcon name="chevron-left" />
          <p class="text-xs">Back</p>
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
          path: '/matches',
          title: 'Matches',
          fontAwesomeClass: 'futbol',
        },
        {
          path: '/leaderboards',
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
  display: none;
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

// TODO: Hide when non-mobile
@media (min-width: 100px) and (max-width: 575px) {
  #footer-nav {
    display: block;
  }
}
</style>
