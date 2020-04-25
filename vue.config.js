module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  runtimeCompiler: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'localhost:5000',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    performance: {
      hints: false
    }
  }
}
