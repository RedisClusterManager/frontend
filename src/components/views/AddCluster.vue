<template>
  <div class="create-page">
    <p class="create-page__title">Create Cluster</p>
    <div class="create-container">
      <el-form :model="clusterForm" :rules="rules" ref="clusterForm" label-width="120px">
        <el-form-item label="Name" prop="name" required>
          <el-input v-model="clusterForm.name"></el-input>
        </el-form-item>

        <el-form-item label="Total Capacity" prop="total_memory" required>
          <el-input v-model="clusterForm.total_memory" type="number">
            <template slot="append">
              <el-select v-model="memoryUnit" placeholder="Please choose">
                <el-option
                  v-for="item in memoryUnitOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="Version" prop="version" required>
          <el-input v-model="clusterForm.version"></el-input>
        </el-form-item>

        <el-form-item label="Type" required>
          <el-radio-group v-model="clusterForm.spec">
            <el-radio
              :label="item.value"
              v-for="(item, index) in specOptions"
              :key="index"
            >{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Specification" prop="spec" required>
          <div v-if="clusterForm.spec !== 'custom'">{{clusterForm.spec}}</div>
          <div v-else class="custom-spec">
            <el-input v-model="specCustomForm.core" size="mini" type="number">
              <template slot="append">Core</template>
            </el-input>
            <el-input v-model="specCustomForm.memory" size="mini" type="number">
              <template slot="append">
                <el-select v-model="specMemoryUnit" placeholder="Please choose">
                  <el-option
                    v-for="item in memoryUnitOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </template>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item label="Group" required>
          <el-select
            v-model="clusterForm.group"
            class="group-select"
            filterable
            placeholder="Please select the APPID to be correlated"
          >
            <el-option
              v-for="item in groupOptions"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="APPID" prop="appids">
          <el-select
            v-model="clusterForm.appids"
            class="appid-select"
            multiple
            filterable
            placeholder="Please select the APPID to be correlated"
            no-data-text="No data"
          >
            <el-option v-for="item in appidOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="footer-item">
          <el-button @click="resetForm('clusterForm')">Reset</el-button>
          <el-button
            type="primary"
            @click="submitForm('clusterForm')"
            :disabled="submitDisabled"
          >Create</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { createClusterApi, getAppidsApi } from '@/utils/api'
import { SPEC_OPTIONS, GROUP_OPTIONS } from '@/constants/CREATE_TYPES'

export default {
  data () {
    const checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please enter a name'))
      }
      if (!/^\w+$/.test(value)) {
        callback(
          new Error(
            'Only English characters, numbers and underscores_ are supported'
          )
        )
      }
      callback()
    }
    const checkTotalMemory = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please enter the total capacity'))
      }
      if (value <= 0) {
        callback(new Error('Please enter a value greater than 0'))
      }
      callback()
    }
    const checCustomSpec = (rule, value, callback) => {
      if (
        value === 'custom' &&
        (!this.specCustomForm.core || !this.specCustomForm.memory)
      ) {
        callback(new Error('Please enter specification'))
      }
      if (
        value === 'custom' &&
        (this.specCustomForm.core <= 0 || this.specCustomForm.memory <= 0)
      ) {
        callback(new Error('Please enter a value greater than 0'))
      }
      callback()
    }
    return {
      memoryUnit: 'G',
      specMemoryUnit: 'G',
      memoryUnitOptions: ['G', 'M'],
      rules: {
        name: [
          {
            validator: checkName,
            trigger: 'change'
          }
        ],
        total_memory: [
          {
            validator: checkTotalMemory,
            trigger: 'change'
          }
        ],
        spec: [
          {
            validator: checCustomSpec,
            trigger: 'change'
          }
        ]
      },
      clusterForm: {
        name: null,
        spec: '0.25c2g',
        total_memory: null,
        version: null,
        group: 'sh001',
        appids: []
      },
      specOptions: SPEC_OPTIONS,
      groupOptions: GROUP_OPTIONS,
      specCustomForm: {
        core: null,
        memory: null
      },
      appidOptions: ['*China - *AP1', '*China - *AP2', '*US - *NYC'],
      submitDisabled: false
    }
  },
  created () {
    this.getAppids()
    this.getVersions()
  },
  methods: {
    async getAppids () {
      try {
        const { data } = await getAppidsApi({
          format: 'plain'
        })
        this.appidOptions = data.items
      } catch (_) {
        this.$message.error('Fail to get AppId list')
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.onSubmit()
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      // this.clusterForm.spec = null
      this.memoryUnit = 'G'
      this.specMemoryUnit = 'G'
    },
    async onSubmit () {
      let params = JSON.parse(JSON.stringify(this.clusterForm))
      params.total_memory =
        this.memoryUnit === 'G'
          ? Number(params.total_memory) * 1024
          : Number(params.total_memory)
      if (params.spec === 'custom') {
        params.spec = `${this.specCustomForm.core}c${
          this.specCustomForm.memory
        }${this.specMemoryUnit === 'G' ? 'g' : 'm'}`
      }
      this.submitDisabled = true
      try {
        await createClusterApi(params)
        this.$message.success('Creating，please wait')
        setTimeout(() => {
          this.$router.push({
            name: 'cluster',
            params: { name: this.clusterForm.name }
          })
        }, 3000)
      } catch ({ error }) {
        this.$message.error(`Fail to create：${error}`)
      }
      this.submitDisabled = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixin.scss";
$edit-icon-color: #1890ff;
$green-color: #67c23a;

.create-page__title {
  @include page-title-font;
  margin: 10px 0;
}

.create-container {
  padding: 20px 20px;
  margin-top: 20px;
  background: #fff;
  border-radius: 5px;

  .el-form {
    max-width: 600px;
  }
}

.type-tooltip {
  i {
    color: $green-color;
    font-size: 18px;
  }

  h6 {
    margin: 8px 0 5px 0;
  }

  p {
    margin: 3px 0;
  }

  .emphasis-text {
    color: #000;
  }
}

.type-icon {
  margin: 2px 10px;
}

.appid-select,
.group-select {
  width: 100%;
}

.custom-spec {
  display: flex;

  .el-input {
    width: 150px;
    margin-right: 5px;

    .el-input-group__append {
      padding: 0 5px;
    }
  }
}

.footer-item {
  margin-top: 50px;
  display: flex;
  justify-content: flex-end;
}
</style>

<style lang="scss">
.create-page {
  .el-input-group__append {
    width: 60px;
  }
}
</style>
