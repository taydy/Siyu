<template>
  <div class="json-format">
    <div class="parameter">
      <el-form :model="json" ref="json" :rules="rules" label-width="100px" label-position="top" class="demo-ruleForm">
        <el-row :span="20">
          <el-col :span="4" :offset="1">
            <div class="info">
              <img src="@/assets/svg/right.svg">
              <a>Paste in JSON or a URL and away you go.</a>
            </div>
          </el-col>
          <el-col :span="12" style="text-align:left;" :offset="1">
            <el-form-item label="JSON Data/URL" prop="jsondata" required>
              <el-input type="textarea" :rows="10" placeholder="JSON Data/URL" v-model="json.jsondata">
              </el-input>
            </el-form-item>
            <el-col :span="5" :offset="10">
              <el-button type="primary" @click="submitForm('json')" v-loading="loading">Process</el-button>
            </el-col>
          </el-col>
          <el-col :span="4" style="text-align:left;padding-top:40px;" :offset="1">
            <el-form-item label="JSON Standard">
              <el-select v-model="json.jsonstandard" placeholder="请选择">
                <el-option v-for="item in jsonstandards" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="JSON Template">
              <el-select v-model="json.jsontemplate" placeholder="请选择">
                <el-option v-for="item in jsontemplates" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="result">
      <div class="show-result">
        <div class="jsonholder ui-resizable">
        <div class="json" v-html="formatterJson">

        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Json',
  data() {
    return {
      loading: false,
      json: {
        jsondata: '',
        jsonstandard: '1',
        jsontemplate: '0'
      },
      jsonstandards: [
        {
          value: '1',
          label: 'RFC 4627'
        },
        {
          value: '2',
          label: 'RFC 7159'
        },
        {
          value: '3',
          label: 'ECMA-404'
        },
        {
          value: '0',
          label: 'Do Not Validate'
        }
      ],
      jsontemplates: [
        {
          value: '0',
          label: '4 Space Tab'
        },
        {
          value: '1',
          label: '3 Space Tab'
        },
        {
          value: '2',
          label: '2 Space Tab'
        },
        {
          value: '3',
          label: 'Compact'
        }
      ],
      rules: {
        jsondata: [
          { required: true, message: '请填写 JSON Data/URL', trigger: 'blur' }
        ]
      },
      formatterJson: ''
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.axios({
            url: '/tools/json-format',
            method: 'POST',
            data: {
              jsondata: JSON.stringify(this.json.jsondata),
              jsonstandard: this.json.jsonstandard,
              jsontemplate: this.json.jsontemplate
            },
            transformRequest: [
              function(data) {
                let ret = ''
                for (let it in data) {
                  ret +=
                    encodeURIComponent(it) +
                    '=' +
                    encodeURIComponent(data[it]) +
                    '&'
                }
                return ret
              }
            ],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
            .then(response => {
              this.loading = false
              console.log(response)
              let result = response.data.result
              this.formatterJson = result.json
            })
            .catch(err => {
              this.loading = false
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
