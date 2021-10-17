import request from '@/utils/request'
import store from '@/store'

export function api_dataDqiRule() {
    return request({
        url: `/function/data-dqi-rule`,
        method: 'post',
        params: store.getters.ruleParam,
    })
}

export function api_dataDqiRule_temp() {
    return request({
        url: `/api/get/DQI`,
        method: 'get',
        data : store.getters.ruleParam
    })
}