const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" });
  const conn = await pool.getConnection();
  try {
    const [existing] = await conn.query("SELECT id FROM users WHERE email=?", [
      email,
    ]);
    if (existing.length)
      return res.status(400).json({ error: "Email already exists" });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await conn.query(
      "INSERT INTO users (name,email,password) VALUES (?,?,?)",
      [name || "", email, hash]
    );
    const userId = result.insertId;
    const token = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET || JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, user: { id: userId, name, email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  } finally {
    conn.release();
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" });
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    if (!rows.length)
      return res.status(400).json({ error: "Invalid credentials" });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  } finally {
    conn.release();
  }
};
