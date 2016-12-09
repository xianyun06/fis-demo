//api请求代理转发
//用node express起的服务，监听目录为dev/page文件夹，即fis3 release到dev进行监听
//另一种方案用改写的fis3 server 插件,扩充了代理功能，详细见test-confi.js
var fs = require('fs');
var url = require('url');
var path = require('path');
var express = require('express');
var proxyMiddleware = require('http-proxy-middleware');

var port = 9120;
var DOCUMENT_ROOT='./dev/';
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = {
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
var app = express();

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
  var options = proxyTable[context]
  if(typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(context, options))
});

app.use(express.static(DOCUMENT_ROOT, {
  index: ['index.html', 'index.htm', 'default.html', 'default.htm'],
  extensions: ['html', 'htm']
}));

// 静态文件列表。
app.use((function() {

  return function(req, res, next) {
    var pathname = url.parse(req.url).pathname;
    var fullpath = path.join(DOCUMENT_ROOT, pathname);
    if(/\/$/.test(pathname) && fs.existsSync(fullpath)) {
      var stat = fs.statSync(fullpath);

      if(stat.isDirectory()) {
        var html = '';
        var files = fs.readdirSync(fullpath);
        html += '<!doctype html>';
        html += '<html>';
        html += '<head>';
        html += '<title>' + pathname + '</title>';
        html += '</head>';
        html += '<body>';
        html += '<h1> - ' + pathname + '</h1>';
        html += '<div id="file-list">';
        html += '<ul>';
        if(pathname != '/') {
          html += '<li><a href="' + pathname + '..">..</a></li>';
        }
        files.forEach(function(item) {
          var s_url = path.join(pathname, item);
          html += '<li><a href="' + s_url + '">' + item + '</a></li>';
        });
        html += '</ul>';
        html += '</div>';
        html += '</body>';
        html += '</html>';
        res.send(html);
        return;
      }
    }
    next();
  };
})());

app.listen(port)

console.log('app listening at http://127.0.0.1:%s', port);

