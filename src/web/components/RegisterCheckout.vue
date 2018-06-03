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
        v-text-field(label="First Name" v-model="firstName" required
          ref="firstName" :rules="[() => !!firstName || 'This field is required']")
        v-text-field(label="Last Name" v-model="lastName" required
          ref="lastName" :rules="[() => !!lastName || 'This field is required']")
        v-text-field(label="USCF ID" :mask="'########'" v-model="uscfId" required
          ref="uscfId" :rules="[() => !!uscfId || 'This field is required']")
        v-text-field(label="Rating (approx.)" v-model="rating" required
          ref="rating" :rules="[() => !!rating || 'This field is required']")
        v-text-field(label="E-mail" v-model="email" required
          ref="email" :rules="[() => !!email || 'This field is required']")
        v-text-field(label="Phone" :mask="'phone'" v-model="phone" required
          ref="phone" :rules="[() => !!phone || 'This field is required']")
        v-text-field(label="Section" v-model="tournamentSection.section" disabled)
        v-layout.mt-1(column justify-start)
          div Bye Requests
          div.pl-5.bye
            v-checkbox(label="Round 1" v-model="byes" value="1")
            v-checkbox(label="Round 2" v-model="byes" value="2")
            v-checkbox(label="Round 3" v-model="byes" value="3")
        v-text-field(label="Entry Fee" v-model="strEntryFee" disabled)
        v-layout.mt-2(v-if="inputValidated" row justify-center)
          paypal(:amount="tournamentSection.entryFee"
            currency='USD'
            :client="credentials"
            :items="items"
            env="sandbox"
            v-on:payment-authorized="paymentAuthorized"
            v-on:payment-completed="paymentCompleted"
            v-on:payment-cancelled="paymentCancelled")
        v-layout.mt-2(v-else row justify-center)
          v-btn(round disabled style="text-transform: none !important;") PayPal Checkout
  v-card
</template>

<script>
import axios from 'axios'
import Paypal from 'vue-paypal-checkout'
import { mapState } from 'vuex'
import router from '../router'

export default {
  name: 'Register',
  data () {
    return {
      firstName: null,
      lastName: null,
      uscfId: null,
      rating: null,
      email: null,
      phone: null,
      strEntryFee: null,
      byes: [],
      credentials: {
        sandbox: 'AXNafu-VjtJs09w_Pi1tXF_CPHdk2pzOiQloTnKNtDGSapeXzbavWHiJteAjQOUpRehwSNyRI8QiC50a',
        // sandbox: 'AXRMJY8iGUQ_0fe5Fv0wlu_CsuGI15m-3h8fxZX5M5J-_EoN44YEahBpo-HBCop_0q0eHaiqVrO01__l',
        production: 'production client id'
      },
      items: []
    }
  },
  computed: {
    ...mapState({
      tournamentSection (state) {
        console.log(state.tournamentSection.name)
        this.strEntryFee = '$' + state.tournamentSection.entryFee
        this.items = []
        this.items.push({
          'name': state.tournamentSection.name,
          'description': state.tournamentSection.section + ' section',
          'quantity': '1',
          'price': state.tournamentSection.entryFee,
          'currency': 'USD'
        })
        return state.tournamentSection
      }
    }),
    inputValidated () {
      return (!!this.firstName && !!this.lastName && !!this.uscfId && !!this.rating && !!this.email && !!this.phone)
    }
  },
  methods: {
    toHome () {
      router.push('/home')
    },
    paymentAuthorized (data) {
      console.log('logged in PayPal')
    },
    paymentCompleted (data) {
      console.log('complete payment')
      console.log(data)
      console.log(this.byes)
      axios.post('/api/players', {
        firstName: this.firstName,
        lastName: this.lastName,
        uscfId: this.uscfId,
        rating: this.rating,
        email: this.email,
        phone: this.phone,
        tournament: this.tournamentSection.name,
        section: this.tournamentSection.section.toLowerCase(),
        byes: this.byes,
        payment: this.tournamentSection.entryFee
      })
        .then(response => {
          console.log(response.data)
          let data = response.data
          let player = {
            name: data.firstName + ' ' + data.lastName,
            rating: data.rating,
            id: data.uscfId,
            state: data.state,
            byes: (data.byes && data.byes.length > 0) ? 'Round ' + data.byes.join(',') : ''
          }
          this.$store.commit('addTournamentPlayer', player)
          router.push('/players')
        })
        .catch(err => {
          console.log(err)
        })
    },
    paymentCancelled (data) {
      console.log('cancel payment')
    }
  },
  components: {
    Paypal
  }
}
</script>

<style lang="stylus">
.register .bye .input-group__details
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
