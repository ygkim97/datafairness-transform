import request from "@/utils/request";

export function api_dataDqi(param) {
  return request({
    url: `/function/data-dqi`,
    method: "post",
    params: param
  });
}
