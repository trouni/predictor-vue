import store from '@/store'

export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home'),
  },
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
    path: '/competitions',
    name: 'competitions',
    component: () => import('@/views/Competitions'),
  },
  {
    path: '/competitions/:id',
    name: 'competition',
    component: () => import('@/views/Competition'),
    props: route => ({ id: parseInt(route.params.id) }),
    children: [
      {
        path: 'leagues',
        name: 'leagues',
        component: () => import('@/views/Leagues'),
        props: route => ({ competitionId: parseInt(route.params.id) }),
      },
      {
        path: '/league/:id',
        name: 'league',
        component: () => import('@/views/League'),
        props: route => ({ id: parseInt(route.params.id) }),
      },
      {
        path: 'leagues/new',
        name: 'new_league',
        component: () => import('@/views/LeagueNew'),
        meta: {
          authRequired: true,
        },
      },
    ],
  },
  {
    path: '/matches',
    name: 'matches',
    component: () => import('@/views/Matches'),
    props: route => ({
      competitionId: route.query.competition_id,
      userId: route.query.user_id,
    }),
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/UserProfile'),
    props: () => ({ id: store.getters['auth/currentUser'].id }),
    meta: {
      authRequired: true,
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
]
