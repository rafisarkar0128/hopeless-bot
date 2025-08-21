module.exports = [
  {
    id: "Local Node",
    host: "localhost",
    port: 2333,
    authorization: "youshallnotpass",
    secure: false,
    retryAmount: 5,
    retryDelay: 60000,
    requestSignalTimeoutMS: 3000,
    closeOnError: true,
    heartBeatInterval: 30000,
    enablePingOnStatsCheck: true,
    regions: [], // Voice regions for this node
  },
];
