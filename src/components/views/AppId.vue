<template>
  <div>
    <div class="appid-container">
      <div class="appid-tree">
        <el-input placeholder="Enter keyword to filter" clearable v-model="filterText"></el-input>

        <el-tree
          v-loading="appidLoading"
          class="filter-tree"
          :data="appidTree"
          :highlight-current="true"
          :props="defaultProps"
          @node-click="handleNodeClick"
          default-expand-all
          :filter-node-method="filterNode"
          ref="appidTree"
          empty-text="No data"
        ></el-tree>
        <el-button size="mini" type="text" @click="addIdDialogVisible = true">Add AppId</el-button>
      </div>
      <div class="appid-info" v-loading="clusterLoading">
        <div class="appid-header">
          <p>{{ appid }}</p>
          <el-button type="text" size="large" @click="dialogVisible = true">Add Correlation</el-button>
        </div>
        <div class="appid-group" v-for="(groupItem, index) in groupedClusters" :key="index">
          <div class="appid-group__title">{{ GROUP_MAP[groupItem.group] }}</div>
          <el-table :data="groupItem.clusters" border max-height="500">
            <el-table-column prop="name" label="Cluster Name" min-width="100"></el-table-column>
            <el-table-column prop="cache_type" label="Cache Type" min-width="70"></el-table-column>
            <el-table-column prop="front_end_port" label="Front-end Port"></el-table-column>
            <el-table-column prop="max_memory" label="Total Capacity">
              <template slot-scope="{ row }">{{ row.max_memory }} MB</template>
            </el-table-column>
            <el-table-column prop="number" label="Number of Nodes" min-width="80"></el-table-column>
            <el-table-column label="Detail" min-width="135">
              <template slot-scope="{ row }">
                <el-button type="text" @click="removeCorrelation(row)">Remove Correlation</el-button>
                <!-- <el-button type="text" @click="linkToSetting(row)">Edit Correlation</el-button> -->
                <el-button type="text" @click="linkToCluster(row)">Detail</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="!groupedClusters.length" class="appid-group appid-group--empty">
          No clusters,
          <el-button type="text" size="mini" @click="dialogVisible = true">go to correlate</el-button>
        </div>
      </div>
    </div>

    <el-dialog
      title="Add Correlation"
      :visible.sync="dialogVisible"
      width="600px"
      custom-class="correlation-dialog"
    >
      <el-input
        placeholder="Enter cluster keywords to search"
        clearable
        v-model="clusterKeyword"
        @keyup.native="searchCluster"
      ></el-input>
      <el-table :data="clusterList" v-loading="queryLoading" border max-height="300px">
        <el-table-column prop="name" label="Cluster" width="150"></el-table-column>
        <el-table-column prop="group" label="Group">
          <template slot-scope="{ row }">{{ GROUP_MAP[row.group] }}</template>
        </el-table-column>
        <el-table-column label="Detail" width="230">
          <template slot-scope="{ row }">
            <el-button type="text" @click="addCorrelation(row)">Correlate to {{ appid }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Close</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Add AppId"
      :visible.sync="addIdDialogVisible"
      width="400px"
      custom-class="correlation-dialog"
    >
      <div class="addid-panel">
        <el-input placeholder="Department" v-model="appidForm.department" size="mini"></el-input>-
        <el-input placeholder="Service" v-model="appidForm.service" size="mini"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addIdDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitAddAppId">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GROUP_MAP from '@/constants/GROUP'
import {
  getAppidsApi,
  getAppidDetailApi,
  removeCorrelationApi,
  addCorrelationApi,
  addAppIdApi
} from '@/utils/api'
import { mapState } from 'vuex'
import { throttle } from 'lodash'

export default {
  data () {
    return {
      GROUP_MAP,
      filterText: null,
      appidTree: [
        {
          label: '*China',
          children: [
            {
              label: '*AP1'
            },
            {
              label: '*Ap2'
            }
          ]
        },
        {
          label: '*US',
          children: [
            {
              label: '*NYC'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      appid: '*AP1',
      groupedClusters: [{
        group: 'sh001',
        clusters: [{
          name: 'name1',
          cache_type: 'redis_cluster',
          front_end_port: '10086',
          max_memory: '4096',
          number: '2'
        }, {
          name: 'name2',
          cache_type: 'redis_cluster',
          front_end_port: '10000',
          max_memory: '8192',
          number: '3'
        }]
      },
      {
        group: 'sh002',
        clusters: [{
          name: 'name3',
          cache_type: 'redis_cluster',
          front_end_port: '10087',
          max_memory: '4096',
          number: '2'
        }, {
          name: 'name4',
          cache_type: 'redis_cluster',
          front_end_port: '10001',
          max_memory: '8192',
          number: '3'
        }]
      }],
      appidLoading: false,
      clusterLoading: false,
      // dialog
      dialogVisible: false,
      clusterKeyword: null,
      // dialog
      addIdDialogVisible: false,
      appidForm: {
        department: null,
        service: null
      },

      clusterList: [{
        name: 'name5',
        group: 'sh001'
      },
      {
        name: 'name6',
        group: 'sh002'
      },
      {
        name: 'name7',
        group: 'bj001'
      }]
    }
  },
  created () {
    this.getAppids()
  },
  computed: {
    ...mapState({
      clusterList: state => state.clusters.clusterResult,
      queryLoading: state => state.clusters.queryLoading
    })
  },
  watch: {
    filterText (val) {
      this.$refs.appidTree.filter(val)
    },
    appid (nv) {
      this.$router.replace({ name: 'appId', query: { name: nv } })
    }
  },
  methods: {
    async getAppids () {
      this.appidLoading = true
      try {
        const { data } = await getAppidsApi({
          format: 'tree'
        })
        this.appidTree = data.items
        this.getClusterList(
          this.$route.query.name || this.appidTree[0].children[0].name
        )
      } catch ({ error }) {
        this.$message.error(`Fail to get Appids: ${error}`)
      }
      this.appidLoading = false
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    async getClusterList (name) {
      if (!name) return
      this.clusterLoading = true
      try {
        const { data } = await getAppidDetailApi(name)
        this.groupedClusters = data.grouped_clusters
        this.appid = name
      } catch ({ error }) {
        this.$message.error(`Fail to get cluster list: ${error}`)
      }
      this.clusterLoading = false
    },
    handleNodeClick (data) {
      if (!data.children) {
        this.getClusterList(data.name)
      }
    },
    removeCorrelation ({ id, name }) {
      this.$confirm(
        `You will disassociate the cluster [${name}] with AppId [${this.appid}], are you sure to continue?`,
        'Remove',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(() => {
          this.confirmRemoveCorrelation(name)
        })
        .catch(() => {})
    },
    async confirmRemoveCorrelation (name) {
      try {
        await removeCorrelationApi(name, {
          appid: this.appid
        })
        this.getClusterList(this.appid)
        this.$message.success('Successfully remove')
      } catch ({ error }) {
        this.$message.error(`Fail to remove${error}`)
      }
    },
    addCorrelation ({ name }) {
      this.$confirm(
        `Cluster [${name}] and AppId [${this.appid}] will be correlated, are you sure to continue?`,
        'Correlate',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'info'
        }
      )
        .then(() => {
          this.confirmAddCorrelation(name)
        })
        .catch(() => {})
    },
    async confirmAddCorrelation (name) {
      try {
        await addCorrelationApi(name, {
          appid: this.appid
        })
        this.dialogVisible = false
        this.getClusterList(this.appid)
        this.$message.success('Successfully Correlated')
      } catch ({ error }) {
        this.$message.error(`Fail to correalte：${error}`)
      }
    },
    linkToCluster ({ name }) {
      this.$router.push({ name: 'cluster', params: { name } })
    },
    // 添加 appid
    async submitAddAppId () {
      const { department, service } = this.appidForm
      if (!department && !service) {
        this.$message.warning('Please enter all infomation required')
        return
      }
      try {
        await addAppIdApi({
          appid: `${department}.${service}`
        })
        this.addIdDialogVisible = false
        this.getAppids()
        this.$message.success('Successfully add Appid')
        this.appidForm.department = null
        this.appidForm.service = null
      } catch ({ error }) {
        this.$message.error(`Fail to add Appid: ${error}`)
      }
    },
    // linkToSetting () {

    // },
    searchCluster: throttle(function searchCluster () {
      this.loadClusterData()
    }, 1000),
    async loadClusterData () {
      if (!this.clusterKeyword) return
      this.$store.dispatch('clusters/getClusterResult', {
        name: this.clusterKeyword
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$hint-text-color: #909399;

.appid-container {
  display: flex;
}

.appid-tree {
  flex-shrink: 0;
  width: 230px;
  min-height: 500px;
  background: #fff;
  padding: 10px;
  margin-right: 10px;

  .el-tree {
    margin: 10px 0;
  }

  .el-button {
    width: 100%;
  }
}

.appid-info {
  width: 100%;
  min-height: 500px;
}

.appid-header {
  height: 40px;
  width: 100%;
  background: #fff;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}

.appid-group {
  padding: 10px;
  margin: 10px 0;
  background: #fff;

  &__title {
    font-size: 15px;
    font-weight: bold;
    margin: 10px 0 5px 2px;
  }

  &--empty {
    min-height: 250px;
    color: $hint-text-color;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.correlation-dialog {
  .el-input {
    margin-bottom: 10px;
  }

  .addid-panel {
    display: flex;
    align-items: center;

    .el-input {
      margin: 0 5px;
    }
  }
}
</style>
