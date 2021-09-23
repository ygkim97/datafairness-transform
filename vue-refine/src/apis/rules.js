import request from '@/utils/request'

export function api_getRuleInfo(tableName) {
    return request({
        url: `/api/get/${tableName}`,
        method: 'get'
    })
}

export function api_deleteRule(params) {
    return request({
        url: '/api/delete',
        method: 'delete',
        params : params,
    })
}