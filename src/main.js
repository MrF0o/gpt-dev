'use strict'

import chalk from "chalk"
import FileSystem from "./FileSystem.js"
import Generator from "./Generator.js"
import Logger from "./Logger.js"
import AI from "./ai.js"
import dotenv from 'dotenv'
import * as readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

export default async function main(argv) {
    dotenv.config()
    console.clear()

    Logger.log({ debug: false, msg: "starting GPT-dev... Happy coding!" })
    const fs = new FileSystem()
    FileSystem.prjectPath = './' + argv.dir + '/'

    const ai = new AI(await AI.getModel())
    const gen = new Generator(ai, fs.open(argv.dir + '/prompt'))
    const input = readline.createInterface({ input: stdin, output: stdout })

    console.log(chalk.gray('GPT-dev is preparing some questions for you... (enter \'s\' to skip any question)\n'))

    let init = true
    while (true) {

        const question = await gen.ask(init)

        if (init) init = false
        if (question === 'NO QUESTIONS LEFT') break

        console.log(chalk.bold(question))

        let answer = await input.question('> ')

        if (answer === 's') {
            console.log(chalk.italic('letting GPT-dev make an assumption.'))
            answer = 'you decide'
        }

        await gen.next(answer)
    }

    Logger.log({debug: false, msg: 'thanks for answering the questions, GPT-dev is generating your project...'})

    const files = await gen.generateQuestioned()

    if (files) {
        console.log(files.map(f => f.path))
        Logger.log({ debug: true, msg: "generation complete" })
        files.forEach((f) => {
            fs.writeFileContent(f.path, f.content)
        })
    } else {
        Logger.log({ debug: true, msg: "Error: no files were generated" })
    }

    // gen.dumpConversation()
    input.close()
}