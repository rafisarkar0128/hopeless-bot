// event handler function
async function loadEvents(client, dir) {
    // variables
    const ascii = require("ascii-table");
    const table = new ascii("EVENTS")
        .setBorder("│", "─", " ", " ")
        .setHeading("FILES", "STATUS");
    const files = await client.loadFiles(dir);

    await client.events.clear();

    for (const file of files) {
        try {
            const eventObject = require(file);
            const execute = (...args) => eventObject.execute(client, ...args);
            const target = eventObject.rest ? client.rest : client;

            client.events.set(eventObject.name, execute);
            target[eventObject.once ? "once" : "on"](eventObject.name, execute);

            table.addRow(file.split("\\").pop(), "✅");
        } catch (error) {
            table.addRow(file.split("\\").pop(), `❌ | ${file}`);
            throw error;
        }
    }

    console.log(table.toString());
    return client.log("loaded events", "log");
}

// exporting the function
module.exports = { loadEvents };
