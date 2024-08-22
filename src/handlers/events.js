async function loadEvents(client, dir) {
    try {
        const ascii = require("ascii-table");
        const table = new ascii("COMMANDS")
            .setBorder("│", "─", " ", " ")
            .setHeading("files", "status");

        const { loadJSFiles } = require("../utils/file.util.js");
        const files = await loadJSFiles(dir);

        await client.events.clear();

        for (const file of files) {
            const eventObject = require(file);
            const execute = (...args) => eventObject.execute(client, ...args);
            const target = eventObject.rest ? client.rest : client;

            client.events.set(eventObject.name, execute);
            target[eventObject.once ? "once" : "on"](eventObject.name, execute);

            table.addRow(file.replace(/\\/g, "/").split("/").pop(), "✅");
        }

        console.log(table.toString());
        return client.log("✅ loaded events.", "event");
    } catch (error) {
        throw error;
    }
}

module.exports = { loadEvents };
