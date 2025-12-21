// Secrets are loaded from a .env file in the root directory
require("dotenv").config({ quiet: true });
const { REST, Routes } = require("discord.js");
const token = process.env["DISCORD_CLIENT_TOKEN"];
const clientId = process.env["DISCORD_CLIENT_ID"];

// Required for logging
const chalk = require("chalk");
const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Utility to wait between logs
const wait = require("util").promisify(setTimeout);

const warningMsg = [
  "----------------------------------- !!! WARNING !!! -----------------------------------",
  "This script will delete every global slash & context menu command of your discord bot.",
  "Do you want to continue? (y/n): ",
].join("\n");

rl.question(chalk.yellow(warningMsg), async function (answer) {
  try {
    if (answer.toLowerCase() === "y") {
      await deleteCommands();
      process.exit(0);
    } else {
      console.log(chalk.red("Canceled the deletion."));
      process.exit(0);
    }
  } catch (error) {
    console.log(chalk.red(error?.stack ? error?.stack : error));
    process.exit(1);
  }
});

async function deleteCommands() {
  const rest = new REST({ version: 10 }).setToken(token);
  const commands = await rest.get(Routes.applicationCommands(clientId));

  if (commands.length === 0) {
    console.log(chalk.red("\n❗ Couldn't find any global command."));
    process.exit(0);
  }

  console.log(`\n✅ Found ${chalk.cyan(commands.length)} global commands.\n`);

  let i = 0;
  for (const command of commands) {
    i++;
    console.log(
      `${
        i >= 100 ? ""
        : i >= 10 ? " "
        : "  "
      }${chalk.magenta(i)} | 🔥 ${chalk.red("deleted")} - ${command.id} - ${chalk.cyan(command.name)}`
    );
    await wait(500); // To make it look its deleting in real-time
  }

  await rest.put(Routes.applicationCommands(clientId), { body: [] });
  console.log(`\n✅ Deleted all global commands.`);

  process.exit(0);
}
