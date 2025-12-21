// Secrets are loaded from a .env file in the root directory
require("dotenv").config({ quiet: true });
const { REST, Routes } = require("discord.js");
const token = process.env["DISCORD_CLIENT_TOKEN"];
const clientId = process.env["DISCORD_CLIENT_ID"];
const serverId = process.env["DISCORD_GUILD_ID"];

// Required for logging
const chalk = require("chalk");
const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Utility to wait between logs
const wait = require("util").promisify(setTimeout);

const warningMsg = [
  "----------------------------------- !!! WARNING !!! -----------------------------------",
  "This script will delete every guild slash & context menu command of your discord bot.",
  "Do you want to continue? (y/n): ",
].join("\n");

console.clear();

rl.question(chalk.yellow(warningMsg), async function (name) {
  try {
    if (name.toLowerCase() === "y") {
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
  const guild = await rest.get(Routes.guild(serverId));
  const commands = await rest.get(Routes.applicationGuildCommands(clientId, serverId));

  if (commands.length === 0) {
    console.log(`\n❗ Couldn't find any guild command in ${chalk.yellow(guild.name)}.`);
    process.exit(0);
  }

  console.log(
    `\n✅ Found ${chalk.cyan(commands.length)} guild commands in ${chalk.yellow(guild.name)}.\n`
  );

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

  await rest.put(Routes.applicationGuildCommands(clientId, serverId), { body: [] });
  console.log(`\n✅ Deleted all commands in ${chalk.yellow(guild.name)}.`);

  process.exit(0);
}
