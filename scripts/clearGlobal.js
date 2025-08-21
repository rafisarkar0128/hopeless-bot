require("dotenv").config();
const { REST, Routes } = require("discord.js");
const chalk = require("chalk");
const token = process.env["DISCORD_CLIENT_TOKEN"];
const clientId = process.env["DISCORD_CLIENT_ID"];
const readline = require("readline");
const rest = new REST({ version: 10 }).setToken(token);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const warningMsg = [
  "----------------------------------- !!! WARNING !!! -----------------------------------",
  "This script will delete every global slash & context menu command of your discord bot.",
  "Do you want to continue? (y/n): ",
].join("\n");

console.clear();

rl.question(warningMsg, async function (name) {
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
  const commands = await rest.get(Routes.applicationCommands(clientId));

  if (commands?.length === 0) {
    console.log(chalk.red("\n❗ Couldn't fing any global command."));
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
  }

  await rest.put(Routes.applicationCommands(clientId), { body: [] });
  console.log(`\n✅ Deleted all global commands.`);
  process.exit(0);
}
