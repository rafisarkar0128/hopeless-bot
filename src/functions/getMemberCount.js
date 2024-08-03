// function to get total amount of users
async function getMemberCount(client) {
    var memberCount = 0;

    client.guilds.cache.forEach((guild) => {
        memberCount += guild.memberCount;
    });

    return memberCount;
}

// exporting the function
module.exports = { getMemberCount };
