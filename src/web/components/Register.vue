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
        autocomplete(ref="firstName" label="First Name" required=true
          :options="playerOptions"
          :process="processPlayers"
          :allowUserInput="true"
          :dataStruct="{ description: '', shownText: '', data: {} }"
          :bindValue="{ description: '', shownText: '', data: {} }"
          url="/api/members/search"
          @select="selectPlayer($event)"
          @updateInputOnly="firstName = $event")
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
        v-layout.mt-1(column justify-start)
          div
            span.label Bye Requests
          div.pl-5.bye
            v-checkbox(label="Round 1" v-model="byes" value="1")
            v-checkbox(label="Round 2" v-model="byes" value="2")
            v-checkbox(label="Round 3" v-model="byes" value="3")
        v-text-field(label="Section" v-model="tournamentSection.title" disabled)
        v-text-field(label="Entry Fee" v-model="strEntryFee" disabled)
        v-layout.mt-2(row justify-center)
          v-btn(round :disabled="!inputValidated" @click.native="gotoPaypal") Submit
          v-dialog(v-model="progressDialog" max-width="290")
            v-card
              v-layout(justify-center style="padding: 24px 24px")
                v-progress-circular(indeterminate v-bind:size="50" color="green")
          v-dialog(v-model="messageDialog", persistent max-width="290")
            v-card
              v-card-text {{ message }}
              v-card-actions
                v-layout(justify-center)
                  v-btn(color="blue darken-1" flat @click.native="messageDialog = false") Close
  v-card
</template>

<script>
import axios from 'axios'
import Autocomplete from 'components/Autocomplete'
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
      items: [],
      progressDialog: false,
      messageDialog: false,
      message: '',
      playerOptions: []
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
          'description': state.tournamentSection.title + ' section',
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
    gotoPaypal () {
      this.progressDialog = true
      axios.post('/api/registrations', {
        firstName: this.firstName,
        lastName: this.lastName,
        uscfId: this.uscfId,
        rating: this.rating,
        email: this.email,
        phone: this.phone,
        tournament: this.tournamentSection.name,
        section: this.tournamentSection.section,
        sectionText: this.tournamentSection.title,
        byes: this.byes,
        payment: this.tournamentSection.entryFee
      })
        .then(response => {
          // let business = 'yongzhi_chen-facilitator@yahoo.com'
          let business = 'bostonelitechess@gmail.com'
          let params = []
          params.push('cmd=_cart')
          params.push('business=' + business)
          params.push('lc=US')
          params.push('item_name=' + this.tournamentSection.name + ' - ' + this.tournamentSection.title)
          params.push('item_number=0916')
          params.push('on0=' + this.uscfId)
          params.push('os0=' + this.firstName + ' ' + this.lastName)
          params.push('amount=' + this.tournamentSection.entryFee)
          params.push('currency_code=USD')
          params.push('button_subtype=products')
          params.push('add=1')
          params.push('bn=PP-ShopCartBF:btn_cart_LG.gif:NonHosted')
          params.push('no_shipping=1')
          params.push('rm=1')
          params.push('return=http://www.bostonelitechess.org/')
          params.push('cancel_return=http://www.bostonelitechess.org')
          let paramStr = params.join('&')
          let url = 'https://www.paypal.com/cgi-bin/webscr?' + encodeURI(paramStr)
          // let url = 'https://www.sandbox.paypal.com/cgi-bin/webscr?' + encodeURI(paramStr)
          console.log(url)
          this.progressDialog = false
          window.open(url, '_self')
        })
        .catch(err => {
          console.log(err)
          if (err.response.data.code === 'USCFID_NOT_EXISTED') {
            this.progressDialog = false
            this.message = err.response.data.message
            this.messageDialog = true
          }
        })
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
        section: this.tournamentSection.section,
        sectionText: this.tournamentSection.title,
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
    processPlayers (data) {
      let rst = []
      for (let i = 0; i < data.length; i++) {
        let player = data[i]
        let firstName = player.firstName.split(' ')[0]
        rst.push({
          data: player,
          shownText: firstName,
          description: `${firstName} ${player.lastName}, ${player.uscfId}, ${player.rating}`
        })
        // currently comment out sorting because sorting results in bad performance
        // rst.sort((a, b) => a.description.localeCompare(b.description))
      }
      return rst
    },
    selectPlayer (event) {
      console.log(event.data)
      let data = event.data
      let fields = ['firstName', 'lastName', 'uscfId', 'rating']
      for (let i = 0; i < fields.length; i++) {
        let field = fields[i]
        if (data[field]) {
          this[field] = data[field]
        } else {
          this.$refs[field].reset()
        }
      }
    },
    reset () {
      let fields = ['firstName', 'lastName', 'uscfId', 'rating', 'email', 'phone']
      for (let i = 0; i < fields.length; i++) {
        let field = fields[i]
        this[field] = null
        this.$refs[field].reset()
      }
    }
  },
  components: {
    Autocomplete
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
.label
  color: rgba(0, 0, 0, .54)
  font-size: 16px
@media screen and (max-device-width: 600px)
  .register
    padding: 16px 2px
  .card-container
    padding: 16px 8px
</style>
