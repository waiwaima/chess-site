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
                    span.name 2nd Boston Elite Chess Tournament
                v-flex(xs12 align-end flexbox)
                  v-layout(column justify-center)
                    span.detail Sunday, May 6, 2018
                v-flex(xs12 align-end flexbox)
                  v-layout(column)
                    span.detail Four Points by Sheraton Norwood
                    span.detail 1125 Boston-Providence Turnpike, Norwood, MA
                v-flex(xs12 align-end flexbox)
                  v-layout(column justify-center)
                    span.detail 3RR, G/80 d5
                    span.detail Rounds: 10:00am / 2:00pm / 5:30pm
      // v-flex(xs12)
        v-layout.section(row wrap)
          v-card.first
            v-layout(column align-start)
              div
                span.name Master:
                span.ml-2 Open to USCF 2000+
              div.content
                span.subtitle Entry Fee:
                ul.ml-4
                  li $55 by 5/5, $65 onsite
                  li $10 discount for 2300+
                  li GM/IM/FM/WGM/WIM/WFM free
              div.content
                span.subtitle Money Prizes:
                ul.ml-4
                  li 1st -- $150, 2nd -- $100
                  li Top U2200 -- $80
              v-layout.action(row justify-center)
                v-btn(small @click.native="register") Register
          v-card.other
            v-layout(column align-start)
              div
                span.name U2000:
                span.ml-2 Open to USCF 1600 - 1999
              div.content
                span.subtitle Entry Fee:
                ul.ml-4
                  li $45 by 5/5, $55 onsite
                  li $10 discount for 1950+
              div.content
                span.subtitle Money Prizes:
                ul.ml-4
                  li 1st -- $150
                  li 2nd -- $100
              v-layout.action.action-mt(row justify-center)
                v-btn(small @click.native="register") Register
          v-card.last
            v-layout(column align-start)
              div
                span.name U1600:
                span.ml-2 Open to USCF 1200 - 1599
              div.content
                span.subtitle Entry Fee:
                ul.ml-4
                  li $45 by 5/5, $55 onsite
                  li $10 discount for 1550+
              div.content
                span.subtitle Money Prizes:
                ul.ml-4
                  li 1st -- $120
                  li 2nd -- $80
              v-layout.action.action-mt(row justify-center)
                v-btn(small @click.native="register") Register
      // div.mt-3.ml-3.mr-1.align-left * February 2018 supplemental rating is used for registration/pairing/prize purposes. Live rating on the registration date can be used for registration as well.
      // div.mt-1.ml-3.mr-1.align-left
        span.subtitle Registration - Online:
        span.ml-2 PayPal payment to
        span(style="color: blue").ml-1 bostonelitechess@gmail.com
        span.ml-1 or via
        a(href="http://masschess.org/Events/Event_Details.aspx?Event_ID=6197" target="_blank")
          span.ml-1 the MACA website.
      div.mt-1.ml-3.mr-1.align-left
        span.subtitle Schedule:
        span.ml-2 Onsite registration 9:00am - 9:30am. All byes need to be declared before the 1st round; last round 0 point bye only.
      div.mt-1.ml-3.mr-1.align-left
        span.subtitle Contact:
        span.ml-2 Questions to
        span(style="color: blue").ml-1 bostonelitechess@gmail.com
      div.mt-1.ml-3.mr-1.align-left * Please bring your own chess set and clock.
      // div.mt-3
        .highlight Highlights
        ul.align-left.mt-2.highlight-ml
          li GM Iotov, GM Ivanov and IM Shmelov confirmed to play, and will review games with their opponents when time allows. The confirmed IM/GMs will NOT be paired to play each other, and will not be eligible for money prize.
          li Free GM game analysis available by
            a(href="https://translate.google.com/translate?hl=en&sl=de&u=https://de.wikipedia.org/wiki/Leonid_Kritz&prev=search" target="_blank")
              span.ml-1 GM Leonid Kritz
            span.ml-1 and
            a(href="https://en.wikipedia.org/wiki/Nadezhda_Kosintseva" target="_blank")
              span.ml-1 GM Nadezhda Kosintseva
            span . GM analysis priority to lower sections.
          li Very competitive tournament with top players and top scholastic players in Massachusetts.
          li Winner of the lower section will be invited to play in the next upper section in the next tournament. No play-up allowed otherwise.
          li Full-time college students get 50% discount on entry fee.
      div.mt-3
        .highlight Rule Variations
        div.mt-1.ml-3.mr-1.align-left
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
export default {
  name: 'Home',
  data () {
    return {}
  },
  methods: {
    register () {
      let win = window.open('http://masschess.org/Events/Event_Registration.aspx?Event_ID=6197&Record_ID=3041', '_blank')
      win.focus()
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
  font-size: 2.3em
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
