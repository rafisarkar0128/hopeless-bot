async function loadEvents(client) {
    try {
        const { loadJSFiles } = require("../utils/file.utils.js");
        const files = await loadJSFiles("events");

        await client.events.clear();

        let i = 0;
        for (const file of files) {
            const eventObject = require(file);
            const execute = (...args) => eventObject.execute(client, ...args);
            const target = eventObject.rest ? client.rest : client;

            client.events.set(eventObject.name, execute);
            target[eventObject.once ? "once" : "on"](eventObject.name, execute);

            i++;
        }

        client.log(`loaded ${i} events.`, "event");
    } catch (error) {
        throw error;
    }
}

module.exports = { loadEvents };
