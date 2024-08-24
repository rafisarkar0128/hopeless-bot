async function loadEvents(client, dir) {
    try {
        const ascii = require("ascii-table");
        const table = new ascii("COMMANDS")
            .setBorder("│", "─", " ", " ")
            .setHeading("files", "status");

        const { loadJSFiles } = require("../utils/file.utils.js");
        const files = await loadJSFiles(dir);

        await client.events.clear();

        let i = 0;
        for (const file of files) {
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

                table.addRow(file.replace(/\\/g, "/").split("/").pop(), "✅");
                i++;
            } catch (error) {
                table.addRow(file.replace(/\\/g, "/").split("/").pop(), "❌");
            }
        }

        client.log(`✅ loaded ${i} events.`, "event");

        setTimeout(() => {
            console.log(table.toString());
        }, 1e4);
    } catch (error) {
        throw error;
    }
}

module.exports = { loadEvents };
