<template lang="pug">
div.autocomplete
  v-text-field(ref="inputField" v-model.trim="keyword.shownText"
    :id="id"
    :name="name"
    :label="label"
    :required="required"
    :rules="rules"
    @input="onInput"
    @keyup.esc="isOpen = false"
    @blur="blur"
    @keydown.down="moveDown"
    @keydown.up="moveUp"
    @keydown.enter="select"
    onclick="this.focus()")
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
    required: Boolean,
    // local option list
    options: Array,
    // retrieve options locally which match keyword
    retrieveOptions: Function,
    // url to retrieve options from remote server
    url: String,
    // url query params
    params: Object,
    // process the result retrieved from server before showing options
    process: Function,
    // rules for validation
    validationRules: Array,
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
        data: ''        // actual saved data
      },
      isOpen: false,
      showErrorInput: false,
      highlightedPosition: 0,
      filteredOptions: [],
      scrolledY: 0
    }
  },
  computed: {
    rules () {
      let rst = []
      if (this.required) {
        rst.push(() => !!this.keyword.shownText || 'This field is required')
      }
      if (this.validationRules && this.validationRules.length) {
        rst = rst.concat(this.validationRules)
      }
      return rst
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
      // first try to find the matched optioins from local list if there are
      if (this.retrieveOptions) {
        const data = this.retrieveOptions(this.options, this.keyword.shownText)
        rst = this.process(data)
        this.filteredOptions = rst
      } else {
        rst = this.options.filter(o => o.data.match(re))
      }

      // if there is no matched in the local option list, retrieve from remote server
      if (!rst.length && this.url) {
        axios.get(this.url, {params: {keyword: this.keyword.shownText}})
          .then(response => {
            // console.log(response.data)
            const data = response.data
            rst = this.process(data)
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
      console.log('... in blur ...')
      if (!this.allowUserInput) {
        this.select()
      } else {
        this.isOpen = false
        this.$emit('updateInputOnly', this.keyword.shownText)
      }
      this.$emit('blur')
    },
    select () {
      console.log('... in select ...')
      this.isOpen = false
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
    },
    reset () {
      this.$refs['inputField'].reset()
    }
  }
}

function resetAutoCompletePosition () {
  let distanceFromTop = document.documentElement.scrollTop
  let panels = document.getElementsByClassName('autocomplete-option-panel')
  for (let i = 0; i < panels.length; i++) {
    panels[i].style.marginTop = (-8 - distanceFromTop) + 'px'
  }
}

</script>

<style lang="stylus" scoped>
.autocomplete
  width: 100%
  height: 100%
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
