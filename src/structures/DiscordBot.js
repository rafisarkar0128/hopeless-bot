const { Client, Collection } = require('discord.js')
const { Logger } = require('./Logger.js')
const colors = require('colors')
const { glob } = require('glob')
const path = require('path')
const pkg = require('../../package.json')

class DiscordBot extends Client {
    /**
     * @param {import("discord.js").ClientOptions} options
     */
    constructor(options) {
        super(options)

        this.logger = new Logger()
        this.config = require(`../config.js`)
        this.colors = require(`../colors.json`)

        /**
         * @type {Collection<string, import("./CommandStructure.js")>}
         */
        this.commands = new Collection()

        /**
         * @type {Collection<string, Collection}
         */
        this.cooldowns = new Collection()

        /**
         * @type {Collection<string, import('../Collected/BaseContext.js')>}
         */
        this.contextMenus = new Collection()
    }

    /**
     * @param {string} content
     */
    info(content) {
        this.logger.log(content)
    }

    /**
     * @param {string} content
     */
    warn(content) {
        this.logger.warn(content)
    }

    /**
     * @param {string} content
     */
    error(content) {
        this.logger.error(content)
    }

    /**
     * @param {string} content
     */
    debug(content) {
        this.logger.debug(content)
    }

    /**
     * @param {string} dirname - Name of a file directory
     */
    async loadFiles(dirname) {
        const deleteCashedFile = (file) => {
            const filePath = path.resolve(file)
            if (require.cache[filePath]) {
                delete require.cache[filePath]
            }
        }

        const files = await glob(
            path.join(__dirname, '..', dirname, `**/*.js`).replace(/\\/g, '/')
        )
        const jsFiles = files.filter((file) => path.extname(file) === '.js')
        await Promise.all(jsFiles.map(deleteCashedFile))
        return jsFiles
    }

    /**
     *@param {string} dirname - Name to event files directory
     */
    async loadEvents(dirname) {
        const files = await this.loadFiles(dirname)

        let i = 0
        for (const file of files) {
            try {
                const event = require(file)
                const execute = (...args) => event.execute(this, ...args)
                const target = event.rest ? this.rest : this

                target[event.once ? 'once' : 'on'](event.name, execute)

                i++
            } catch (error) {
                throw error
            }
        }

        this.info(colors.yellow(`loaded ${i} events.`))
    }

    /**
     * @param {String} content - The text to display
     * @param {import("boxen").Options} options - Options for styling
     */
    async logBox(content, options) {
        const boxen = (await import('boxen')).default
        return console.log(boxen(content, options))
    }
}

module.exports = { DiscordBot }
