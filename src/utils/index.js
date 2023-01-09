import axios from 'axios'
import url from './url'

// 创建请求实例
const instance = axios.create({
  timeout: 1000
})

// 返回符合规则的缓存数据
let backIndex = ''
let backData = []

// 添加请求拦截器，判断缓存是否命中：
instance.interceptors.request.use((config) => {
  let reConfig = cacherules(config) // 判断缓存是否命中
  console.log('请求拦截器传递的config：', reConfig)
  return reConfig
}, (err) => {
  return Promise.reject(err)
})

// 添加响应拦截器
instance.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  console.log('响应拦截器:', response)
  // 缓存数据（已内置缓存条件：响应体中的code为200。符合条件即缓存）
  localStore(response)
  // 判断响应内容是否符合条件：响应体中的code为200。符合条件即返回响应数据，否则将抛出错误。
  if (response.data.code === 200) {
    return response
  } else {
    return Promise.reject(response.data)
  }
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  if (axios.isCancel(error)) {
    console.log('已取消本次请求，返回缓存数据')
    return Promise.resolve(JSON.parse(error.message))
  } else {
    console.log('这个请求没有被取消，但还是有错误:', error)
  }
  return Promise.reject(error)
})

// 存放获取数据的方法。url地址在同级文件url.js中修改，或者直接在实例instance中指定；params参数根据接口自行调整。
const api = {
  // 获取天气数据
  getWeather1 (areaid) {
    return instance.get(url.tianqi, {
      params: {
        city: areaid,
        type: '1' // 实时1，七天7
      }
    })
  },
  getWeather7 (areaid) {
    return instance.get(url.tianqi, {
      params: {
        city: areaid,
        type: '7' // 实时1，七天7
      }
    })
  }
}
export default api

// 检测 localStorage 是否同时受支持和可用的函数storageAvailable
function storageAvailable (type) {
  var storage
  try {
    storage = window[type]
    var x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return e instanceof DOMException && (
    // everything except Firefox
      e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0)
  }
}

// 对数据进行缓存的函数localStore。默认在响应拦截器中使用，若在其它地方使用，需更改传入参数params的属性。（有调用函数storageAvailable：检测 localStorage 是否同时受支持和可用的函数）
function localStore (params) {
  if (storageAvailable('localStorage')) {
    // We can use localStorage awesomeness
    let cacheIndex = '' // 缓存数据的索引，即localStorage{cacheIndex:cacheData}（键，值）
    let cacheData = [] // 缓存列表[{expiretime:过期时间,response:params内容}]
    let cacheObj = {} // {expiretime:过期时间,response:params内容}
    let expiretime = '' // 过期时间（毫秒数）

    // 判断响应内容是否符合条件：响应体中的code为200。符合条件即推入缓存
    if (params.data.code === 200) {
      console.log('开始缓存数据……截获的响应数据为：', params)
      cacheIndex = JSON.stringify(params.config.url + params.config.method + JSON.stringify(params.config.params)) // 编码缓存索引：将请求url、方法、参数组合在一起。参数要根据服务器返回的数据来定。
      expiretime = Date.now() + 24 * 60 * 60 * 1000 // 设置过期时间（毫秒数）：当前时间+24h
      // 设置缓存数据，其结构为[{expiretime:过期时间,response:params内容}]
      cacheObj.expiretime = expiretime
      cacheObj.response = params
      cacheData.push(cacheObj)
      // 将数据保存在本地
      localStorage.setItem(cacheIndex, JSON.stringify(cacheData))
      if (localStorage.getItem(cacheIndex)) {
        console.log('数据已缓存至本地')
      } else {
        console.log('该数据没有缓存至本地')
      }
    } else {
      console.log('响应内容判断条件有误，需修改。输出截获的响应params:', params)
    }
  } else {
    console.log('本地缓存不可用，数据将不会保存至本地')
  }
  return params
}

// 缓存命中规则函数。默认在请求拦截器中使用，若在其它地方使用，需更改传入参数params的属性。
function cacherules (params) {
  // 取消请求的配置
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  // 编码索引：将请求url、方法、参数组合在一起
  let curReqIndex = JSON.stringify(params.url + params.method + JSON.stringify(params.params))
  // 根据编码后的索引查找本地缓存，看是否有该请求的缓存，即缓存命中：请求url、方法、参数一致+缓存没过期 = 需要的缓存数据
  if (localStorage.getItem(curReqIndex)) {
    console.log('本地有该请求的缓存:', localStorage)
    let pastData = JSON.parse(localStorage.getItem(curReqIndex)) // 获取因该条请求缓存的所有数据[{expiretime:过期时间,response:params内容}]
    let cacheExTime = [] // 存放处理后的时间数据：缓存数据中的过期时间expiretime - 现在时刻
    // 接下来找未过期的数据(>0)，而且要找出那个最慢过期的数据(max)。
    pastData.forEach(el => {
      cacheExTime.push(new Date(el.expiretime) - Date.now())
    })
    if (Math.max(...cacheExTime) > 0) {
      console.log('缓存数据没过期，将取消本次请求~')
      // 为本次请求参数添加取消请求的标识：cancelToken
      params.cancelToken = source.token
      // 返回符合规则的缓存数据
      backIndex = cacheExTime.indexOf(Math.max(...cacheExTime))
      backData = pastData[backIndex].response
      console.log('backData', backData)
      // 取消本次请求，并将缓存数据通过source.cancel()传递，即error.message里存放缓存数据。取消请求后，状态码会超出200，被响应拦截器处理。
      source.cancel(JSON.stringify(backData))
    } else {
      console.log('缓存数据都过期了，将重新请求数据~')
    }
  } else {
    console.log('本地没有该请求的缓存，将重新请求数据~')
  }
  return params
}
