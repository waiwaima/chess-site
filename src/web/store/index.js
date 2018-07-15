import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null,
    tournamentSection: {
      name: '',
      section: '',
      title: '',
      entryFee: 0
    },
    players: []
  },
  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user
    },
    setTournamentSection (state, tournament) {
      state.tournamentSection.name = tournament.name
      state.tournamentSection.section = tournament.section
      state.tournamentSection.title = tournament.title
      state.tournamentSection.entryFee = tournament.entryFee
    },
    setTournamentPlayers (state, players) {
      state.players = players
    },
    addTournamentPlayer (state, player) {
      if (state.players.filter(e => e.id === player.id).length === 0) {
        state.players.push(player)
      }
    }
  }
})
