// services/sectionService.js
const pool = require("../config/db");

// Map section names to table info
const getTableInfo = (section) => {
  const tableMap = {
    contact: {
      table: "rb_ContactInformation",
      idField: "contact_id",
      fieldMap: {
        name: "full_name",
        job_title: "job_title",
        email: "email",
        phone: "phone_number",
        city: "city",
        country: "country",
        linkedin: "linkedin_profile",
        github: "github_profile",
        website: "personal_website",
      },
    },
    skills: {
      table: "rb_Skills",
      idField: "skill_id",
      fieldMap: { skill_name: "skill_name" },
    },
    experience: {
      table: "rb_Experience",
      idField: "exp_id",
      fieldMap: {
        title: "job_title",
        employer: "company_name",
        from: "start_date",
        to: "end_date",
        current: "is_current_job",
        description: "description",
        isFresher: "is_fresher",
      },
    },
    projects: {
      table: "rb_Projects",
      idField: "project_id",
      fieldMap: {
        title: "project_name",
        link: "project_url",
        description: "description",
        from: "start_date",
        to: "end_date",
        current: "is_current_project",
        client_name: "client_name",
        team_size: "team_size",
        skills_used: "skills",
      },
      integerFields: ["team_size"],
      jsonFields: ["skills"],
    },
    education: {
      table: "rb_Education",
      idField: "education_id",
      fieldMap: {
        degree: "degree",
        institution: "institution_name",
        from: "start_date",
        to: "end_date",
        current: "is_current_education",
      },
    },
    declarations: {
      table: "rb_Declarations",
      idField: "declaration_id",
      fieldMap: {
        description: "description",
        signature: "signature",
      },
    },
    "personal-statement": {
      table: "rb_PersonalStatements",
      idField: "statement_id",
      fieldMap: { statement_text: "content" },
    },
    achievements: {
      table: "rb_Achievements",
      idField: "achievement_id",
      fieldMap: {
        title: "title",
        description: "description",
        achievement_date: "achievement_date",
        category: "category",
        issuer: "issuer",
        link: "achievement_url",
      },
    },
    certifications: {
      table: "rb_Certifications",
      idField: "certification_id",
      fieldMap: {
        certification_name: "certification_name",
        issuing_organization: "issuing_organization",
        issue_date: "issue_date",
        expiration_date: "expiration_date",
        credential_id: "credential_id",
        certification_url: "certification_url",
      },
    },
    awards: {
      table: "rb_Awards",
      idField: "award_id",
      fieldMap: {
        award_title: "award_name",
        award_date: "award_date",
        awarding_organization: "awarding_organization",
        description: "description",
        award_url: "award_url",
      },
    },
    languages: {
      table: "rb_Languages",
      idField: "language_id",
      fieldMap: {
        language_name: "language_name",
        proficiency: "proficiency_level",
        certificate: "certificate",
      },
    },
    interests: {
      table: "rb_Interests",
      idField: "interest_id",
      fieldMap: {
        interest_name: "interest_name",
        description: "description",
      },
    },
  };

  return (
    tableMap[section] || {
      table: `rb_${section.charAt(0).toUpperCase() + section.slice(1)}`,
      idField: `${section}_id`,
      fieldMap: {},
      integerFields: [],
      jsonFields: [],
    }
  );
};

// Helper to clean data before insert/update
const cleanData = (item, integerFields = [], jsonFields = []) => {
  const cleaned = { ...item };

  integerFields.forEach((field) => {
    if (
      cleaned[field] === "" ||
      cleaned[field] === null ||
      cleaned[field] === undefined
    ) {
      cleaned[field] = null;
    } else if (typeof cleaned[field] === "string" && !isNaN(cleaned[field])) {
      cleaned[field] = parseInt(cleaned[field], 10);
    }
  });

  jsonFields.forEach((field) => {
    if (cleaned[field] && typeof cleaned[field] === "string") {
      cleaned[field] = cleaned[field].includes(",")
        ? JSON.stringify(
            cleaned[field]
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          )
        : JSON.stringify([cleaned[field].trim()]);
    } else if (Array.isArray(cleaned[field])) {
      cleaned[field] = JSON.stringify(cleaned[field]);
    } else if (!cleaned[field]) {
      cleaned[field] = null;
    }
  });

  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === "") cleaned[key] = null;
  });

  return cleaned;
};

// ===== Smart Save =====
exports.smartSave = async (resumeId, section, items) => {
  try {
    console.log(
      `Saving section: ${section}, resumeId: ${resumeId}, items:`,
      items
    );
    const {
      table,
      idField,
      fieldMap,
      integerFields = [],
      jsonFields = [],
    } = getTableInfo(section);

    const db = await pool.getConnection();
    try {
      // Fetch existing items
      const [existingRows] = await db.query(
        `SELECT * FROM ${table} WHERE resume_id = ?`,
        [resumeId]
      );
      const existingMap = {};
      existingRows.forEach((row) => (existingMap[row[idField]] = row));

      const created = [];
      const updated = [];
      const receivedIds = [];

      for (const item of items) {
        const itemId = item[idField] || null;
        if (itemId) receivedIds.push(itemId);

        // Map and clean fields
        const mappedItem = {};
        Object.keys(fieldMap).forEach((key) => {
          if (item[key] !== undefined) mappedItem[fieldMap[key]] = item[key];
        });
        const cleanedItem = cleanData(mappedItem, integerFields, jsonFields);

        const fields = Object.keys(cleanedItem);
        const values = Object.values(cleanedItem);

        if (itemId && existingMap[itemId]) {
          // Update existing
          const setQuery = fields.map((f) => `${f}=?`).join(", ");
          await db.query(
            `UPDATE ${table} SET ${setQuery} WHERE ${idField}=? AND resume_id=?`,
            [...values, itemId, resumeId]
          );
          updated.push(itemId);
        } else {
          // Insert new
          const placeholders = fields.map(() => "?").join(", ");
          const [result] = await db.query(
            `INSERT INTO ${table} (resume_id, ${fields.join(
              ", "
            )}) VALUES (?, ${placeholders})`,
            [resumeId, ...values]
          );
          created.push(result.insertId);
        }
      }

      // Delete removed items
      const toDelete = existingRows
        .map((row) => row[idField])
        .filter((id) => !receivedIds.includes(id));

      if (toDelete.length > 0) {
        await db.query(
          `DELETE FROM ${table} WHERE ${idField} IN (?) AND resume_id=?`,
          [toDelete, resumeId]
        );
      }

      return {
        message: `${section} saved successfully`,
        created,
        updated,
        deleted: toDelete,
      };
    } finally {
      db.release();
    }
  } catch (err) {
    console.error(`Error saving ${section}:`, err);
    throw new Error(`Failed to save ${section}: ${err.message}`);
  }
};

// ===== Delete Single Item =====
exports.deleteItem = async (resumeId, section, id) => {
  try {
    console.log(
      `Deleting item from section: ${section}, resumeId: ${resumeId}, itemId: ${id}`
    );
    const { table, idField } = getTableInfo(section);
    console.log(`Target table: ${table}, idField: ${idField}`);
    const [result] = await pool.query(
      `DELETE FROM ${table} WHERE resume_id = ? AND ${idField} = ?`,
      [resumeId, id]
    );
    if (result.affectedRows === 0) {
      throw new Error("Item not found or cannot delete");
    }
    return { message: "Item deleted successfully" };
  } catch (err) {
    console.error(`Error deleting ${section} item:`, err);
    throw new Error(`Failed to delete ${section} item: ${err.message}`);
  }
};

// ===== Bulk Save =====
exports.bulkSave = async (resumeId, sectionsData) => {
  const result = {};
  for (let section in sectionsData) {
    if (Array.isArray(sectionsData[section])) {
      result[section] = await exports.smartSave(
        resumeId,
        section,
        sectionsData[section]
      );
    }
  }
  return result;
};
