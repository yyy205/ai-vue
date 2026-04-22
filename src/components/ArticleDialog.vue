<template>
  <el-dialog
      :title="isEmit ? '编辑文章' : '新增文章'"
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
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor 
        v-model="formData.content" 
        placeholder="请输入文本内容，支持富文本格式\n\n可以使用加粗、斜体、列表、标题等格式来丰富文本内容。"
        :max-char-count="5000"
        @change="handleContentChange"
        @created="handleEditorCreated"
        min-height="400px"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <h3>预览效果</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
        <el-button @click="btnPreview=!btnPreview">{{ btnPreview ? '隐藏预览' : '预览效果' }}</el-button>
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="handleSubmit" :loading="loading" type="primary">{{ isEmit ? '更新文章' : '创建文章' }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref ,reactive,computed,nextTick} from 'vue'
  import{ ElMessage } from 'element-plus'
  import { uploadFile,createArticle } from '@/api/admin.js'
  import { fileBaseUrl } from '@/config/index.js'
  import RichTextEditor from './RichTextEditor.vue'

  const props =defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    categories:{
      type:Array,
      default:()=>[]
    },
    article:{
      type:Object,
      default:null
    }
  })

const emit =defineEmits(['update:modelValue','success'])

  const dialogVisible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      emit('update:modelValue', val)
    }
  })

  const isEmit = computed(() =>!!props.article?.id)
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
    ],
    content: [
      { required: true, message: '请输入文章内容', trigger: 'blur' },
      { max: 5000, message: '最多5000 个字符', trigger: 'blur' }
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

  const handleUploadRequest = async({file}) => {
    const businessId =crypto.randomUUID()
    const fileRes = await uploadFile(file,{
      businessId:businessId,
    })
    imgUrl.value = fileBaseUrl + fileRes.filePath
    formData.coverImage = fileRes.filePath
  }

  
  const  handleContentChange = (data) => {
    formData.content = data.html
  }

  const editorInstance = ref(null)
  const handleEditorCreated = (editor) => {
    editorInstance.value = editor
    if(formData.content&&editor){
      nextTick(() => {
        editor.setHtml(formData.content)
      })  
  }
}

const btnPreview =ref(false)

const formRef = ref()
const loading = ref(false)
const handleSubmit = () => {
  //表单校验
  formRef.value.validate((valid,fileds) => {
      if (valid) {
        loading.value = true
      }
      console.log(formData)
      const submitData = {
        ...formData,
        tags:formData.tagArray.join(',')
      }
      delete submitData.tagArray

      createArticle(submitData).then(res => {
        loading.value = false
        ElMessage.success('创建文章成功')
        emit('success')
      })
  })
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
.cover-image {
  width: 200px;
  height: 100px;
  display: block;
}
</style>