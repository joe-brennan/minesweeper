const { defineConfig } = require('@vue/cli-service')
module.exports = {
  outputDir: '../backend/src/main/resources/static',
  publicPath: process.env.NODE_ENV === 'production' ? '/minesweeper/' : '/'
}