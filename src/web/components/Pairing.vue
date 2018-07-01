<template lang="pug">
.pairing
  .admin.mb-2(v-if="user === 'admin'")
    v-layout(row justify-space-between wrap)
      div
        .subtitle
          span Upload
        v-card
          v-layout(row justify-start wrap)
            div
              input(type="file" ref="masterPairingInput" @change="e => handleUploadPairing(e, 'master')" hidden)
              input(type="file" ref="u2000PairingInput" @change="e => handleUploadPairing(e, 'u2000')" hidden)
              input(type="file" ref="u1600PairingInput" @change="e => handleUploadPairing(e, 'u1600')" hidden)
              v-menu(open-on-hover offset-y)
                v-btn(outline color="primary" slot="activator") Pairings
                v-list
                  v-list-tile(v-for="item in tabs" :key="item.value" @click="uploadPairing(item.value)")
                    v-list-tile-title {{ item.text }}
            div
              input(type="file" ref="wallchartInput" @change="handleUploadWallchart" hidden)
              v-btn(outline color="primary" @click.native="uploadWallchart") Wallchart
            div
              input(type="file" ref="standingInput" @change="handleUploadStanding" hidden)
              v-btn(outline color="primary" @click.native="uploadStanding") Standings
      div
        .subtitle
          span Delete
        v-card
          v-layout(row justify-start wrap)
            v-menu(open-on-hover offset-y)
              v-btn(outline color="error" slot="activator") Pairings
              v-list
                v-list-tile(v-for="item in tabs" :key="item.value" @click="deletePairing(item.value)")
                  v-list-tile-title {{ item.text }}
            v-btn(outline color="error" @click.native="deleteWallchart") Wallchart
            v-btn(outline color="error" @click.native="deleteStanding") Standings
    v-divider.mt-3
  v-layout(row justify-space-between)
    div.round
      span Round
      span.ml-3 {{ round }}
    v-btn.refresh(:loading="refresh" @click.native="reload" :disabled="refresh" small) refresh
      v-icon(right dark) refresh
  v-tabs#section.mt-2(v-model="active")
    v-tabs-bar
      v-tabs-item(v-for="tab in tabs" :key="tab.value" :href="'#' + tab.value" ripple) {{ tab.text }}
      v-tabs-slider(color="orange")
    v-tabs-content(v-for="tab in tabs" :key="tab.value" :id="tab.value")
      v-card.result
        div.content-selction
          v-radio-group(v-model="content[tab.value]" row)
            v-radio(label="Pairings" value="pairings")
            v-radio(label="Wallchart" value="wallchart")
            v-radio(label="Standings" value="standings")
        div(style="overflow:auto; width:100%;")
          div(v-html="pairingsHtml[tab.value]" v-if="content[tab.value] === 'pairings'")
          div.wallchart(v-html="wallchartHtml[tab.value]" v-if="content[tab.value] === 'wallchart'")
          div(v-html="standingsHtml[tab.value]" v-if="content[tab.value] === 'standings'")
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'Pairing',
  data () {
    return {
      round: '1',
      refresh: false,
      loaded: {
        standings: false,
        wallchart: false,
        master: false,
        u2000: false
        // u1600: false
      },
      active: 'master',
      tabs: [
        {text: 'Master', value: 'master'},
        {text: 'U2000', value: 'u2000'}
        // {text: 'U1600', value: 'u1600'}
      ],
      wallchartHtml: {
        master: '',
        u2000: '',
        u1600: ''
      },
      standingsHtml: {
        master: '',
        u2000: '',
        u1600: ''
      },
      pairingsHtml: {
        master: '',
        u2000: '',
        u1600: ''
      },
      content: {
        master: 'pairings',
        u2000: 'pairings',
        u1600: 'pairings'
      }
    }
  },
  computed: {
    ...mapState({
      user (state) {
        return state.currentUser
      }
    })
  },
  methods: {
    uploadWallchart () {
      this.$refs.wallchartInput.click()
    },
    handleUploadWallchart (e) {
      let file = this.$refs.wallchartInput.files[0]
      console.log(file)
      let formData = new FormData()
      formData.append('file', file)
      axios.post('/api/wallchart', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(response => {
          console.log('Uploaded ' + file.name)
          this.loadWallchart()
        })
        .catch(err => {
          console.log(err)
        })
    },
    uploadStanding () {
      this.$refs.standingInput.click()
    },
    handleUploadStanding (e) {
      let file = this.$refs.standingInput.files[0]
      console.log(file)
      let formData = new FormData()
      formData.append('file', file)
      axios.post('/api/standings', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(response => {
          console.log('Uploaded ' + file.name)
          this.loadStanding()
        })
        .catch(err => {
          console.log(err)
        })
    },
    uploadPairing (section) {
      this.$refs[section + 'PairingInput'].click()
    },
    handleUploadPairing (e, section) {
      let file = this.$refs[section + 'PairingInput'].files[0]
      console.log(section)
      console.log(file)
      let formData = new FormData()
      formData.append('file', file)
      axios.post('/api/pairings/' + section, formData, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(response => {
          console.log('Uploaded ' + file.name)
          this.loadPairing(section)
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteWallchart () {
      axios.delete('/api/wallchart')
        .then(response => {
          console.log('Deleted wallchart')
          this.loadWallchart()
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteStanding () {
      axios.delete('/api/standings')
        .then(response => {
          console.log('Deleted wallchart')
          this.loadStanding()
        })
        .catch(err => {
          console.log(err)
        })
    },
    deletePairing (section) {
      axios.delete('/api/pairings/' + section)
        .then(response => {
          console.log('Deleted pairings for ' + section)
          this.loadPairing(section)
        })
        .catch(err => {
          console.log(err)
        })
    },
    loadWallchart () {
      axios.get('/api/wallchart')
        .then(response => {
          this.updateLoadStatus('wallchart', true)
          if (this.isLoaded()) {
            this.refresh = false
          }
          this.wallchartHtml = {
            master: response.data.master,
            u2000: response.data.u2000,
            u1600: response.data.u1600
          }
        })
        .catch(err => {
          console.log(err)
          this.updateLoadStatus('wallchart', true)
          if (this.isLoaded()) {
            this.refresh = false
          }
          this.wallchartHtml = {
            master: '',
            u2000: '',
            u1600: ''
          }
        })
    },
    loadStanding () {
      axios.get('/api/standings')
        .then(response => {
          this.updateLoadStatus('standings', true)
          if (this.isLoaded()) {
            this.refresh = false
          }
          this.standingsHtml = {
            master: response.data.master,
            u2000: response.data.u2000,
            u1600: response.data.u1600
          }
        })
        .catch(err => {
          console.log(err)
          this.updateLoadStatus('standings', true)
          if (this.isLoaded()) {
            this.refresh = false
          }
          this.standingsHtml = {
            master: '',
            u2000: '',
            u1600: ''
          }
        })
    },
    loadPairing (section) {
      axios.get('/api/pairings/' + section)
        .then(response => {
          this.updateLoadStatus(section, true)
          if (this.isLoaded()) {
            this.refresh = false
          }
          if (response.data.round) {
            this.round = response.data.round
          }
          this.pairingsHtml[section] = response.data[section]
        })
        .catch(err => {
          console.log(err)
          this.updateLoadStatus(section, true)
          if (this.isLoaded()) {
            this.refresh = false
          }
          this.pairingsHtml = {
            master: '',
            u2000: '',
            u1600: ''
          }
        })
    },
    reload () {
      this.refresh = true
      this.initLoadStatus()
      this.loadWallchart()
      this.loadStanding()
      // const sections = ['master', 'u2000', 'u1600']
      const sections = ['master', 'u2000']
      for (let i = 0; i < sections.length; i++) {
        this.loadPairing(sections[i])
      }
    },
    initLoadStatus () {
      for (let prop in this.loaded) {
        if (this.loaded.hasOwnProperty(prop)) {
          this.loaded[prop] = false
        }
      }
    },
    updateLoadStatus (prop, value) {
      this.loaded[prop] = value
    },
    isLoaded () {
      // console.log(JSON.parse(JSON.stringify(this.loaded)))
      let rst = true
      for (let prop in this.loaded) {
        if (this.loaded.hasOwnProperty(prop) && !this.loaded[prop]) {
          rst = false
          break
        }
      }
      return rst
    }
  },
  created () {
    this.reload()
  }
}
</script>

<style lang="stylus">
.pairing .tabs .tabs__item.tabs__item--active
  color: white !important
  font-weight: 600
.pairing .tabs .tabs__li
  border-radius: 2px
  width: 100px
  color: white
  background-color: #3497f0
.pairing .tabs__li
  margin: 2px
  width: auto
.pairing .tabs__slider
  height: 3px
.pairing #section .tabs__content
  transition: none
.pairing .input-group__details
  min-height: 16px
.pairing td, .pairing .wallchart th
  border: 1px solid #cccccc
  margin: 0
  padding: 0.5em
  font-size: inherit
  overflow: visible
.pairing .wallchart tbody tr:nth-child(4n+3), .pairing .wallchart tbody tr:nth-child(4n)
  background-color: #f1f1f1
</style>

<style lang="stylus" scoped>
.pairing
  width: 100%
  padding: 16px 16px
  background-color: #f7f7f6
  text-align: left
.admin button
  text-transform: none
.admin .subtitle
  font-weight: 600
  padding-left: 8px
  padding-bottom: 4px
.upload
  padding: 16px 16px
.round
  font-size: 1.8em
  font-weight: 600
  color: #cc6553
  padding-left: 8px
.pairing button.refresh
  color: #fff
  background-color: #cc6553 !important
.result
  padding: 0 16px
.content-selction
  width: 350px
  padding-left: 8px
@media screen and (max-device-width: 600px)
  .pairing
    padding: 16px 2px
  .result
    padding: 0 0
</style>
