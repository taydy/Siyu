<template>
  <div class="user-article">
    <div class="card search-from" @keyup.enter="searchArticles">
      <el-form size="medium" :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="搜索">
          <el-input v-model="search.query" placeholder="搜索"></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="search.category" placeholder="所属类别">
            <el-option v-for="(item, index) in categorys" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchArticles">查询</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
          <el-button type="success" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="card" id="table-data">
      <el-table size="medium" :data="tableData" stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="标题">
                <span>{{ props.row.title }}</span>
              </el-form-item>
              <el-form-item label="分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="是否公开">
                <span>{{ isPublicObj[props.row.isPublic] }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createdTime | moment("YYYY-MM-DD HH:mm:ss") }}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span>{{ props.row.updatedTime | moment("YYYY-MM-DD HH:mm:ss") }}</span>
              </el-form-item>
              <el-form-item label="摘要" class="el-form-item-full">
                <span>{{ props.row.summary }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="category" label="分类" width="150">
        </el-table-column>
        <el-table-column prop="isPublic" label="是否公开" width="100">
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.isPublic === 1 ? 'success' : 'info'" disable-transitions>{{isPublicObj[scope.row.isPublic]}}</el-tag>
          </template>
        </el-table-column>
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="view(scope.$index, scope.row)">预览</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { articleApi } from '@/api/api'
export default {
  data() {
    return {
      tableData: [],
      isPublicObj: {
        '1': '公开',
        '0': '私有'
      },
      search: {
        category: '',
        query: ''
      },
      categorys: [],
      status: 1,
      isPublic: -1,
      page: 1,
      loadArticleslimit: 10,
      total: 0
    }
  },
  mounted: function() {
    this.loadArticles()
    this.loadCategorys()
    this.amplitude.getInstance().logEvent('Viewed Blog admin')
  },
  methods: {
    searchArticles() {
      this.page = 1
      this.loadArticles()
    },
    loadCategorys() {
      articleApi.getAuthArticleCategory(1, 20).then(response => {
        this.categorys = response.data.datas
      })
    },
    loadArticles() {
      const loading = this.yoyaLoading({
        lock: true,
        background: 'white',
        target: document.getElementById('table-data')
      })
      articleApi
        .getAuthArticles({
          query: this.search.query,
          category: this.search.category,
          status: this.status,
          isPublic: this.isPublic,
          page: this.page,
          limit: this.limit
        })
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
      this.loadArticles()
    },
    handleCurrentChange(val) {
      this.page = val
      this.loadArticles()
    },
    resetForm(formName) {
      this.search = {
        category: '',
        query: ''
      }
    },
    view(index, item) {
      this.$router.push({
        path: '/my/blogs/' + item.pid
      })
    },
    handleEdit(index, item) {
      this.$router.push({
        path: '/users/article/edit',
        query: {
          pid: item.pid
        }
      })
    },
    handleDelete(index, item) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          articleApi
            .deleteArticle(item.pid)
            .then(response => {
              this.$notify({
                title: '成功',
                message: '文章删除成功!',
                type: 'success'
              })
              this.loadArticles()
            })
            .catch(error => {
              this.$notify.error({
                title: '失败',
                message: error.message || '文章删除失败!'
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
    add() {
      this.$router.push({
        path: '/users/article/edit'
      })
    }
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.demo-table-expand .el-form-item-full {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
