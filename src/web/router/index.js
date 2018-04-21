import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home'
import Player from 'components/Player'
import Pairing from 'components/Pairing'
import Events from 'components/Events'
import Photo from 'components/Photo'
import Venue from 'components/Venue'
import Login from 'components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      alias: '/home',
      component: Home
    },
    {
      path: '/players',
      component: Player
    },
    {
      path: '/pairings',
      component: Pairing
    },
    {
      path: '/events',
      component: Events
    },
    {
      path: '/photos',
      component: Photo
    },
    {
      path: '/venue',
      component: Venue
    },
    {
      path: '/login',
      component: Login
    }
  ]
})
