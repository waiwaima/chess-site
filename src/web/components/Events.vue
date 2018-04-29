<template lang="pug">
.events
  v-layout(v-if="listEvent" row align-start)
    v-flex(xs12 sm6)
      v-card
        v-list(two-line)
          template(v-for="(t, i) in tournaments")
            v-list-tile(:key="t.value" @click="displayResult(t.value)")
              v-list-tile-content
                v-list-tile-title {{ t.name }}
                v-list-tile-sub-title {{ t.date }}
            v-divider(v-if="i < tournaments.length - 1")
  div(v-else)
    v-layout(row justify-start align-center style="margin-top: -12px; margin-left: -2px")
      v-btn(flat icon color="primary" @click="toggleView")
        v-icon keyboard_backspace
      span Back to tournament list
    div.highlight {{ selectedTournamentName }}
    div
      v-layout(v-if="loading" justify-center)
        v-progress-circular(indeterminate color="teal")
      v-tabs#section(v-else-if="hasPhoto")
        v-tabs-bar
          v-tabs-item(href="#tab-standings" ripple) Standings
          v-tabs-item(v-if="hasPhoto" href="#tab-photos" ripple) Photos
          v-tabs-slider(color="orange")
        v-tabs-items
          v-tabs-content(id="tab-standings")
            v-card.result
              div(style="overflow:auto; width:100%")
                div(v-html="selectedTournamentStandingHtml")
          v-tabs-content(id="tab-photos")
            tournament-photo
      v-card.result.elevation-0(v-else)
        div(style="overflow:auto; width:100%")
          div(v-html="selectedTournamentStandingHtml")
</template>

<script>
import axios from 'axios'
import TournamentPhoto from './TournamentPhoto'

export default {
  name: 'Events',
  data () {
    return {
      listEvent: true,
      tournaments: [
        {name: '1st Boston Elite Quads Invitational', date: 'April 8, 2018', value: '1st-quads-invitational', hasPhoto: false},
        {name: '1st Boston Elite Chess Tournament', date: 'February 11, 2018', value: '1st-chess-tournament', hasPhoto: true}
      ],
      selectedTournamentName: '',
      selectedTournamentStandingHtml: '',
      hasPhoto: false,
      loading: false
    }
  },
  methods: {
    displayResult (tournament) {
      if (tournament === this.selectedTournamentName) {
        this.toggleView()
        return
      }
      for (let i = 0; i < this.tournaments.length; i++) {
        if (tournament === this.tournaments[i].value) {
          this.selectedTournamentName = this.tournaments[i].name
          this.hasPhoto = this.tournaments[i].hasPhoto
          break
        }
      }
      this.selectedTournamentStandingHtml = ''
      this.loading = true
      this.toggleView()
      axios.get('/api/standings/' + tournament)
        .then(response => {
          this.loading = false
          this.selectedTournamentStandingHtml = response.data.standing
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    toggleView () {
      this.listEvent = !this.listEvent
    }
  },
  components: {
    TournamentPhoto
  }
}
</script>

<style lang="stylus">
.events .tabs .tabs__item.tabs__item--active
  color: white !important
  font-weight: 600
.events .tabs .tabs__li
  border-radius: 2px
  width: 100px
  color: white
  background-color: #3497f0
.events .tabs__li
  margin: 2px
  width: auto
.events .tabs__slider
  height: 3px
.events #section .tabs__content
  transition: none
.events td
  border: 1px solid #cccccc
  margin: 0
  padding: 0.5em
  font-size: inherit
  overflow: visible
</style>

<style lang="stylus" scoped>
.events
  width: 100%
  padding: 16px 16px
  background-color: #f7f7f6
.highlight
  padding: 0 0 16px 14px
  color: #cc6553
  font-size: 1.3em
  font-weight: 500
.result
  padding: 16px 16px
@media screen and (max-device-width: 600px)
  .events
    padding: 16px 2px
  .result
    padding: 8px 2px
</style>
