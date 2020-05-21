import * as types from '../mutation-types'
import { Message } from 'element-ui'
import { getClusterDetailApi, getClusterListByQueryApi } from '@/utils/api'

// initial state
const state = {
  clusterDetail: {},
  loading: false,
  clusterResult: [],
  queryLoading: false
}

// getters
const getters = {
}

// actions
const actions = {
  async getClusterDetail ({ commit }, { name }) {
    commit(types.SAVE_CLUSTER_DETAIL_LOADING, true)
    try {
      const { data } = await getClusterDetailApi(name)
      commit(types.SAVE_CLUSTER_INFO, data)
    } catch ({ error }) {
      Message.error(`Fali to get cluster detail: ${error}`)
    }
    commit(types.SAVE_CLUSTER_DETAIL_LOADING, false)
  },
  async getClusterResult ({ commit }, { name }) {
    commit(types.SAVE_CLUSTER_DETAIL_LOADING, true)
    try {
      const { data: { items } } = await getClusterListByQueryApi({
        name
      })
      commit(types.SAVE_CLUSTER_BY_QUERY, items)
    } catch ({ error }) {
      Message.error(`Fali to get cluster result: ${error}`)
    }
    commit(types.SAVE_CLUSTER_DETAIL_LOADING, false)
  }
}

// mutations
const mutations = {
  [types.SAVE_CLUSTER_INFO] (state, data) {
    state.clusterDetail = data
  },
  [types.SAVE_CLUSTER_DETAIL_LOADING] (state, loading) {
    state.loading = loading
  },
  [types.SAVE_CLUSTER_BY_QUERY] (state, data) {
    state.clusterResult = data
  },
  [types.SAVE_CLUSTER_BY_QUERY_LOADING] (state, queryLoading) {
    state.queryLoading = queryLoading
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
