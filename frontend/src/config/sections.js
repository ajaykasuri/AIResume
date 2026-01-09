export const sectionConfig = {
  contact: {
    title: "Contact Information",
    fields: [
      { name: "full_name", label: "Full Name", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone Number", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "country", label: "Country", type: "text" },
      { name: "linkedin", label: "LinkedIn", type: "text" },
      { name: "github", label: "GitHub", type: "text" },
      { name: "website", label: "Website", type: "text" },
    ],
  },
  education: {
    title: "Education",
    fields: [
      { name: "degree", label: "Degree", type: "text" },
      { name: "institution", label: "Institution", type: "text" },
      { name: "start_year", label: "Start Year", type: "number" },
      { name: "end_year", label: "End Year", type: "number" },
      { name: "grade", label: "Grade/Percentage", type: "text" },
    ],
  },
  experience: {
    title: "Work Experience",
    fields: [
      { name: "company", label: "Company", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "start_date", label: "Start Date", type: "date" },
      { name: "end_date", label: "End Date", type: "date" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  skills: {
    title: "Skills",
    fields: [{ name: "skill_name", label: "Skill", type: "text" }],
  },
  projects: {
    title: "Projects",
    fields: [
      { name: "project_name", label: "Project Name", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "technologies", label: "Technologies Used", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  awards: {
    title: "Awards",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "year", label: "Year", type: "number" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  achievements: {
    title: "Achievements",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  certifications: {
    title: "Certifications",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "issuer", label: "Issuer", type: "text" },
      { name: "year", label: "Year", type: "number" },
    ],
  },
  languages: {
    title: "Languages",
    fields: [
      { name: "language", label: "Language", type: "text" },
      { name: "proficiency", label: "Proficiency", type: "text" },
    ],
  },
  interests: {
    title: "Interests",
    fields: [{ name: "interest", label: "Interest", type: "text" }],
  },
  personal_statement: {
    title: "Personal Statement",
    fields: [{ name: "statement", label: "Statement", type: "textarea" }],
  },
  courses: {
    title: "Courses",
    fields: [
      { name: "course_name", label: "Course Name", type: "text" },
      { name: "institution", label: "Institution", type: "text" },
      { name: "year", label: "Year", type: "number" },
    ],
  },
  publications: {
    title: "Publications",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "publisher", label: "Publisher", type: "text" },
      { name: "year", label: "Year", type: "number" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  references: {
    title: "References",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "contact", label: "Contact", type: "text" },
      { name: "relationship", label: "Relationship", type: "text" },
    ],
  },
  declarations: {
    title: "Declarations",
    fields: [{ name: "declaration", label: "Declaration", type: "textarea" }],
  },
};
