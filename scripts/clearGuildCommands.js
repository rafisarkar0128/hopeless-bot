require("dotenv").config();
const colors = require("colors");
const token = process.env["BOT_TOKEN"];
const clientId = process.env["BOT_ID"];
const serverId = process.env["SERVER_ID"];
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
This script will delete every guild slash & context menu command of your discord bot.
Do you want to continue? (y/n): `);

console.clear();
rl.question(warningMsg, async (name) => {
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
  const Guild = await axios.get(`${apiUrl}/guilds/${serverId}`, {
    headers: {
      Authorization: `Bot ${token}`,
    },
  });
  const guild = Guild?.data;

  process.stdout.write(
    colors.cyan(`\n🔎 Fetching guild commands from ${guild.name}.`)
  );

  await wait(2500);
  const commands = await axios.get(
    `${apiUrl}/applications/${clientId}/guilds/${guild.id}/commands`,
    {
      headers: {
        Authorization: `Bot ${token}`,
      },
    }
  );

  if (commands.data.length === 0) {
    clearAndLog(
      colors.red(`❗ Couldn't fing any guild command in ${guild.name}.`)
    );
  } else {
    clearAndWrite(
      colors.cyan(
        `✅ Found ${commands.data?.length} guild commands in ${guild.name}.`
      )
    );
    await wait(2500);
    clearAndLog(colors.yellow("🧹 Started to delete guild commands.\n"));

    let i = 0;
    for (const command of commands.data) {
      process.stdout.write(colors.blue(`🧨 Deleting ${command.name}.`));
      await wait(4000);
      const response = await axios.delete(
        `${apiUrl}/applications/${clientId}/guilds/${guild.id}/commands/${command.id}`,
        {
          headers: {
            Authorization: `Bot ${token}`,
          },
        }
      );

      if (response.status === 204) {
        clearAndLog(colors.red(`🔥 Deleted ${command.name}.`));
        i++;
      } else {
        clearAndLog(colors.red(`❌ Couldn't delete ${command.name}.`));
      }
    }

    console.log(
      colors.green(`\n✅ Deleted ${i} guild commands in ${guild.name}.`)
    );
  }
}
