// common plugins

import request from "@/utils/request_dqi"; // axios interceptor

export default {
  install(Vue) {
    Vue.mixin({
      methods: {
        getCloneArray(array) {
          return [...array];
        },
        // check string is empty
        isStringEmpty(val) {
          return val !== 0 && (val === "" || val === null || false);
        }, // axios cancel
        axiosCancel() {
          request.clear();
        },
        getDataPath(bucket, s3_key) {
          let dataPath = "";
          if (this.isStringEmpty(bucket)) {
            dataPath = "file:///" + s3_key;
          } else {
            dataPath = "s3://" + bucket + "/" + s3_key;
          }
          return dataPath.indexOf("null") > -1 ? "" : dataPath;
        },
        convertTwoNo(val) {
          return (val + "").length === 1 ? "0" + val : val;
        },
        /**
         * params : date (long)
         * format : 'yyyy-MM-dd'
         */
        getDateByFormat(date, format) {
          if (this.isStringEmpty(date) || isNaN(date)) {
            // 공백일 경우, 오늘 날짜 이용
            date = new Date();
          } else {
            date = new Date(date);
          }

          if (this.isStringEmpty(format)) {
            format = "yyyy-MM-dd";
          }

          if (format.indexOf("yyyy") > -1) {
            format = format.replace("yyyy", date.getFullYear());
          }
          if (format.indexOf("yy") > -1) {
            format = format.replace(
              "yy",
              (date.getFullYear() + "").substr(2, 4)
            );
          }
          if (format.indexOf("MM") > -1) {
            format = format.replace(
              "MM",
              this.convertTwoNo(date.getMonth() + 1)
            );
          }
          if (format.indexOf("dd") > -1) {
            format = format.replace("dd", this.convertTwoNo(date.getDate()));
          }
          if (format.indexOf("HH") > -1) {
            format = format.replace("HH", this.convertTwoNo(date.getHours()));
          }
          if (format.indexOf("mm") > -1) {
            format = format.replace("mm", this.convertTwoNo(date.getMinutes()));
          }
          if (format.indexOf("ss") > -1) {
            format = format.replace("ss", this.convertTwoNo(date.getSeconds()));
          }

          return format;
        },
        // 숫자를 입력받아서, 3자리 마다 ','를 찍어준다.
        setDotToNumber(number) {
          return Number(number)
            .toFixed(0)
            .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
        },
        IsJsonValid(str) {
          try {
            return typeof JSON.parse(str) === "object";
          } catch (e) {
            return false;
          }
        },
        replaceAll(str, oldVal, newVal) {
          const reg = new RegExp(oldVal, "gi");
          return str.replace(reg, newVal);
        }
      }
    });
  }
};
