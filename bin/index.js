#!/usr/bin/env node

import boxen from 'boxen'
import chalk from 'chalk'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import main from '../src/main.js'

var usage = chalk.green("\nUsage: gptdev <command>");

yargs(hideBin(process.argv))
  .usage(usage)
  .command('generate [prompt_file]', 'Generate a project based on a prompt', (yargs) => {
    return yargs
      .positional('prompt_file', {
        describe: 'a text file containing a prompt',
        demandOption: true,
        default: "prompt"
      })
  }, (argv) => {
    main(argv)
  })
  .showHelpOnFail(true)
  .option('dir', {
    type: 'string',
    description: 'Output folder',
    demandOption: true
  })
  .option('key', {
    alias: 'k',
    type: 'string',
    description: 'OpenAI API key',
    // demandOption: true
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .demandCommand()
  .argv