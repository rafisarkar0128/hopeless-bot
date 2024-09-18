const { glob } = require("glob");
const path = require("path");
const { Colors, ColorArray } = require("../colors.json");
const { Permissions } = require("./validations/permissions.js");
const { EmbedBuilder, WebhookClient } = require("discord.js");

class Utils {
    /**
     *@param {import("../lib/DiscordBot.js").DiscordBot} client
     */
    constructor(client) {
        this.client = client;
    }

    /** Takes a dirname within src directory and returns files with extentions given in ext array
     * @param {string} dirname Name of a file directory
     * @param {Array} [ext=[".js"]]
     * @returns {Promise<Array>}
     */
    async loadFiles(dirname, ext = [".js"]) {
        const deleteCashedFile = (file) => {
            const filePath = path.resolve(file);
            if (require.cache[filePath]) {
                delete require.cache[filePath];
            }
        };

        const files = await glob(
            path.join(__dirname, "..", dirname, `**/*`).replace(/\\/g, "/"),
        );
        const Files = files.filter((file) => path.extname(file) === ".js");
        await Promise.all(Files.map(deleteCashedFile));
        return Files;
    }

    /** @typedef {"error"|"event"|"command"|"internal"|"external"|"player"} Type */
    /**
     * @typedef {Object} Data
     * @property {string} [origin]
     * @property {Type} type
     */
    /**
     * @param {Error} error
     * @param {Data} data
     */
    async sendError(
        error,
        data = { origin: "src/lib/DiscordBot.js", type: "error" },
    ) {
        if (!error) return;
        if (!this.client.database) {
        }
        try {
            const errStack = error?.stack ? error.stack : error;
            const webhookClient = process.env.ERROR_WEBHOOK_URL
                ? new WebhookClient({ url: process.env.ERROR_WEBHOOK_URL })
                : undefined;

            const embed = new EmbedBuilder()
                .setColor(Colors.Wrong)
                .setTitle(`**An Error Occoured**`)
                .setDescription(
                    `\`\`\`\n${
                        errStack.length > 4000
                            ? errStack.substring(length, 4000) + "..."
                            : errStack
                    }\n\`\`\``,
                )
                .setFooter({
                    text: `Memory: ${(
                        process.memoryUsage().heapUsed /
                        1024 /
                        1024
                    ).toFixed(2)} MB CPU: ${(
                        process.cpuUsage().system /
                        1024 /
                        1024
                    ).toFixed(2)}%`,
                })
                .setTimestamp();

            return webhookClient.send({
                username: this.client.user?.tag || undefined,
                avatarURL: this.client.user?.avatarURL() || undefined,
                embeds: [embed],
            });
        } catch (error) {
            this.client.logger.error(error);
        }
    }

    /**
     * Checks if a string contains a URL
     * @param {string} text
     */
    containsLink(text) {
        return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
            text,
        );
    }

    /**
     * Checks if a string is a valid discord invite
     * @param {string} text
     */
    containsDiscordInvite(text) {
        return /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?p?p?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/.test(
            text,
        );
    }

    /**
     * Returns a random number below a max
     * @param {number} max
     */
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    /**
     * Checks if a string is a valid Hex color
     * @param {string} text
     */
    isHex(text) {
        return /^#[0-9A-F]{6}$/i.test(text);
    }

    /**
     * Checks if a string is a valid Hex color
     * @param {string} text
     */
    isValidColor(text) {
        if (Colors.indexOf(text) > -1) {
            return true;
        } else return false;
    }

    /**
     * Returns hour difference between two dates
     * @param {Date} dt2
     * @param {Date} dt1
     */
    diffHours(dt2, dt1) {
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60 * 60;
        return Math.abs(Math.round(diff));
    }

    /**
     * Returns remaining time in days, hours, minutes and seconds
     * @param {number} timeInSeconds
     */
    timeformat(timeInSeconds) {
        const days = Math.floor((timeInSeconds % 31536000) / 86400);
        const hours = Math.floor((timeInSeconds % 86400) / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.round(timeInSeconds % 60);
        return (
            (days > 0 ? `${days} days, ` : "") +
            (hours > 0 ? `${hours} hours, ` : "") +
            (minutes > 0 ? `${minutes} minutes, ` : "") +
            (seconds > 0 ? `${seconds} seconds` : "")
        );
    }

    /**
     * Converts duration to milliseconds
     * @param {string} duration
     */
    durationToMillis(duration) {
        return (
            duration
                .split(":")
                .map(Number)
                .reduce((acc, curr) => curr + acc * 60) * 1000
        );
    }

    /**
     * Returns time remaining until provided date
     * @param {Date} timeUntil
     * @returns {Number}
     */
    getRemainingTime(timeUntil) {
        const seconds = Math.abs((timeUntil - new Date()) / 1000);
        const time = Utils.timeformat(seconds);
        return time;
    }

    /** Takes a single or array of permissions and returns a formated string
     * @param {import("discord.js").PermissionResolvable[]} permissions Permission or Array of Permissions
     * @returns {String} A formated permission string
     */
    parsePermissions(permissions) {
        const permissionWord = `permission${perms.length > 1 ? "s" : ""}`;
        return (
            permissions.map((p) => `\`${Permissions[p]}\``).join(", ") +
            permissionWord
        );
    }

    /** Return a random color from colors.json
     * @returns {String} A hexcolor code
     */
    randomColor() {
        return ColorArray[Math.floor(Math.random() * ColorArray.length)];
    }
}

module.exports = { Utils };
