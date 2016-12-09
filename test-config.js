//npm install -g fis3-command-test
//https://github.com/cheneyliu/fis3-command-test
//基于 fis3-command-server 开发, 添加 http-proxy-middleware, 使服务器具有代理服务器的功能
//与fis3内置server的命令一致 如 fis3 server start---》fis3 test start
module.exports = {
    port: 8080,
    browse: false,
    proxy: {
        '/api_oauth': {
            target: 'http://192.168.254.1:7100',
            changeOrigin: false,
            logLevel: 'debug',
            pathRewrite: {
                '^/api_oauth(.*)': ''
            }
        },
        '/api_inner': {
            target: 'http://192.168.254.1:7200',
            changeOrigin: false,
            pathRewrite: {
                '^/api_inner(.*)': ''
            },
        },
        '/api_outer': {
            target: 'http://192.168.254.1:7300',
            changeOrigin: false,
            pathRewrite: {
                '^/api_outer(.*)': ''
            },
        },
        '/api_outer_oauth': {
            target: 'http://192.168.254.1:7000',
            changeOrigin: false,
            pathRewrite: {
                '^/api_outer_oauth(.*)': ''
            },
        }
    }
}