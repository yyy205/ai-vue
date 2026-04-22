import service from "@/utils/request";

export function login(data) {
  return service.post('/user/login',data)
}

export function categoryTree() {
  return service.get('/knowledge/category/tree')
}

export function articlePage(params) {
  return service.get('/knowledge/article/page',params)
}

// export function uploadFile(file,businessInfo) {
//   const formData = new FormData()
//   formData.append('file',file)  
//   formData.append('businessType','ARTICLE')
//   formData.append('businessInfo',businessInfo)
//   formData.append('businessField','cover')

//   return service.post('/file/upload',formData,{
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   })
// }
export function uploadFile(file, businessInfo) {  // ← 添加 businessId 参数
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)     // ← 直接传 businessId 字符串
  formData.append('businessField', 'cover')
  return service.post('/file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function createArticle(data) {
  return service.post('/knowledge/article',data)
}
export function getArticleDetail(data) {
  return service.get('/knowledge/article/{id}',data)
}