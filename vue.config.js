const path = require('path')

const resolve = dir => {
    return path.join(__dirname, dir)
}
module.exports = {
    // 设置快捷路径名
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('_c', resolve('src/components'))
    },
    // 打包时不生成.map文件
    productionSourceMap: false,
    // 配置跨域路径
    devServer: {
        port: 8081,
        proxy: 'http://localhost:8080/o2o'
    },
    publicPath: './'
}