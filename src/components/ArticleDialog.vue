<template>
  <el-dialog
      title="文章详情"
      v-model="dialogVisible"
      width="50%"
      @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable /> 
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000" show-word-limit :row="4" ></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select v-model="formData.tagArray" placeholder="请输入文章标签(可选)" multiple filterable allow-create style="width:100%">
          <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片" >
        <div class="cover-upload">
          <el-upload
              class="avater-uploader"
              action="#"
              :before-upload="beforeUpload"
              :http-request="handleUploadRequest"
              accept="image/*"
          >
            <div v-if="!imgUrl" class="cover-placeholder">
              <p>点击上传封面</p>
            </div>
            <img v-else :src="imgUrl" class="cover-image" alt="封面图片">
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
  import { ref ,reactive,computed} from 'vue'
  import{ ElMessage } from 'element-plus'

  const props =defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    categories:{
      type:Array,
      default:()=>[]
    }
  })

const emit =defineEmits(['update:modelValue'])

  const dialogVisible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      emit('update:modelValue', val)
    }
  })
  const handleClose = () => {
    
  }
  //表单数据
  const formData = reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 1,
    "summary": "",
    "tags": "",
    "id": "",
  })

  const rules = reactive({
    title: [
      { required: true, message: '请输入文章标题', trigger: 'blur' },
      { max: 200, message: '最多200 个字符', trigger: 'blur' }
    ],
    categoryId: [
      { required: true, message: '请选择文章分类', trigger: 'change' }
    ]
  })



  const commonTags =[
    '情绪管理','焦虑','抑郁','压力','睡眠',
    '冥想','正念','放松','心理健康','自我成长',
    '人际关系','工作压力','学习方法','生活技巧'
  ]

  const imgUrl = ref('')

  const beforeUpload = (file) => {
    //针对上传的文件校验
    const isImage =file.type.startsWith('image/')
    const isLt5M = file.size / 1024 / 1024 < 5
    if(!isImage){
      ElMessage.error('上传图片文件,请选择图片文件')
      return false
    }
    if(!isLt5M){
      ElMessage.error('上传图片文件大小不能超过5M')
      return false
    }
    return isImage
  }

  const handleUploadRequest = () => {
    
  }

</script>
<style lang="scss" scoped>
.cover-placeholder {
  width: 200px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background:#f6f8fa;
}
</style>