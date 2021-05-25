module.exports = {
  devServer: {
    hot: false,
    liveReload: false
  },
  configureWebpack: {
    devtool: 'source-map'
  },
  transpileDependencies: ["vuetify"]
};
