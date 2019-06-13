#!/usr/bin/env node

const process = require('process')
const http = require('http')
const path = require('path')
const util = require('../lib/util')
let port = 8080

const targetPath = process.cwd().replace(/\\/g, '/')
const args = process.argv

if (args.length > 1) {
    const pIndex = args.indexOf('-p')
    if (pIndex !== -1) {
        if (pIndex + 1 <= args.length && !isNaN(parseInt(args[pIndex + 1]))) {
            port = parseInt(args[pIndex + 1])
        } else {
            throw new Error('port is not a number.')
        }
    }
}

const server = http.createServer((req, resp) => {
    const reqPath = targetPath + req.url
    if (/\/$/.test(req.url)) {
        util.readdir(reqPath).then(dir => {
            if (dir.indexOf('index.htm') !== -1) {
                util.readFile(path.resolve(targetPath, './index.htm')).then(data => {
                    resp.end(data)
                })
            }
            if (dir.indexOf('index.html') !== -1) {
                util.readFile(path.resolve(targetPath, './index.html')).then(data => {
                    resp.end(data)
                })
            }
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
        }).catch(e => {
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
