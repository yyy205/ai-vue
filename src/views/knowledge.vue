<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary">新增</el-button>
        <el-button type="primary">编辑</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch"/>
  </div>
</template>

<script setup>
import { onMounted,reactive,ref } from 'vue';
import PageHead from '@/components/PageHead.vue';
import TableSearch from '@/components/TableSearch.vue';
import { categoryTree,articlePage } from '../api/admin';

  const formItem = [
    { comp: 'input',prop: 'title',label: '文章标题',placeholder: '请输入文章标题' },
    { comp: 'select',prop: 'category',label: '分类',placeholder: '请选择文章分类' },
    { comp: 'select',prop:'status',label:'状态',placeholder:'请选择文章状态',options:[
      { label: '草稿', value: 0 },
      { label: '已发布', value: 1 },
      { label: '已下线', value: 2 }
    ]}
  ]

  const handleSearch = (searchForm) => {
    console.log(searchForm);
    
  }
// 分类
const categoryMap = reactive({})

// 列表
const categories =ref([])

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
  })
</script>