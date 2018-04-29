<template lang="pug">
.photo
  v-card
    v-card-title(primary-title)
      div
        h3.pl-2 Tournament
    v-container(fluid grid-list-sm)
      v-layout(row wrap)
        v-flex(xs12 sm6 v-for="i in 16" :key="i")
          img.image(:src="`/static/featured/bechess-${i}.jpg`" alt="lorem" width="100%" height="100%")
</template>

<script>
export default {
  name: 'Photo',
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
