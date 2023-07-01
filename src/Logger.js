'use strict'

import chalk from "chalk"

export default class Logger {

    static log({ debug, msg }) {
        const date = new Date().toLocaleString()
        let rep = chalk.gray(`[${date}]  `);
        rep += debug ? msg + chalk.bold.yellow(' ⚠') : chalk.bold(msg);

        console.log(rep);
    }
}