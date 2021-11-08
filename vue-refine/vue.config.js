module.exports = {
  runtimeCompiler: true,
  devServer: {
    port: process.env.VUE_APP_PORT,
    disableHostCheck: true,
    proxy: {
      "^/function/data-dqi": {
        target: `http://${process.env.VUE_APP_REST_SERVER_URL_DQI}:${process.env.VUE_APP_REST_SERVER_PORT_DQI}`,
        changeOrigin: true,
        logLevel: "debug"
      },
      "^/function/data-dqi-rule": {
        target: `http://${process.env.VUE_APP_REST_SERVER_URL_DQI}:${process.env.VUE_APP_REST_SERVER_PORT_DQI}`,
        changeOrigin: true,
        logLevel: "debug"
      },
      "^/cdn": {
        target: `http://${process.env.VUE_APP_REST_SERVER_URL_DQI}:${process.env.VUE_APP_REST_SERVER_PORT_DQI}`,
        changeOrigin: true,
        logLevel: "debug"
      },
      "^/function/fairness": {
        target: `http://${process.env.VUE_APP_REST_SERVER_URL_AFI}:${process.env.VUE_APP_REST_SERVER_PORT_AFI}`,
        changeOrigin: true,
        logLevel: "debug"
      }
    }
  },

  transpileDependencies: ["vuetify"],

  pluginOptions: {
    i18n: {
      locale: "ko",
      fallbackLocale: "ko",
      localeDir: "locales",
      enableInSFC: false
    }
  },

  pages: {
    index: {
      entry: "src/main.js",
      title: "IRIS-Refine-Rule"
    }
  }
};
