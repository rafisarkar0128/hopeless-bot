/** @type {import("@structures/event.d.ts").EventStructure} */
module.exports = {
  name: "error",
  once: false,
  node: true,
  execute: (node, error, payload) => {
    console.error(`The Lavalink Node #${node.id} errored: `, error);
    console.error(`Error-Payload: `, payload);
  },
};
