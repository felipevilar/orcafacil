module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/orcafacil/'
  : '/',
  transpileDependencies: [
    'vuetify'
  ]
}
