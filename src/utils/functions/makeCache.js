const { LRUCache } = require("lru-cache");

/**
 * Create a cache factory using predefined settings to sweep or limit.
 * @param {Object<string, import("lru-cache").LRUCache|number>} [settings={}] Settings passed to the relevant constructor.
 * If no setting is provided for a manager, it uses LRUCache with 5000 as max.
 * If a number is provided for a manager, it uses that number as the max for a LRUCache.
 * If LRUCache options are provided for a manager, it uses those settings to form a LRUCache.
 * @returns {LRUCache}
 */
function makeCache(settings = {}) {
  return (manager) => {
    const setting = settings[manager.name];
    if (setting == null) {
      return new LRUCache({ max: 5000 });
    }
    if (typeof setting === "number") {
      if (setting === Infinity) {
        throw new Error("Provided number can not be Infinity.");
      }
      return new LRUCache({ max: setting });
    }
    const noLimit = setting.max == null || setting.max === Infinity;
    if (noLimit) {
      throw new Error("Provided settings for the cache is invalid.");
    }
    return new LRUCache(setting);
  };
}

module.exports = { makeCache };
