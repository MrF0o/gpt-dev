'use strict'

import fs from 'fs'
import Logger from './Logger.js'
import { dirname } from 'path'
import chalk from 'chalk'

export default class FileSystem {

    static projectPath = ''

    constructor() {
        null
    }

    open(path) {
        const file = fs.readFileSync(path, 'utf-8')

        return file
    }

    writeFile(path) {
        const fullPath = FileSystem.projectPath + path

        if (!fs.existsSync(fullPath)) {
            fs.open(fullPath, (err, file) => {
                if (err) {
                    fs.writeFileSync(fullPath, '')
                } else {
                    Logger.log({ debug: false, msg: `file already exists at ${fullPath}` })
                }
            })
        }
    }

    writeFileContent(path, content) {
        const fullPath = FileSystem.projectPath + path

        Logger.log({ debug: false, msg: `writing to ${fullPath}...` })

        if (!fs.existsSync(dirname(fullPath))) {
            this.createFullPath(fullPath)
        }

        fs.appendFileSync(fullPath, content, (err, file) => {
            if (err) throw err
            Logger.log({ debug: false, msg: `done writing to ${fullPath}!` })
        })
    }


    createFullPath(path) {
        const dirn = dirname(path)

        if (!fs.existsSync(dirn)) {
            fs.mkdirSync(dirn, { recursive: true })
        }
    }

    createProject(name) {
        if (this.isValidProjectName(name)) {
            if (fs.existsSync(name) && fs.readdirSync(name).length > 0) {
                console.log(chalk.red('folder already exists and it\'s not empty'))
            } else {
                fs.mkdirSync(`./${name}`)
                
                if (fs.existsSync(name)) {
                    FileSystem.projectPath = `./${name}`
                    this.writeFileContent(`/prompt`, '')

                    Logger.log({ debug: false, msg: `done creating the project.\nplease navigate to ${name} fill in the prompt file and run '${chalk.green('gptdev generate --dir="."')}'` })
                } else {
                    console.log(chalk.red(`couldn\'t create a project directory: ./${name}`))
                }

            }
        } else {
            console.log(chalk.red('please provide a valid project name'))
        }
    }

    isValidProjectName(name) {
        // to be expanded
        const pattern = /[\s!@#$%^&*()+\\=\[\]{};':"\\|,.<>\/?]+/g

        return !pattern.test(name)
    }

}