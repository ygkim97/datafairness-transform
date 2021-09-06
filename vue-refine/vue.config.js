module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  
  transpileDependencies: [
    'vuetify'
  ],

  pluginOptions: {
    i18n: {
      locale: 'ko',
      fallbackLocale: 'ko',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
