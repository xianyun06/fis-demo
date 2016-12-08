/**
 * File:    fis-conf.js.
 * Date:    2016/2/3.
 * Creator: Cheney.
 */
// 设置不产出文件及目录
//默认有:['node_modules/**', 'output/**', '.git/**', 'fis-conf.js']
fis.match('.idea/**', {release: false});
fis.match('docs/**', {release: false});
fis.match('**.md', {release: false});
fis.match('**.less', {release: false});
fis.match('dist/**', {release: false});
fis.match('template/**', {release: false});
fis.match('dev/**', {release: false});
fis.match('package.json', {release: false});
fis.match('dev-server.js', {release: false});
//https://github.com/cheneyliu/fis3-command-test
fis.match('test-config.js', {release: false});

//相对定位
//npm install -g fis3-hook-relative
fis.hook('relative');
fis.match('**', {
    relative: true
});
// less编译
//npm install -g fis-parser-less
fis.match('assets/less/(*).less', {
    parser: fis.plugin('less-2.x', {dumpLineNumbers: "comments"}),
    // optimizer: fis.plugin('clean-css'),//压缩css
    release: '/static/css/$1',
    rExt: '.css'
});
fis.match('*.{js,css,png,less}', {
    useHash: true
});

//支持require 静态文件，如json,图片等
//npm install -g fis3-preprocessor-js-require-file
fis.match('*.{js,es,es6,jsx,ts,tsx}', {
    preprocessor: fis.plugin('js-require-file')
})

// 配置js的babel转义
fis.match('assets/js/(*).js', {
    parser: fis.plugin('babel-5.x'),
    // optimizer: fis.plugin('uglify-js'),//压缩js
    rExt: 'js',
    isMod: true,
    release: '/static/js/$1'
});

function cleanDist(options, modified, total, next) {
    fis.util.del('./dist');
    next();
}

//产出生产文件
fis.media('prod')
    .match('assets/less/(*).less', {release: false})
    .match('assets/less/common.less', {
        parser: fis.plugin('less-2.x'),
        // optimizer: fis.plugin('clean-css'),//压缩css
        release: '/static/css/common',
        rExt: '.css'
    })
    .match('**', {
        deploy: [cleanDist, fis.plugin('local-deliver', {
            to: './dist'
        })]
    });

//上传到服务器
fis.media('upload').match('/dist/(**)', {
    deploy: fis.plugin('ftp', {
        //console: true,
        cache: false,           // 是否开启上传列表缓存，开启后支持跳过未修改文件，默认：true
        remoteDir: '/fis-demo/',   // 远程文件目录，注意！！！设置错误将导致文件被覆盖
        connect: {
            host: '192.168.254.98',
            port: '21',
            user: 'share',
            password: '123qwe!@#'
        }
    }),
    release: '$1'
});
