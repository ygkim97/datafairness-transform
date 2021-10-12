import request from '@/utils/request'
import store from '@/store'

export function api_getRuleInfo() {
    return request({
        url: `/function/data-dqi-rule/`,
        method: 'post',
        params: store.getters.ruleParam,
    })
}

export function api_getRuleInfo_temp() {
    return request({
        url: `/api/get/DQI`,
        method: 'get',
        data : store.getters.ruleParam
    })
}

export function api_createRule() {
    return request({
        url: '/function/data-dqi-rule/',
        method: 'post',
        params : store.getters.ruleParam,
    })
}

export function api_deleteRule() {
    return request({
        url: '/function/data-dqi-rule/',
        method: 'post',
        params : store.getters.ruleParam,
    })
}