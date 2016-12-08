//api请求代理转发
//用node express起的服务，监听目录为dev/page文件夹，即fis3 release到dev进行监听
//另一种方案用改写的fis3 server 插件,扩充了代理功能，详细见test-confi.js
var express = require('express')
var proxyMiddleware = require('http-proxy-middleware')

var port = 9120
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = {
    '/api_oauth/**': {
        target: 'http://192.168.254.1:7100',
        changeOrigin: false,
        logLevel: 'debug',
        pathRewrite: {
            '^/api_oauth/': ''
        }
    },
    '/api_inner/**': {
        target: 'http://192.168.254.1:7200',
        changeOrigin: false,
        pathRewrite: {
            '^/api_inner/': ''
        },
    },
    '/api_outer/**': {
        target: 'http://192.168.254.1:7300',
        changeOrigin: false,
        pathRewrite: {
            '^/api_outer/': ''
        },
    },
    '/api_outer_oauth/**': {
        target: 'http://192.168.254.1:7000',
        changeOrigin: false,
        pathRewrite: {
            '^/api_outer_oauth/': ''
        },
    }
}
var app = express()

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = {target: options}
    }
    app.use(proxyMiddleware(context, options))
})
// app.get('/', function (req, res) {
//     res.send('Hello World!');
// })
app.use(express.static('./dev/'));

console.log('listen at '+port);
console.log('app listening at http://127.0.0.1:%s', port);

app.listen(port)
