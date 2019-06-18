const http = require('http');
const path = require('path');
const EventEmitter = require('events');
const util = require('./util');

let server;

class DyServer extends EventEmitter {
    constructor (conf) {
        super();
        this.port = conf.port;
        this.directory = conf.directory;
        server = http.createServer((req, resp) => {
            req.url = decodeURIComponent(req.url);
            const reqPath = this.directory + req.url;
            if (!util.exists(reqPath)) {
                code_404(resp)
            } else if (util.isDir(reqPath)) {
                let indexPath = reqPath + (/\/$/.test(reqPath) ? '' : '/') + 'index.htm';
                indexPath += util.exists(indexPath) ? '' : 'l';
                indexPath = util.exists(indexPath) ? indexPath : '';
                if (indexPath) {
                    util.readFile(path.resolve(this.directory, indexPath)).then(data => {
                        resp.end(data)
                    })
                } else {
                    util.readdir(reqPath).then(dir => {
                        util.jq(path.resolve(__dirname, './list.html')).then($ => {
                            $('.dirname').html(req.url.substring(1));
                            const $list = $('.file-list').html((() => {
                                let html = '';
                                dir.forEach(item => {
                                    let href = path.resolve(reqPath, `./${item}`).replace(/\\/g, '/');
                                    const lastStr = util.isFile(href) ? '' : '/';
                                    item += lastStr;
                                    href = href.replace(/(\\|\/)+/, '/');
                                    href = href.replace(this.directory, '/') + lastStr;
                                    html += `<li><a href="${href}">${item}</a></li>`
                                });
                                return html;
                            })());
                            req.url !== '/' && $list.prepend('<li><a href="..">..(上一级)</a></li>');
                            resp.end($.html());
                        }, err);
                    })
                }
            } else {
                util.readFile(reqPath).then(data => {
                    resp.end(data)
                }).catch(e => {
                    errHandle(e, resp)
                })
            }
        });

        server.on('error', () => {
            this.port++;
            this.listen();
        });

        server.on('listening', () => {
            console.log(`服务器已启动，端口为${this.port}\n`);
            util.ipv4.forEach(item => {
                console.log(`http://${item.address}:${this.port}`);
            });
            let firstAddr = util.ipv4[0];
            firstAddr = firstAddr ? `http://${util.ipv4[0].address}:${this.port}` : '';
            this.emit('started', firstAddr);
        });
    }

    listen () {
        server.listen(this.port);
    }

    stop () {
        console.log('服务器已停止');
        process.exit();
    }

}

function err () {
}

function code_404 (resp) {
    resp.statusCode = 404;
    util.readFile(path.resolve(__dirname, './404.html')).then(data => {
        resp.end(data);
    })
}

function errHandle (e, resp) {
    if (e.errno === -4058) {
        code_404(resp);
    } else {
        resp.end();
    }
}

module.exports = DyServer;
