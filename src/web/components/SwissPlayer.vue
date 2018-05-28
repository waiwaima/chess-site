<template lang="pug">
.swiss-player
  v-layout(column justify-start)
    v-flex
      v-layout(row justify-start)
        v-icon date_range
        span.ml-2 Advance entries through {{ today }}
    v-flex
      v-layout(row justify-start)
        v-icon people_outline
        span.fw-600.ml-2 Total number of players: {{ items.length }}
    v-flex.mt-2(xs12 md10)
      v-tabs#section(v-model="active")
        v-tabs-bar
          v-tabs-item(v-for="tab in tabs" :key="tab.value" :href="'#' + tab.value" ripple) {{ tab.text }}
          v-tabs-slider(color="orange")
        v-tabs-content(v-for="tab in tabs" :key="tab.value" :id="tab.value")
          v-card
            v-data-table(:headers="headers" :items="players[tab.value]" hide-actions)
              template(slot="items" slot-scope="props")
                td(class="text-xs-left") {{ props.item.number }}
                td(class="text-xs-left") {{ props.item.name }}
                td(class="text-xs-left") {{ props.item.rating }}
                td(class="text-xs-left")
                  a(:href="'http://www.uschess.org/msa/MbrDtlMain.php?' + props.item.id" target="_blank")
                    span {{ props.item.id }}
                td(class="text-xs-left") {{ props.item.state }}
                td(class="text-xs-left") {{ props.item.byes }}
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
const moment = require('moment')
moment.locale()

export default {
  name: 'SwissPlayer',
  data () {
    return {
      active: 'master',
      tabs: [
        {text: 'Master', value: 'master'},
        {text: 'U2000', value: 'u2000'},
        {text: 'U1600', value: 'u1600'},
        {text: 'U1200', value: 'u1200'}
      ],
      headers: [
        {text: '#', value: 'number', align: 'left', sortable: false},
        {text: 'Name', value: 'name', align: 'left', sortable: false},
        {text: 'Rating', value: 'rating', align: 'left', sortable: false},
        {text: 'USCF ID', value: 'id', align: 'left', sortable: false},
        {text: 'State', value: 'state', align: 'left', sortable: false},
        {text: 'Byes', value: 'byes', align: 'left', sortable: false}
      ],
      items: [
        {name: 'GM Valentin I Yotov', state: 'NY', rating: 2571, id: '13484812', byes: ''},
        {name: 'GM Alex Ivanov', state: 'MA', rating: 2579, id: '12513936', byes: ''},
        {name: 'IM Denys Shmelov', state: 'MA', rating: 2535, id: '13433622', byes: ''},
        {name: 'FM Steve Winer', state: 'MA', rating: 2446, id: '12549813', byes: ''},
        {name: 'FM Nathan Solon', state: 'MA', rating: 2333, id: '12637883', byes: ''},
        {name: 'NM Sherif Khater', state: 'MA', rating: 2277, id: '12748218', byes: ''},
        {name: 'NM Michael Isakov', state: 'MA', rating: 2260, id: '14109882', byes: ''},
        {name: 'NM Lawyer Times', state: 'MA', rating: 2258, id: '12167330', byes: ''},
        {name: 'NM Samuel He', state: 'WA', rating: 2257, id: '13978467', byes: ''},
        {name: 'NM Angel Hernandez-Camen', state: 'MA', rating: 2212, id: '14320958', byes: ''},
        {name: 'CM Jerry Li', state: 'MA', rating: 2109, id: '15391332', byes: ''},
        {name: 'Dustin Liang', state: 'MA', rating: 2135, id: '15072460', byes: ''},
        {name: 'Danila Poliannikov', state: 'MA', rating: 2177, id: '14969622', byes: ''},
        {name: 'Alan Zhang', state: 'NJ', rating: 2174, id: '14430870', byes: ''},
        {name: 'Alan Song', state: 'MA', rating: 2161, id: '15418978', byes: ''},
        {name: 'Suraj Ramanathan', state: 'MA', rating: 2152, id: '14361257', byes: ''},
        {name: 'NM J Timothy Sage', state: 'MA', rating: 2138, id: '10146712', byes: ''},
        {name: 'Jason Tang', state: 'MA', rating: 2133, id: '14217571', byes: ''},
        {name: 'Ilya Figelman', state: 'MA', rating: 2086, id: '12414619', byes: ''},
        {name: 'Michael Carey', state: 'RI', rating: 2084, id: '10120560', byes: ''},
        {name: 'Alex Yu', state: 'MA', rating: 2079, id: '14581805', byes: ''},
        {name: 'Maxwell Chen', state: 'MA', rating: 2077, id: '14678004', byes: ''},
        {name: 'Jack Cheng', state: 'RI', rating: 2083, id: '15482577', byes: ''},
        {name: 'Anton Barash', state: 'MA', rating: 2057, id: '13679247', byes: ''},
        {name: 'David Zhou', state: 'MA', rating: 2045, id: '15194137', byes: ''},
        {name: 'Derek Jin', state: 'MA', rating: 2042, id: '15200352', byes: ''},
        {name: 'Zubin Baliga', state: 'MA', rating: 2025, id: '13744248', byes: ''},
        {name: 'Nicholas Belous', state: 'MA', rating: 2012, id: '15039926', byes: ''},
        {name: 'Bernie Xu', state: 'MA', rating: 1981, id: '14940771', byes: ''},
        {name: 'Vinod Vishwanath', state: 'MA', rating: 1970, id: '15819108', byes: ''},
        {name: 'Derek Zhao', state: 'MA', rating: 1917, id: '15131158', byes: ''},
        {name: 'Yuriy Zhaurov', state: 'MA', rating: 1941, id: '14256202', byes: ''},
        {name: 'Peter Pashkov', state: 'MA', rating: 1945, id: '12600882', byes: ''},
        {name: 'Carl Hess', state: 'MA', rating: 1796, id: '10029295', byes: ''},
        {name: 'Alon Trogan', state: 'MA', rating: 1891, id: '14304943', byes: ''},
        {name: 'Alan Sikarov', state: 'MA', rating: 1957, id: '13679232', byes: ''},
        {name: 'Joy Cao', state: 'MA', rating: 1827, id: '14973655', byes: ''},
        {name: 'Ryan Wang', state: 'MA', rating: 1794, id: '15486461', byes: ''},
        {name: 'Tianna Wang', state: 'MA', rating: 1747, id: '15486476', byes: ''},
        {name: 'Yue Huang', state: 'MA', rating: 1750, id: '15130107', byes: ''},
        {name: 'Thomas Ha', state: 'MA', rating: 1816, id: '15207334', byes: ''},
        {name: 'David Katsman', state: 'MA', rating: 1788, id: '14958088', byes: ''},
        {name: 'Kevin James Hass', state: 'MA', rating: 1767, id: '15531186', byes: ''},
        {name: 'David Martin', state: 'MA', rating: 1660, id: '12877246', byes: ''},
        {name: 'Sandra Shur', state: 'MA', rating: 1679, id: '14817520', byes: ''},
        {name: 'Kevin Liu', state: 'MA', rating: 1768, id: '15582141', byes: ''},
        {name: 'Skyler Zhou', state: 'MA', rating: 1736, id: '15456428', byes: ''},
        {name: 'Victor Feng', state: 'MA', rating: 1749, id: '15560438', byes: ''},
        {name: 'Rafael Pashkov', state: 'MA', rating: 1696, id: '15251590', byes: ''},
        {name: 'Carah Su', state: 'MA', rating: 1687, id: '15456152', byes: ''},
        {name: 'Kelsey Liu', state: 'MA', rating: 1685, id: '15770981', byes: ''},
        {name: 'Ananth Rangan', state: 'NH', rating: 1681, id: '15163642', byes: ''},
        {name: 'Raymond Xu', state: 'MA', rating: 1617, id: '15248334', byes: ''},
        {name: 'Eric Feng', state: 'MA', rating: 1669, id: '15742464', byes: ''},
        {name: 'Brandon Ni', state: 'MA', rating: 1638, id: '15801498', byes: ''},
        {name: 'Sai Sneha Yerra', state: 'NH', rating: 1633, id: '15993891', byes: ''},
        {name: 'Kevin Li', state: 'MA', rating: 1618, id: '15465238', byes: ''},
        {name: 'Henry He', state: 'MA', rating: 1607, id: '15714654', byes: ''},
        {name: 'Jeremy Rosenholtz', state: 'MA', rating: 1607, id: '15786752', byes: ''},
        {name: 'Alexander Meng', state: 'MA', rating: 1564, id: '15844061', byes: ''},
        {name: 'Justin Li', state: 'MA', rating: 1537, id: '15826242', byes: ''},
        {name: 'Robert Oresick', state: 'MA', rating: 1536, id: '12659519', byes: ''},
        {name: 'Daniel Levin', state: 'MA', rating: 1518, id: '16075826', byes: ''},
        {name: 'Amy Lei', state: 'MA', rating: 1517, id: '15760000', byes: ''},
        {name: 'Arjun Girish', state: 'MA', rating: 1515, id: '15471954', byes: ''},
        {name: 'Sofia Trakhtenberg', state: 'MA', rating: 1501, id: '16110964', byes: ''},
        {name: 'Saanvi Tiruveedhula', state: 'NH', rating: 1466, id: '15087552', byes: ''},
        {name: 'Andrew Su', state: 'MA', rating: 1464, id: '15518741', byes: ''},
        {name: 'Riya A. Kanury', state: 'MA', rating: 1492, id: '16066054', byes: ''},
        {name: 'Maruthi Tiruveedhula', state: 'NH', rating: 1389, id: '15087546', byes: ''},
        {name: 'Ansh Yadawad', state: 'MA', rating: 1506, id: '15842414', byes: ''},
        {name: 'Sophia Rosenholtz', state: 'MA', rating: 1432, id: '15263723', byes: ''},
        {name: 'Chase Yarbrough', state: 'MA', rating: 1386, id: '14717371', byes: ''},
        {name: 'Maya Figelman', state: 'MA', rating: 1350, id: '15439823', byes: ''},
        {name: 'Danial Ge', state: 'MA', rating: 1253, id: '16065814', byes: ''},
        {name: 'Isaac Gordon', state: 'MA', rating: 1343, id: '15190993', byes: ''},
        {name: 'Isabella Lai', state: 'MA', rating: 1315, id: '15990974', byes: ''},
        {name: 'Isaac Chen', state: 'MA', rating: 1300, id: '15966891', byes: ''},
        {name: 'Prachi Dayal', state: 'MA', rating: 1303, id: '16442640', byes: ''},
        {name: 'Owen Ji', state: 'MA', rating: 1268, id: '16225038', byes: ''},
        {name: 'Henry Han', state: 'MA', rating: 1275, id: '14728674', byes: ''},
        {name: 'Kurt Amber', state: 'MA', rating: 1275, id: '15955011', byes: ''}
      ]
    }
  },
  computed: {
    today () {
      return moment(new Date()).format('MMMM D, YYYY')
    },
    ...mapState({
      players (state) {
        let items = state.players
        items.sort((a, b) => {
          let aRating = parseInt(a.rating)
          let bRating = parseInt(b.rating)
          return (bRating - aRating)
        })
        const rst = {
          master: [],
          u2000: [],
          u1600: [],
          u1200: []
        }
        for (let i = 0; i < items.length; i++) {
          if (items[i].rating > 1999) {
            items[i].number = rst.master.length + 1
            rst.master.push(items[i])
          } else if (items[i].rating > 1599) {
            items[i].number = rst.u2000.length + 1
            rst.u2000.push(items[i])
          } else if (items[i].rating > 1199) {
            items[i].number = rst.u1600.length + 1
            rst.u1600.push(items[i])
          } else {
            items[i].number = rst.u1200.length + 1
            rst.u1200.push(items[i])
          }
        }
        return rst
      }
    })
  },
  methods: {
    load () {
      this.items = []
      axios.get('/api/players')
        .then(response => {
          console.log(response.data)
          this.$store.commit('setTournamentPlayers', response.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created () {
    this.load()
  }
}
</script>

<style lang="stylus">
.swiss-player .tabs .tabs__item.tabs__item--active
  color: white !important
  font-weight: 600
.swiss-player .tabs .tabs__li
  border-radius: 2px
  width: 100px
  color: white
  background-color: #3497f0
.swiss-player .tabs__li
  margin: 2px
  width: auto
.swiss-player .tabs__slider
  height: 3px
.swiss-player #section .tabs__content
  transition: none
.swiss-player table.table tbody td
  height: 40px
.swiss-player table.table tbody td:first-child, .swiss-player table.table thead th:first-child
  padding: 0 0 0 24px
</style>

<style lang="stylus" scoped>
.swiss-player
  width: 100%
  padding: 16px 16px
  background-color: #f7f7f6
.total
  color: #cc6553
.fw-600
  font-weight: 600
@media screen and (max-device-width: 600px)
  .swiss-player
    padding: 16px 2px
</style>
