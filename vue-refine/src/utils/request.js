import axios from 'axios'
import store from '@/store'
import router from '@/router/routes.js'

const service = axios.create({
  baseURL: _baseURL + ':' + process.env.VUE_APP_API_BASE_PORT,
  timeout: 600000,
  withCredentials: true
})

// abort duplicate request
const pending = {}
const CancelToken = axios.CancelToken
const removePending = (config, f) => {
  if (config != undefined) {
    // make sure the url is same for both request and response
    // stringify whole RESTful request with URL params

    const baseUrl = config.baseURL
    const methodUrl = (config.url.indexOf(baseUrl) > -1) ? config.url.replace(baseUrl, '') : config.url
    let params = ""
    if (config.method == 'get') {
      params = JSON.stringify(config.params)
    } else {
      if (typeof config.data == 'object') {
        params = JSON.stringify(config.data);
      } else {
        params = JSON.stringify(JSON.parse(config.data));
      }
    }
    let flagUrl = baseUrl + '&' + methodUrl + '&' + params

    if (flagUrl in pending) {
      if (f) {
        f() // abort the request
      } else {
        delete pending[flagUrl]
      }
    } else {
      if (f) {
        pending[flagUrl] = f // store the cancel function
      }
    }
  }
}
service.clear = () => {
  Object.keys(pending).map(e => {
    if (pending[e]) {
      pending[e]()
      delete pending[e]
    }
  })
}

service.interceptors.request.use(config => {
  // flask_api를 이용할 경우, port 번호를 바꿔줘야 한다.
  // /api/*.js 의 parameter를 이용해서 처리 하고 싶은데, 방법을 찾지 못함.
  if (config.url == '/recommend/movie') {
    // config.baseURL = config.baseURL.replace(process.env.VUE_APP_API_BASE_PORT, process.env.VUE_APP_FLASK_API_PORT)
    // console.log(config.baseURL)
    config.baseURL = 'http://192.168.101.42:9099'
  }
  if (store.getters.accessToken) {
    config.headers.common['X-AUTH-TOKEN'] = store.getters.accessToken
  }

  // post는 params가 아니고, data를 사용한다.
  if (config.method != 'get') {
    config.data = config.params;
    config.params = null
  }

  config.cancelToken = new CancelToken((c) => {
    removePending(config, c)
  })

  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    removePending(response.config)
      // response를 전체적으로 수정해야 할 경우, 여기서 한다.
      // response.data 가, back-end에서 넘어오는 부분이고,
      // response.status 는 front-end에서 back-end 로 axios 호출할때의 상태값이다.
      if (response.data.status == "true"
        || response.data.status == true
        || response.data.status == "200") {
        response.data.status = true
      } else {
        // back-end 의 error를 일괄 처리 하고 싶을 경우, 여기서 처리한다.
        response.data.status = false
      }

      // back-end와의 통신중, 발생하는 error는 여기서 해결한다.
      if (response.status != 200) {
        throw new Error("error");
      }

      // back-end response만 넘겨준다.    
      return response.data
  },
  error => {
    removePending(error.config)

    if (!axios.isCancel(error)) {
      const _r = router
      const vm = router.app

      if (error.message.toLowerCase() == 'network error') {
        // network error 발생 = backend 서버 다운
        _r.push({ name: 'error02' })
      } else {
        const resp = error.response.data
        if (resp.error == 'Forbidden' && resp.message == 'Access Denied') {
          // 표시되고 있는 modal을 닫는다.
          vm.EventBus.$emit('modalClose')

          // access Denied > login 메시지로 팅구기
          vm.EventBus.$emit('modalAlert', {
            title: 'Information',
            text: '로그아웃되셨습니다. 로그인 페이지로 이동합니다.',
            okTitle: '확인',
            okRes: function () {
              vm.$store.dispatch('logout')
              _r.push({ name: 'login' })
            }
          });
        } else {
          console.log('err' + error)
          return Promise.reject(error)
        }
      }
    } else {
      // return empty object for aborted request
      return Promise.resolve({})
    }
  })

export default service
