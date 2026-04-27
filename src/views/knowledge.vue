<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button @click="handleEdit({})" type="primary" >新增</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch"/>
    <el-table :data="tableData" style="width: 100%;margin-top: 25px;">
      <el-table-column  label="文章标题" width="200">
        <template #default="scope">
          <div style="display: flex;align-items: center;">
            <el-icon><timer /></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="分类" width="200">
        <template #default="scope">
          <div style="display: flex;align-items: center;">
            <el-icon><timer /></el-icon>
            <span>{{ categoryMap[scope.row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="200" />
      <el-table-column prop="readCount" label="阅读量" width="200" />
      <el-table-column prop="createdAt" label="发布时间" width="200" />
      <el-table-column  label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" text type="primary">编辑</el-button>
          <el-button @click="handlePublish(scope.row)" v-if="scope.row.status=== 0||scope.row.status === 2" text type="success">发布</el-button>
          <el-button @click="handleUnPublish(scope.row)" v-if="scope.row.status=== 1" text type="warning">下线</el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
    style="margin-top: 25px;"
    :page-size="pageination.size"
    layout="prev, pager, next"
    :total="pageination.total" 
    @change="handleChange"
    />
    <ArticleDialog v-model:modelValue="dialogVisible" :article="currentArticle" :categories="categories" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { onMounted,reactive,ref } from 'vue';
import PageHead from '@/components/PageHead.vue';
import TableSearch from '@/components/TableSearch.vue';
import { categoryTree,articlePage,getArticleDetail ,changeArticleStatus,deleteArticle} from '../api/admin';
import { Timer } from '@element-plus/icons-vue';
import ArticleDialog from '../components/ArticleDialog.vue';
import { ElMessageBox, ElMessage} from 'element-plus';

  const formItem = [
    { comp: 'input',prop: 'title',label: '文章标题',placeholder: '请输入文章标题' },
    { comp: 'select',prop: 'category',label: '分类',placeholder: '请选择文章分类' },
    { comp: 'select',prop:'status',label:'状态',placeholder:'请选择文章状态',options:[
      { label: '草稿', value: 0 },
      { label: '已发布', value: 1 },
      { label: '已下线', value: 2 }
    ]}
  ]

  //分页参数
  const pageination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
  })

  const handleSearch = async (formData) => {

    
    const params = {
      ...pageination,
      ...formData
    }
  const { records, total} = await articlePage(params)
  tableData.value = records
  pageination.total = total // Keep pagination total in sync with backend result
  }

  const handleChange = (page) => {
    pageination.currentPage = page
    handleSearch()
  }
// 分类
const categoryMap = reactive({})

// 列表
const categories =ref([])

const tableData = ref([])

const dialogVisible = ref(false)

const currentArticle = ref(null)

  onMounted(async () => {
    const data = await categoryTree()

      categories.value = data.map(item => {
      // categoryMap[item.id] = item.categoryName// 将树形结构转换成对象
      return {
        label: item.categoryName,
        value: item.id
      }
    })
    formItem[1].options = categories.value
    handleSearch()
  })
  const handleSuccess = () => {
    dialogVisible.value = false
    // pageination.currentPage = 1 // After create/update, jump back to first page to show latest list
    handleSearch()
  }

   const handleEdit = (row) => {
      if(!row.id) {
        currentArticle.value = null
        dialogVisible.value = true
      }else{
        getArticleDetail(row.id).then(res => {
        currentArticle.value = res
        dialogVisible.value = true
        })
      }

   }

   const handlePublish = (row) => {
    ElMessageBox.confirm(
      `确认发布文章 ${row.title} ?`,
      `确认`,
      {
        confirmButtonText: '确定发布',
        cancelButtonText: '取消',
        type: 'info',
      }
    ).then(() => {
      changeArticleStatus(row.id,{status:1}).then(res => {
        ElMessage.success('发布成功')
        handleSearch()
      })
    })
   }
    
   const handleUnPublish = (row) => {
    ElMessageBox.confirm(
      `确认下线文章 ${row.title} ?`,
      `确认`,
      {
        confirmButtonText: '确定下线',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      changeArticleStatus(row.id,{status:2}).then(res => {
        ElMessage.success('下线成功')
        handleSearch()
      })
    })    
   }

   const handleDelete = (row) => {
    ElMessageBox.confirm(
      `确认删除文章 ${row.title} ?`,
      `确认`,
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'danger',
      }
    ).then(() => {
      deleteArticle(row.id).then(res => {
        ElMessage.success('删除成功')
        handleSearch()
      })
    })      
   }
</script>
