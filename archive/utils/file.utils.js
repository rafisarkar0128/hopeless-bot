// Part of memberinfo | userinfo command.

const { glob } = require("glob");
const path = require("path");

async function getRandomBanner(Path = `${process.cwd() / assets / banners}`) {
    try {
        const banners = await glob(
            path.join(Path, "**/*.{png,jpg,jpeg,gif}").replace(/\\/g, "/")
        );
        return banners[Math.floor(Math.random() * banners?.length)];
    } catch (error) {
        throw error;
    }
}
