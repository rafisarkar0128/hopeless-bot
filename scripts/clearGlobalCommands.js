require("dotenv").config();
const colors = require("colors");
const token = process.env["BOT_TOKEN"];
const clientId = process.env["BOT_ID"];
const wait = require("timers/promises").setTimeout;
const readline = require("readline");
const axios = require("axios");
const apiUrl = "https://discord.com/api/v10";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const warningMsg =
  colors.yellow(`----------------------------------- !!! WARNING !!! -----------------------------------
This script will delete every global slash & context menu command of your discord bot.
Do you want to continue? (y/n): `);

console.clear();
rl.question(warningMsg, async function (name) {
  try {
    if (name.toLowerCase() === "y") {
      await deleteCommands();
      process.exit(0);
    } else {
      console.log(colors.red("Canceled the deletion."));
      process.exit(0);
    }
  } catch (error) {
    console.log(colors.red(error?.stack ? error?.stack : error));
    process.exit(1);
  }
});

function clearAndWrite(message) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(message);
}

function clearAndLog(message) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(message);
}

async function deleteCommands() {
  process.stdout.write(
    colors.cyan("\n🔎 Fetching global commands form discord."),
  );

  await wait(2500);
  const commands = await axios.get(
    `${apiUrl}/applications/${clientId}/commands`,
    {
      headers: {
        Authorization: `Bot ${token}`,
      },
    },
  );

  if (commands.data.length === 0) {
    clearAndLog(colors.red("❗ Couldn't fing any global command."));
  } else {
    clearAndWrite(
      colors.cyan(`✅ Found ${commands.data?.length} global commands.`),
    );
    await wait(2500);
    clearAndLog(colors.yellow("🧹 Started to delete global commands.\n"));

    let i = 0;
    for (const command of commands.data) {
      process.stdout.write(colors.blue(`🧨 Deleting ${command.name}.`));
      await wait(4000);
      const response = await axios.delete(
        `${apiUrl}/applications/${clientId}/commands/${command.id}`,
        {
          headers: {
            Authorization: `Bot ${token}`,
          },
        },
      );

      if (response.status === 204) {
        clearAndLog(colors.red(`🔥 Deleted ${command.name}.`));
      } else {
        clearAndLog(colors.red(`❌ Couldn't delete ${command.name}.`));
      }
    }

    console.log(colors.green(`\n✅ Deleted ${i} global commands.`));
  }
}
