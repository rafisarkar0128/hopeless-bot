async function getRandomBanner(Path = `${process.cwd()}/assets/banners`) {
    const path = require("path");
    const { glob } = require("glob");
    const banners = await glob(
        path.join(Path, "**/*.{png,jpg,jpeg,gif}").replace(/\\/g, "/")
    );
    return banners[Math.floor(Math.random() * banners?.length)];
}

function addSuffix(number) {
    if (number % 100 >= 11 && number % 100 <= 13) return number + "th";
    switch (number % 10) {
        case 1:
            return number + "st";
        case 2:
            return number + "nd";
        case 3:
            return number + "rd";
    }
    return number + "th";
}

function addBadges(badgeNames) {
    if (!badgeNames.length) return [":x:"];
    const badgeMap = {
        ActiveDeveloper: "<:activedeveloper:1272302061739839539>",
        BugHunterLevel1: "<:discordbughunter1:1272302103594930196>",
        BugHunterLevel2: "<:discordbughunter2:1272302121282179135>",
        PremiumEarlySupporter: "<:discordearlysupporter:1272302136310628372>",
        Partner: "<:discordpartner:1272302197488488538>",
        Staff: "<:discordstaff:1272302221043826718>",
        HypeSquadOnlineHouse1: "<:hypesquadbravery:1272302257991581706>", // bravery
        HypeSquadOnlineHouse2: "<:hypesquadbrilliance:1272302326874505268>", // brilliance
        HypeSquadOnlineHouse3: "<:hypesquadbalance:1272302274022215682>", // balance
        Hypesquad: "<:hypesquadevents:1272302310625906781>",
        CertifiedModerator: "<:discordmod:1272302149706973244>",
        VerifiedDeveloper: "<:discordbotdev:1272302089434828891>",
        BotHTTPInteractions: "<:supportscommands:1275412776936017931>",
        VerifiedBot:
            "<:verifiedbot1:1275477687108108358><:verifiedbot2:1275477702362533991>",
    };
    return badgeNames.map((badgeName) => badgeMap[badgeName] || "❔").join("");
}

function getJoinedPosition(data, id) {
    return (
        Array.from(
            data.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp).keys()
        ).indexOf(id) + 1
    );
}

module.exports = { getRandomBanner, addSuffix, addBadges, getJoinedPosition };
