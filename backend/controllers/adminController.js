const db = require("../config/db");

const adminController = {
  getDashboard: async (req, res) => {
    console.log("Admin dashboard accessed by user:", req.user.id);
    try {
      const [userCount] = await db.execute(
        "SELECT COUNT(*) as count FROM rb_Users"
      );

      const [resumeCount] = await db.execute(
        "SELECT COUNT(*) as count FROM rb_Resumes"
      );

      const [activeToday] = await db.execute(`
        SELECT COUNT(DISTINCT user_id) as count 
        FROM rb_Resumes 
        WHERE DATE(created_at) = CURDATE()
      `);

      const [templateStats] = await db.execute(`
        SELECT template_name, COUNT(*) as usage_count 
        FROM rb_Resumes 
        GROUP BY template_name 
        ORDER BY usage_count DESC 
        LIMIT 5
      `);

      const [recentUsers] = await db.execute(`
        SELECT id, name, email, created_at, role
        FROM rb_Users 
        ORDER BY created_at DESC 
        LIMIT 10
      `);

      // Get recent resumes
      const [recentResumes] = await db.execute(`
        SELECT r.resume_id, r.resume_name, r.template_name, r.created_at, u.name as user_name
        FROM rb_Resumes r
        JOIN rb_Users u ON r.user_id = u.id
        ORDER BY r.created_at DESC 
        LIMIT 10
      `);

      res.json({
        stats: {
          totalUsers: userCount[0].count,
          totalResumes: resumeCount[0].count,
          activeToday: activeToday[0].count,
          popularTemplate: templateStats[0]?.template_name || "Classic",
        },
        recentUsers,
        recentResumes,
        templateStats,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get all users with pagination and search
getUsers: async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    let query = `
      SELECT 
        u.id, u.name, u.email, u.created_at, u.role,
        COUNT(r.resume_id) AS resume_count,
        (SELECT MAX(created_at) FROM rb_Resumes WHERE user_id = u.id) AS last_resume_activity
      FROM rb_Users u
      LEFT JOIN rb_Resumes r ON u.id = r.user_id
    `;

    let countQuery = `SELECT COUNT(*) AS total FROM rb_Users u`;
    let queryParams = [];

    if (search) {
      const condition = ` WHERE u.name LIKE ? OR u.email LIKE ?`;
      query += condition;
      countQuery += condition;
      queryParams.push(`%${search}%`, `%${search}%`);
    }


    query += ` GROUP BY u.id ORDER BY u.created_at DESC LIMIT 0, 10`;

    // console.log("Final SQL:", query);
    // console.log("Params:", queryParams);

    const [users] = await db.execute(query, search ? queryParams : []);

    const [countResult] = await db.execute(
      countQuery,
      search ? [`%${search}%`, `%${search}%`] : []
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalUsers: total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error("Users fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
,

  // Get specific user details
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;

      const [user] = await db.execute(
        `
        SELECT id, name, email, created_at, role
        FROM rb_Users 
        WHERE id = ?
      `,
        [userId]
      );

      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get user's resumes
      const [resumes] = await db.execute(
        `
        SELECT resume_id, resume_name, template_name, completion_percentage, created_at, last_updated
        FROM rb_Resumes 
        WHERE user_id = ?
        ORDER BY last_updated DESC
      `,
        [userId]
      );

      res.json({
        user: user[0],
        resumes,
      });
    } catch (error) {
      console.error("User details error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete user and all their data
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;

      // Check if user exists
      const [user] = await db.execute("SELECT id FROM rb_Users WHERE id = ?", [
        userId,
      ]);
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get all resume IDs for this user to delete related data
      const [resumes] = await db.execute(
        "SELECT resume_id FROM rb_Resumes WHERE user_id = ?",
        [userId]
      );
      const resumeIds = resumes.map((r) => r.resume_id);

      if (resumeIds.length > 0) {
        // Delete related data from all tables
        const tables = [
          "rb_ContactInformation",
          "rb_PersonalStatements",
          "rb_Experience",
          "rb_Education",
          "rb_Skills",
          "rb_Projects",
          "rb_Declarations",
          "rb_Achievements",
          "rb_Awards",
          "rb_Certifications",
          "rb_Languages",
          "rb_Interests",
          "rb_Courses",
          "rb_Publications",
          "rb_References",
          "rb_AdditionalSections",
        ];

        for (const table of tables) {
          await db.execute(`DELETE FROM ${table} WHERE resume_id IN (?)`, [
            resumeIds,
          ]);
        }
      }

      // Delete resumes
      await db.execute("DELETE FROM rb_Resumes WHERE user_id = ?", [userId]);

      // Finally delete user
      await db.execute("DELETE FROM rb_Users WHERE id = ?", [userId]);

      res.json({
        message: "User and all associated data deleted successfully",
      });
    } catch (error) {
      console.error("User delete error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update user role
  updateUserRole: async (req, res) => {
    try {
      const userId = req.params.id;
      const { role } = req.body;

      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      await db.execute("UPDATE rb_Users SET role = ? WHERE id = ?", [
        role,
        userId,
      ]);

      res.json({ message: "User role updated successfully" });
    } catch (error) {
      console.error("Role update error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get all resumes with filters
 getResumes: async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const template = req.query.template;

    let query = `
      SELECT 
        r.resume_id, r.resume_name, r.template_name, r.completion_percentage,
        r.created_at, r.last_updated, r.is_fresher,
        u.id as user_id, u.name as user_name, u.email
      FROM rb_Resumes r
      JOIN rb_Users u ON r.user_id = u.id
    `;

    let countQuery = `SELECT COUNT(*) as total FROM rb_Resumes r`;
    let queryParams = [];

    if (template) {
      const condition = ` WHERE r.template_name = ?`;
      query += condition;
      countQuery += condition;
      queryParams.push(template);
    }

    // -------- TEMP STATIC LIMIT FOR TESTING --------
    query += ` ORDER BY r.last_updated DESC LIMIT 0, 10`;

    console.log("SQL:", query);
    console.log("Params:", queryParams);

    const [resumes] = await db.execute(query, queryParams);

    const [totalResult] = await db.execute(
      countQuery,
      template ? [template] : []
    );
    const total = totalResult[0].total;

    res.json({
      resumes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResumes: total,
      },
    });

  } catch (error) {
    console.error("Resumes fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
,

  // Get template analytics
  getTemplateAnalytics: async (req, res) => {
    try {
      const [templateStats] = await db.execute(`
        SELECT 
          template_name,
          COUNT(*) as usage_count,
          ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM rb_Resumes)), 2) as usage_percentage
        FROM rb_Resumes 
        GROUP BY template_name 
        ORDER BY usage_count DESC
      `);

      res.json({ templateStats });
    } catch (error) {
      console.error("Template analytics error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = adminController;
