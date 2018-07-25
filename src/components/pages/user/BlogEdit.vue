<template>
  <div id="editor">
    <el-form :model="article" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top">
      <el-form-item label="标题" prop="title">
        <el-input v-model="article.title"></el-input>
      </el-form-item>
      <el-form-item label="摘要" prop="summary">
        <el-input type="textarea" v-model="article.summary" :rows="4"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="分类" prop="category">
            <el-col :span="18">
              <el-select v-model="article.category" placeholder="所属类别">
                <el-option v-for="(item, index) in categorys" :key="index" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-button type="primary" size="medium" @click="openAddDialog">新增分类</el-button>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="14" :offset="2">
          <el-form-item label="标签" prop="label">
            <input-tag :tags.sync="article.label"></input-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="是否公开" prop="isPublic">
        <el-switch v-model="isPublic" active-text="公开" inactive-text="私有">
        </el-switch>
      </el-form-item>
      <el-form-item label="正文" prop="content">
        <mavon-editor ref="md" v-model="article.content" @imgAdd="imgAdd" @save="backup(null)" style="height: 600px;z-index:2000"></mavon-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">{{action === 'insert' ? '立即创建' : '立即更新'}}</el-button>
        <el-button type="primary" @click="saveDraft">保存草稿</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="新增分类" :visible.sync="dialogVisible" width="30%" :append-to-body="true" id="dialog">
      <div id="dialog-form" style="text-align:center">
        <el-form size="medium" :inline="true" :model="category" class="demo-form-inline" :rules="categoryRules" ref="categoryRuleForm">
          <el-form-item label="分类" prop="name">
            <el-input v-model="category.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCategory('categoryRuleForm')">确 定</el-button>
        </span>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// Local Registration
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { articleApi } from '@/api/api'
import InputTag from 'vue-input-tag'
import { DEFAULT_WEB_ROOT } from '@/assets/js/const'
export default {
  name: 'editor',
  components: {
    mavonEditor,
    InputTag
  },
  data() {
    return {
      article: {
        id: '',
        title: '',
        summary: '',
        content: '',
        toc: '',
        category: '',
        label: [],
        isPublic: 0,
        status: ''
      },
      oldArticle: {},
      categorys: [],
      isPublic: false,
      pid: '',
      action: 'insert',
      rules: {
        title: [{ type: 'string', required: true, message: '请输入文章标题' }],
        summary: [
          { type: 'string', required: true, message: '请输入文章摘要' }
        ],
        content: [
          { type: 'string', required: true, message: '请输入文章内容' }
        ],
        label: [{ type: 'array', required: true, message: '请输入文章标签' }],
        category: [
          { type: 'string', required: true, message: '请选择文章所属分类' }
        ]
      },
      categoryRules: {
        name: [{ type: 'string', required: true, message: '请输入分类' }]
      },
      dialogVisible: false,
      category: {}
    }
  },
  mounted: function() {
    // const editLoading = this.yoyaLoading({
    //   lock: true,
    //   background: 'white',
    //   target: document.getElementById('editor')
    // })
    this.loadArticle()
    this.loadCategorys()
  },
  watch: {
    $route: this.loadArticle,
    isPublic: function(newValue, oldValue) {
      this.article.isPublic = newValue ? 1 : 0
    }
  },
  methods: {
    submitForm(formName) {
      const editLoading = this.yoyaLoading({
        lock: true,
        background: 'white',
        target: document.getElementById('editor')
      })
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.commonUtil.isEmpty(this.article.pid)) {
            this.insertArticle(editLoading)
          } else {
            this.article.status = 1
            this.updateArticle(editLoading)
          }
        } else {
          if (editLoading) {
            editLoading.close()
          }
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async backup(formName, editLoading) {
      this.article.status = 0
      if (this.commonUtil.isEmpty(this.article.pid)) {
        return this.insertArticle(editLoading)
      } else {
        return this.updateArticle(editLoading)
      }
    },
    insertArticle(editLoading) {
      this.article.pid = 0
      if (this.commonUtil.isEmpty(this.article.label)) {
        this.article.label = ['Default']
      }
      articleApi
        .addAuthArticle(this.article)
        .then(response => {
          this.article = response.data
          this.oldArticle = this.commonUtil.clone(this.article)
          if (editLoading) {
            editLoading.close()
          }
          this.$notify({
            title: '保存成功',
            type: 'success'
          })
          return true
        })
        .catch(error => {
          if (editLoading) {
            editLoading.close()
          }
          this.$notify.error({
            title: '保存失败',
            message: error.message
          })
          return false
        })
    },
    updateArticle(editLoading) {
      if (this.underscore.isEqual(this.oldArticle, this.article)) {
        if (editLoading) {
          editLoading.close()
        }
        this.$notify({
          title: '保存成功',
          type: 'success'
        })
        return false
      }
      articleApi
        .updateAuthArticle(this.article, this.article.pid)
        .then(response => {
          this.oldArticle = this.commonUtil.clone(this.article)
          if (editLoading) {
            editLoading.close()
          }
          this.$notify({
            title: '保存成功',
            type: 'success'
          })
          return true
        })
        .catch(error => {
          if (editLoading) {
            editLoading.close()
          }
          this.$notify.error({
            title: '保存失败',
            message: error.message
          })
          return false
        })
    },
    loadCategorys() {
      articleApi
        .getAuthArticleCategory(this.page, this.limit)
        .then(response => {
          this.categorys = response.data.datas
        })
    },
    loadArticle(editLoading) {
      this.pid = this.$route.query.pid
      if (!this.pid) {
        if (editLoading) {
          editLoading.close()
        }
        return false
      } else {
        this.action = 'update'
      }
      articleApi.getAuthArticlesByPid(this.pid).then(response => {
        this.article = response.data
        this.oldArticle = this.commonUtil.clone(this.article)
        this.isPublic = this.article.isPublic === 1
        if (editLoading) {
          editLoading.close()
        }
      })
    },
    async saveDraft() {
      const editLoading = this.yoyaLoading({
        lock: true,
        background: 'white',
        target: document.getElementById('editor')
      })
      this.backup('ruleForm', editLoading)
      this.$router.push({
        path: '/users/draftbox'
      })
    },
    imgAdd(pos, file) {
      articleApi
        .uploadPicture(file)
        .then(response => {
          console.log(response)
          this.$refs.md.$img2Url(pos, DEFAULT_WEB_ROOT + response.data.message)
        })
        .catch(error => {
          this.$notify.error({
            title: '上传失败',
            message: error.message
          })
        })
    },
    openAddDialog() {
      this.dialogVisible = true
      this.category = {}
    },
    addCategory(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const loading = this.yoyaLoading({
            lock: true,
            background: 'white',
            target: document.getElementById('dialog-form')
          })
          articleApi
            .addAuthArticleCategory(this.category)
            .then(response => {
              if (loading) {
                loading.close()
              }
              this.$notify({
                title: '成功',
                message: '新增分类成功!',
                type: 'success'
              })
              this.dialogVisible = false
              this.loadCategorys()
            })
            .catch(error => {
              if (loading) {
                loading.close()
              }
              this.$notify.error({
                title: '新增分类失败',
                message: error.message
              })
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
#editor {
  margin: auto;
  width: 95%;
}
/* html *,
html *::before,
html *::after {
  z-index: 2000;
} */
.vue-input-tag-wrapper {
  border-radius: 4px;
  height: 40px;
  line-height: 20px;
  -webkit-appearance: inherit;
}
.vue-input-tag-wrapper .input-tag {
  border-radius: 5px;
  font-size: 13px;
}
.v-note-wrapper.fullscreen {
  top: 90px;
}
.v-note-wrapper.fullscreen {
  height: auto !important;
}
</style>
