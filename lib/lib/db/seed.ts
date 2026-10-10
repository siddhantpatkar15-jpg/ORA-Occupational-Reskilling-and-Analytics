import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sql } from 'drizzle-orm';
import * as schema from './schema';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_URL?.replace('sqlite:', '') || './data/ora.db';
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

const db = drizzle(sqlite, { schema });

async function createTables() {
  console.log('Creating tables...');
  
  const tables = [
    `CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      industry TEXT,
      size TEXT,
      logo_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      manager_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'learner',
      organization_id TEXT REFERENCES organizations(id),
      department_id TEXT REFERENCES departments(id),
      status TEXT NOT NULL DEFAULT 'active',
      language TEXT NOT NULL DEFAULT 'en',
      avatar_url TEXT,
      phone TEXT,
      bio TEXT,
      onboarding_completed INTEGER NOT NULL DEFAULT 0,
      email_verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS learner_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
      highest_education TEXT,
      field_of_study TEXT,
      years_of_experience INTEGER,
      current_job_title TEXT,
      target_occupation_id TEXT,
      career_goals TEXT,
      resume_url TEXT,
      linkedin_url TEXT,
      profile_completeness INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS trainer_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
      specialization TEXT,
      qualifications TEXT,
      years_of_experience INTEGER,
      certifications TEXT,
      max_learners INTEGER DEFAULT 50,
      rating REAL DEFAULT 0,
      total_reviews INTEGER DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS occupations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      industry TEXT,
      seniority_level TEXT,
      average_salary_range TEXT,
      demand_level TEXT,
      data_source TEXT DEFAULT 'Illustrative sample data',
      last_reviewed TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      proficiency_scale TEXT NOT NULL DEFAULT '1-5',
      assessment_method TEXT,
      evidence_requirements TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS related_skills (
      id TEXT PRIMARY KEY,
      skill_id TEXT NOT NULL REFERENCES skills(id),
      related_skill_id TEXT NOT NULL REFERENCES skills(id),
      relationship_type TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS occupation_skills (
      id TEXT PRIMARY KEY,
      occupation_id TEXT NOT NULL REFERENCES occupations(id),
      skill_id TEXT NOT NULL REFERENCES skills(id),
      required_level INTEGER NOT NULL,
      importance TEXT NOT NULL,
      is_required INTEGER NOT NULL DEFAULT 1
    );`,
    `CREATE TABLE IF NOT EXISTS related_occupations (
      id TEXT PRIMARY KEY,
      occupation_id TEXT NOT NULL REFERENCES occupations(id),
      related_occupation_id TEXT NOT NULL REFERENCES occupations(id)
    );`,
    `CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      skill_id TEXT NOT NULL REFERENCES skills(id),
      created_by TEXT NOT NULL REFERENCES users(id),
      organization_id TEXT REFERENCES organizations(id),
      type TEXT NOT NULL,
      time_limit_minutes INTEGER,
      passing_score INTEGER DEFAULT 60,
      max_attempts INTEGER DEFAULT 3,
      difficulty_level TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      total_questions INTEGER DEFAULT 0,
      total_points INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      assessment_id TEXT NOT NULL REFERENCES assessments(id),
      question_text TEXT NOT NULL,
      question_type TEXT NOT NULL,
      options TEXT,
      correct_answer TEXT,
      explanation TEXT,
      difficulty INTEGER NOT NULL DEFAULT 1,
      points INTEGER NOT NULL DEFAULT 10,
      order_index INTEGER NOT NULL DEFAULT 0,
      skill_id TEXT REFERENCES skills(id)
    );`,
    `CREATE TABLE IF NOT EXISTS assessment_attempts (
      id TEXT PRIMARY KEY,
      assessment_id TEXT NOT NULL REFERENCES assessments(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      score INTEGER,
      max_score INTEGER,
      percentage REAL,
      passed INTEGER,
      status TEXT NOT NULL DEFAULT 'in_progress',
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      time_spent_seconds INTEGER
    );`,
    `CREATE TABLE IF NOT EXISTS assessment_responses (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL REFERENCES assessment_attempts(id),
      question_id TEXT NOT NULL REFERENCES questions(id),
      answer TEXT,
      is_correct INTEGER,
      points_earned INTEGER DEFAULT 0
    );`,
    `CREATE TABLE IF NOT EXISTS learner_competencies (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      skill_id TEXT NOT NULL REFERENCES skills(id),
      self_reported_level INTEGER,
      assessed_level INTEGER,
      verified_level INTEGER,
      evidence_type TEXT,
      evidence_url TEXT,
      confidence_score REAL,
      last_assessed_at TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS competency_evidence (
      id TEXT PRIMARY KEY,
      competency_id TEXT NOT NULL REFERENCES learner_competencies(id),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      file_url TEXT,
      verified_by TEXT REFERENCES users(id),
      verified_at TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      short_description TEXT,
      skill_id TEXT REFERENCES skills(id),
      trainer_id TEXT REFERENCES users(id),
      organization_id TEXT REFERENCES organizations(id),
      category TEXT,
      level TEXT,
      estimated_hours INTEGER,
      thumbnail_url TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      enrollment_count INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      total_reviews INTEGER DEFAULT 0,
      completion_criteria TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS course_modules (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL REFERENCES courses(id),
      title TEXT NOT NULL,
      description TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      content_type TEXT,
      content TEXT,
      resource_url TEXT,
      duration_minutes INTEGER,
      is_required INTEGER NOT NULL DEFAULT 1
    );`,
    `CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL REFERENCES courses(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      progress INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'enrolled',
      enrolled_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      last_accessed_at TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS module_progress (
      id TEXT PRIMARY KEY,
      enrollment_id TEXT NOT NULL REFERENCES enrollments(id),
      module_id TEXT NOT NULL REFERENCES course_modules(id),
      status TEXT NOT NULL DEFAULT 'not_started',
      completed_at TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS learning_roadmaps (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      occupation_id TEXT NOT NULL REFERENCES occupations(id),
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      total_steps INTEGER DEFAULT 0,
      completed_steps INTEGER DEFAULT 0,
      estimated_weeks INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS roadmap_steps (
      id TEXT PRIMARY KEY,
      roadmap_id TEXT NOT NULL REFERENCES learning_roadmaps(id),
      skill_id TEXT NOT NULL REFERENCES skills(id),
      course_id TEXT REFERENCES courses(id),
      assessment_id TEXT REFERENCES assessments(id),
      step_order INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      reason TEXT,
      estimated_duration TEXT,
      prerequisite_step_id TEXT,
      status TEXT NOT NULL DEFAULT 'locked',
      completed_at TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS trainer_assignments (
      id TEXT PRIMARY KEY,
      trainer_id TEXT NOT NULL REFERENCES users(id),
      learner_id TEXT NOT NULL REFERENCES users(id),
      status TEXT NOT NULL DEFAULT 'active',
      assigned_at TEXT NOT NULL DEFAULT (datetime('now')),
      notes TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS course_feedback (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL REFERENCES courses(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      course_id TEXT REFERENCES courses(id),
      assessment_id TEXT REFERENCES assessments(id),
      certificate_number TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      issuing_organization TEXT,
      verification_status TEXT NOT NULL DEFAULT 'valid',
      issued_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      link TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      action TEXT NOT NULL,
      resource_type TEXT NOT NULL,
      resource_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`
  ];

  for (const tableSql of tables) {
    db.run(sql.raw(tableSql));
  }
}

async function seedOrganizations() {
  await db.insert(schema.organizations).values({
    id: 'org-1',
    name: 'TechCorp India',
    description: 'A leading technology solutions provider',
    industry: 'Technology',
    size: 'Medium'
  }).onConflictDoNothing();
}

async function seedDepartments() {
  const depts = [
    { id: 'dept-eng', name: 'Engineering', organizationId: 'org-1' },
    { id: 'dept-ds', name: 'Data Science', organizationId: 'org-1' },
    { id: 'dept-pm', name: 'Product Management', organizationId: 'org-1' },
    { id: 'dept-hr', name: 'Human Resources', organizationId: 'org-1' },
  ];
  for (const dept of depts) {
    await db.insert(schema.departments).values(dept).onConflictDoNothing();
  }
}

async function seedUsers() {
  const passwordHash = bcrypt.hashSync('OraDemo2024!', 10);
  const users = [
    { id: 'user-learner', email: 'learner@ora-demo.com', name: 'Arjun Sharma', role: 'learner' as const, departmentId: 'dept-eng', organizationId: 'org-1', passwordHash },
    { id: 'user-trainer', email: 'trainer@ora-demo.com', name: 'Priya Patel', role: 'trainer' as const, departmentId: 'dept-ds', organizationId: 'org-1', passwordHash },
    { id: 'user-admin', email: 'admin@ora-demo.com', name: 'Rajesh Kumar', role: 'admin' as const, organizationId: 'org-1', passwordHash },
    { id: 'user-meera', email: 'meera@ora-demo.com', name: 'Meera Singh', role: 'learner' as const, departmentId: 'dept-ds', organizationId: 'org-1', passwordHash },
    { id: 'user-vikram', email: 'vikram@ora-demo.com', name: 'Vikram Desai', role: 'learner' as const, departmentId: 'dept-pm', organizationId: 'org-1', passwordHash },
  ];
  for (const user of users) {
    await db.insert(schema.users).values(user).onConflictDoNothing();
  }
}

async function seedSkills() {
  const skills = [
    { id: 'skill-sql', name: 'SQL', category: 'technical' as const },
    { id: 'skill-python', name: 'Python', category: 'technical' as const },
    { id: 'skill-java', name: 'Java', category: 'technical' as const },
    { id: 'skill-javascript', name: 'JavaScript', category: 'technical' as const },
    { id: 'skill-react', name: 'React', category: 'technical' as const },
    { id: 'skill-nodejs', name: 'Node.js', category: 'technical' as const },
    { id: 'skill-rest-apis', name: 'REST APIs', category: 'technical' as const },
    { id: 'skill-data-viz', name: 'Data Visualization', category: 'digital' as const },
    { id: 'skill-cloud', name: 'Cloud Computing', category: 'digital' as const },
    { id: 'skill-excel', name: 'Excel/Spreadsheets', category: 'digital' as const },
    { id: 'skill-statistics', name: 'Statistics', category: 'analytical' as const },
    { id: 'skill-data-analysis', name: 'Data Analysis', category: 'analytical' as const },
    { id: 'skill-ml', name: 'Machine Learning', category: 'analytical' as const },
    { id: 'skill-problem-decomp', name: 'Problem Decomposition', category: 'problem_solving' as const },
    { id: 'skill-tech-writing', name: 'Technical Writing', category: 'communication' as const },
    { id: 'skill-presentation', name: 'Presentation Skills', category: 'communication' as const },
    { id: 'skill-stakeholder-comm', name: 'Stakeholder Communication', category: 'communication' as const },
    { id: 'skill-team-mgmt', name: 'Team Management', category: 'leadership' as const },
    { id: 'skill-project-plan', name: 'Project Planning', category: 'leadership' as const },
    { id: 'skill-mentoring', name: 'Mentoring', category: 'leadership' as const },
    { id: 'skill-agile', name: 'Agile Methodology', category: 'operational' as const },
    { id: 'skill-qa', name: 'Quality Assurance', category: 'operational' as const },
    { id: 'skill-fin-analysis', name: 'Financial Analysis', category: 'industry_specific' as const },
    { id: 'skill-health-it', name: 'Healthcare IT', category: 'industry_specific' as const },
  ];
  for (const skill of skills) {
    await db.insert(schema.skills).values({
      ...skill,
      proficiencyScale: '1-5',
    }).onConflictDoNothing();
  }
}

async function seedOccupations() {
  const occupations = [
    { id: 'occ-data-analyst', title: 'Data Analyst', seniorityLevel: 'junior' as const, industry: 'Technology', demandLevel: 'high' as const },
    { id: 'occ-fullstack', title: 'Full Stack Developer', seniorityLevel: 'mid' as const, industry: 'Technology', demandLevel: 'very_high' as const },
    { id: 'occ-pm', title: 'Product Manager', seniorityLevel: 'mid' as const, industry: 'Technology', demandLevel: 'high' as const },
    { id: 'occ-ml-eng', title: 'ML Engineer', seniorityLevel: 'senior' as const, industry: 'Technology', demandLevel: 'very_high' as const },
    { id: 'occ-business-analyst', title: 'Business Analyst', seniorityLevel: 'entry' as const, industry: 'Technology', demandLevel: 'medium' as const },
  ];
  for (const occ of occupations) {
    await db.insert(schema.occupations).values(occ).onConflictDoNothing();
  }
}

async function seedOccupationSkills() {
  const os = [
    // Data Analyst
    { id: 'os-da-1', occupationId: 'occ-data-analyst', skillId: 'skill-sql', requiredLevel: 4, importance: 'critical' as const, isRequired: true },
    { id: 'os-da-2', occupationId: 'occ-data-analyst', skillId: 'skill-python', requiredLevel: 3, importance: 'important' as const, isRequired: true },
    { id: 'os-da-3', occupationId: 'occ-data-analyst', skillId: 'skill-statistics', requiredLevel: 4, importance: 'critical' as const, isRequired: true },
    { id: 'os-da-4', occupationId: 'occ-data-analyst', skillId: 'skill-data-viz', requiredLevel: 4, importance: 'important' as const, isRequired: true },
    { id: 'os-da-5', occupationId: 'occ-data-analyst', skillId: 'skill-excel', requiredLevel: 3, importance: 'important' as const, isRequired: true },
    { id: 'os-da-6', occupationId: 'occ-data-analyst', skillId: 'skill-data-analysis', requiredLevel: 4, importance: 'critical' as const, isRequired: true },
    { id: 'os-da-7', occupationId: 'occ-data-analyst', skillId: 'skill-ml', requiredLevel: 2, importance: 'nice_to_have' as const, isRequired: false },
    { id: 'os-da-8', occupationId: 'occ-data-analyst', skillId: 'skill-tech-writing', requiredLevel: 2, importance: 'nice_to_have' as const, isRequired: false },

    // Full Stack Developer
    { id: 'os-fs-1', occupationId: 'occ-fullstack', skillId: 'skill-javascript', requiredLevel: 4, importance: 'critical' as const, isRequired: true },
    { id: 'os-fs-2', occupationId: 'occ-fullstack', skillId: 'skill-react', requiredLevel: 4, importance: 'critical' as const, isRequired: true },
    { id: 'os-fs-3', occupationId: 'occ-fullstack', skillId: 'skill-nodejs', requiredLevel: 4, importance: 'critical' as const, isRequired: true },
    { id: 'os-fs-4', occupationId: 'occ-fullstack', skillId: 'skill-sql', requiredLevel: 3, importance: 'important' as const, isRequired: true },
    { id: 'os-fs-5', occupationId: 'occ-fullstack', skillId: 'skill-rest-apis', requiredLevel: 4, importance: 'critical' as const, isRequired: true },
    { id: 'os-fs-6', occupationId: 'occ-fullstack', skillId: 'skill-cloud', requiredLevel: 2, importance: 'nice_to_have' as const, isRequired: false },
    { id: 'os-fs-7', occupationId: 'occ-fullstack', skillId: 'skill-agile', requiredLevel: 3, importance: 'nice_to_have' as const, isRequired: false },
    
    // Product Manager
    { id: 'os-pm-1', occupationId: 'occ-pm', skillId: 'skill-stakeholder-comm', requiredLevel: 4, importance: 'critical' as const, isRequired: true },
    { id: 'os-pm-2', occupationId: 'occ-pm', skillId: 'skill-project-plan', requiredLevel: 4, importance: 'critical' as const, isRequired: true },
    { id: 'os-pm-3', occupationId: 'occ-pm', skillId: 'skill-data-analysis', requiredLevel: 3, importance: 'important' as const, isRequired: true },
    { id: 'os-pm-4', occupationId: 'occ-pm', skillId: 'skill-presentation', requiredLevel: 4, importance: 'critical' as const, isRequired: true },
    { id: 'os-pm-5', occupationId: 'occ-pm', skillId: 'skill-sql', requiredLevel: 2, importance: 'nice_to_have' as const, isRequired: false },
    { id: 'os-pm-6', occupationId: 'occ-pm', skillId: 'skill-agile', requiredLevel: 3, importance: 'nice_to_have' as const, isRequired: false },

    // ML Engineer
    { id: 'os-ml-1', occupationId: 'occ-ml-eng', skillId: 'skill-python', requiredLevel: 5, importance: 'critical' as const, isRequired: true },
    { id: 'os-ml-2', occupationId: 'occ-ml-eng', skillId: 'skill-ml', requiredLevel: 5, importance: 'critical' as const, isRequired: true },
    { id: 'os-ml-3', occupationId: 'occ-ml-eng', skillId: 'skill-statistics', requiredLevel: 4, importance: 'important' as const, isRequired: true },
    { id: 'os-ml-4', occupationId: 'occ-ml-eng', skillId: 'skill-sql', requiredLevel: 3, importance: 'important' as const, isRequired: true },
    { id: 'os-ml-5', occupationId: 'occ-ml-eng', skillId: 'skill-cloud', requiredLevel: 3, importance: 'important' as const, isRequired: true },
    { id: 'os-ml-6', occupationId: 'occ-ml-eng', skillId: 'skill-data-viz', requiredLevel: 3, importance: 'nice_to_have' as const, isRequired: false },

    // Business Analyst
    { id: 'os-ba-1', occupationId: 'occ-business-analyst', skillId: 'skill-excel', requiredLevel: 4, importance: 'critical' as const, isRequired: true },
    { id: 'os-ba-2', occupationId: 'occ-business-analyst', skillId: 'skill-sql', requiredLevel: 3, importance: 'important' as const, isRequired: true },
    { id: 'os-ba-3', occupationId: 'occ-business-analyst', skillId: 'skill-data-analysis', requiredLevel: 3, importance: 'important' as const, isRequired: true },
    { id: 'os-ba-4', occupationId: 'occ-business-analyst', skillId: 'skill-stakeholder-comm', requiredLevel: 3, importance: 'important' as const, isRequired: true },
    { id: 'os-ba-5', occupationId: 'occ-business-analyst', skillId: 'skill-tech-writing', requiredLevel: 3, importance: 'important' as const, isRequired: true },
    { id: 'os-ba-6', occupationId: 'occ-business-analyst', skillId: 'skill-statistics', requiredLevel: 2, importance: 'nice_to_have' as const, isRequired: false },
    { id: 'os-ba-7', occupationId: 'occ-business-analyst', skillId: 'skill-data-viz', requiredLevel: 2, importance: 'nice_to_have' as const, isRequired: false },
  ];
  for (const relation of os) {
    await db.insert(schema.occupationSkills).values(relation).onConflictDoNothing();
  }

  const rel = [
    { id: 'ro-1', occupationId: 'occ-data-analyst', relatedOccupationId: 'occ-ml-eng' },
    { id: 'ro-2', occupationId: 'occ-data-analyst', relatedOccupationId: 'occ-business-analyst' },
    { id: 'ro-3', occupationId: 'occ-fullstack', relatedOccupationId: 'occ-data-analyst' },
    { id: 'ro-4', occupationId: 'occ-pm', relatedOccupationId: 'occ-business-analyst' },
  ];
  for (const r of rel) {
    await db.insert(schema.relatedOccupations).values(r).onConflictDoNothing();
  }
}

async function seedProfiles() {
  await db.insert(schema.learnerProfiles).values({
    id: 'lp-arjun',
    userId: 'user-learner',
    targetOccupationId: 'occ-data-analyst',
    highestEducation: 'Bachelors',
    yearsOfExperience: 1
  }).onConflictDoNothing();
  
  await db.insert(schema.learnerProfiles).values({
    id: 'lp-meera',
    userId: 'user-meera',
    targetOccupationId: 'occ-fullstack',
    highestEducation: 'Bachelors',
    yearsOfExperience: 2
  }).onConflictDoNothing();

  await db.insert(schema.trainerProfiles).values({
    id: 'tp-priya',
    userId: 'user-trainer',
    specialization: 'Data Science',
    yearsOfExperience: 5
  }).onConflictDoNothing();
}

async function seedCourses() {
  const coursesData = [
    { id: 'course-sql', title: 'SQL Fundamentals', level: 'beginner' as const, estimatedHours: 20, skillId: 'skill-sql', trainerId: 'user-trainer', status: 'published' as const },
    { id: 'course-py', title: 'Python for Data Analysis', level: 'beginner' as const, estimatedHours: 30, skillId: 'skill-python', trainerId: 'user-trainer', status: 'published' as const },
    { id: 'course-stat', title: 'Statistics Essentials', level: 'intermediate' as const, estimatedHours: 25, skillId: 'skill-statistics', trainerId: 'user-trainer', status: 'published' as const },
    { id: 'course-viz', title: 'Data Visualization with Charts', level: 'intermediate' as const, estimatedHours: 15, skillId: 'skill-data-viz', trainerId: 'user-trainer', status: 'published' as const },
    { id: 'course-ml', title: 'Introduction to Machine Learning', level: 'advanced' as const, estimatedHours: 40, skillId: 'skill-ml', trainerId: 'user-trainer', status: 'published' as const },
    { id: 'course-excel', title: 'Advanced Spreadsheet Analysis', level: 'beginner' as const, estimatedHours: 10, skillId: 'skill-excel', trainerId: 'user-trainer', status: 'published' as const },
  ];
  for (const c of coursesData) {
    await db.insert(schema.courses).values(c).onConflictDoNothing();
  }
}

async function seedCourseModules() {
  const modules = [
    { id: 'mod-sql-1', courseId: 'course-sql', title: 'Introduction to Databases', orderIndex: 1, contentType: 'video' as const, durationMinutes: 30 },
    { id: 'mod-sql-2', courseId: 'course-sql', title: 'Basic Queries', orderIndex: 2, contentType: 'text' as const, durationMinutes: 45 },
    { id: 'mod-sql-3', courseId: 'course-sql', title: 'Joins and Relations', orderIndex: 3, contentType: 'video' as const, durationMinutes: 60 },
  ];
  for (const m of modules) {
    await db.insert(schema.courseModules).values(m).onConflictDoNothing();
  }
}

async function seedAssessments() {
  const assts = [
    { id: 'ass-sql', title: 'SQL Assessment', skillId: 'skill-sql', createdBy: 'user-trainer', type: 'knowledge' as const, timeLimitMinutes: 30, status: 'published' as const },
    { id: 'ass-py', title: 'Python Basics Assessment', skillId: 'skill-python', createdBy: 'user-trainer', type: 'knowledge' as const, status: 'published' as const },
    { id: 'ass-stat', title: 'Statistics Assessment', skillId: 'skill-statistics', createdBy: 'user-trainer', type: 'knowledge' as const, status: 'published' as const },
    { id: 'ass-viz', title: 'Data Visualization Assessment', skillId: 'skill-data-viz', createdBy: 'user-trainer', type: 'knowledge' as const, status: 'published' as const },
    { id: 'ass-excel', title: 'Excel Assessment', skillId: 'skill-excel', createdBy: 'user-trainer', type: 'knowledge' as const, status: 'published' as const },
  ];
  for (const a of assts) {
    await db.insert(schema.assessments).values(a).onConflictDoNothing();
  }
}

async function seedQuestions() {
  const sqlQ = [
    { id: 'q-sql-1', assessmentId: 'ass-sql', questionText: 'Which SQL clause is used to filter rows?', questionType: 'multiple_choice' as const, options: JSON.stringify(['SELECT', 'WHERE', 'FROM', 'GROUP BY']), correctAnswer: 'WHERE' },
    { id: 'q-sql-2', assessmentId: 'ass-sql', questionText: 'What does JOIN do?', questionType: 'multiple_choice' as const, options: JSON.stringify(['Combines columns', 'Combines rows from two or more tables', 'Deletes tables', 'Creates a table']), correctAnswer: 'Combines rows from two or more tables' },
  ];
  const pyQ = [
    { id: 'q-py-1', assessmentId: 'ass-py', questionText: 'What is the output of print(type([]))?', questionType: 'multiple_choice' as const, options: JSON.stringify(['list', 'tuple', 'dict', 'set']), correctAnswer: 'list' },
  ];
  for (const q of [...sqlQ, ...pyQ]) {
    await db.insert(schema.questions).values(q).onConflictDoNothing();
  }
}

async function seedDemoData() {
  const comps = [
    { id: 'comp-1', userId: 'user-learner', skillId: 'skill-sql', selfReportedLevel: 3, assessedLevel: 2 },
    { id: 'comp-2', userId: 'user-learner', skillId: 'skill-python', selfReportedLevel: 2, assessedLevel: 1 },
    { id: 'comp-3', userId: 'user-learner', skillId: 'skill-statistics', selfReportedLevel: 2, assessedLevel: 1 },
    { id: 'comp-4', userId: 'user-learner', skillId: 'skill-data-viz', selfReportedLevel: 3, assessedLevel: 2 },
    { id: 'comp-5', userId: 'user-learner', skillId: 'skill-excel', selfReportedLevel: 4, assessedLevel: 3 },
  ];
  for (const c of comps) {
    await db.insert(schema.learnerCompetencies).values(c).onConflictDoNothing();
  }

  await db.insert(schema.enrollments).values({
    id: 'enr-arjun-sql',
    courseId: 'course-sql',
    userId: 'user-learner',
    progress: 60,
    status: 'in_progress' as const
  }).onConflictDoNothing();

  await db.insert(schema.assessmentAttempts).values({
    id: 'att-arjun-excel',
    assessmentId: 'ass-excel',
    userId: 'user-learner',
    score: 75,
    maxScore: 100,
    percentage: 75,
    passed: true,
    status: 'completed' as const
  }).onConflictDoNothing();

  await db.insert(schema.learningRoadmaps).values({
    id: 'rm-arjun-da',
    userId: 'user-learner',
    occupationId: 'occ-data-analyst',
    title: 'Path to Data Analyst',
    totalSteps: 7,
    completedSteps: 1
  }).onConflictDoNothing();
  
  await db.insert(schema.enrollments).values({
    id: 'enr-meera-fs',
    courseId: 'course-sql',
    userId: 'user-meera',
    progress: 20,
    status: 'in_progress' as const
  }).onConflictDoNothing();
}

async function seedNotifications() {
  const notifs = [
    { id: 'not-1', userId: 'user-learner', title: 'Welcome to ORA', message: 'Your learning journey starts here.', type: 'system' as const },
    { id: 'not-2', userId: 'user-learner', title: 'Course Update', message: 'SQL Fundamentals module 2 is available.', type: 'course' as const },
    { id: 'not-3', userId: 'user-learner', title: 'Assessment Result', message: 'You passed the Excel Assessment!', type: 'assessment' as const },
  ];
  for (const n of notifs) {
    await db.insert(schema.notifications).values(n).onConflictDoNothing();
  }
}

async function seed() {
  console.log('🌱 Seeding ORA database...');
  
  await createTables();
  
  await seedOrganizations();
  await seedDepartments();
  await seedUsers();
  await seedProfiles();
  await seedSkills();
  await seedOccupations();
  await seedOccupationSkills();
  await seedCourses();
  await seedCourseModules();
  await seedAssessments();
  await seedQuestions();
  await seedDemoData();
  await seedNotifications();
  
  console.log('✅ Seeding complete!');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
