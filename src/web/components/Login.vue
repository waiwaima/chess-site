<template lang="pug">
.login
  v-layout(row justify-center)
    v-flex(xs12 sm8)
      v-card.panel
        v-layout(column justify-start)
          v-text-field(v-model="username" label="Username")
          v-text-field(v-model="password" label="Password" type="password")
          v-layout(row justify-center)
            v-btn.mt-4(@click.native="login") Sign in
</template>

<script>
import axios from 'axios'
import router from '../router'

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.username = this.username.trim()
      this.password = this.password.trim()
      axios.post('/auth/login', {username: this.username, password: this.password})
        .then(response => {
          this.$store.commit('setCurrentUser', this.username)
          this.username = ''
          this.password = ''
          router.push('/')
        })
        .catch(err => {
          this.username = ''
          this.password = ''
          console.log(err)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.login
  width: 100%
  padding: 16px 16px
  background-color: #f7f7f6
  text-align: left
.panel
  padding: 48px 48px
  margin-top: 60px
  margin-bottom: 60px
.login button
  color: #fff
  background-color: #cc6553 !important
@media screen and (max-device-width: 600px)
  .login
    padding: 16px 2px
  .panel
    padding: 24px 24px
    margin-top: 8px
    margin-bottom: 0
</style>
