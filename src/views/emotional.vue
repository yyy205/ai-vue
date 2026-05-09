<template>
  <div>
    <PageHead title="情绪日志" />
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table :data="tableData">
      <el-table-column prop="id" label="用户ID" width="80" />
      <el-table-column  label="会话ID" width="80">
        <template #default="scope">
            <el-avatar>{{ scope.row.username }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="diaryDate" label="记录日期" width="120" />
      <el-table-column  label="情绪评分" width="200">
        <template #default="scope">
          <el-rate :model-value="scope.row.moodScore" :max="10" disabled />
        </template>
      </el-table-column>
      <el-table-column  label="生活指标" width="120">
        <template #default="scope">
          <div>
            <p>
              睡眠：{{ scope.row.sleepQuality }} / 5
            </p>
            <p>
              压力：{{ scope.row.stressLevel }} / 5
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="emotionTriggers" label="情绪触发因素" width="120" />   
      <el-table-column prop="diaryContent" label="日记内容" width="250" />   
      <el-table-column  label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button  text type="primary">详情</el-button>
          <el-button  text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
      style="margin-top: 25px;"
      :page-size="pagination.size"
      layout="prev, pager, next"
      :total="pagination.total" 
      @change="handleChange"
    />
  </div>
</template>

<script setup>
  import PageHead from '@/components/PageHead.vue';
  import TableSearch from '@/components/TableSearch.vue';
  import {ref,reactive,onMounted} from 'vue';
  import {getEmotionalPage} from '@/api/admin.js';

const tableData = ref([])
  
const formItem = [
  {comp:'input',prop:'userId',label:'用户ID',placeholder:'请输入用户ID'},
  {comp:'select',prop:'moodScreRange',label:'情绪评分',placeholder:'请选择评分范围',options:[{
    label:'低分（1-3）',
    value:'1-3'
  },{
    label:'中分（4-6）',
    value:'4-6'
  },{
    label:'高分（7-10）',
    value:'7-10'
  }]},
]

const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0
})

const handleChange = (page) => {
    pagination.currentPage = page
    handleSearch()
  }

const handleSearch = async(formData) => {
  const params = {
    ...pagination,
    ...formData
  };

  const { records, total} = await getEmotionalPage(params)
  // console.log(records)
  tableData.value = records
  pagination.total = total
}

onMounted(() => {
  handleSearch()
})
</script>