<template lang="pug">
.player
  v-layout(column justify-start)
    v-flex
      v-layout.pl-2.pr-2(row justify-start)
        v-icon people_outline
        span.ml-2 15 players
    v-flex(xs12 md9)
      div.mt-3(v-for="(quad, i) in quads" :key="i")
        span.fw-600.ml-2(v-if="i < quads.length") Quad {{ i + 1 }}
        // span.fw-600.ml-2(v-else) Small Swiss
        v-card.mt-1
          v-data-table(:headers="headers" :items="quad" hide-actions)
            template(slot="items" slot-scope="props")
              td(class="text-xs-left") {{ props.item.number }}
              td(class="text-xs-left")
                a(:href="'http://www.uschess.org/msa/MbrDtlMain.php?' + props.item.id" target="_blank")
                  span {{ props.item.name }}
              td(class="text-xs-left") {{ props.item.rating }}
              td(class="text-xs-left") {{ props.item.rd1 }}
              td(class="text-xs-left") {{ props.item.rd2 }}
              td(class="text-xs-left") {{ props.item.rd3 }}
</template>

<script>
const moment = require('moment')
moment.locale()

export default {
  name: 'Player',
  data () {
    return {
      headers: [
        {text: '#', value: 'number', align: 'left', sortable: false},
        {text: 'Name', value: 'name', align: 'left', sortable: false},
        {text: 'Rating', value: 'rating', align: 'left', sortable: false},
        {text: 'Rd 1', value: 'rd1', align: 'left', sortable: false},
        {text: 'Rd 2', value: 'rd2', align: 'left', sortable: false},
        {text: 'Rd 3', value: 'rd3', align: 'left', sortable: false}
      ],
      items: [
        {name: 'Peter  Pashkov', state: 'MA', rating: 1991, id: '12600882', byes: '', quad: 1},
        {name: 'Derek Zhao', state: 'MA', rating: 1906, id: '15131158', byes: '', quad: 1},
        {name: 'Joy Cao', state: 'MA', rating: 1811, id: '14973655', byes: '', quad: 1},
        {name: 'Kevin Liu', state: 'MA', rating: 1788, id: '15582141', byes: '', quad: 1},
        {name: 'Rafael Pashkov', state: 'MA', rating: 1825, id: '15251590', byes: '', quad: 2},
        {name: 'Skyler Zhou', state: 'MA', rating: 1770, id: '15456428', byes: '', quad: 2},
        {name: 'Raymond Xu', state: 'MA', rating: 1726, id: '15248334', byes: '', quad: 2},
        {name: 'Jeremy Rosenholtz', state: 'MA', rating: 1687, id: '15786752', byes: '', quad: 2},
        {name: 'Carah Su', state: 'MA', rating: 1719, id: '15456152', byes: '', quad: 3},
        {name: 'Kelsey Liu', state: 'MA', rating: 1708, id: '15770981', byes: '', quad: 3},
        {name: 'Justin Li', state: 'MA', rating: 1559, id: '15826242', byes: '', quad: 3},
        {name: 'Sophia Rosenholtz', state: 'MA', rating: 1505, id: '15263723', byes: '', quad: 3},
        {name: 'Paired later', state: 'MA', rating: 1300, id: '5187410', byes: '', quad: 4},
        {name: 'Michelle Zhang', state: 'MA', rating: 1230, id: '15879438', byes: '', quad: 4},
        {name: 'Maya Figelman', state: 'MA', rating: 1226, id: '15439823', byes: '', quad: 4},
        {name: 'Tyler Cummins', state: 'MA', rating: 1163, id: '16469055', byes: '', quad: 4}
      ],
      quads: []
    }
  },
  created () {
    this.items.sort((a, b) => {
      let aQuad = parseInt(a.quad)
      let bQuad = parseInt(b.quad)
      let aRating = parseInt(a.rating)
      let bRating = parseInt(b.rating)
      if (aQuad === bQuad) {
        return (bRating - aRating)
      } else {
        return (aQuad - bQuad)
      }
    })
    this.quads = []
    let length = 0
    let quad = []
    let curQuad = 1
    for (let i = 0; i < this.items.length; i++) {
      if (curQuad !== this.items[i].quad) {
        this.quads.push(quad)
        quad = []
        length = 0
        curQuad++
      }

      quad.push(this.items[i])
      length++
      this.items[i].number = length
      if (length === 1 && curQuad !== 8) {
        this.items[i].rd1 = 'W 4'
        this.items[i].rd2 = 'W 2'
        this.items[i].rd3 = 'B 3'
      } else if (length === 2 && curQuad !== 8) {
        this.items[i].rd1 = 'W 3'
        this.items[i].rd2 = 'B 1'
        this.items[i].rd3 = 'W 4'
      } else if (length === 3 && curQuad !== 8) {
        this.items[i].rd1 = 'B 2'
        this.items[i].rd2 = 'B 4'
        this.items[i].rd3 = 'W 1'
      } else if (curQuad !== 8) {
        this.items[i].rd1 = 'B 1'
        this.items[i].rd2 = 'W 3'
        this.items[i].rd3 = 'B 2'
      }
    }
    this.quads.push(quad)
  }
}
</script>

<style lang="stylus">
.player .tabs .tabs__item.tabs__item--active
  color: white !important
  font-weight: 600
.player .tabs .tabs__li
  border-radius: 2px
  width: 100px
  color: white
  background-color: #3497f0
.player .tabs__li
  margin: 2px
  width: auto
.player .tabs__slider
  height: 3px
.player #section .tabs__content
  transition: none
.player table.table tbody td
  height: 40px
.player table.table tbody td:first-child, .player table.table thead th:first-child
  padding: 0 0 0 24px
</style>

<style lang="stylus" scoped>
.player
  width: 100%
  padding: 16px 16px
  background-color: #f7f7f6
  text-align: left
.total
  color: #cc6553
.fw-600
  font-weight: 600
@media screen and (max-device-width: 600px)
  .player
    padding: 16px 2px
</style>
