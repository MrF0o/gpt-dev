'use strict'

import chalk from "chalk"
import { Configuration, OpenAIApi } from "openai"

export default class AI {
    #model
    #temperature
    #openaiAPI
    #conversation = []

    constructor(model = 'gpt-4', temp = 0.1) {
        const config = new Configuration({
            apiKey: process.env.OPENAI_API_KEY || "sk-hEllo1nt3rn3t"
        })

        this.#openaiAPI = new OpenAIApi(config)
        this.#model = model
        this.#temperature = temp
    }


    // send the conversation
    async #query() {
        try {
            const chat = await this.#openaiAPI.createChatCompletion({
                model: this.#model,
                temperature: this.#temperature,
                stream: true,
                messages: this.#conversation,
            }, { responseType: 'stream' })
            return chat
        } catch (err) {
            console.error(err)
            return null
        }

    }

    // start a new conversation
    start(messages) {
        this.#conversation.push(...messages)

        return this.#query()
    }

    // TODO: follow up an already open conversation
    followUp(prompt) {
        const chat = this.#query()
        if (!this.#conversation) {
            // set the system messages
        }
    }

    newSystemMessage(content) {
        this.#conversation.push({
            role: 'system',
            content
        })

        return this.#conversation
    }

    newUserMessage(content) {
        this.#conversation.push({
            role: 'user',
            content
        })

        return this.#conversation
    }

    newAssistantMessage(content) {
        this.#conversation.push({
            role: 'assistant',
            content
        })

        return this.#conversation
    }

    getConversation() {
        return this.#conversation
    }

    static async getModel() {
        let model = 'gpt-4'

        try {
            await this.#openaiAPI.retrieveModel(model)
        } catch (err) {
            model = 'gpt-3.5-turbo';
            console.log(chalk.yellow(`The gpt-4 model isn't available for the provided API key, using ${model} instead`))
        }

        return model
    }
}