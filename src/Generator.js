'use strict'
import prompts from './defaults/prompts.json' assert {type: 'json'}

export default class Generator {
    #ai
    #prompt

    constructor(ai, prompt) {
        this.#ai = ai
        this.#prompt = prompt
    }

    async generate() {
        // initialize a conversation
        const systemPrompt = prompts.find(p => p.name == 'generate')
        const messages = [
            { role: 'system', content: systemPrompt.content },
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
                const payloads = chunk.toString().split("\n\n")

                for (const payload of payloads) {
                    if (payload.includes('[DONE]')) return

                    if (payload.startsWith('data:')) {
                        const json = JSON.parse(payload.replace('data: ', ''))
                        response += json.choices[0].delta.content
                    }
                }
            })

            stream.on('end', () => {
                // parse the response
                const files = this.parseResponse(response)
                // construct a README.md file
                files.push({
                    path: 'README.md',
                    content: response.split('```')[0]
                })

                resolve(files)
            })
        })
    }


    // TODO
    next() {
        this.#ai.followUp();
    }

    // returns an array of file to be created
    /*
        [
            {
                path: string,
                content: string,
            }
        ]
    */
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

}