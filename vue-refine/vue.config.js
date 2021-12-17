module.exports = {
  runtimeCompiler: true,
  devServer: {
    // overlay: false,
    port: process.env.VUE_APP_PORT,
    disableHostCheck: true,
    proxy: {
      "^/function/*": {
        target: `http://${process.env.VUE_APP_REST_SERVER_URL}:${process.env.VUE_APP_REST_SERVER_PORT}`,
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
