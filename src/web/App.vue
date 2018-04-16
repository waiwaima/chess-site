<template lang="pug">
v-app
  v-toolbar.top-bg
    v-layout.top-navigator(row justify-space-between)
      img.logo(src="static/chess.svg")
      v-layout(row justify-end)
        v-toolbar-items.hidden-xs-only
          v-btn(:style="homeStyle" @click.native="routeTo('home')" flat) Home
          v-btn(:style="playersStyle" @click.native="routeTo('players')" flat) Players
          v-btn(:style="pairingsStyle" @click.native="routeTo('pairings')" flat) Pairings & Results
          v-btn(:style="photosStyle" @click.native="routeTo('photos')" flat) Photos
          v-btn(:style="venueStyle" @click.native="routeTo('venue')" flat) Venue
          v-btn(v-if="user === 'admin'" :style="logoutStyle" @click.native="logout" flat) Sign Out
          // v-btn(v-if="user !== 'admin'" :style="loginStyle" @click.native="routeTo('login')" flat) Sign In
        v-menu.hidden-sm-and-up
          v-toolbar-title(slot="activator")
            v-icon.mt-3 menu
          v-list
            v-list-tile(v-for="item in items" :key="item.value" @click="routeTo(item.value)")
              v-list-tile-title(v-text="item.text")
  v-content.main-background
    v-layout(column justify-start)
      v-container.view-background(fluid)
        transition
          keep-alive(:include="['Home', 'Player', 'Pairing', 'Photo']")
            router-view
</template>

<script>
import axios from 'axios'
import router from './router'
import { mapState } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      items: [
        {text: 'Home', value: 'home', style: 'homeStyle'},
        {text: 'Players', value: 'players', style: 'playersStyle'},
        {text: 'Pairings & Results', value: 'pairings', style: 'pairingsStyle'},
        {text: 'Photos', value: 'photos', style: 'photosStyle'},
        {text: 'Venue', value: 'venue', style: 'venueStyle'}
      ],
      active: 'home'
    }
  },
  computed: {
    homeStyle: function () {
      return this.getStyle('home')
    },
    playersStyle: function () {
      return this.getStyle('players')
    },
    pairingsStyle: function () {
      return this.getStyle('pairings')
    },
    photosStyle: function () {
      return this.getStyle('photos')
    },
    venueStyle: function () {
      return this.getStyle('venue')
    },
    loginStyle: function () {
      return this.getStyle('login')
    },
    logoutStyle: function () {
      return this.getStyle('logout')
    },
    ...mapState({
      user (state) {
        return state.currentUser
      }
    })
  },
  methods: {
    routeTo (view) {
      this.active = view
      router.push('/' + view)
    },
    getStyle (btn) {
      return (this.active === btn) ? 'color: #cc6553' : 'rgba(0,0,0,.87)'
    },
    logout () {
      axios.get('/auth/logout')
        .then(response => {
          this.$store.commit('setCurrentUser', null)
          router.push('/')
          this.active = 'home'
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  beforeMount () {
    axios.get('/auth/user')
      .then(response => {
        let user = response.data.username
        console.log('current user: ' + user)
        this.$store.commit('setCurrentUser', user)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style lang="stylus">
#app .toolbar__content
  justify-content: center
/* move the right icon out of viewport */
.tabs__bar .icon--right
  right: -200px
</style>

<style lang="stylus" scoped>
#app
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
.top-bg
  //background-color: #d9d6d0
  background: url(/static/bg-toolbar.jpg) 0 0 repeat
.top-navigator
  margin: auto
  padding: 0 24px
  width: 1180px
  max-width: 1180px
  position: relative
.logo
  height: 48px
  margin-top: 4px
  padding-left: 8px
.main-background
  background-color: #ffffff
.view-background
  max-width: 1180px
  margin: auto
  padding-top: 2px
  padding-left: 0
  padding-right: 0
  background-color: #f7f7f6
</style>
