// models/sectionModels.js
const db = require('../config/database');

class SectionModels {
  // Generic method to get section data
  static async getSectionData(resumeId, tableName, orderBy = '') {
    const query = `SELECT * FROM ${tableName} WHERE resume_id = ? ${orderBy}`;
    const [rows] = await db.execute(query, [resumeId]);
    return rows;
  }

  // Generic method to get single section data (for contact, summary, declaration)
  static async getSingleSectionData(resumeId, tableName) {
    const data = await this.getSectionData(resumeId, tableName);
    return data[0] || null;
  }

  // Generic method to delete section item
  static async deleteSectionItem(resumeId, tableName, idField, itemId) {
    const [result] = await db.execute(
      `DELETE FROM ${tableName} WHERE ${idField} = ? AND resume_id = ?`,
      [itemId, resumeId]
    );
    return result.affectedRows > 0;
  }

  // ========== CONTACT INFORMATION ==========
  static async getContact(resumeId) {
    return this.getSingleSectionData(resumeId, 'rb_ContactInformation');
  }

  // ========== EDUCATION ==========
  static async getEducation(resumeId) {
    return this.getSectionData(resumeId, 'rb_Education', 'ORDER BY start_date DESC');
  }

  static async deleteEducation(resumeId, educationId) {
    return this.deleteSectionItem(resumeId, 'rb_Education', 'education_id', educationId);
  }

  // ========== EXPERIENCE ==========
  static async getExperience(resumeId) {
    return this.getSectionData(resumeId, 'rb_Experience', 'ORDER BY start_date DESC');
  }

  static async deleteExperience(resumeId, expId) {
    return this.deleteSectionItem(resumeId, 'rb_Experience', 'exp_id', expId);
  }

  // ========== SKILLS ==========
  static async getSkills(resumeId) {
    return this.getSectionData(resumeId, 'rb_Skills');
  }

  static async deleteSkill(resumeId, skillId) {
    return this.deleteSectionItem(resumeId, 'rb_Skills', 'skill_id', skillId);
  }

  // ========== PROJECTS ==========
  static async getProjects(resumeId) {
    return this.getSectionData(resumeId, 'rb_Projects', 'ORDER BY start_date DESC');
  }

  static async deleteProject(resumeId, projectId) {
    return this.deleteSectionItem(resumeId, 'rb_Projects', 'project_id', projectId);
  }

  // ========== PERSONAL STATEMENTS/SUMMARY ==========
  static async getSummary(resumeId) {
    return this.getSingleSectionData(resumeId, 'rb_PersonalStatements');
  }

  // ========== DECLARATIONS ==========
  static async getDeclaration(resumeId) {
    return this.getSingleSectionData(resumeId, 'rb_Declarations');
  }

  // ========== ACHIEVEMENTS ==========
  static async getAchievements(resumeId) {
    return this.getSectionData(resumeId, 'rb_Achievements', 'ORDER BY achievement_date DESC');
  }

  static async deleteAchievement(resumeId, achievementId) {
    return this.deleteSectionItem(resumeId, 'rb_Achievements', 'achievement_id', achievementId);
  }

  // ========== AWARDS ==========
  static async getAwards(resumeId) {
    return this.getSectionData(resumeId, 'rb_Awards', 'ORDER BY award_date DESC');
  }

  static async deleteAward(resumeId, awardId) {
    return this.deleteSectionItem(resumeId, 'rb_Awards', 'award_id', awardId);
  }

  // ========== CERTIFICATIONS ==========
  static async getCertifications(resumeId) {
    return this.getSectionData(resumeId, 'rb_Certifications', 'ORDER BY issue_date DESC');
  }

  static async deleteCertification(resumeId, certificationId) {
    return this.deleteSectionItem(resumeId, 'rb_Certifications', 'certification_id', certificationId);
  }

  // ========== LANGUAGES ==========
  static async getLanguages(resumeId) {
    return this.getSectionData(resumeId, 'rb_Languages');
  }

  static async deleteLanguage(resumeId, languageId) {
    return this.deleteSectionItem(resumeId, 'rb_Languages', 'language_id', languageId);
  }

  // ========== INTERESTS ==========
  static async getInterests(resumeId) {
    return this.getSectionData(resumeId, 'rb_Interests');
  }

  static async deleteInterest(resumeId, interestId) {
    return this.deleteSectionItem(resumeId, 'rb_Interests', 'interest_id', interestId);
  }

  // ========== COURSES ==========
  static async getCourses(resumeId) {
    return this.getSectionData(resumeId, 'rb_Courses', 'ORDER BY completion_date DESC');
  }

  static async deleteCourse(resumeId, courseId) {
    return this.deleteSectionItem(resumeId, 'rb_Courses', 'course_id', courseId);
  }

  // ========== PUBLICATIONS ==========
  static async getPublications(resumeId) {
    return this.getSectionData(resumeId, 'rb_Publications', 'ORDER BY publication_date DESC');
  }

  static async deletePublication(resumeId, publicationId) {
    return this.deleteSectionItem(resumeId, 'rb_Publications', 'publication_id', publicationId);
  }

  // ========== REFERENCES ==========
  static async getReferences(resumeId) {
    return this.getSectionData(resumeId, 'rb_References');
  }

  static async deleteReference(resumeId, referenceId) {
    return this.deleteSectionItem(resumeId, 'rb_References', 'reference_id', referenceId);
  }

  // ========== ADDITIONAL SECTIONS ==========
  static async getAdditionalSections(resumeId) {
    return this.getSectionData(resumeId, 'rb_AdditionalSections', 'ORDER BY section_order ASC');
  }

  static async deleteAdditionalSection(resumeId, sectionId) {
    return this.deleteSectionItem(resumeId, 'rb_AdditionalSections', 'section_id', sectionId);
  }
}

module.exports = SectionModels;