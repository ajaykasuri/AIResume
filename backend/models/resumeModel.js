const db = require('../config/database');

class ResumeModel {
  // Get all resumes for a user
  static async getResumesByUser(userId) {
    const [rows] = await db.execute(
      'SELECT * FROM rb_Resumes WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  // Create new resume
  static async createResume(userId, resumeData) {
    const { resume_name, template_id = 1, template_name = 'Classic' } = resumeData;
    
    const [result] = await db.execute(
      'INSERT INTO rb_Resumes (user_id, resume_name, template_id, template_name) VALUES (?, ?, ?, ?)',
      [userId, resume_name, template_id, template_name]
    );
    return result.insertId;
  }

  // Get resume by ID
  static async getResumeById(resumeId) {
    const [rows] = await db.execute(
      'SELECT * FROM rb_Resumes WHERE resume_id = ?',
      [resumeId]
    );
    return rows[0] || null;
  }

  // Delete resume
  static async deleteResume(resumeId) {
    const [result] = await db.execute(
      'DELETE FROM rb_Resumes WHERE resume_id = ?',
      [resumeId]
    );
    return result.affectedRows > 0;
  }

  // Update completion percentage
  static async updateCompletionPercentage(resumeId) {
    // This will be implemented after we build section models
    const percentage = 0; // Placeholder
    await db.execute(
      'UPDATE rb_Resumes SET completion_percentage = ? WHERE resume_id = ?',
      [percentage, resumeId]
    );
    return percentage;
  }
}

module.exports = ResumeModel;