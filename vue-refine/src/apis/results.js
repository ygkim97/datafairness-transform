import request from '@/utils/request'
import store from '@/store'

export function api_dataDqi() {
    return request({
        url: `/function/data-dqi`,
        method: 'get',
        data : store.getters.ruleParam
    })
}

export function api_dataDqi_temp() {
    return request({
        url: `/api/get/DQI`,
        method: 'get',
        data : store.getters.ruleParam
    })
}