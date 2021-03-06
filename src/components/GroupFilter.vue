<template>
  <div class="eight wide field">
    <label>
      <i :class="[icon, 'icon']"></i> <span>{{ title }}</span>
      <i v-if="label === 'topic'" class="question circle link primary icon" style="color: #069; vertical-align: super; line-height: 0;" @click="openTopicHelp"></i>
    </label>

    <div tabindex="-1" ref="dropdown" :class="[isLoading ? 'loading':'', active ? 'active visible':'', 'ui fluid multiple search selection dropdown']" @focus="setActive()">
      <i class="dropdown icon"></i>

      <a v-for="sel in selectedWidthInfo" :key="`sel.${label}.${sel.id}`" class="ui label large transition visible" :data-value="sel.id">
        {{sel.name}} <span v-if="sel.short">({{sel.short}})</span><i class="delete icon" @click="removeSelected(sel.id)"></i>
      </a>

      <input class="search" autocomplete="off" tabindex="0" v-model="query" ref="input" @focus="setActive()" @blur="setInactive($event)" @keyup="addFirstSelected($event)">
      <span ref="sizer" class="sizer">{{query}}</span>

      <div v-show="active" class="menu active visible" ref="menu">
        <template v-if="active">
          <div v-for="opt in options" :key="`opt.${label}.${opt.id}`" :class="[opt.main ? 'bold' : '', opt.id === options[index].id ? 'selected':'','item']" :data-value="opt.id" @click="addSelected(opt.id)">
            {{ opt.name }} <span v-if="opt.short">({{opt.short}})</span>
          </div>
          <div v-if="options.length < 1" class="message">{{ noResults }}</div>
        </template>
      </div>
    </div>

  </div>
</template>

<script>

  import { sortLocale, accentFold } from './../util.js'

  export default {
    name: 'group-filter',
    props: ['data','label', 'icon'],
    data: function(){
      return {
        active: false,
        index: 0,
        query: '',
        amountToShow: 10
      }
    },
    methods: {
      openTopicHelp(){
        open(`./topics.html#${this.$store.state.language.selected}`, '_blank', 'scrollbars=yes,height=600,width=450, left=30, top=30')
      },
      addFirstSelected(e){
        if(e.which === 13){
          if(this.options.length > 0) this.addSelected(this.options[this.index].id)
        } else if(e.which === 40){
          if(this.index < this.options.length-1) this.index++
        } else if(e.which === 38){
          if(this.index > 0) this.index--
        } else if(e.which === 8){
          if(this.query.length < 1){
            if(this.selected.length > 0) this.removeSelected(this.selected[this.selected.length-1])
          }
        }
      },
      addSelected(id) {
        const selected = this.selected.map(id => id);
        selected.push(id)
        this.selected = selected
        this.query = ''
        this.index = 0
      },
      removeSelected(id) {
        const selected = this.selected.map(id => id)
        const index = selected.indexOf(id)
        selected.splice(index, 1)
        this.selected = selected
        this.index = 0
      },
      setActive(e){
        this.active = true
        this.$refs.input.focus()
        this.index = 0
      },
      setInactive(e){
        const relatedTarget = e.relatedTarget || e.explicitOriginalTarget || document.activeElement
        if(!relatedTarget || !this.$refs.dropdown.contains(relatedTarget)){
          this.active = false
          this.$refs.menu.scrollTop = 0
          this.amountToShow = 10
          this.query = ''
        }
      }
    },
    computed: {
      title(){
        return this.$store.getters.term(this.label)
      },
      noResults(){
        return this.$store.getters.term('no_results')
      },
      isLoading(){
        return this.$store.state[this.label].list < 1
      },
      options(){
        const amount = this.amountToShow
        const options = this.data.sort(sortLocale('name')).filter((o) => {
          const name = accentFold(o.name.toLowerCase())
          const short = o.short ? accentFold(o.short.toLowerCase()) : ""
          const query = accentFold(this.query.toLowerCase())

          return (
            (this.$store.state[this.label].selected.indexOf(o.id) === -1) &&
            (name.indexOf(query) !== -1 || short.indexOf(query) !== -1))
        }).slice(0, amount)
        return options
      },
      selected: {
        get(){
          return this.$store.state[this.label].selected
        },
        set(value){
          this.$store.commit('setSelected', {
            list: this.label,
            data: value
          })
        }
      },
      selectedWidthInfo() {
        if(!this.isLoading){
          const options = this.options
          return this.selected.map((id) => this.$store.state[this.label].data[id])
        } else {
          return []
        }
      }
    },

    watch: {
      query(val){
        const sizer = this.$refs.sizer
        const input = this.$refs.input
        sizer.style.display = 'inline-block'
        input.style.width = sizer.clientWidth + 'px'
        sizer.style.display = 'none'
        this.index = 0
      }
    },

    mounted: function(){
      this.$refs.menu.addEventListener('scroll', (e) => {
        if(e.target.clientHeight + e.target.scrollTop + 50 > e.target.scrollHeight) {
          this.amountToShow += 10
        }
      })
    },
    destroyed: function(){
    },
    updated: function(){
      this.eventHub.$emit('app-resize')
    }
  }
</script>

<style lang="less">
  .ui.dropdown {
    .menu>.item.bold {
      font-weight: 900;
    }
    .label {
      user-select: none;
      display: inline-block;
      vertical-align: top;
      white-space: normal;
      font-size: 1em;
      padding: 0.3125em 0.8125em;
      margin: 0.125rem 0.25rem 0.125rem 0em;
      box-shadow: 0px 0px 0px 1px rgba(34, 36, 38, 0.15) inset;
    }
    .menu.active.visible {
      display: block;
    }
    .search {
      width: 100%;
    }
  }
</style>
