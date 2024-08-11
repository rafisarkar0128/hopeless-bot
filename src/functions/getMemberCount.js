module.exports = async (client) => {
    var memberCount = 0;

    client.guilds.cache.forEach((guild) => {
        memberCount += guild.memberCount;
    });

    return memberCount;
};
