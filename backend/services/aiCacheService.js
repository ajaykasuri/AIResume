const crypto = require("crypto");
const aiCache = require("../models/aiCache");

function generateHash(obj) {
  return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}

module.exports = {
  generateHash,

  async getCachedResult(type, payload) {
    const hash = generateHash(payload);
    const cached = await aiCache.findByHash(type, hash);
    return { hash, cached };
  },

  async saveResult(type, hash, payload, output) {
    await aiCache.save(type, hash, payload, output);
  },
};
