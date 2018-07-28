<template lang="pug">
.events
  div(v-if="listEvent")
    v-layout(column justify-center)
      v-layout(row justify-center)
        div.highlight Finished Tournaments
      v-layout.mt-2(row justify-center)
        v-flex(xs12 sm8)
          v-card
            v-list(two-line)
              template(v-for="(t, i) in tournaments")
                v-list-tile(avator :key="t.value" @click="displayResult(t.value)")
                  v-list-tile-avatar(size="32px")
                    img(src="/static/32-tournament.png")
                  v-list-tile-content
                    v-list-tile-title {{ t.name }}
                    v-list-tile-sub-title {{ t.date }}
                v-divider(v-if="i < tournaments.length - 1")
      v-layout.mt-4(row justify-center)
        div.highlight What People Are Saying
      v-layout.mt-2.mb-2(row justify-center v-for="(t, i) in testimonials" :key="i")
        v-flex(xs12 sm8)
          v-card.pt-3.pr-3.pb-3.pl-3
            v-layout(column)
              v-layout(row justify-center)
                v-avatar(size="64px")
                  img(:src="t.img")
              v-layout.mt-3(row justify-start)
                div.testimonial {{ t.content }}
              v-layout.mt-3(row justify-end)
                div {{ t.name }}
              v-layout(v-if="t.title" row justify-end)
                div {{ t.title }}
              v-layout(v-if="t.other" row justify-end)
                div {{ t.other }}
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
            // tournament-photo
            v-layout.photo(column justify-start)
              v-flex(x12 sm6)
                v-card
                  v-card-media.tournament(class="white--text" :src="photoIcon")
                  v-card-actions
                    v-btn(flat color="orange" @click.native="explore(photoLink)") See more photos
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
        {
          name: '2nd Boston Elite Chess Tournament',
          date: 'July 1, 2018',
          value: '2nd-chess-tournament',
          hasPhoto: true,
          photoIcon: '/static/events/2nd-chess-tournament.jpg',
          photoLink: 'https://photos.app.goo.gl/7RU7X6k3YxBYWRKN7'
        },
        {
          name: '1st Boston Elite Quads Invitational',
          date: 'April 8, 2018',
          value: '1st-quads-invitational',
          hasPhoto: false
        },
        {
          name: '1st Boston Elite Chess Tournament',
          date: 'February 11, 2018',
          value: '1st-chess-tournament',
          hasPhoto: true,
          photoIcon: '/static/events/1st-chess-tournament.jpg',
          photoLink: 'https://photos.app.goo.gl/UYAG0YvvSOZkZXdx1'
        }
      ],
      selectedTournamentName: '',
      selectedTournamentStandingHtml: '',
      hasPhoto: false,
      photoIcon: '',
      photoLink: '',
      loading: false,
      testimonials: [
        {
          img: '/static/t-robert.png',
          content: '"I want to thank you for such a fine event, for all the reasons you mentioned. But also I want to mention that the hotel was a good venue. It was spacious, quiet, with very clean restrooms, and very hospitable."',
          name: '-- Robert Oresick, MA'
        },
        {
          img: '/static/t-mike.png',
          content: '"Thank you for a very well run tournament. The organization was terrific! I appreciate the rules that you followed. The venue was excellent — spacious, great lighting, clean, modern. The website was a nice plus. It was nice to have free parking at the hotel as well, and the location was convenient. Will definitely play in future events if you hold them."',
          name: '-- Michael Carey, RI',
          title: 'National Master',
          other: '2017 Rhode Island Champion'
        },
        {
          img: '/static/t-lawyer.png',
          content: '"It is was a very nice creative chess tournament. I liked it. ... ... Thank you once again for an innovative thoughtful tournament."',
          name: '-- Lawyer Times, MA',
          title: 'National Master',
          other: '2017 Massachusetts Champion'
        },
        {
          img: '/static/t-sterling.png',
          content: '"Thanks for an outstanding tournament! This was exceptionally well run. I look forward to the next."',
          name: '-- Nicholas P. Sterling, Ph.D., MA',
          title: 'USCF Chess Tournament Director'
        }
      ]
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
          if (this.hasPhoto) {
            this.photoIcon = this.tournaments[i].photoIcon
            this.photoLink = this.tournaments[i].photoLink
          }
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
    },
    explore (url) {
      let win = window.open(url, '_blank')
      win.focus()
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
.photo
  padding: 24px 8px
.tournament
  height: 300px !important
.testimonial
  font-style: italic
.highlight
  padding: 0 0
  color: #cc6553
  font-size: 1.8em
  font-weight: 600
@media screen and (max-device-width: 600px)
  .events
    padding: 16px 2px
  .result
    padding: 8px 2px
  .photo
    padding: 16px 0
  .tournament
    height: 200px !important
  .highlight
    font-size: 1.4em
</style>
