const fs = require('fs')
const cheerio = require('cheerio')

module.exports = {
    readFile (path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (e, data) => {
                if (e) {
                    reject(e)
                } else {
                    resolve(data)
                }
            })
        })
    },
    readdir (path) {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (e, data) => {
                if (e) {
                    reject(e)
                } else {
                    resolve(data)
                }
            })
        })
    },
    jq (path) {
        return this.readFile(path).then(data => {
            return cheerio.load(data.toString())
        }).catch(e => {
            return e
        })
    },
    isFile (path) {
        return fs.statSync(path).isFile()
    },
    isDir (path) {
        return !this.isFile(path)
    }
}
