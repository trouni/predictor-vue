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
        path: '/forgot-password',
        name: 'forgot_password',
        component: () => import('@/views/ForgotPassword'),
        meta: {
          title: 'Reset Password',
          img: 'player.png',
        },
      },
      {
        path: '/reset-password',
        name: 'reset_password',
        component: () => import('@/views/ResetPassword'),
        meta: {
          title: 'Reset Password',
          img: 'player.png',
          beforeResolve(routeTo, routeFrom, next) {
            const headers = {
              'access-token': routeTo.query['access-token'],
              client: routeTo.query.client,
              uid: routeTo.query.uid,
            }
            // If the access token is present
            if (headers['access-token']) {
              // Set headers and continue to the activation page
              store.dispatch('auth/updateHeaders', headers)
              next()
            } else {
              // Redirect to the homepage
              next({ name: 'home' })
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
              name: 'rankings',
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
            path: 'results',
            name: 'results',
            component: () => import('@/views/Results'),
            meta: {
              authRequired: true,
              title: 'Results',
              img: 'trophy.png', // TODO: change this icon
              subHeader: 'LeaderboardSubHeader',
            },
            alias: '/results',
            beforeEnter: async (to, from, next) => {
              try {
                const currentCompetition =
                  store.getters['competitions/currentCompetition']
                if (currentCompetition) {
                  to.meta.title = currentCompetition.name
                }
              } catch (error) {
                console.error('Error fetching current competition:', error)
              }
              next()
            },
          },
          {
            path: 'rankings',
            name: 'rankings',
            component: () => import('@/views/Rankings'),
            props: () => ({ userId: store.getters['auth/currentUser'].id }),
            meta: {
              authRequired: true,
              title: 'Rankings',
              img: 'trophy.png',
              subHeader: 'LeaderboardSubHeader',
            },
            alias: '/rankings',
            beforeEnter: async (to, from, next) => {
              try {
                const currentCompetition =
                  store.getters['competitions/currentCompetition']
                if (currentCompetition) {
                  to.meta.title = currentCompetition.name
                }
              } catch (error) {
                console.error('Error fetching current competition:', error)
              }
              next()
            },
          },
          {
            path: 'predict',
            name: 'predict',
            component: () => import('@/views/Predict'),
            props: true,
            meta: {
              authRequired: true,
              title: 'Swipe to predict',
              img: 'trophy.png',
            },
            alias: '/predict',
          },
          {
            path: 'predictions/edit',
            name: 'edit_predictions',
            component: () => import('@/views/Predict'),
            props: { allMatches: true },
            meta: {
              authRequired: true,
              title: 'Swipe to predict',
              img: 'trophy.png',
            },
            alias: '/predictions/edit',
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
            path: 'predictions',
            name: 'predictions',
            component: () => import('@/views/Predictions'),
            props: route => ({
              userId: parseInt(route.query.userId) || undefined,
            }),
            meta: {
              authRequired: true,
              title: 'Predictions',
              img: 'football.png',
              subHeader: 'MatchesSubHeader',
            },
            alias: '/predictions',
            beforeEnter: async (to, from, next) => {
              try {
                const currentCompetition =
                  store.getters['competitions/currentCompetition']
                if (currentCompetition) {
                  to.meta.title = currentCompetition.name
                }
              } catch (error) {
                console.error('Error fetching current competition:', error)
              }
              next()
            },
          },
        ],
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
        path: '/support',
        name: 'support',
        component: () => import('@/views/Support'),
        meta: {
          authRequired: true,
          title: 'Support',
          img: 'player.png',
        },
      },
      {
        path: '/all_competitions',
        name: 'competitions',
        component: () => import('@/views/Competitions'),
        props: () => ({ id: store.getters['auth/currentUser'].id }),
        meta: {
          authRequired: true,
          title: 'Competitions',
          img: 'player.png',
        },
      },
    ],
  },
]
