const { Schema, model } = require("mongoose");

const schema = new Schema(
    {
        _id: Number,
        enabled: Boolean,
        guild_id: String,
        channel_id: String,
        categories: {
            interactions: Boolean,
            messages: Boolean,
            events: Boolean,
            internal: Boolean,
            external: Boolean,
            player: Boolean,
        },
    },
    {
        autoIndex: false,
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

const Model = model("errorlog-config", schema);

/**
 * @typedef {Object} Data
 * @property {boolean} enabled
 * @property {number} guild_id
 * @property {number} channel_id
 * @property {Categories} categories
 */
/**
 * @typedef {Object} Categories
 * @property {boolean} interactions
 * @property {boolean} messages
 * @property {boolean} events
 * @property {boolean} internal
 * @property {boolean} external
 * @property {boolean} player
 */

module.exports = {
    model: Model,
    /**
     * @type {Data}
     * @param {Data} data
     */
    createErrorlogConfig: async (data) => {
        if (!data) throw new Error("no data has been provided");
        await new Model({
            _id: client.user.id,
            enabled: data.enabled,
            guild_id: data.guild_id,
            channel_id: data.channel_id,
            categories: {
                interactions: data.categories.interactions,
                messages: data.categories.messages,
                events: data.categories.events,
                internal: data.categories.internal,
                external: data.external,
                player: data.categories.player,
            },
        }).save();
    },
};
