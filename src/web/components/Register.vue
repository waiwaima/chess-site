<template lang="pug">
.register
  v-layout(row justify-start align-center style="margin-top: -12px; margin-left: -2px")
    v-btn(flat icon color="primary" @click="toHome()")
      v-icon keyboard_backspace
    span Back to tournament info
  div.highlight
    span(style="color:black;") Register for
    span.ml-2 {{ tournamentSection.name }}
  v-layout(justify-start)
    v-flex(xs12 sm10 md8)
      v-card.card-container
        v-text-field(label="Full Name" hint="Format: Firstname Lastname" v-model="name" required
          ref="name" :rules="[() => !!name || 'This field is required']")
        v-text-field(label="USCF ID" v-model="uscfId" required
          ref="uscfId" :rules="[() => !!uscfId || 'This field is required']")
        v-text-field(label="Rating (approx.)" v-model="rating" required
          ref="rating" :rules="[() => !!rating || 'This field is required']")
        v-text-field(label="E-mail" v-model="email" required
          ref="email" :rules="[() => !!email || 'This field is required']")
        v-text-field(label="Phone" v-model="phone" required
          ref="phone" :rules="[() => !!phone || 'This field is required']")
        v-text-field(label="Section" v-model="tournamentSection.section" disabled)
        v-layout.mt-1(column justify-start)
          div Bye Requests
          div.pl-5
            v-checkbox(label="Round 1" v-model="byes" value="1")
            v-checkbox(label="Round 2" v-model="byes" value="2")
            v-checkbox(label="Round 3" v-model="byes" value="3")
        v-text-field(label="Entry Fee" v-model="strEntryFee" disabled)
  v-card
</template>

<script>
import { mapState } from 'vuex'
import router from '../router'

export default {
  name: 'Register',
  data () {
    return {
      name: null,
      uscfId: null,
      rating: null,
      email: null,
      phone: null,
      strEntryFee: null,
      byes: []
    }
  },
  computed: {
    ...mapState({
      tournamentSection (state) {
        console.log(state.tournamentSection.name)
        this.strEntryFee = '$' + state.tournamentSection.entryFee
        return state.tournamentSection
      }
    })
  },
  methods: {
    toHome () {
      router.push('/home')
    }
  }
}
</script>

<style lang="stylus">
.register .input-group__details
  min-height: 2px
</style>

<style lang="stylus" scoped>
.register
  width: 100%
  padding: 16px 16px
  background-color: #f7f7f6
.highlight
  padding: 0 0 16px 14px
  color: #cc6553
  font-size: 1.3em
  font-weight: 500
.card-container
  padding: 16px 24px
@media screen and (max-device-width: 600px)
  .register
    padding: 16px 2px
  .card-container
    padding: 16px 8px
</style>
