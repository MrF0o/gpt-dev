'use strict'

import FileSystem from "./FileSystem.js"
import Generator from "./Generator.js"
import Logger from "./Logger.js"
import AI from "./ai.js"
import dotenv from 'dotenv'

export default async function main(argv) {
    dotenv.config()
    console.clear()
    Logger.log({ debug: false, msg: "starting GPT-dev... Happy coding!" })

    const fs = new FileSystem()
    const ai = new AI()
    const gen = new Generator(ai, fs.open('./prompt'))

    // write the generated files
    const resultFiles = await gen.generate()

    if (resultFiles) {
        console.log(resultFiles.map(f => f.path))
        Logger.log({debug: true, msg: "generation complete"})
        resultFiles.forEach((f) => {
            fs.writeFileContent(f.path, f.content)
        })
    } else {
        Logger.log({debug: true, msg: "Error: no files were generated"})
    }
    // setTimeout(() => {}, 5000)
}