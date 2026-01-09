// controllers/authController.js
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
// const { use } = require("../routes/aiRoutes");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

function signToken(payload, expiresIn = "7d") {
  return jwt.sign(payload, process.env.JWT_SECRET || JWT_SECRET, { expiresIn });
}

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" });

  const conn = await pool.getConnection();
  try {
    const [existing] = await conn.query(
      "SELECT user_id FROM rb_users WHERE email = ?",
      [email]
    );
    if (existing.length)
      return res.status(400).json({ error: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await conn.query(
      "INSERT INTO rb_users (user_id, name, email, password, is_guest) VALUES (?, ?, ?, ?, FALSE)",
      [userId, name || "User", email, hash]
    );

    const token = signToken({ id: userId, email }, "7d");

    res.json({ token, user: { id: userId, name: name || "User", email } });
  } catch (err) {
    console.error("Register error:", err);
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
    const [rows] = await conn.query("SELECT * FROM rb_users WHERE email = ?", [
      email,
    ]);
    if (!rows.length)
      return res.status(400).json({ error: "Invalid credentials" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
// console.log("user",user)
    const token = signToken(
      { id: user.user_id, email: user.email, role: user.role },
      "7d"
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        isGuest: !!user.is_guest,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    conn.release();
  }
};

exports.createGuestUser = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const userId = uuidv4();
    const guestId = `guest_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const guestEmail = `${guestId}@guest.resumebuilder.com`;

    // Guest expires in 30 days
    const guestExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Hash a default password for guest accounts (not used by clients, but stored)
    const guestPasswordHash = await bcrypt.hash("guest_password", 10);

    await conn.query(
      "INSERT INTO rb_users (user_id, name, email, password, is_guest, guest_expires_at) VALUES (?, ?, ?, ?, TRUE, ?)",
      [userId, "Guest User", guestEmail, guestPasswordHash, guestExpiresAt]
    );

    const token = signToken(
      { id: userId, email: guestEmail, isGuest: true },
      "30d"
    );

    res.json({
      token,
      user: {
        id: userId,
        name: "Guest User",
        email: guestEmail,
        isGuest: true,
        guestExpiresAt,
      },
    });
  } catch (err) {
    console.error("Guest creation error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

exports.convertGuestToUser = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { name, email, password } = req.body;
    const guestUserId = req.user && req.user.id;
    if (!guestUserId) return res.status(401).json({ error: "Unauthorized" });

    // Check email uniqueness (excluding current guest user)
    const [existingUsers] = await conn.query(
      "SELECT user_id FROM rb_users WHERE email = ? AND user_id != ? AND is_guest = FALSE",
      [email, guestUserId]
    );
    if (existingUsers.length > 0)
      return res.status(400).json({ error: "Email already exists" });

    // Verify this is a guest user
    const [guestUsers] = await conn.query(
      "SELECT * FROM rb_users WHERE user_id = ? AND is_guest = TRUE",
      [guestUserId]
    );
    if (guestUsers.length === 0)
      return res.status(400).json({ error: "User is not a guest account" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await conn.query(
      `UPDATE rb_users
       SET name = ?, email = ?, password = ?, is_guest = FALSE, guest_expires_at = NULL
       WHERE user_id = ?`,
      [name || guestUsers[0].name, email, hashedPassword, guestUserId]
    );

    const token = signToken({ id: guestUserId, email }, "30d");

    res.json({
      token,
      user: {
        id: guestUserId,
        name: name || guestUsers[0].name,
        email,
        isGuest: false,
      },
    });
  } catch (err) {
    console.error("Guest conversion error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

exports.getCurrentUser = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const [users] = await conn.query(
      "SELECT user_id AS id, name, email, is_guest, guest_expires_at, role FROM rb_users WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = users[0];
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isGuest: !!user.is_guest,
        guestExpiresAt: user.guest_expires_at,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};
