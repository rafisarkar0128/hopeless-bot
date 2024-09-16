const { EmbedBuilder, WebhookClient } = require('discord.js')
const { Wrong } = require(`../colors.json`)
const colors = require('colors')
const { DateTime } = require('luxon')
const dt = colors.gray(DateTime.now().toFormat('[dd/LL/yyyy - HH:mm:ss]'))

class Logger {
    constructor() {}

    /**
     * @param {String} content
     */
    log(content) {
        return console.log(`${dt} ${colors.bold.bgBlue(' INFO ')} ${content}`)
    }

    /**
     * @param {String} content
     */
    warn(content) {
        return console.log(
            `${dt} ${colors.bold.bgYellow(' WARN ')} ${colors.yellow(`${content}`)}`
        )
    }

    /**
     * @param {String} content
     */
    async error(content) {
        let error = content.stack ? content.stack : content
        await sendError(content)
        return console.log(
            `${dt} ${colors.bold.bgRed(' ERROR ')} ${colors.red(`${error}`)}`
        )
    }

    /**
     * @param {String} content
     */
    debug(content) {
        return console.log(`${dt} ${colors.bgGreen(' DEBUG ')} ${content}`)
    }
}

/**
 * @param {Client} client
 * @param {Error} error
 */
async function sendError(error) {
    if (!error) return
    try {
        const webhookLogger = process.env.ERROR_WEBHOOK_URL
            ? new WebhookClient({ url: process.env.ERROR_WEBHOOK_URL })
            : undefined

        const errorStack = error.stack ? error.stack : error
        const embed = new EmbedBuilder()
            .setColor(Wrong)
            .setTitle(`**An Error Occoured**`)
            .setDescription(
                `\`\`\`js\n${
                    errorStack.length > 4000
                        ? errorStack.substring(length, 4000) + '...'
                        : errorStack
                }\n\`\`\``
            )
            .setFooter({
                text: `Memory: ${(
                    process.memoryUsage().heapUsed /
                    1024 /
                    1024
                ).toFixed(
                    2
                )} MB CPU: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%`,
            })
            .setTimestamp()

        return webhookLogger.send({
            embeds: [embed],
        })
    } catch (err) {
        throw err
    }
}

module.exports = { Logger }
