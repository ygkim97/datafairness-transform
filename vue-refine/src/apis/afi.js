import request from "@/utils/request_dqi";

export function afi_getAIResult(param) {
    return request({
        url: `/afi`,
        method: "post",
        params: param
    });
}
