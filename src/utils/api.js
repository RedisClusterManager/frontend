import request from '@/utils/request'

// 根据关键字搜索获取 cluster 列表
const getClusterListByQueryApi = params => {
  return request.get(`api/clusters`, {
    params
  })
}

// 获取 appid 列表
const getAppidsApi = params => {
  return request.get(`api/appids`, {
    params
  })
}
// 获取 version
const getVersionsApi = params => {
  return request.get('api/versions')
}

// 获取 appid 详情
const getAppidDetailApi = params => {
  return request.get(`api/appids/${params}`)
}

// 获取 cluster 详情
const getClusterDetailApi = params => {
  return request.get(`api/clusters/${params}`)
}

// 解除 cluster 和 appid 的绑定
const removeCorrelationApi = (clusterName, params) => {
  return request.delete(`api/clusters/${clusterName}/appid`, {
    data: params
  })
}

// 删除 cluster
const deleteClusterApi = (clusterName, params) => {
  return request.delete(`api/clusters/${clusterName}`)
}

// 创建 cluster
const createClusterApi = params => {
  return request.post('api/clusters/create', params)
}

// 更新 cluster
const updateClusterApi = (clusterName, params) => {
  return request.post(`api/clusters/${clusterName}`, params)
}

// 添加 cluster 和 appid 关联
const addCorrelationApi = (clusterName, params) => {
  return request.post(`api/clusters/${clusterName}/appid`, params)
}

// 新增 appid
const addAppIdApi = (params) => {
  return request.post('api/appids', params)
}

// 重启节点
const restartInstanceApi = (clusterName, instance) => {
  return request.post(`api/clusters/${clusterName}/instance/${instance}/restart`)
}

export {
  getClusterListByQueryApi,
  getAppidsApi,
  getVersionsApi,
  getAppidDetailApi,
  getClusterDetailApi,
  removeCorrelationApi,
  deleteClusterApi,
  createClusterApi,
  updateClusterApi,
  addCorrelationApi,
  addAppIdApi,
  restartInstanceApi
}
