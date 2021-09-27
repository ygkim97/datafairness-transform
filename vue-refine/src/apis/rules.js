import request from '@/utils/request'

export function api_getRuleInfo(params) {
    return request({
        url: `/function/data-dqi-rule/`,
        method: 'post',
        params: params,
    })
}

export function api_deleteRule(params) {
    return request({
        url: '/function/data-dqi-rule/',
        method: 'delete',
        params : params,
    })
}