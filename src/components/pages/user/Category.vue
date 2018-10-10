<template>
  <div class="user-category">
    <div class="card search-from" @keyup.enter="searchArticles">
      <el-form size="medium" :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button type="success" @click="openAddDialog('新增')">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="card" id="table-data">
      <el-table size="medium" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="name" label="类别">
        </el-table-column>
        <!-- <el-table-column prop="count" label="文章数" width="150">
        </el-table-column> -->
        <el-table-column label="创建时间" width="150">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.createdTime | moment("YYYY-MM-DD") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="150">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.updatedTime | moment("YYYY-MM-DD") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="openAddDialog('编辑', scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :append-to-body="true" id="dialog">
      <div id="dialog-form" style="text-align:center">
        <el-form size="medium" :inline="true" :model="category" class="demo-form-inline" :rules="rules" ref="ruleForm">
          <el-form-item label="分类" prop="name">
            <el-input v-model="category.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="update('ruleForm')">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { articleApi } from '@/api/api'
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      category: {},
      oldCategory: {},
      dialogVisible: false,
      title: '',
      rules: {
        name: [{ type: 'string', required: true, message: '请输入分类' }]
      }
    }
  },
  mounted: function() {
    this.loadCategorys()
    this.amplitude.getInstance().logEvent('Viewed Category admin')
  },
  methods: {
    loadCategorys() {
      const loading = this.yoyaLoading({
        lock: true,
        background: 'white',
        target: document.getElementById('table-data')
      })
      articleApi
        .getAuthArticleCategory(this.page, this.limit)
        .then(response => {
          response = response.data
          this.tableData = response.datas
          this.total = response.total
          if (loading) {
            loading.close()
          }
        })
    },
    handleSizeChange(val) {
      this.limit = val
      this.loadCategorys()
    },
    handleCurrentChange(val) {
      this.page = val
      this.loadCategorys()
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const loading = this.yoyaLoading({
            lock: true,
            background: 'white',
            target: document.getElementById('dialog-form')
          })
          if (this.commonUtil.isEmpty(this.category.id)) {
            this.insertCategory(loading)
          } else {
            this.updateCategory(loading)
          }
        } else {
          return false
        }
      })
    },
    insertCategory(loading) {
      articleApi
        .addAuthArticleCategory(this.category)
        .then(response => {
          if (loading) {
            loading.close()
          }
          this.$notify({
            title: '成功',
            message: '新增成功!',
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
            title: '新增失败',
            message: error.message
          })
        })
    },
    updateCategory(loading) {
      if (this.underscore.isEqual(this.oldCategory, this.category)) {
        if (loading) {
          loading.close()
        }
        this.$message({
          message: '请先修改后再进行保存！',
          type: 'warning'
        })
        return false
      }
      articleApi
        .updateAuthArticleCategory(this.category.id, this.category)
        .then(response => {
          if (loading) {
            loading.close()
          }
          this.$notify({
            title: '成功',
            message: '修改成功!',
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
            title: '更新失败',
            message: error.message
          })
        })
    },
    handleDelete(index, item, loading) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (item.count > 0) {
            this.$notify({
              title: '警告',
              message: '此分类下文章数不为0，无法删除!',
              type: 'warning'
            })
            return false
          }
          articleApi
            .deleteAuthArticleCategory(item.id)
            .then(response => {
              if (response.data.code === 200) {
                this.$notify({
                  title: '成功',
                  message: '删除成功!',
                  type: 'success'
                })
                this.loadCategorys()
              }
            })
            .catch(error => {
              if (loading) {
                loading.close()
              }
              this.$notify.error({
                title: '删除失败',
                message: error.message
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    openAddDialog(title, item) {
      this.title = title
      this.category = item || {}
      this.oldCategory = this.commonUtil.clone(this.category)
      this.dialogVisible = true
    }
  }
}
</script>

<style>
#dialog .el-form-item {
  width: 100%;
}
#dialog .el-form-item__content {
  width: 80%;
}
</style>
