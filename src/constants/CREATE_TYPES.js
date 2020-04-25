// 集群类型
const TYPE_OPTIONS = [{
  name: 'Redis Cluster',
  value: 'redis_cluster'
}, {
  name: 'Redis',
  value: 'redis'
}, {
  name: 'Memcache',
  value: 'memcache'
}]

// 集群型号
const SPEC_OPTIONS = [{
  name: 'small',
  value: '0.25c2g'
}, {
  name: 'middle',
  value: '0.5c2g'
}, {
  name: 'large',
  value: '1c4g'
}, {
  name: 'custom',
  value: 'custom'
}]

const GROUP_OPTIONS = [{
  name: 'Shanghai',
  value: 'sh001'
}]

export { TYPE_OPTIONS, SPEC_OPTIONS, GROUP_OPTIONS }
