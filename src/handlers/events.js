async function loadEvents(client) {
    try {
        const loadFiles = require("../functions/loadFiles.js");

        await client.events.clear();

        (await loadFiles("events")).forEach((file) => {
            try {
                const eventObject = require(file);
                const execute = (...args) =>
                    eventObject.execute(client, ...args);
                const target = eventObject.rest ? client.rest : client;

                client.events.set(eventObject.name, execute);
                target[eventObject.once ? "once" : "on"](
                    eventObject.name,
                    execute
                );
            } catch (error) {
                throw error;
            }
        });

        client.log("✅ loaded events.", "event");
    } catch (error) {
        throw error;
    }
}

module.exports = { loadEvents };
