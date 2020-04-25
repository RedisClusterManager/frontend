import http from '@/http/service'

// 根据关键字搜索获取 cluster 列表
const getClusterListByQueryApi = params => {
  return http.get(`api/clusters`, {
    params
  })
}

// 获取 appid 列表
const getAppidsApi = params => {
  return http.get(`api/appids`, {
    params
  })
}

// 获取 job 列表
const getJobsApi = params => {
  return http.get('api/jobs')
}

// 获取 version 列表
const getVersionsApi = params => {
  return http.get('api/versions')
}

// 获取 appid 详情
const getAppidDetailApi = params => {
  return http.get(`api/appids/${params}`)
}

// 获取 appid 详情
const getClusterDetailApi = params => {
  return http.get(`api/clusters/${params}`)
}

// 解除 cluster 和 appid 的绑定
const removeCorrelationApi = (clusterName, params) => {
  return http.delete(`api/clusters/${clusterName}/appid`, {
    data: params
  })
}

// 删除 cluster
const deleteClusterApi = (clusterName, params) => {
  return http.delete(`api/clusters/${clusterName}`)
}

// 更新集群节点权重
const patchInstanceWeightApi = (clusterName, addr, params) => {
  return http.patch(`api/clusters/${clusterName}/instances/${addr}`, params)
}

// 创建 cluster
const createClusterApi = params => {
  return http.post('api/clusters', params)
}

// 添加 cluster 和 appid 关联
const addCorrelationApi = (clusterName, params) => {
  return http.post(`api/clusters/${clusterName}/appid`, params)
}

// 新增 appid
const addAppIdApi = (params) => {
  return http.post('api/appids', params)
}

// 重启节点
const restartInstanceApi = (clusterName, instance) => {
  return http.post(`api/clusters/${clusterName}/instance/${instance}/restart`)
}

export {
  getClusterListByQueryApi,
  getAppidsApi,
  getJobsApi,
  getVersionsApi,
  getAppidDetailApi,
  getClusterDetailApi,
  removeCorrelationApi,
  deleteClusterApi,
  patchInstanceWeightApi,
  createClusterApi,
  addCorrelationApi,
  addAppIdApi,
  restartInstanceApi
}
