<template lang="pug">
.player
  quadsplayer(v-if="quadsTournament")
  swissplayer(v-else)
</template>

<script>
import SwissPlayer from 'components/SwissPlayer'
import QuadsPlayer from 'components/QuadsPlayer'

export default {
  name: 'Player',
  data () {
    return {
      quadsTournament: false
    }
  },
  components: {
    swissplayer: SwissPlayer,
    quadsplayer: QuadsPlayer
  }
}
</script>

<style lang="stylus" scoped>
.player
  width: 100%
</style>
