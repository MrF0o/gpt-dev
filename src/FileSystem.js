'use strict'

import fs from 'fs'
import Logger from './Logger.js'

export default class FileSystem {

    static prjectPath = './gen/'

    constructor() {
        null
    }

    open(path) {
        const file = fs.readFileSync(path, 'utf-8')

        return file
    }

    writeFile(path) {
        const fullPath = FileSystem.prjectPath + path

        if (!fs.existsSync(fullPath)) {
            fs.open(fullPath, (err, file) => {
                if (err) {
                    fs.writeFileSync(fullPath, '');
                } else {
                    Logger.log({ debug: false, msg: `file already exists at ${fullPath}` });
                }
            })
        }
    }

    writeFileContent(path, content) {
        const fullPath = FileSystem.prjectPath + path

        Logger.log({ debug: false, msg: `writing to ${fullPath}...` });
        fs.appendFileSync(fullPath, content, (err, file) => {
            if (err) throw err
            Logger.log({ debug: false, msg: `done writing to ${fullPath}!` });
        })
    }

}