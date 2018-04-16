<template lang="pug">
.venue
  v-layout(column)
    .highlight Nearby Restaurants
    div.mt-1.mr-1
      span.subtitle On site restaurant:
    div
      ul.highlight-ml
        li One Bistro (
          a(href="https://www.onebistro.com" target="_blank")
            span website
          span )
    div.mt-1.mr-1
      span.subtitle Across route 1, U turn on Morse St (0.2 miles):
    div
      ul.highlight-ml
        li Subway, 36 Vanderbilt Ave, Norwood, MA 02062
        li Indian, Paradise Biryani (
          a(href="http://www.norwoodparadise.com" target="_blank")
            span website
          span )
        li Japanese, Yamato Hibachi (
          a(href="http://www.yamatohibachima.com/norwood/" target="_blank")
            span website
          span )
        li Japanese, Hibachi Steak House  (
          a(href="http://www.hibachistkhouse.com" target="_blank")
            span website
          span )
        li Pizza, Olivios (
          a(href="http://www.oliviospizzeria.com" target="_blank")
            span website
          span )
    div.mt-1.mr-1
      span.subtitle Along route 1 (within 1 mile):
    div
      ul.highlight-ml
        li Thai, Siam Lotus (
          a(href="http://www.siamlotusrestaurant.com" target="_blank")
            span website
          span )
        li Bertucci’s, 1405 Providence Hwy, Norwood, MA 02062
        li Chipotle, 1415 Providence Hwy, Norwood, MA 02062
        li Friendly’s, 1469 Providence Hwy, Norwood, MA 02062
        li Sky, American, business lounge (
          a(href="http://skynorwood.restaurant " target="_blank")
            span website
          span )
        li Bon Caldo, Italian, upscale (
          a(href="http://www.boncaldo.com" target="_blank")
            span website
          span )
    div.mt-1.mr-1
      span.subtitle Walpole mall (1.2 miles, along route 1):
    div
      ul.highlight-ml
        li Panda Express
        li Panera Bread
        li Taco Bell
        li Five Guys
        li Chili’s
        li Papa Gino’s
        li Texas Roadhouse
</template>

<script>
export default {
  name: 'Venue'
}
</script>

<style lang="stylus" scoped>
.venue
  width: 100%
  padding: 16px 16px
  background-color: #f7f7f6
  text-align: left
.align-left
  text-align: left
.highlight
  padding: 0 0
  color: #cc6553
  font-size: 1.8em
  font-weight: 600
.highlight-ml
  margin-left: 32px
.subtitle
  font-weight: 600
</style>
