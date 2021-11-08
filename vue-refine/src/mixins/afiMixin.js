export default {
  methods: {
    convertAFIData: function(req, useAlgorithm) {
      // 내부 동작상, array로 처리되고 있던 부분 string 으로 변환

      // favorable_classes는 array로 변경하는 부분이 조금 달라서 개별로 처리함.
      req.dataset.label.favorable_classes = [
        Number(req.dataset.label.favorable_classes)
      ];

      req.dataset.categorical_features = this.convertArray(
        req.dataset.categorical_features
      );
      req.dataset.features_to_keep = this.convertArray(
        req.dataset.features_to_keep
      );
      req.dataset.features_to_drop = this.convertArray(
        req.dataset.features_to_drop
      );

      req.metric.privileged_groups = req.metric.privileged_groups.map((e) => {
        return { [e.name]: e.value };
      });
      req.metric.unprivileged_groups = req.metric.unprivileged_groups.map(
        (e) => {
          return { [e.name]: e.value };
        }
      );

      // object로 되어있는 값을, true/false 에 따라 array로 변환시켜준다.
      req.metric.metrics = Object.keys(req.metric.metrics)
        .map((e) => {
          return req.metric.metrics[e] ? e : null;
        })
        .filter((e) => e !== null);

      if (!useAlgorithm) {
        // mitigation object 삭제
        delete req["mitigate"];
      } else {
        // algorithm값을 정상적으로 셋팅한다.
        req.mitigation = {
          algorithm: req.mitigate.algorithmList.value
        };
        delete req["mitigate"];
      }

      return req;
    },
    convertArray(str) {
      if (this.isStringEmpty(str)) {
        return [];
      } else {
        return str.split(",");
      }
    }
  }
};
