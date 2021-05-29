import store from '@/store'

export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home'),
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          store.dispatch('auth/logOut')
        }
        const authRequiredOnPreviousRoute = routeFrom.matched.some(
          route => route.meta.authRequired
        )
        // Navigate back to previous page, or home as a fallback
        next(authRequiredOnPreviousRoute ? { name: 'home' } : { ...routeFrom })
      },
    },
  },
  {
    path: '/',
    component: () => import('@/views/layouts/DefaultLayout'),
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login'),
        meta: {
          beforeResolve(routeTo, routeFrom, next) {
            // If the user is already logged in
            if (store.getters['auth/loggedIn']) {
              // Redirect to the home page instead
              next({ name: 'home' })
            } else {
              // Continue to the login page
              next()
            }
          },
        },
      },
      {
        path: '/join/:password',
        name: 'join',
        component: () => import('@/views/Leaderboards'),
        props: route => ({
          competitionId: 1,
          password: route.params.password,
        }),
        meta: {
          title: 'Leaderboards',
          img: 'trophy.png',
          subHeader: 'LeaderboardSubHeader',
          beforeResolve(routeTo, routeFrom, next) {
            if (store.getters['auth/loggedIn']) {
              console.log(routeTo.params)
              // this doesn't work so moved it to "beforeRouteEnter"
              this.$store.dispatch(
                'leaderboards/joinLeaderboard',
                routeTo.params
              )
              next({ name: 'leaderboards', params: { competitionId: 1 } })
            } else {
              next({ name: 'login' })
            }
          },
        },
      },
      {
        path: '/competitions/:id',
        name: 'competition',
        component: () => import('@/views/Competition'),
        props: route => ({ id: parseInt(route.params.id) }),
        meta: {
          title: 'Competitions',
        },
        children: [
          {
            path: 'leaderboards',
            name: 'leaderboards',
            component: () => import('@/views/Leaderboards'),
            props: route => ({
              competitionId: parseInt(route.params.id),
              leaderboardId: parseInt(
                store.getters['leaderboards/currentLeaderboard']
              ),
            }),
            meta: {
              authRequired: true,
              title: 'Leaderboards',
              img: 'trophy.png',
              subHeader: 'LeaderboardSubHeader',
            },
          },
          {
            path: 'leaderboards/new',
            name: 'new_leaderboard',
            component: () => import('@/views/LeaderboardNew'),
            props: route => ({
              competitionId: parseInt(route.params.id),
            }),
            meta: {
              authRequired: true,
              title: 'New Leaderboard',
              img: 'trophy.png',
            },
          },
        ],
      },
      {
        path: '/matches',
        name: 'matches',
        component: () => import('@/views/Matches'),
        props: route => ({
          competitionId: parseInt(route.query.competitionId),
          userId: parseInt(route.query.userId),
        }),
        meta: {
          authRequired: true,
          title: 'Euro Championship',
          img: 'football.png',
          subHeader: 'MatchesSubHeader',
        },
      },
      {
        path: '/leaderboards/:id',
        name: 'leaderboard',
        component: () => import('@/views/Leaderboard'),
        props: route => ({ id: parseInt(route.params.id) }),
        meta: {
          authRequired: true,
          title: 'Leaderboard',
          img: 'trophy.png',
        },
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/UserProfile'),
        props: () => ({ id: store.getters['auth/currentUser'].id }),
        meta: {
          authRequired: true,
          title: 'Profile',
          img: 'player.png',
        },
      },
      {
        path: '/users/:id',
        name: 'user',
        component: () => import('@/views/UserProfile'),
        props: route => ({ id: parseInt(route.params.id) }),
        meta: {
          authRequired: true,
        },
      },
    ],
  },
]
