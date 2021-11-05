import request from "@/utils/request";

export function api_dataDqiRule(param) {
  return request({
    url: `/function/data-dqi-rule`,
    method: "post",
    params: param
  });
}

export function api_dataDqiRuleChange(param) {
  return request({
    url: `/function/data-dqi-rule`,
    method: "post",
    params: param
  });
}

export function api_dataDqiRule_temp(param) {
  return request({
    url: `/api/get/DQI`,
    method: "get",
    data: param
  });
}
