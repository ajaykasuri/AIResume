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
 
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    email VARCHAR(200) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 
-- RESUMES TABLE
 
CREATE TABLE Resumes (
    resume_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resume_name VARCHAR(255) NOT NULL,
    template_id INT DEFAULT 1,
    template_name VARCHAR(255) DEFAULT 'Classic',
    completion_percentage INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

 
-- CONTACT INFORMATION
 
CREATE TABLE ContactInformation (
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
    FOREIGN KEY (resume_id) REFERENCES Resumes(resume_id)
);

 
-- SUMMARY / PERSONAL STATEMENT
 
CREATE TABLE PersonalSummary (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    content TEXT,
    FOREIGN KEY (resume_id) REFERENCES Resumes(resume_id)
);

 
-- EXPERIENCE TABLE
 
CREATE TABLE Experience (
    exp_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current_job BOOLEAN DEFAULT FALSE,
    description TEXT,
    FOREIGN KEY (resume_id) REFERENCES Resumes(resume_id)
);

 
-- EDUCATION TABLE
 
CREATE TABLE Education (
    education_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    degree VARCHAR(255) NOT NULL,
    major VARCHAR(255),
    institution_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    graduation_date DATE,
    gpa DECIMAL(3,2),
    FOREIGN KEY (resume_id) REFERENCES Resumes(resume_id)
);

 
-- SKILLS TABLE
 
CREATE TABLE Skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    skill_level VARCHAR(50),
    FOREIGN KEY (resume_id) REFERENCES Resumes(resume_id)
);

 
-- PROJECTS TABLE
 
CREATE TABLE Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    project_url VARCHAR(255),
    FOREIGN KEY (resume_id) REFERENCES Resumes(resume_id)
);

 
-- DECLARATION TABLE
 
CREATE TABLE Declarations (
    declaration_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    description TEXT,
    signature VARCHAR(255),
    FOREIGN KEY (resume_id) REFERENCES Resumes(resume_id)
);

 
-- AWARDS TABLE
 
CREATE TABLE Awards (
    award_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    award_name VARCHAR(255) NOT NULL,
    awarding_organization VARCHAR(255),
    award_date DATE,
    description TEXT,
    FOREIGN KEY (resume_id) REFERENCES Resumes(resume_id)
);

 
-- ACHIEVEMENTS TABLE
 
CREATE TABLE Achievements (
    achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    date DATE,
    FOREIGN KEY (resume_id) REFERENCES Resumes(resume_id)
);

 
-- INTERESTS TABLE
 
CREATE TABLE Interests (
    interest_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    interest VARCHAR(255),
    FOREIGN KEY (resume_id) REFERENCES Resumes(resume_id)
);

 
-- CERTIFICATIONS TABLE
 
CREATE TABLE Certifications (
    certification_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    certification_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255),
    issue_date DATE,
    expiration_date DATE,
    FOREIGN KEY (resume_id) REFERENCES Resumes(resume_id)
);

 
-- LANGUAGES TABLE
 
CREATE TABLE Languages (
    language_id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    language_name VARCHAR(255),
    proficiency VARCHAR(50),
    FOREIGN KEY (resume_id) REFERENCES Resumes(resume_id)
);




