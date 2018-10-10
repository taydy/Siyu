<template>
  <div class="ip">
    <div class="parameter" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0,0,0,.5)">
      <el-row>
        <el-col :span="12" :offset="6">
          <div class="search" @keyup.enter="parseIp">
            <!-- <a>IP 查询</a> -->
            <el-form :model="search" status-icon :rules="rules" ref="search" label-width="100px" label-position="right" class="demo-ruleForm" >
              <el-form-item label="IP 地址" prop="ip">
                <el-input id="ip" v-model="search.ip" prefix-icon="el-icon-search" placeholder="请输入 IP 地址，按回车键"></el-input>
                <el-input v-show="false"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="result">
      <a>IP 查询结果</a>
      <div class="show-result">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item.prop" :label="item.label">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Common from '@/assets/js/common'
export default {
  name: 'IP',
  data() {
    var checkIp = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入 IP 地址'))
      } else {
        if (!Common.isValidIP(value)) {
          callback(new Error('IP 地址格式不正确'))
        }
        callback()
      }
    }
    return {
      search: {
        ip: ''
      },
      tableHeader: [
        {
          prop: 'ip',
          label: 'IP 地址'
        },
        {
          prop: 'country',
          label: '国家/地区'
        },
        {
          prop: 'area',
          label: '大区'
        },
        {
          prop: 'region',
          label: '省（自治区或直辖市）'
        },
        {
          prop: 'city',
          label: '城市'
        },
        {
          prop: 'isp',
          label: '运营商'
        }
      ],
      tableData: [],
      rules: {
        ip: [{ validator: checkIp, trigger: 'blur' }]
      },
      loading: false,
      isOngoing: false
    }
  },
  methods: {
    parseIp() {
      this.$refs['search'].validate(valid => {
        if (valid && !this.isOngoing) {
          this.isOngoing = true
          this.loading = true

          this.axios
            .get('https://api.siluyunyu.com/tools/ip-parse', {
              params: {
                ip: this.search.ip
              }
            }).then(response => {
              this.isOngoing = false
              this.loading = false
              this.tableData.unshift(response.data.data)
            }).catch(error => {
              this.isOngoing = false
              this.loading = false
              console.log(error)
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
