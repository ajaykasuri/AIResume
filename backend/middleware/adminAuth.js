const adminAuth = (req, res, next) => {
  try {
    const user = req.user;
    // console.log("AdminAuth middleware - user:", user);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = adminAuth;