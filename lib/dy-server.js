const http = require('http');
const path = require('path');
const util = require('./util');

function DyServer(conf) {
  this.port = conf.port;
  this.directory = conf.directory;
  const server = http.createServer((req, resp) => {
    req.url = decodeURIComponent(req.url)
    const reqPath = this.directory + req.url;
    if (/\/$/.test(req.url)) {
      util.readFile(path.resolve(this.directory, reqPath + 'index.htm')).then(data => {
        resp.end(data)
      }, err).then(() => {
        return util.readFile(path.resolve(this.directory, reqPath + 'index.html'))
      }).then(data => {
        console.log(11111, data)
        resp.end(data)
      }, e => {
        console.log(e)
      }).then(() => {
        return util.readdir(reqPath)
      }).then(dir => {
        util.jq(path.resolve(__dirname, './list.html')).then($ => {
          $('.dirname').html(req.url.substring(1));
          $('.file-list').html((() => {
            let html = '';
            dir.forEach(item => {
              let href = path.resolve(reqPath, `./${item}`).replace(/\\/g, '/');
              const lastStr = util.isFile(href) ? '' : '/';
              item += lastStr;
              href = href.replace(/(\/\/)||(\\\\)/, '/').replace(this.directory, '') + lastStr;
              html += `<li><a href="${href}">${item}</a></li>`
            });
            return html
          })());
          resp.end($.html())
        }, err)
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
  });

  server.listen(this.port, () => {
    console.log('服务器已启动，端口为' + this.port)
  })
}

function err() {
}

function code_404(resp) {
  resp.statusCode = 404
  util.readFile(path.resolve(__dirname, './404.html')).then(data => {
    resp.end(data)
  })
}

function errHandle(e, resp) {
  if (e.errno === -4058) {
    code_404(resp)
  } else {
    resp.end()
  }
}

module.exports = DyServer;
