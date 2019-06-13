const http = require('http');
const path = require('path');
const util = require('./util');

function DyServer (conf) {
    this.port = conf.port || 8080;
    this.path = conf.path.replace(/\\/g, '/');
    this.server = null;
}

DyServer.prototype.createServer = function () {
    this.server = http.createServer((req, resp) => {
        const reqPath = this.path + req.url;
        if (/\/$/.test(req.url)) {
            util.readFile(path.resolve(targetPath, './index.htm')).then(data => {
                resp.end(data)
            }, e => {
            }).then(() => {
                return util.readFile(path.resolve(targetPath, './index.html'))
            }).then(data => {
                resp.end(data)
            }, e => {
            }).then(() => {
                return util.readdir(reqPath)
            }).then(dir => {
                util.jq(path.resolve(__dirname, './list.html')).then($ => {
                    $('.dirname').html(req.url)
                    $('.file-list').html((() => {
                        let html = ''
                        dir.forEach(item => {
                            let href = path.resolve(reqPath, `./${item}`).replace(/\\/g, '/')
                            const lastStr = util.isFile(href) ? '' : '/'
                            item += lastStr
                            href = href.replace(targetPath, '') + lastStr
                            html += `<li><a href="${href}">${item}</a></li>`
                        })
                        return html
                    })())
                    resp.end($.html())
                })
            }, e => {
                errHandle(e, resp)
            })
        } else {
            util.readFile(reqPath).then(data => {
                resp.end(data)
            }).catch(e => {
                errHandle(e, resp)
            })
        }
    })
};

function code_404 (resp) {
    resp.statusCode = 404
    util.readFile(path.resolve(__dirname, './404.html')).then(data => {
        resp.end(data)
    })
}

function errHandle (e, resp) {
    if (e.errno === -4058) {
        code_404(resp)
    } else {
        resp.end()
    }
}

server.listen(port, () => {
    console.log('服务器已启动，端口为' + port)
})

module.exports = DyServer
