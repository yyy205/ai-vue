import axios from "axios";
import { ElMessage } from "element-plus";

const service = axios.create({
  baseURL: '/api',//请求前缀
  timeout: 5000,//超时时间
})

service.interceptors.request.use(
  (config) => {
    //在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if(token){
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    //对请求错误做些什么
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    //对响应数据做些什么
    const {data,config} = response
    //data拿到的是后端返回的json数据（对象）
    //code是后端返回的状态码
    //data.data是后端返回的数据
    if(data.code === 200 ){
      return data.data
    }else{
      if(data.code === '-1'){
        if(!config.url?.includes('login')){
          ElMessage.error(data.msg||'登录过期，请重新登录')
          //清除token
          localStorage.removeItem('token')
          //清除用户信息
          localStorage.removeItem('userInfo')
          //跳转登录页面
          window.location.href = '/auth/login'
        }else{
          ElMessage.error(data.msg||'登录失败')
          return Promise.reject('网络请求失败...')
        }
      }
    }
    return response
  },
  (error) => {
    //对响应错误做些什么
    return Promise.reject(error)
  }
)
export default service