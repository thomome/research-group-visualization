import Vue from 'vue'
import Vuex from 'vuex'

import { intersect } from './util.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    lang: 'de',
    topic: { list: [], data: {}, selected: [] },
    institution: { list: [], data: {}, selected: [] },
    canton: { list: [], data: {}, selected: [] },
    head: { list: [], data: {}, selected: [] },
    group: { list: [], data: {}, selected: [] },
  },
  mutations: {

    setData(state, data){
      for(let d in data.data){
        const r = data.data[d]
        Vue.set(state[data.list].data, r.id, r)
        state[data.list].list.push(r.id)
      }
    },

    setSelected(state, data){
      Vue.set(state[data.list], 'selected', data.data)
    },

    updateData(state, data){
      if(!data.replace) data.data = $.extend(true, {}, state[data.list].data[data.id], data.data)
      Vue.set(state[data.list].data, data.id, data.data)
    }
  },
  getters: {
    topics({topic}){
      return topic.list.map(id => topic.data[id])
    },
    institutions({institution}){
      return institution.list.map(id => institution.data[id])
    },
    cantons({canton}){
      return canton.list.map(id => canton.data[id])
    },
    heads({head}){
      return head.list.map(id => head.data[id])
    },
    groups(state, getters){
      let groups = state.group.list.map(id => state.group.data[id])
      const slcC = state.canton.selected
      const slcI = state.institution.selected
      const slcH = state.head.selected
      const slcT = state.topic.selected

      groups = groups.filter((v) => {
        return  (
          (slcC.length === 0 || slcC.indexOf(v.cantonId) != -1) &&
          (slcI.length === 0 || slcI.indexOf(v.institutionId) != -1) &&
          (slcH.length === 0 || intersect(slcH, v.headIds).length > 0) &&
          (slcT.length === 0 || intersect(slcT, v.topicIds).length >= slcT.length)
        )
      })

      return groups
    },
    selected(state, getters){
      return (label) => {
        return state[label].selected.map(id => state[label].data[id])
      }
    }
  }
})
