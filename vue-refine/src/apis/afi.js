import request from "@/utils/request";

export function api_getAFIResponse(param) {
    return request({
        url: `/function/fairness`,
        method: "post",
        params: param
    });
}
