module.exports = {
  devServer: {
    port: process.env.VUE_APP_PORT,
    disableHostCheck: true,
    proxy: {
      "^/function": {
        target: `http://${process.env.VUE_APP_REST_SERVER_URL}:${process.env.VUE_APP_REST_SERVER_PORT}`,
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: { "^/api/": "/api/" }
      },
      "^/api": {
        target: `http://${process.env.VUE_APP_REST_SERVER_URL}:${process.env.VUE_APP_REST_SERVER_PORT}`,
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: { "^/api/": "/api/" }
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
  },

  configureWebpack: {
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    }
  }
};
