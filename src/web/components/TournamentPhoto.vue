<template lang="pug">
.photo
  v-layout(column justify-start)
    v-flex(x12 sm6)
      v-card
        v-card-media.tournament(class="white--text" src="/static/tournament.jpg")
          v-container(fill-height fluid)
            v-layout(fill-height)
              v-flex(xs12 align-end flexbox)
                span(class="headline") 1st BECA Tournament
        v-card-actions
          v-btn(flat color="orange" @click.native="explore") See more photos
    v-flex.mt-2
      v-card
        v-card-title(primary-title)
          div
            h3.pl-2 Venue
        v-container(fluid grid-list-sm)
          v-layout(row wrap)
            v-flex(xs12 sm6 v-for="i in 4" :key="i")
              img.image(:src="`/static/venue-${i}.jpg`" alt="lorem" width="100%" height="100%")
</template>

<script>
export default {
  name: 'TournamentPhoto',
  methods: {
    explore () {
      let win = window.open('https://photos.app.goo.gl/UYAG0YvvSOZkZXdx1', '_blank')
      win.focus()
    }
  }
}
</script>

<style lang="stylus" scoped>
.photo
  width: 100%
  padding: 16px 16px
  background-color: #f7f7f6
  text-align: left
.tournament
  height: 300px !important
@media screen and (max-device-width: 600px)
  .photo
    padding: 16px 0
  .tournament
    height: 200px !important
</style>
