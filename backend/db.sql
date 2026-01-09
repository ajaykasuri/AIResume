-- MySQL schema for resume_builder
CREATE DATABASE IF NOT EXISTS resume_builder;
USE resume_builder;

-- CREATE TABLE IF NOT EXISTS users (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(150),
--   email VARCHAR(200) UNIQUE,
--   password VARCHAR(255),
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS resumes (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   user_id INT,
--   title VARCHAR(255),
--   template VARCHAR(100),
--   data JSON,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );




 
-- USERS TABLE
CREATE TABLE rb_Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    email VARCHAR(200) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- RESUMES TABLE - 
CREATE TABLE rb_Resumes (
    resume_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resume_name VARCHAR(255) NOT NULL,
    template_id INT DEFAULT 1,
    template_name VARCHAR(255) DEFAULT 'Classic',
    sections_order JSON,
    completion_percentage INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- FOREIGN KEY (user_id) REFERENCES rb_Users(user_id) ON DELETE CASCADE
);



CREATE TABLE rb_ContactInformation (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    full_name VARCHAR(255),
    job_title VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(50),
    linkedin_profile VARCHAR(255),
    github_profile VARCHAR(255),
    personal_website VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
);

CREATE TABLE rb_PersonalStatements (
    statement_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    content TEXT,
  );

CREATE TABLE rb_Experience (
    exp_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
	is_fresher BOOLEAN DEFAULT FALSE,

    is_current_job BOOLEAN DEFAULT FALSE,
    description TEXT,
  );

CREATE TABLE rb_Education (
    education_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    degree VARCHAR(255) NOT NULL,
    major VARCHAR(255),
    institution_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_current_education BOOLEAN DEFAULT FALSE,
    gpa DECIMAL(3,2),
  );

CREATE TABLE rb_Skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    skill_level VARCHAR(50),
  );

CREATE TABLE rb_Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_url VARCHAR(255),
    start_date DATE,
    end_date DATE,
	 skills JSON, 
    is_current_project BOOLEAN DEFAULT FALSE,
    description TEXT,
    client_name VARCHAR(255),
    team_size INT,
  );

CREATE TABLE rb_Projects_Technologies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    technology_name VARCHAR(100) NOT NULL,
    
  );

CREATE TABLE rb_Declarations (
    declaration_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    description TEXT,
    signature VARCHAR(255),
  );

CREATE TABLE rb_Achievements (
    achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    achievement_date DATE,
    category VARCHAR(100),
    issuer VARCHAR(255),
    achievement_url VARCHAR(255),
  );

CREATE TABLE rb_Awards (
    award_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    award_name VARCHAR(255) NOT NULL,
    awarding_organization VARCHAR(255),
    award_date DATE,
    description TEXT,
    award_url VARCHAR(255),
  );

CREATE TABLE rb_Certifications (
    certification_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    certification_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255),
    issue_date DATE,
    expiration_date DATE,
    credential_id VARCHAR(255),
    certification_url VARCHAR(255),
  );

CREATE TABLE rb_Languages (
    language_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    language_name VARCHAR(255) NOT NULL,
    proficiency VARCHAR(50),
    certificate VARCHAR(255),
  );

CREATE TABLE rb_Interests (
    interest_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    interest_name VARCHAR(255) NOT NULL,
    description TEXT,
  );

CREATE TABLE rb_Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    completion_date DATE,
    description TEXT,
  );

CREATE TABLE rb_Publications (
    publication_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    publication_date DATE,
    publication_url VARCHAR(255),
    description TEXT,
  );

CREATE TABLE rb_References (
    reference_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    reference_name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    company VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    relationship VARCHAR(100),
  );

CREATE TABLE rb_AdditionalSections (
    section_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    section_type VARCHAR(100) NOT NULL,
    section_content TEXT,
    section_order INT DEFAULT 0,
  );
