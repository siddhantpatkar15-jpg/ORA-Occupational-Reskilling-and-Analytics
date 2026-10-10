import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['learner', 'trainer', 'admin', 'super_admin'] }).notNull().default('learner'),
  organizationId: text('organization_id').references(() => organizations.id),
  departmentId: text('department_id').references((): any => departments.id),
  status: text('status', { enum: ['active', 'inactive', 'pending'] }).notNull().default('active'),
  language: text('language').notNull().default('en'),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
  bio: text('bio'),
  onboardingCompleted: integer('onboarding_completed', { mode: 'boolean' }).notNull().default(false),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Organizations
export const organizations = sqliteTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  industry: text('industry'),
  size: text('size'),
  logoUrl: text('logo_url'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Departments
export const departments = sqliteTable('departments', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  organizationId: text('organization_id').notNull().references(() => organizations.id),
  managerId: text('manager_id').references((): any => users.id),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

// Learner Profiles (extended profile data)
export const learnerProfiles = sqliteTable('learner_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id).unique(),
  highestEducation: text('highest_education'),
  fieldOfStudy: text('field_of_study'),
  yearsOfExperience: integer('years_of_experience'),
  currentJobTitle: text('current_job_title'),
  targetOccupationId: text('target_occupation_id').references(() => occupations.id),
  careerGoals: text('career_goals'),
  resumeUrl: text('resume_url'),
  linkedinUrl: text('linkedin_url'),
  profileCompleteness: integer('profile_completeness').notNull().default(0),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Trainer Profiles  
export const trainerProfiles = sqliteTable('trainer_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id).unique(),
  specialization: text('specialization'),
  qualifications: text('qualifications'),
  yearsOfExperience: integer('years_of_experience'),
  certifications: text('certifications'),
  maxLearners: integer('max_learners').default(50),
  rating: real('rating').default(0),
  totalReviews: integer('total_reviews').default(0),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Occupations
export const occupations = sqliteTable('occupations', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  industry: text('industry'),
  seniorityLevel: text('seniority_level', { enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'] }),
  averageSalaryRange: text('average_salary_range'),
  demandLevel: text('demand_level', { enum: ['low', 'medium', 'high', 'very_high'] }),
  dataSource: text('data_source').default('Illustrative sample data'),
  lastReviewed: text('last_reviewed'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Skills
export const skills = sqliteTable('skills', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category', { enum: ['technical', 'digital', 'analytical', 'communication', 'leadership', 'problem_solving', 'operational', 'industry_specific'] }).notNull(),
  proficiencyScale: text('proficiency_scale').notNull().default('1-5'),
  assessmentMethod: text('assessment_method'),
  evidenceRequirements: text('evidence_requirements'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Related Skills
export const relatedSkills = sqliteTable('related_skills', {
  id: text('id').primaryKey(),
  skillId: text('skill_id').notNull().references(() => skills.id),
  relatedSkillId: text('related_skill_id').notNull().references(() => skills.id),
  relationshipType: text('relationship_type', { enum: ['prerequisite', 'complementary', 'alternative'] }).notNull(),
});

// Occupation Skills (what skills an occupation requires)
export const occupationSkills = sqliteTable('occupation_skills', {
  id: text('id').primaryKey(),
  occupationId: text('occupation_id').notNull().references(() => occupations.id),
  skillId: text('skill_id').notNull().references(() => skills.id),
  requiredLevel: integer('required_level').notNull(), // 1-5
  importance: text('importance', { enum: ['critical', 'important', 'nice_to_have'] }).notNull(),
  isRequired: integer('is_required', { mode: 'boolean' }).notNull().default(true),
});

// Related Occupations
export const relatedOccupations = sqliteTable('related_occupations', {
  id: text('id').primaryKey(),
  occupationId: text('occupation_id').notNull().references(() => occupations.id),
  relatedOccupationId: text('related_occupation_id').notNull().references(() => occupations.id),
});

// Assessments
export const assessments = sqliteTable('assessments', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  skillId: text('skill_id').notNull().references(() => skills.id),
  createdBy: text('created_by').notNull().references(() => users.id),
  organizationId: text('organization_id').references(() => organizations.id),
  type: text('type', { enum: ['knowledge', 'practical', 'self_assessment', 'scenario'] }).notNull(),
  timeLimitMinutes: integer('time_limit_minutes'),
  passingScore: integer('passing_score').default(60),
  maxAttempts: integer('max_attempts').default(3),
  difficultyLevel: text('difficulty_level', { enum: ['beginner', 'intermediate', 'advanced'] }),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
  totalQuestions: integer('total_questions').default(0),
  totalPoints: integer('total_points').default(0),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Questions
export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  assessmentId: text('assessment_id').notNull().references(() => assessments.id),
  questionText: text('question_text').notNull(),
  questionType: text('question_type', { enum: ['multiple_choice', 'scenario', 'self_assessment', 'practical'] }).notNull(),
  options: text('options'), // JSON array
  correctAnswer: text('correct_answer'),
  explanation: text('explanation'),
  difficulty: integer('difficulty').notNull().default(1), // 1-3
  points: integer('points').notNull().default(10),
  orderIndex: integer('order_index').notNull().default(0),
  skillId: text('skill_id').references(() => skills.id),
});

// Assessment Attempts
export const assessmentAttempts = sqliteTable('assessment_attempts', {
  id: text('id').primaryKey(),
  assessmentId: text('assessment_id').notNull().references(() => assessments.id),
  userId: text('user_id').notNull().references(() => users.id),
  score: integer('score'),
  maxScore: integer('max_score'),
  percentage: real('percentage'),
  passed: integer('passed', { mode: 'boolean' }),
  status: text('status', { enum: ['in_progress', 'completed', 'abandoned'] }).notNull().default('in_progress'),
  startedAt: text('started_at').notNull().default(sql`(datetime('now'))`),
  completedAt: text('completed_at'),
  timeSpentSeconds: integer('time_spent_seconds'),
});

// Assessment Responses  
export const assessmentResponses = sqliteTable('assessment_responses', {
  id: text('id').primaryKey(),
  attemptId: text('attempt_id').notNull().references(() => assessmentAttempts.id),
  questionId: text('question_id').notNull().references(() => questions.id),
  answer: text('answer'),
  isCorrect: integer('is_correct', { mode: 'boolean' }),
  pointsEarned: integer('points_earned').default(0),
});

// Learner Competencies (the competency profile)
export const learnerCompetencies = sqliteTable('learner_competencies', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  skillId: text('skill_id').notNull().references(() => skills.id),
  selfReportedLevel: integer('self_reported_level'), // 1-5
  assessedLevel: integer('assessed_level'), // 1-5
  verifiedLevel: integer('verified_level'), // 1-5
  evidenceType: text('evidence_type', { enum: ['self_reported', 'knowledge_test', 'practical_demo', 'trainer_verified', 'imported'] }),
  evidenceUrl: text('evidence_url'),
  confidenceScore: real('confidence_score'), // 0-1
  lastAssessedAt: text('last_assessed_at'),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Competency Evidence
export const competencyEvidence = sqliteTable('competency_evidence', {
  id: text('id').primaryKey(),
  competencyId: text('competency_id').notNull().references(() => learnerCompetencies.id),
  type: text('type', { enum: ['assessment_result', 'project', 'certification', 'trainer_review', 'self_report'] }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  fileUrl: text('file_url'),
  verifiedBy: text('verified_by').references(() => users.id),
  verifiedAt: text('verified_at'),
  status: text('status', { enum: ['pending', 'verified', 'rejected'] }).notNull().default('pending'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

// Courses
export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  skillId: text('skill_id').references(() => skills.id),
  trainerId: text('trainer_id').references(() => users.id),
  organizationId: text('organization_id').references(() => organizations.id),
  category: text('category'),
  level: text('level', { enum: ['beginner', 'intermediate', 'advanced'] }),
  estimatedHours: integer('estimated_hours'),
  thumbnailUrl: text('thumbnail_url'),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
  enrollmentCount: integer('enrollment_count').default(0),
  rating: real('rating').default(0),
  totalReviews: integer('total_reviews').default(0),
  completionCriteria: text('completion_criteria'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Course Modules
export const courseModules = sqliteTable('course_modules', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => courses.id),
  title: text('title').notNull(),
  description: text('description'),
  orderIndex: integer('order_index').notNull().default(0),
  contentType: text('content_type', { enum: ['text', 'video', 'pdf', 'assignment', 'quiz'] }),
  content: text('content'),
  resourceUrl: text('resource_url'),
  durationMinutes: integer('duration_minutes'),
  isRequired: integer('is_required', { mode: 'boolean' }).notNull().default(true),
});

// Enrollments
export const enrollments = sqliteTable('enrollments', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => courses.id),
  userId: text('user_id').notNull().references(() => users.id),
  progress: integer('progress').notNull().default(0), // 0-100
  status: text('status', { enum: ['enrolled', 'in_progress', 'completed', 'dropped'] }).notNull().default('enrolled'),
  enrolledAt: text('enrolled_at').notNull().default(sql`(datetime('now'))`),
  completedAt: text('completed_at'),
  lastAccessedAt: text('last_accessed_at'),
});

// Module Progress
export const moduleProgress = sqliteTable('module_progress', {
  id: text('id').primaryKey(),
  enrollmentId: text('enrollment_id').notNull().references(() => enrollments.id),
  moduleId: text('module_id').notNull().references(() => courseModules.id),
  status: text('status', { enum: ['not_started', 'in_progress', 'completed'] }).notNull().default('not_started'),
  completedAt: text('completed_at'),
});

// Learning Roadmaps
export const learningRoadmaps = sqliteTable('learning_roadmaps', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  occupationId: text('occupation_id').notNull().references(() => occupations.id),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { enum: ['active', 'completed', 'paused', 'abandoned'] }).notNull().default('active'),
  totalSteps: integer('total_steps').default(0),
  completedSteps: integer('completed_steps').default(0),
  estimatedWeeks: integer('estimated_weeks'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Roadmap Steps
export const roadmapSteps = sqliteTable('roadmap_steps', {
  id: text('id').primaryKey(),
  roadmapId: text('roadmap_id').notNull().references(() => learningRoadmaps.id),
  skillId: text('skill_id').notNull().references(() => skills.id),
  courseId: text('course_id').references(() => courses.id),
  assessmentId: text('assessment_id').references(() => assessments.id),
  stepOrder: integer('step_order').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  reason: text('reason'),
  estimatedDuration: text('estimated_duration'),
  prerequisiteStepId: text('prerequisite_step_id'),
  status: text('status', { enum: ['locked', 'available', 'in_progress', 'completed', 'skipped'] }).notNull().default('locked'),
  completedAt: text('completed_at'),
});

// Trainer-Learner assignments
export const trainerAssignments = sqliteTable('trainer_assignments', {
  id: text('id').primaryKey(),
  trainerId: text('trainer_id').notNull().references(() => users.id),
  learnerId: text('learner_id').notNull().references(() => users.id),
  status: text('status', { enum: ['active', 'completed', 'cancelled'] }).notNull().default('active'),
  assignedAt: text('assigned_at').notNull().default(sql`(datetime('now'))`),
  notes: text('notes'),
});

// Course Feedback
export const courseFeedback = sqliteTable('course_feedback', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => courses.id),
  userId: text('user_id').notNull().references(() => users.id),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

// Certificates
export const certificates = sqliteTable('certificates', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  courseId: text('course_id').references(() => courses.id),
  assessmentId: text('assessment_id').references(() => assessments.id),
  certificateNumber: text('certificate_number').notNull().unique(),
  title: text('title').notNull(),
  issuingOrganization: text('issuing_organization'),
  verificationStatus: text('verification_status', { enum: ['valid', 'revoked', 'expired'] }).notNull().default('valid'),
  issuedAt: text('issued_at').notNull().default(sql`(datetime('now'))`),
  expiresAt: text('expires_at'),
});

// Notifications
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type', { enum: ['info', 'success', 'warning', 'course', 'assessment', 'feedback', 'system'] }).notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  link: text('link'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

// Audit Logs
export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  resourceType: text('resource_type').notNull(),
  resourceId: text('resource_id'),
  details: text('details'),
  ipAddress: text('ip_address'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

// Relations

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
  learnerProfile: one(learnerProfiles, {
    fields: [users.id],
    references: [learnerProfiles.userId],
  }),
  trainerProfile: one(trainerProfiles, {
    fields: [users.id],
    references: [trainerProfiles.userId],
  }),
  learnerCompetencies: many(learnerCompetencies),
  enrollments: many(enrollments),
  learningRoadmaps: many(learningRoadmaps),
  certificates: many(certificates),
  notifications: many(notifications),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  departments: many(departments),
  courses: many(courses),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [departments.organizationId],
    references: [organizations.id],
  }),
  users: many(users),
}));

export const learnerProfilesRelations = relations(learnerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [learnerProfiles.userId],
    references: [users.id],
  }),
  targetOccupation: one(occupations, {
    fields: [learnerProfiles.targetOccupationId],
    references: [occupations.id],
  }),
}));

export const trainerProfilesRelations = relations(trainerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [trainerProfiles.userId],
    references: [users.id],
  }),
}));

export const occupationsRelations = relations(occupations, ({ many }) => ({
  skills: many(occupationSkills),
  roadmaps: many(learningRoadmaps),
}));

export const skillsRelations = relations(skills, ({ many }) => ({
  occupationSkills: many(occupationSkills),
  competencies: many(learnerCompetencies),
  courses: many(courses),
  assessments: many(assessments),
}));

export const occupationSkillsRelations = relations(occupationSkills, ({ one }) => ({
  occupation: one(occupations, {
    fields: [occupationSkills.occupationId],
    references: [occupations.id],
  }),
  skill: one(skills, {
    fields: [occupationSkills.skillId],
    references: [skills.id],
  }),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  skill: one(skills, {
    fields: [assessments.skillId],
    references: [skills.id],
  }),
  creator: one(users, {
    fields: [assessments.createdBy],
    references: [users.id],
  }),
  questions: many(questions),
  attempts: many(assessmentAttempts),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  assessment: one(assessments, {
    fields: [questions.assessmentId],
    references: [assessments.id],
  }),
  skill: one(skills, {
    fields: [questions.skillId],
    references: [skills.id],
  }),
}));

export const assessmentAttemptsRelations = relations(assessmentAttempts, ({ one, many }) => ({
  assessment: one(assessments, {
    fields: [assessmentAttempts.assessmentId],
    references: [assessments.id],
  }),
  user: one(users, {
    fields: [assessmentAttempts.userId],
    references: [users.id],
  }),
  responses: many(assessmentResponses),
}));

export const assessmentResponsesRelations = relations(assessmentResponses, ({ one }) => ({
  attempt: one(assessmentAttempts, {
    fields: [assessmentResponses.attemptId],
    references: [assessmentAttempts.id],
  }),
  question: one(questions, {
    fields: [assessmentResponses.questionId],
    references: [questions.id],
  }),
}));

export const learnerCompetenciesRelations = relations(learnerCompetencies, ({ one, many }) => ({
  user: one(users, {
    fields: [learnerCompetencies.userId],
    references: [users.id],
  }),
  skill: one(skills, {
    fields: [learnerCompetencies.skillId],
    references: [skills.id],
  }),
  evidence: many(competencyEvidence),
}));

export const competencyEvidenceRelations = relations(competencyEvidence, ({ one }) => ({
  competency: one(learnerCompetencies, {
    fields: [competencyEvidence.competencyId],
    references: [learnerCompetencies.id],
  }),
  verifier: one(users, {
    fields: [competencyEvidence.verifiedBy],
    references: [users.id],
  }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  skill: one(skills, {
    fields: [courses.skillId],
    references: [skills.id],
  }),
  trainer: one(users, {
    fields: [courses.trainerId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [courses.organizationId],
    references: [organizations.id],
  }),
  modules: many(courseModules),
  enrollments: many(enrollments),
  feedback: many(courseFeedback),
}));

export const courseModulesRelations = relations(courseModules, ({ one }) => ({
  course: one(courses, {
    fields: [courseModules.courseId],
    references: [courses.id],
  }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one, many }) => ({
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  moduleProgress: many(moduleProgress),
}));

export const moduleProgressRelations = relations(moduleProgress, ({ one }) => ({
  enrollment: one(enrollments, {
    fields: [moduleProgress.enrollmentId],
    references: [enrollments.id],
  }),
  module: one(courseModules, {
    fields: [moduleProgress.moduleId],
    references: [courseModules.id],
  }),
}));

export const learningRoadmapsRelations = relations(learningRoadmaps, ({ one, many }) => ({
  user: one(users, {
    fields: [learningRoadmaps.userId],
    references: [users.id],
  }),
  occupation: one(occupations, {
    fields: [learningRoadmaps.occupationId],
    references: [occupations.id],
  }),
  steps: many(roadmapSteps),
}));

export const roadmapStepsRelations = relations(roadmapSteps, ({ one }) => ({
  roadmap: one(learningRoadmaps, {
    fields: [roadmapSteps.roadmapId],
    references: [learningRoadmaps.id],
  }),
  skill: one(skills, {
    fields: [roadmapSteps.skillId],
    references: [skills.id],
  }),
  course: one(courses, {
    fields: [roadmapSteps.courseId],
    references: [courses.id],
  }),
  assessment: one(assessments, {
    fields: [roadmapSteps.assessmentId],
    references: [assessments.id],
  }),
}));

export const trainerAssignmentsRelations = relations(trainerAssignments, ({ one }) => ({
  trainer: one(users, {
    fields: [trainerAssignments.trainerId],
    references: [users.id],
  }),
  learner: one(users, {
    fields: [trainerAssignments.learnerId],
    references: [users.id],
  }),
}));

export const courseFeedbackRelations = relations(courseFeedback, ({ one }) => ({
  course: one(courses, {
    fields: [courseFeedback.courseId],
    references: [courses.id],
  }),
  user: one(users, {
    fields: [courseFeedback.userId],
    references: [users.id],
  }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
  user: one(users, {
    fields: [certificates.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [certificates.courseId],
    references: [courses.id],
  }),
  assessment: one(assessments, {
    fields: [certificates.assessmentId],
    references: [assessments.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// Backward compatibility aliases (snake_case to camelCase)
export const learner_profiles = learnerProfiles;
export const trainer_profiles = trainerProfiles;
export const related_skills = relatedSkills;
export const occupation_skills = occupationSkills;
export const related_occupations = relatedOccupations;
export const assessment_attempts = assessmentAttempts;
export const assessment_responses = assessmentResponses;
export const learner_competencies = learnerCompetencies;
export const competency_evidence = competencyEvidence;
export const course_modules = courseModules;
export const course_enrollments = enrollments;
export const module_progress = moduleProgress;
export const learning_roadmaps = learningRoadmaps;
export const roadmap_steps = roadmapSteps;
export const trainer_assignments = trainerAssignments;
export const course_feedback = courseFeedback;
export const audit_logs = auditLogs;
export const assessment_questions = questions;
