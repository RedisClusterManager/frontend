import Vue from 'vue'
import Vuex from 'vuex'
import clusters from './modules/cluster'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    clusters
  },
  strict: debug
})
