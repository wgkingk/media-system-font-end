import axios from 'axios'
import {Message, Loading} from 'element-ui'
import store from '../store/index.js'
import router from '../router'


const Service = axios.create({
  timeout: 7000
})
Service.defaults.baseURL = 'http://39.97.121.236:8082'
Service.interceptors.request.use(config => {
  config.headers.authorization = localStorage.getItem("token")
  return config
})

Service.interceptors.response.use(response => {
  // console.log(response)
  if (response.data.code === 1003) {
    Message({
      message: '对不起，你没有权限访问',
      type: 'warning'
    })
  } else if (response.data.code === 1004) {
    Message({
      message: '登录过期，请重新登录',
      type: 'error'
    })
    router.push('/login')
  }
  return response
}, error => {
  console.log('TCL: error', error)
  const msg = error.Message !== undefined ? error.Message : ''
  Message({
    message: '网络错误' + msg,
    type: 'error',
    duration: 3 * 1000
  })
  return Promise.reject(error)
})

export default Service
