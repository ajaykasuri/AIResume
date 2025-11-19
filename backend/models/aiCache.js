const db = require("../config/db");

module.exports = {
  async findByHash(type, hash) {
    const [rows] = await db.query(
      "SELECT output_text FROM ai_cache WHERE type=? AND hash_key=?",
      [type, hash]
    );
    return rows.length ? rows[0].output_text : null;
  },

  async save(type, hash, inputJson, output) {
    return db.query(
      "INSERT INTO ai_cache (type, hash_key, input_json, output_text) VALUES (?, ?, ?, ?)",
      [type, hash, JSON.stringify(inputJson), output]
    );
  }
};
