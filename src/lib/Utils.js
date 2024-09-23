const { glob } = require("glob");
const path = require("path");
const { Colors, ColorArray } = require("../colors.json");
const { Permissions } = require("../helpers/validations/permissions.js");
const { EmbedBuilder, WebhookClient } = require("discord.js");

class Utils {
    /**
     * @param {import("@lib/DiscordBot").DiscordBot} client
     */
    constructor(client) {
        this.client = client;
    }

    /** Returns an array of files from given direcotry filtered by provided extension
     * @type {import("@src/index").LoadFiles}
     * @example const file = await client.utils.loadFiles("src", ".js");
     */
    async loadFiles(dirname, ext) {
        const deleteCashedFile = (file) => {
            const filePath = path.resolve(file);
            if (require.cache[filePath]) {
                delete require.cache[filePath];
            }
        };

        const files = await glob(
            path.join(`${process.cwd()}`, "src", dirname, `**/*`).replace(/\\/g, "/"),
        );
        const Files = files.filter((file) => path.extname(file) === ext);
        await Promise.all(Files.map(deleteCashedFile));
        return Files;
    }

    /** A function to send error to a discord channel
     * @type {import("@src/index.d.ts").SendError}
     * @example client.utils.sendError(error, type, data);
     */
    async sendError(error, type, data) {
        if (!error) return;
        if (!this.client.database) {
        }
        const errStack = error?.stack ? error.stack : error;
        const webhookClient = process.env.ERROR_WEBHOOK_URL
            ? new WebhookClient({
                  url: process.env.ERROR_WEBHOOK_URL,
              })
            : undefined;

        const embed = new EmbedBuilder()
            .setColor(Colors.Wrong)
            .setTitle(`**An Error Occoured**`)
            .setDescription(
                `\`\`\`\n${errStack.length > 4000 ? errStack.substring(length, 4000) + "..." : errStack}\n\`\`\``,
            )
            .setFooter({
                text: `Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB CPU: ${(
                    process.cpuUsage().system /
                    1024 /
                    1024
                ).toFixed(2)}%`,
            })
            .setTimestamp();

        try {
            return webhookClient.send({
                username: this.client.user?.tag || undefined,
                avatarURL: this.client.user?.avatarURL() || undefined,
                embeds: [embed],
            });
        } catch (error) {
            throw error;
        }
    }

    /** Checks if a string contains a URL
     * @type {import("@src/index.d.ts").ContainsLink}
     * @example client.utils.containsLink(text);
     */
    containsLink(text) {
        return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
            text,
        );
    }

    /** Checks if a string is a valid discord invite
     * @type {import("src/index.d.ts").ContainsDiscordInvite}
     * @example client.utils.containsDiscordInvite(text);
     */
    containsDiscordInvite(text) {
        return /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?p?p?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/.test(
            text,
        );
    }

    /** Returns a random number below a max
     * @type {import("@src/index").GetRandomInt}
     * @example client.utils.getRandomInt(max);
     */
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    /** Return a random color from colors.json
     * @type {import("@src/index").GetRandomColor}
     * @example client.utils.getRandomColor();
     */
    getRandomColor() {
        return ColorArray[Math.floor(Math.random() * ColorArray.length)];
    }

    /** Checks if a string is a valid Hex color
     * @type {import("@src/index").IsHex}
     * @example client.utils.isHex(text)
     */
    isHex(text) {
        return /^#[0-9A-F]{6}$/i.test(text);
    }

    /** Checks if a string is a valid Hex color
     * @type {import("@src/index").IsValidColor}
     * @example client.utils.isValidColor(text);
     */
    isValidColor(text) {
        if (Colors.indexOf(text) > -1) {
            return true;
        } else return false;
    }

    /** Returns hour difference between two dates
     * @type {import("@src/index").DiffHours}
     * @example client.utils.dissHours(Date2, Date1);
     */
    diffHours(dt2, dt1) {
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60 * 60;
        return Math.abs(Math.round(diff));
    }

    /** Returns remaining time in days, hours, minutes and seconds
     * @type {import("@src/index").Timeformat}
     * @example client.utils.timeFormat(timeInMillis);
     */
    timeFormat(timeInMillis) {
        const days = Math.floor(timeInMillis / 86400000);
        const hours = Math.floor(timeInMillis / 3600000) % 24;
        const minutes = Math.floor(timeInMillis / 60000) % 60;
        const seconds = Math.floor(timeInMillis / 1000) % 60;
        return (
            (days > 0 ? `${days} days, ` : "") +
            (hours > 0 ? `${hours} hours, ` : "") +
            (minutes > 0 ? `${minutes} minutes, ` : "") +
            (seconds > 0 ? `${seconds} seconds` : "")
        );
    }

    /** Converts duration to milliseconds
     * @type {import("@src/index").DurationToMillis}
     * @example client.utils.durationToMillis(duration);
     */
    durationToMillis(duration) {
        return (
            duration
                .split(":")
                .map(Number)
                .reduce((acc, curr) => curr + acc * 60) * 1000
        );
    }

    /** Returns time remaining until provided date
     * @type {import("@src/index").GetRemainingTime}
     * @example client.utils.getRemainingTime(timeUntil);
     */
    getRemainingTime(timeUntil) {
        const seconds = Math.abs((timeUntil - new Date()) / 1000);
        const time = Utils.timeformat(seconds);
        return time;
    }

    /** Takes a single or array of permissions and returns a formated string
     * @type {import("@src/index").ParsePermissions}
     * @example client.utils.parsePermissions(permissions)
     */
    parsePermissions(permissions) {
        const permissionWord = `permission${perms.length > 1 ? "s" : ""}`;
        return (
            permissions.map((p) => `\`${Permissions[p]}\``).join(", ") + permissionWord
        );
    }
}

module.exports = { Utils };
