async function loadEvents(client, dir) {
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
            table
                .setHeading("FILES", "STATUS", "PATH", "ERROR")
                .addRow(
                    file.split("\\").pop(),
                    "❌",
                    file.split("\\").slice(7).join("\\"),
                    `${error}`
                );
        }
    }

    console.log(table.toString());
    return client.log("✅ loaded events", "log");
}

module.exports = { loadEvents };
