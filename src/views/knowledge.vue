<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary">新增</el-button>
        <el-button type="primary">编辑</el-button>
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
          <el-button text type="primary">编辑</el-button>
          <el-button v-if="scope.row.status=== 0||scope.row.status === 2" text type="success">发布</el-button>
          <el-button v-if="scope.row.status=== 1" text type="warning">下线</el-button>
          <el-button text type="danger">删除</el-button>
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
  </div>
</template>

<script setup>
import { onMounted,reactive,ref } from 'vue';
import PageHead from '@/components/PageHead.vue';
import TableSearch from '@/components/TableSearch.vue';
import { categoryTree,articlePage } from '../api/admin';
import { Timer } from '@element-plus/icons-vue';

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
    console.log(formData);
    
    const params = {
      ...pageination,
      ...formData
    }


  const handleChange = (page) => {
    pageination.currentPage = page
    handleSearch()
  }

  const { records, total} = await articlePage(params)
  tableData.value = records
  }
// 分类
const categoryMap = reactive({})

// 列表
const categories =ref([])

const tableData = ref([])

  onMounted(async () => {
    const data = await categoryTree()

    const categories = data.map(item => {
      categoryMap[item.id] = item.categoryName// 将树形结构转换成对象
      return {
        label: item.categoryName,
        value: item.id
      }
    })
    formItem[1].options = categories
    handleSearch()
  })
</script>