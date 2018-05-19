import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null,
    tournamentSection: {
      name: '',
      section: '',
      entryFee: 0
    }
  },
  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user
    },
    setTournamentSection (state, tournament) {
      state.tournamentSection.name = tournament.name
      state.tournamentSection.section = tournament.section
      state.tournamentSection.entryFee = tournament.entryFee
    }
  }
})
