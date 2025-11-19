const pool = require("../config/db");

async function createResume(userId, title, template, data, templateId) {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      "INSERT INTO resumes (user_id, title, template, data, tempID) VALUES (?,?,?,?,?)",
      [
        userId,
        title || "Untitled",
        template || "modern",
        JSON.stringify(data || {}),
        templateId,
      ]
    );

    const [rows] = await conn.query("SELECT * FROM resumes WHERE id = ?", [
      result.insertId,
    ]);
    return rows[0];
  } finally {
    conn.release();
  }
}

async function getResumesByUser(userId) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT * FROM resumes WHERE user_id=? ORDER BY updated_at DESC",
      [userId]
    );
    return rows;
  } finally {
    conn.release();
  }
}

async function getResumeById(id, userId) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT * FROM resumes WHERE id=? AND user_id=?",
      [id, userId]
    );
    return rows[0];
  } finally {
    conn.release();
  }
}

async function updateResume(id, userId, title, template, data) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "UPDATE resumes SET title=?, template=?, data=? WHERE id=? AND user_id=?",
      [
        title || "Untitled",
        template || "modern",
        JSON.stringify(data || {}),
        id,
        userId,
      ]
    );
    const [rows] = await conn.query("SELECT * FROM resumes WHERE id=?", [id]);
    return rows[0];
  } finally {
    conn.release();
  }
}

async function deleteResume(id, userId) {
  const conn = await pool.getConnection();
  try {
    await conn.query("DELETE FROM resumes WHERE id=? AND user_id=?", [
      id,
      userId,
    ]);
    return true;
  } finally {
    conn.release();
  }
}

async function changeTemplate(id, userId, newTemplate) {
  const conn = await pool.getConnection();
  try {
    await conn.query("UPDATE resumes SET template=? WHERE id=? AND user_id=?", [
      newTemplate,
      id,
      userId,
    ]);
    const [rows] = await conn.query("SELECT * FROM resumes WHERE id=?", [id]);
    return rows[0];
  } finally {
    conn.release();
  }
}

module.exports = {
  createResume,
  getResumesByUser,
  getResumeById,
  updateResume,
  deleteResume,
  changeTemplate,
};
