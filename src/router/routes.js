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
          title: 'Registration',
          img: 'player.png',
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
        meta: {
          authRequired: true, // Router will check auth and redirect here after login
          async beforeResolve(routeTo, _, next) {
            const membership = await store.dispatch(
              'leaderboards/joinLeaderboard',
              routeTo.params.password
            )
            next({
              name: 'leaderboards',
              params: { id: membership.competitionId },
            })
          },
        },
      },
      {
        path: '/competitions/:id?',
        name: 'competition',
        component: () => import('@/views/Competition'),
        meta: {
          title: 'Competitions',
          beforeResolve(routeTo, _routeFrom, next) {
            if (routeTo.params.id) {
              store.dispatch(
                'competitions/selectCompetition',
                parseInt(routeTo.params.id)
              )
              next({ path: routeTo.path.replace(/\/competitions\/\d+/, '') })
            }
          },
        },
        children: [
          {
            path: 'leaderboards',
            name: 'leaderboards',
            component: () => import('@/views/Leaderboards'),
            meta: {
              authRequired: true,
              title: 'Leaderboards',
              img: 'trophy.png',
              subHeader: 'LeaderboardSubHeader',
            },
            alias: '/leaderboards',
          },
          {
            path: 'predictions',
            name: 'predictions',
            component: () => import('@/views/PredictionsNew'),
            meta: {
              authRequired: true,
              title: 'Predictions',
              img: 'trophy.png',
            },
            alias: '/predictions',
          },
          {
            path: 'leaderboards/new',
            name: 'new_leaderboard',
            component: () => import('@/views/LeaderboardNew'),
            meta: {
              authRequired: true,
              title: 'New Leaderboard',
              img: 'trophy.png',
            },
            alias: '/leaderboards/new',
          },
          {
            path: 'matches',
            name: 'matches',
            component: () => import('@/views/Matches'),
            props: route => ({
              userId: parseInt(route.query.userId) || undefined,
            }),
            meta: {
              authRequired: true,
              title: store.getters['competitions/currentCompetition'].name,
              img: 'football.png',
              subHeader: 'MatchesSubHeader',
            },
            alias: '/matches',
          },
        ],
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
