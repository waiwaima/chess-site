<template lang="pug">
.home
  v-layout.outter(row)
    v-layout(column)
      v-flex(xs12)
        v-card
          v-card-media(height="300px" src="/static/chess-background.jpg")
            v-container.tournament(fill-height fluid)
              v-layout(column)
                v-flex(xs12 align-end flexbox)
                    span.name {{ tournamentName }}
                v-flex(xs12 align-end flexbox)
                  v-layout(column justify-center)
                    span.detail Sunday, September 16, 2018
                v-flex(xs12 align-end flexbox)
                  v-layout(column)
                    span.detail Four Points by Sheraton Norwood
                    span.detail 1125 Boston-Providence Turnpike, Norwood, MA
                    // span.detail SMART School
                    // span.detail 1320 Centre St, Newton, MA
                v-flex(xs12 align-end flexbox)
                  v-layout(column justify-center)
                    span.detail 3SS, G/90 d5
                    span.detail Rounds: 10:00am, 1:45pm, 5:30pm
      v-flex(xs12)
        v-layout.section(row wrap)
          v-card.first
            v-layout(row align-center)
              v-layout(column align-start)
                div.name Master
                div.subname Open to USCF 1950+
                div.content
                  span.subtitle Entry Fee:
                  ul.ml-4
                    li $50 by 8/15
                    li $55 by 9/8
                    li $60 by 9/15
                    li $65 onsite
                    li GM/IM/WGM free
                div.content
                  span.subtitle Money Prizes
                  span.ml-3 (Guaranteed):
                  ul.ml-4
                    li 1st -- $400
                    li 2nd -- $200
                    li 3rd -- $100
                v-layout.action(row justify-center)
                  v-btn(small @click.native="register('master')") Register
          v-card.other
            v-layout(column align-start)
              v-layout(row align-center)
              div.name U2050
              div.subname Open to USCF 1650 - 2050
              div.content
                span.subtitle Entry Fee:
                ul.ml-4
                  li $40 by 8/15
                  li $45 by 9/8
                  li $50 by 9/15
                  li $55 onsite
              div.content
                span.subtitle Money Prizes
                span.ml-3 (Guaranteed):
                ul.ml-4
                  li 1st -- $250
                  li 2nd -- $150
                  li 3rd -- $80
              v-layout.action.action-mt(row justify-center)
                v-btn(small @click.native="register('u2000')") Register
          v-card.last
            v-layout(column align-start)
              div.name U1750
              div.subname Open to USCF 1300 - 1750
              div.content
                span.subtitle Entry Fee:
                ul.ml-4
                  li $40 by 8/15
                  li $45 by 9/8
                  li $50 by 9/15
                  li $55 onsite
              div.content
                span.subtitle Money Prizes
                span.ml-1 (with 20 paid entries):
                ul.ml-4
                  li 1st -- $250
                  li 2nd -- $150
                  li 3rd -- $80
              v-layout.action.action-mt(row justify-center)
                v-btn(small @click.native="register('u1600')") Register
          // v-card.light-background
            v-layout(column align-start)
              div.name U1200
              div.subname Open to USCF 800 - 1199
              div.content
                span.subtitle Entry Fee:
                ul.ml-4
                  li $45 by 6/23
                  li 50 by 6/30
                  li $55 onsite
              div.content
                span.subtitle Prizes:
                ul.ml-4
                  li 40% entry fee
                  li Trophies or money prizes
              v-layout.action.action-mt(row justify-center)
                      v-btn(small @click.native="register('u1200')") Register
      // div.mt-3.ml-3.mr-1.align-left * February 2018 supplemental rating is used for registration/pairing/prize purposes. Live rating on the registration date can be used for registration as well.
      // div.mt-1.ml-3.mr-1.align-left
        span.subtitle Registration - Online:
        span.ml-2 PayPal payment to
        span(style="color: blue").ml-1 bostonelitechess@gmail.com
        span.ml-1 or via
        a(href="http://masschess.org/Events/Event_Details.aspx?Event_ID=6197" target="_blank")
          span.ml-1 the MACA website.
      // div.mt-1.ml-3.mr-1.align-left
        span.subtitle Schedule:
        span.ml-2 Onsite registration 9:00am - 9:30am. All byes need to be declared before the 1st round; last round 0 point bye only.
      // div.mt-1.ml-3.mr-1.align-left
        span.subtitle Contact:
        span.ml-2 Questions to
        span(style="color: blue").ml-1 bostonelitechess@gmail.com
      // div.mt-1.ml-3.mr-1.align-left * Please bring your own chess set and clock.
      // div.mt-3
        ul.align-left.mt-2.highlight-ml
          li
            span.text-highlight Entry fee:
            span.ml-1 $45 per person, $30 second sibling.
          li
            span.text-highlight Prizes:
            span.ml-1 $50 for the winner of each quad. If multiple players tie for the first place, the price will be shared equally between all of them, e.g. if two players tie for first place each player gets $25 etc.
          li
            a(href="https://translate.google.com/translate?hl=en&sl=de&u=https://de.wikipedia.org/wiki/Leonid_Kritz&prev=search" target="_blank")
              span GM Leonid Kritz
            span.ml-1 will be there and analyze games with the players.
          li Free parking available at the location for the whole day.
          li Please bring your own chess set and clock.
          li Contact Leonid Kritz (leonidkritz@gmail.com) if you have any questions.
      div.mt-3
        ul.align-left.mt-2.highlight-ml
          li Onsite registration 9:00am - 9:30am.
          li Withdraw: by 9/13, $1 process fee for Paypal refund; after that $5 process fee.
          li All byes need to be declared before the 1st round; last round 0 point bye only.
          li September 2018 supplemental rating is used for registration/pairing/prize purposes. Live rating on the registration date can be used for registration as well.
          li Please bring your own chess set and clock.
          li Contact
            span.ml-1.text-highlight Yi Wang
            span.ml-1 via
            span.ml-1(style="color: blue") bostonelitechess@gmail.com
            span.ml-1 if you have any questions. This tournament is listed on
            a(href="http://www.masschess.org/Events/Event_Details.aspx?Event_ID=6345" target="_blank")
              span.ml-1 MACA website
      div.mt-3
        .highlight Highlights
        ul.align-left.mt-2.highlight-ml
          // li GM Ivanov and IM Shmelov confirmed to play. The confirmed GM/IMs will NOT be paired to play each other, and will not be eligible for money prize.
          li US Chess Grand Prix Point: 15
          li Top female player prize available: 1-year membership at ChessOpeningsExplained.com, sponsored by GM Eugene Perelshteyn.
          li Free GM game analysis available by GM Leonid Kritz or GM Nadezhda Kosintseva.
          li First time players for Boston Elite Tournaments have $20 discount.
      div.mt-3
        .highlight Rule Variations
        // div.mt-1.ml-3.mr-1.align-left
          span.subtitle Late Arrival Forfeit:
          span.ml-2 A player can claim a forfeit no-show win if the opponent arrives
          span.ml-2.text-highlight 30 minutes
          span.ml-2 after starting the clock.
        div.mt-1.ml-3.mr-1.align-left
          span.subtitle Spectators:
          span.ml-2 To ensure the best environment for our players, we ask that spectators stay outside the tournament hall once the game starts.  Please consult a TD for special accommodations.
        div.mt-1.ml-3.align-left
          span.subtitle Electronic Devices Policy
          span.ml-1 (summary of key points)
          a(href="/static/ElectricalDevicePolicy.pdf" download="ElectricalDevicePolicy.pdf")
            span.ml-4 Download details
        div
          ul.align-left.highlight-ml
            li During play, players may not use cellphones or other electronic devices capable of chess analysis or communication.
            li To avoid potential misunderstanding, during play,
              ul.ml-3
                li players’ electronic devices must be stored out of sight and turned off
                li players may not possess such devices outside of the playing hall (including inside the bathroom)
                li players may not leave the tournament area, or go to a different floor of the hotel, during play without the TD’s permission
            li Penalty for violating above rules will result in forfeit or time deduction at TD’s discretion.
            li Players may contact a TD in advance for exception requests due to special circumstances.
    div.banner
      a(href="https://www.chess.com/?ref_id=11089448" target="_blank")
        img.hidden-sm-and-down(src="/static/chess-com-v.jpg" style="height: 510px")
        img.hidden-md-and-up(src="/static/chess-com-h.jpg" style="width: 100%")
</template>

<script>
import router from '../router'
const moment = require('moment')
moment.locale()

export default {
  name: 'Home',
  data () {
    return {
      tournamentName: '3rd Boston Elite Chess Tournament',
      master: {
        section: 'master',
        title: 'Master',
        description: '',
        fees: [
          { amount: 50, date: '8/15/18' },
          { amount: 55, date: '9/8/18' },
          { amount: 60, date: '9/15/18' },
          { amount: 65, date: '' }
        ],
        feeAdditions: ['GM/IM/WGM free'],
        prizes: []
      },
      u2000: {
        section: 'u2000',
        title: 'U2050',
        fees: [
          { amount: 40, date: '8/15/18' },
          { amount: 45, date: '9/8/18' },
          { amount: 50, date: '9/15/18' },
          { amount: 55, date: '' }
        ]
      },
      u1600: {
        section: 'u1600',
        title: 'U1750',
        fees: [
          { amount: 40, date: '8/15/18' },
          { amount: 45, date: '9/8/18' },
          { amount: 50, date: '9/15/18' },
          { amount: 55, date: '' }
        ]
      }
    }
  },
  methods: {
    register (section) {
      let info = {
        name: this.tournamentName,
        section: this[section].section,
        title: this[section].title,
        entryFee: 0
      }
      let fees = this[section].fees
      let rightNow = moment()
      for (let i = 0; i < fees.length; i++) {
        info.entryFee = fees[i].amount
        if (!fees[i].date) break
        let refDate = moment(fees[i].date, 'M/D/YY').add(1, 'day')
        console.log(refDate.format('LLL'))
        if (rightNow < refDate) break
      }
      this.$store.commit('setTournamentSection', info)
      router.push('/register')
    }
  }
}
</script>

<style lang="stylus" scoped>
.home
  width: 100%
  background-color: #f7f7f6
  text-align: center
.tournament .name
  color: #cc6553
  font-size: 1.8em
  font-weight: 600
.tournament .detail
  color: #cc6553
  font-size: 1.3em
  font-weight: 500
.section .card
  // background-color: #ece9e1
  background: url(/static/bg-card.jpg) 0 0 repeat
  margin-top: 24px
  padding: 16px 24px
  flex-grow: 1
.section .card.light-background
  background: url(/static/bg-card-light.jpg) 0 0 repeat
.section .first
  margin-right: 16px
.section .other
  margin-left: 16px
  margin-right: 16px
.section .last
  margin-left: 16px
.section .name
  font-size: 1.3em
  font-weight: 600
  text-align: center
  width: 100%
.section .subname
  text-align: center
  width: 100%
.section .content
  text-align: left
  margin-top: 8px
.section .action
  width: 100%
.section .action button
  color: #fff
  background-color: #cc6553 !important
.action-mt
  margin-top: 20px
.subtitle
  font-weight: 600
.text-highlight
  font-weight: 500
.align-left
  text-align: left
.highlight
  padding: 0 16px
  color: #cc6553
  font-size: 1.8em
  font-weight: 600
  text-align: left
.highlight-ml
  margin-left: 48px
.banner
  margin-left: 8px
@media screen and (max-device-width: 600px)
  .tournament .name
    font-size: 1.4em
  .tournament .detail
    font-size: 1.1em
  .section .first, .section .other, .section .last
    margin-left: 0
    margin-right: 0
  .highlight-ml
    margin-left: 28px
    margin-right: 4px
  .home .outter
    flex-wrap: wrap
  .banner
    margin: 24px 8px
</style>
