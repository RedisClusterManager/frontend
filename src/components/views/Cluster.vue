<template>
  <div class="cluster-page">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>
        <a href="#" @click="$router.back()">back</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ clusterData.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-loading="loading" class="cluster-panel">
      <div class="cluster-header">
        <span class="cluster-header__title">cluster info</span>
        <el-tag :type="statusMap[clusterData.status]">
          <i v-if="clusterData.status === 'waiting'" class="el-icon-loading"></i>
          {{ clusterData.status }}
        </el-tag>
      </div>
      <div class="cluster-info">
        <div>
          <p>
            Name:
            <span class="cluster-info__name">{{ clusterData.name }}</span>
          </p>
          <p>
            Type:
            <span>{{ clusterData.cache_type || '--' }}</span>
          </p>
          <p>
            Total Capacity:
            <span>{{ clusterData.max_memory * clusterData.number || '--' }} MB</span>
          </p>
          <p>
            Front-end Port:
            <span>{{ clusterData.front_end_port || '--' }}</span>
          </p>
        </div>
        <div>
          <p>
            Single Node Capacity:
            <span>{{ clusterData.max_memory }} MB</span>
          </p>
          <p>
            Number of Master Nodes:
            <span>{{ clusterData.number }}</span>
          </p>
          <p>
            Number of Slave Nodes:
            <span>{{ clusterData.cache_type === 'redis_cluster' ? clusterData.number : 0 }}</span>
          </p>
        </div>
        <div>
          <p>
            Cluster Version:
            <span>
              <el-tag size="mini">{{ clusterData.version || '--' }}</el-tag>
            </span>
          </p>
          <p>
            Group Name:
            <span>{{ GROUP_MAP[clusterData.group] }}</span>
          </p>
          <p>
            Monitor Link:
            <span>
              <a target="_blank" :href="clusterData.monitor">Go</a>
            </span>
          </p>
        </div>
      </div>
    </div>
    <div v-loading="loading" class="cluster-panel">
      <div class="cluster-header">
        <span class="cluster-header__title">List of Correlation AppId</span>
      </div>
      <div v-if="clusterData.appids && clusterData.appids.length" class="cluster-appid">
        <p v-for="(appid, index) in clusterData.appids" :key="index">
          <router-link :to="{ name: 'appId', query: { name: appid } }">{{ appid }}</router-link>
        </p>
      </div>
      <div v-else class="cluster-appid hint">No data</div>
    </div>
    <div v-loading="loading" class="cluster-panel">
      <div class="cluster-header">
        <span class="cluster-header__title">Node List</span>
      </div>
      <div class="cluster-instances">
        <!-- TODO(feature) -->
        <!-- <div v-if="clusterData.instances && clusterData.instances.length" class="cluster-instances__header">
          <el-button type="primary" size="mini" plain>批量重启</el-button>
          <el-button type="success" size="mini" plain>批量启动</el-button>
          <el-button type="danger" size="mini" plain>批量删除</el-button>
        </div>-->
        <el-table
          ref="multipleTable"
          :data="clusterData.instances"
          border
          max-height="400"
          @selection-change="handleSelectionChange"
        >
          <!-- TODO(feature): 二期开放 -->
          <!-- <el-table-column
              type="selection"
              width="55">
          </el-table-column>-->
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column label="IP" min-width="100">
            <template slot-scope="scope">{{ scope.row.ip }}</template>
          </el-table-column>
          <el-table-column prop="port" label="port" min-width="80"></el-table-column>
          <el-table-column
            v-if="clusterData.cache_type === 'redis_cluster'"
            prop="role"
            label="role"
            min-width="80"
          >
            <template slot-scope="{ row }">
              <el-tag :type="row.role === 'master' ? 'warning' : 'info'">{{ row.role }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="clusterData.cache_type !== 'redis_cluster'" label="alias">
            <template slot-scope="{ row }">{{ row.alias || '--' }}</template>
          </el-table-column>
          <el-table-column
            v-if="clusterData.cache_type !== 'redis_cluster'"
            label="weights(权重)"
            width="150"
          >
            <template slot-scope="{ row, $index }">
              <div v-if="row.weightInfo.type === 'view'" class="instance-weight-item">
                {{ row.weight }}
                <i
                  v-if="clusterData.status !== 'waiting'"
                  class="el-icon-edit-outline edit-weight-icon"
                  @click="editInstanceWeight(row, $index)"
                ></i>
              </div>
              <div v-if="row.weightInfo.type === 'edit'" class="instance-weight-item">
                <el-input
                  class="table-mini-input"
                  :value="row.weightInfo.value"
                  @input="updateInstance($event, $index)"
                  placeholder="weight"
                  size="mini"
                  type="number"
                ></el-input>
                <i
                  class="el-icon-success edit-weight-icon"
                  @click="saveInstanceWeight(row, $index)"
                ></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="status" width="80">
            <template slot-scope="{ row }">
              <el-tag :type="statusMap[row.status]">
                <i v-if="row.status === 'waiting'" class="el-icon-loading"></i>
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="operation" width="80">
            <template slot-scope="{ row }">
              <el-button type="text" @click="restartInstance(row)">restart</el-button>
              <!-- TODO(feature): -->
              <!-- <el-button type="text" @click="linkToSetting(row)">开关</el-button>
                <el-button type="text" @click="linkToSetting(row)">删除</el-button>
              <el-button type="text" @click="linkToSetting(row)">监控</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div v-loading="loading" class="cluster-panel">
      <div class="cluster-header">
        <span class="cluster-header__title">Cluster Operation</span>
      </div>
      <div class="cluster-danger">
        <!-- TODO(feature): -->
        <!-- <div class="cluster-danger__item">
          <p>扩容 </p>
          <el-button :disabled="clusterData.status === 'waiting'" type="danger" icon="el-icon-rank">扩容</el-button>
        </div>
        <div class="cluster-danger__item">
          <p>再平衡:rebalance 一下  </p>
          <el-button :disabled="clusterData.statu === 'waiting'" type="danger" icon="el-icon-refresh">再平衡</el-button>
        </div>-->
        <div class="cluster-danger__item">
          <p>I don't need the cluster anymore!</p>
          <el-button
            @click="deleteClusterDialogVisible = true"
            :disabled="clusterData.status === 'waiting'"
            type="danger"
            icon="el-icon-delete"
          >delete</el-button>
        </div>
      </div>
    </div>

    <el-dialog
      title="Are you sure to delete the cluster?"
      :visible.sync="deleteClusterDialogVisible"
      width="400px"
      custom-class="delete-dialog"
    >
      <div class="delete-dialog__tips">
        <b>
          <i class="el-icon-warning"></i>Before deleting the cluster, please revoke all Correlation AppIds with the cluster
        </b>
        <p>
          <i class="el-icon-warning"></i>
          This operation cannot be undone! The data of cluster {{clusterData.name}} and its nodes will be permanently deleted.
          Please enter the name of the cluster you want to delete to confirm:
        </p>
      </div>
      <el-input v-model.trim="confirmClusterName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteClusterDialogVisible = false">Cancel</el-button>
        <el-button
          type="danger"
          @click="confirmDeleteCluster"
          :disabled="confirmClusterName !== clusterData.name"
        >Delete</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  patchInstanceWeightApi,
  deleteClusterApi,
  restartInstanceApi
} from '@/utils/api'
import GROUP_MAP from '@/constants/GROUP'
import { mapState } from 'vuex'

// mapGetters
export default {
  data () {
    return {
      GROUP_MAP,
      multipleSelection: [],
      statusMap: {
        running: 'success',
        waiting: 'warning',
        error: 'danger'
      },
      timer: null,
      deleteClusterDialogVisible: false,
      confirmClusterName: null
    }
  },
  computed: {
    ...mapState({
      clusterData: status => status.clusters.clusterDetail,
      loading: status => status.clusters.loading
    })
  },
  created () {
    this.getClusterData()
  },
  methods: {
    updateInstance (value, index) {
      this.$store.dispatch('clusters/updateInstance', {
        changeType: 'value',
        index,
        weightValue: value
      })
    },
    async getClusterData () {
      if (!this.$route.params.name) return
      this.$store.dispatch('clusters/getClusterDetail', {
        name: this.$route.params.name
      })
      if (this.clusterData.status === 'waiting') {
        this.timer = setTimeout(() => {
          this.getClusterData()
        }, 5000)
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    editInstanceWeight (item, index) {
      this.$store.dispatch('clusters/updateInstance', {
        changeType: 'display',
        index,
        item,
        newType: 'edit'
      })
    },
    async saveInstanceWeight (item, index) {
      this.$store.dispatch('clusters/getClusterDetail', {
        name: this.$route.params.name
      })
      const { weightInfo, ip, port } = item
      try {
        await patchInstanceWeightApi(this.clusterData.name, `${ip}:${port}`, {
          weight: Number(weightInfo.value)
        })
        this.$store.dispatch('clusters/updateInstance', {
          index,
          item,
          newType: 'view'
        })
        this.$message.success('Successfully modified')
        this.getClusterData()
      } catch ({ error }) {
        this.$message.error(error)
      }
    },
    async confirmDeleteCluster () {
      try {
        await deleteClusterApi(this.confirmClusterName)
        this.$message.success('Successfully deleted')
        this.$router.back()
      } catch ({ error }) {
        this.$message.error(`Failed to delete: ${error}`)
      }
    },
    async restartInstance ({ ip, port }) {
      try {
        await restartInstanceApi(this.clusterData.name, `${ip}:${port}`)
        this.$message.success('Successful restart')
      } catch ({ error }) {
        this.$message.error(`Failed to restart: ${error}`)
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.timer) {
      clearInterval(this.timer)
    }
    next()
  }
}
</script>

<style lang="scss">
$hint-text-color: #909399;
$daner-color: #f56c6c;

.cluster-page {
  padding: 5px 24px;
}
.breadcrumb {
  margin: 10px 0;
}
.cluster-panel {
  margin: 0 0 20px 0;
  background: #fff;
  .cluster-header {
    height: 40px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e9f2f7;
    font-weight: bold;
    font-size: 14px;
  }
  .cluster-info {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    > div p {
      margin: 10px 0;
    }
    > div span {
      margin: 0 5px;
    }
    &__name {
      font-weight: bold;
    }
  }
  .cluster-appid {
    padding: 12px;
    font-size: 14px;
    & > p {
      margin: 10px 0;
    }
  }
  .cluster-instances {
    padding: 12px;
    &__header {
      display: flex;
      margin-bottom: 10px;
    }
    .instance-weight-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .edit-weight-icon {
      font-size: 16px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .cluster-danger {
    border: 1px solid #f56c6c;
    border-radius: 0 0 3px 3px;
    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // margin: 10px 0;
      padding: 8px;
      border-bottom: 1px solid #eee;
      > p {
        font-size: 13px;
        margin: 10px;
      }
    }
  }
}

.hint {
  color: $hint-text-color;
}

.delete-dialog {
  &__tips {
    margin: 0 0 10px 0;
    line-height: 24px;
  }
  .el-icon-warning {
    color: $daner-color;
    margin-right: 10px;
  }
}
</style>
