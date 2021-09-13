import request from '@/utils/request'

export function api_getRuleInfo(tableName) {
    return request({
        url: `/api/get/${tableName}`,
        // url : '/test',
        method : 'get'
    })
}