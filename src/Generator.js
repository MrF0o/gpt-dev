'use strict'

import { createRequire } from 'module'
import Logger from './Logger.js'
import { appendFileSync } from 'fs'

const require = createRequire(import.meta.url)
const prompts = require('./defaults/prompts.json')

export default class Generator {
    #ai
    #prompt

    constructor(ai, prompt) {
        this.#ai = ai
        this.#prompt = prompt
    }

    getSystemPrompt() {
        const genPrompt = prompts.find(p => p.name == 'basic_generate')
        const guidePrompt = prompts.find(p => p.name == 'guides')

        return { role: 'system', content: genPrompt.content + "\nGuidelines:\n" + guidePrompt.content }
    }

    // generate code and return an array of files
    async generate(prompt = false) {
        // initialize a conversation
        
        let messages = []

        if (prompt)
            messages = [
                { role: 'user', content: this.#prompt }
            ]

        // ask the model
        const res = await this.#ai.start(messages)
        const stream = res.data

        if (!stream) {
            return null
        }

        let response = ''
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => {
                try {
                    response += this.parseStreamPayload(chunk)
                } catch (err) {
                    Logger.log({ debug: true, msg: `Failed to parse payload, skipping chunk:\n${chunk}` })
                }
            })

            stream.on('end', () => {
                // parse the response
                const files = this.parseResponse(response)
                resolve(files)
            })
        })
    }

    // TODO
    start() {

    }

    // code generation using questions
    async ask(prompt = null) {
        let messages = []
        
        if (prompt) {
            const systemPrompt = prompts.find(p => p.name == 'questions')
            messages = [
                { role: 'system', content: systemPrompt.content },
                { role: 'user', content: this.#prompt }
            ]

        }

        const res = await this.#ai.start(messages)
        let stream
        if (res)
            stream = res.data
        else return null
        
        let question = ''

        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => {
                try {
                    question += this.parseStreamPayload(chunk)
                } catch (err) {
                    Logger.log({ debug: true, msg: `Failed to parse payload, skipping a chunk` })
                }
            })

            stream.on('end', () => {
                this.#ai.newAssistantMessage(question)
                resolve(question)
            })
        })
    }

    // respond to the current question and retrieve a new one
    async next(answer) {
        this.#ai.newUserMessage(answer)

        return await this.ask()
    }

    // returns an array of file to be created
    parseResponse(response) {
        const reg = /(\S+)\s*```[^\s]*\s([\s\S]+?)```/g
        let match
        const matches = []

        while ((match = reg.exec(response))) {
            const path = match[1].trim()
            const content = match[2].trim()

            matches.push({ path, content })
        }

        return matches
    }

    parseStreamPayload(chunk) {
        const payloads = chunk.toString().split("\n\n")
        let payloadContent = ''
        for (let i = 0; i < payloads.length; i++) {
            if (payloads[i].trim() === 'data: [DONE]') return ''

            if (payloads[i].trim().startsWith('data:')) {
                try {
                    const json = JSON.parse(payloads[i].replace('data: ', ''))
                    const content = json.choices[0].delta?.content
                    if (json.choices[0].finish_reason !== 'stop') {
                        payloadContent += content
                    }
                } catch (err) {
                    throw err
                }
            }
        }

        return payloadContent
    }

    async generateQuestioned() {
        const convo = this.#ai.getConversation()
        this.#prompt = prompts.find(p => p.name == 'after_questions').content
        convo.shift()
        convo.unshift(this.getSystemPrompt())
        const result = await this.generate(true)


        return result
    }

    dumpConversation() {
        appendFileSync('./convo', JSON.stringify(this.#ai.getConversation()))
    }

}