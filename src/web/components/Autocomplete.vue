<template lang="pug">
div.autocomplete
  v-text-field.input-field(v-model.trim="keyword.shownText"
    :id="id"
    :name="name"
    :label="label"
    :rules="validationRules"
    @input="onInput"
    @keyup.esc="isOpen = false"
    @blur="blur"
    @keydown.down="moveDown"
    @keydown.up="moveUp"
    @keydown.enter="select"
    onclick="this.focus(); this.select()"
    hide-details)
  v-card.autocomplete-option-panel(v-show="isOpen")
    ul(class="option-list")
      li(v-for="(option, index) in filteredOptions"
        :key="index"
        :class="{'highlighted': index === highlightedPosition}"
        @mouseenter="highlightedPosition = index"
        @mousedown="select")
        // slot(name="item" :option="option")
        P.mb-0
          span.ml-2 {{ option.description }}
</template>

<script>
import axios from 'axios'
window.onscroll = function () { resetAutoCompletePosition() }

export default {
  name: 'Autocomplete',
  props: {
    id: String,
    name: String,
    label: String,
    // local option list
    options: Array,
    // retrieve options locally which match keyword
    retrieveOptions: Function,
    // url to retrieve options from remote server
    url: String,
    // url query params
    params: Object,
    // for pax input, to tag name field when processing
    filedType: String,
    // process the result retrieved from server before showing options
    process: Function,
    // rules for validation
    validationRules: Array,
    // pass in value from searchCon
    bindValue: Object,
    // data struct for keyword
    dataStruct: Object,
    // allowed for user input
    allowUserInput: Boolean
  },
  data () {
    return {
      keyword: {
        // baic template
        description: '', // description for options
        shownText: '',   // shown text in input filed
        title: ''        // actual saved data
      },
      isOpen: false,
      showErrorInput: false,
      highlightedPosition: 0,
      filteredOptions: [],
      scrolledY: 0
    }
  },
  mounted () {
    this.keyword = this.bindValue
  },
  watch: {
    bindValue: function (value) {
      this.keyword = value
    }
  },
  methods: {
    onInput () {
      resetAutoCompletePosition()
      this.highlightedPosition = 0
      this.isOpen = !!this.keyword.shownText
      this.filterOptions()
    },
    filterOptions () {
      const re = new RegExp(this.keyword.shownText, 'i')
      let rst
      if (this.retrieveOptions) {
        const data = this.retrieveOptions(this.options, this.keyword.shownText)
        rst = this.process(data, this.filedType)
        this.filteredOptions = rst
      } else {
        rst = this.options.filter(o => o.title.match(re))
      }

      if (!rst.length && this.url) {
        axios.get(this.url, {params: {keyword: this.keyword.shownText}})
          .then(response => {
            // console.log(response.data)
            const data = response.data
            rst = this.process(data, this.filedType)
            this.filteredOptions = rst
          })
          .catch(err => {
            console.log('Error in autoComplete:', err)
            this.filteredOptions = []
          })
      } else {
        this.filteredOptions = rst
      }
    },
    moveDown () {
      if (!this.isOpen || !this.filteredOptions.length) {
        return
      }
      this.highlightedPosition = (this.highlightedPosition + 1) % this.filteredOptions.length
    },
    moveUp () {
      console.log('key up...' + this.filteredOptions.length)
      if (!this.isOpen || !this.filteredOptions.length) {
        return
      }
      this.highlightedPosition = (this.highlightedPosition - 1) < 0
        ? (this.filteredOptions.length - 1)
        : (this.highlightedPosition - 1)
    },
    blur () {
      if (!this.allowUserInput) {
        this.select()
      } else {
        this.isOpen = false
        if (this.filedType === 'surName' || this.filedType === 'givenName') {
          this.keyword.shownText = this.keyword.shownText.toUpperCase()
        }
        this.$emit('updateInputOnly', this.keyword.shownText)
      }
      this.$emit('blur')
    },
    select () {
      this.isOpen = false
      if (this.filedType === 'surName' || this.filedType === 'givenName') {
        this.keyword.shownText = this.keyword.shownText.toUpperCase()
      }
      const selectedOption = this.filteredOptions[this.highlightedPosition]
      if (selectedOption === undefined || this.keyword.shownText === '') {
        if (this.allowUserInput) {
          this.$emit('updateInputOnly', this.keyword.shownText)
          return
        }
        this.keyword = this.dataStruct
      } else {
        this.keyword = selectedOption
      }
      this.$emit('select', this.keyword)
    }
  }
}

function resetAutoCompletePosition () {
  var distanceFromTop = document.documentElement.scrollTop
  var panels = document.getElementsByClassName('autocomplete-option-panel')
  for (let i = 0; i < panels.length; i++) {
    panels[i].style.marginTop = (-8 - distanceFromTop) + 'px'
  }
}

</script>
<style lang="stylus">
.input-field > .input-group__input > input[type="text"],
.input-field label
  font-size: 14px
</style>

<style lang="stylus" scoped>
.autocomplete
  width: 100%
  height: 100%
.input-field
  width: 100%
  height: 38px
  min-width: 100px
  max-width: 220px
.autocomplete-option-panel
  z-index: 6
  position: fixed
  overflow-y: auto
  overflow-x: hidden
  margin-top: -8px
  margin-left: 0
  max-height: 320px
ul
  list-style-type: none
  padding: 0
li
  display: inline-block
  margin: 0 10px
ul.option-list
  display: flex
  flex-direction: column
  border-radius: 0 0 3px 3px
  width: 100%
  overflow: hidden
ul.option-list li
  width: 100%
  flex-wrap: wrap
  background: white
  margin: 0
  color: #363636
  padding: 7px
  cursor: pointer
ul.option-list li.highlighted
  background: rgb(224, 224, 224)
</style>
