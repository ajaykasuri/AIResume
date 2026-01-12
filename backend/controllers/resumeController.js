const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

exports.getUserResumes = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT * FROM rb_Resumes WHERE user_id = ?",
      [userId]
    );
    // console.log(req.user);
    // console.log("Fetched resumes for user:", userId, "Count:", rows.length);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createResume = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const user_id = req.user.id;
    const { resume_name, template_name, selectedSections, template_id } =
      req.body;
    const resume_id = uuidv4();

    const insertResumeResult = await connection.query(
      `INSERT INTO rb_Resumes 
       (resume_id, user_id, resume_name, template_id, template_name) 
       VALUES (?, ?, ?, ?, ?)`,
      [resume_id, user_id, resume_name, template_id, template_name]
    );

    // console.log("Inserted resume:", insertResumeResult[0]);

    // Insert Sections
    if (Array.isArray(selectedSections) && selectedSections.length > 0) {
      const sectionTitles = {
        personal_info: "Personal Information",
        profile: "Professional Summary",
        experience: "Work Experience",
        education: "Education",
        skills: "Skills",
        projects: "Projects",
        achievements: "Achievements",
        awards: "Awards",
        certifications: "Certifications",
        languages: "Languages",
        courses: "Courses",
        internships: "Internships",
        publications: "Publications",
        interests: "Interests",
        references: "References",
        declarations: "Declarations",
      };

      for (const [index, sectionKey] of selectedSections.entries()) {
        await connection.query(
          `INSERT INTO rb_Sections 
           (section_id, resume_id, section_key, section_title, order_no, visible, is_custom)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            resume_id,
            sectionKey,
            sectionTitles[sectionKey] || sectionKey,
            index + 1,
            1,
            0,
          ]
        );
      }
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      resume_id,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error creating resume:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    connection.release();
  }
};

exports.getFullResume = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;
    const userId = req.user.id;
    // console.log("Updating resume:", resumeId);

    // 1️⃣ Fetch resume + ownership in one query
    const [resumeRows] = await pool.query(
      `SELECT * FROM rb_Resumes 
       WHERE resume_id = ? AND user_id = ?`,
      [resumeId, userId]
    );

    if (!resumeRows.length) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const resume = resumeRows[0];

    const [sectionMeta] = await pool.query(
      `SELECT * FROM rb_Sections 
       WHERE resume_id = ? 
       ORDER BY order_no`,
      [resumeId]
    );

    // 3️⃣ Section content tables
    const sectionTables = [
      "ContactInformation",
      "Education",
      "Experience",
      "Skills",
      "Projects",
      "PersonalStatements",
      "Declarations",
      "Achievements",
      "Awards",
      "Certifications",
      "Languages",
      "Interests",
      "Courses",
      "Publications",
      "References",
      "AdditionalSections",
    ];

    const sectionData = {};

    for (const table of sectionTables) {
      const [rows] = await pool.query(
        `SELECT * FROM rb_${table} WHERE resume_id = ?`,
        [resumeId]
      );
      sectionData[table.toLowerCase()] = rows;
    }

    //     console.log( sectionMeta,
    // sectionData)
    return res.json({
      resume,
      sections: sectionMeta,
      content: sectionData,
    });
  } catch (err) {
    console.error("Error fetching full resume:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteResume = async (req, res) => {
  const connection = await pool.getConnection();
  let thumbnail = null;

  try {
    await connection.beginTransaction();

    const resumeId = req.params.resumeId;

    // Verify ownership + get thumbnail
    const [resumeRows] = await connection.query(
      "SELECT thumbnail FROM rb_Resumes WHERE resume_id = ? AND user_id = ?",
      [resumeId, req.user.id]
    );

    if (resumeRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Resume not found" });
    }

    thumbnail = resumeRows[0].thumbnail;

    const sections = [
      "ContactInformation",
      "Education",
      "Experience",
      "Skills",
      "Projects",
      "PersonalStatements",
      "Declarations",
      "Achievements",
      "Awards",
      "Certifications",
      "Languages",
      "Interests",
      "Courses",
      "Publications",
      "References",
      "AdditionalSections",
    ];

    for (let section of sections) {
      await connection.query(`DELETE FROM rb_${section} WHERE resume_id = ?`, [
        resumeId,
      ]);
    }

    await connection.query("DELETE FROM rb_ShareTokens WHERE resume_id = ?", [
      resumeId,
    ]);

    await connection.query("DELETE FROM rb_Resumes WHERE resume_id = ?", [
      resumeId,
    ]);

    await connection.commit();

    //  Delete thumbnail AFTER DB commit
    if (thumbnail) {
      const filePath = path.join(__dirname, "..", thumbnail);
      fs.existsSync(filePath) && fs.unlinkSync(filePath);
    }

    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

exports.updateResume = async (req, res) => {
  try {
    const { completion_percentage, template_id } = req.body;
    const { resumeId } = req.params;

    // console.log("Updating resume:", resumeId);

    const [result] = await pool.query(
      `UPDATE rb_Resumes 
       SET completion_percentage = ?, 
           template_id = ?, 
           last_updated = NOW() 
       WHERE resume_id = ? AND user_id = ?`,
      [completion_percentage, template_id, resumeId, req.user.id]
    );

    // console.log("Resume update result:", result);

    // No rows updated → resume not found or not owned by user
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Resume not found" });
    }

    return res.json({ message: "Resume updated successfully" });
  } catch (err) {
    console.error("Error updating resume:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.uploadThumbnail = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;

    if (!req.file) {
      return res.status(400).json({ error: "No thumbnail uploaded" });
    }

    // Get old thumbnail
    const [rows] = await pool.query(
      "SELECT thumbnail FROM rb_Resumes WHERE resume_id = ? AND user_id = ?",
      [resumeId, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const oldThumbnail = rows[0].thumbnail;

    // Delete old file
    if (oldThumbnail) {
      const oldPath = path.join(__dirname, "..", oldThumbnail);
      fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
    }

    const thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;

    await pool.query(
      `UPDATE rb_Resumes
       SET thumbnail = ?, last_updated = NOW()
       WHERE resume_id = ? AND user_id = ?`,
      [thumbnailUrl, resumeId, req.user.id]
    );

    res.json({
      success: true,
      thumbnail_url: thumbnailUrl,
    });
  } catch (err) {
    console.error("Thumbnail upload error:", err);
    res.status(500).json({ error: err.message });
  }
};



exports.updateResumeSections = async (req, res) => {
  const { resumeId } = req.params;
  const { selectedSections } = req.body;
  const userId = req.user.id;

  console.log("Updating sections for resume:", selectedSections);

  if (!Array.isArray(selectedSections)) {
    return res.status(400).json({ error: "selectedSections must be an array" });
  }

  const sectionTitles = {
    personal_info: "Personal Information",
    profile: "Professional Summary",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    achievements: "Achievements",
    awards: "Awards",
    certifications: "Certifications",
    languages: "Languages",
    courses: "Courses",
    internships: "Internships",
    publications: "Publications",
    interests: "Interests",
    references: "References",
    declarations: "Declarations",
  };

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1Ownership check
    const [[resume]] = await conn.query(
      `SELECT resume_id FROM rb_Resumes WHERE resume_id = ? AND user_id = ?`,
      [resumeId, userId]
    );

    if (!resume) {
      await conn.rollback();
      return res.status(404).json({ error: "Resume not found" });
    }

    // 2 UPSERT sections (NO DELETE)
    for (const [index, sectionKey] of selectedSections.entries()) {
      const title = sectionTitles[sectionKey] || sectionKey;

      await conn.query(
        `
        INSERT INTO rb_Sections
          (resume_id, section_key, section_title, order_no, visible, is_custom)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          order_no = VALUES(order_no),
          visible = VALUES(visible),
          section_title = VALUES(section_title)
        `,
        [
          resumeId,
          sectionKey,     
          title,          
          index + 1,      
          1,              
          0,              
        ]
      );
    }

    await conn.commit();
    return res.json({ message: "Resume sections updated successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("Update sections error:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};


