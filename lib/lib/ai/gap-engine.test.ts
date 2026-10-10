import { describe, it, expect } from 'vitest';
import { analyzeSkillGaps, generateRoadmap, SkillRequirement, LearnerCompetency } from './gap-engine';

describe('Skill Gap Analysis Engine (Deterministic Algorithm)', () => {
  const mockRequirements: SkillRequirement[] = [
    {
      skillId: 'skill-sql',
      skillName: 'SQL',
      category: 'technical',
      requiredLevel: 4,
      importance: 'critical',
      isRequired: true,
    },
    {
      skillId: 'skill-python',
      skillName: 'Python',
      category: 'technical',
      requiredLevel: 3,
      importance: 'important',
      isRequired: true,
    },
    {
      skillId: 'skill-stats',
      skillName: 'Statistics',
      category: 'analytical',
      requiredLevel: 4,
      importance: 'critical',
      isRequired: true,
    },
    {
      skillId: 'skill-excel',
      skillName: 'Excel / Spreadsheets',
      category: 'digital',
      requiredLevel: 3,
      importance: 'nice_to_have',
      isRequired: false,
    },
  ];

  it('calculates correct gap sizes and priority scores with assessed levels', () => {
    const mockCompetencies: LearnerCompetency[] = [
      {
        skillId: 'skill-sql',
        skillName: 'SQL',
        selfReportedLevel: 3,
        assessedLevel: 2, // effective level should be 2 because assessed > selfReported
        verifiedLevel: null,
        evidenceType: 'knowledge_test',
        confidenceScore: 0.8,
        lastAssessedAt: '2026-10-01',
      },
      {
        skillId: 'skill-python',
        skillName: 'Python',
        selfReportedLevel: 1,
        assessedLevel: null,
        verifiedLevel: null,
        evidenceType: 'self_reported',
        confidenceScore: 0.3,
        lastAssessedAt: null,
      },
      {
        skillId: 'skill-excel',
        skillName: 'Excel / Spreadsheets',
        selfReportedLevel: 5,
        assessedLevel: 4,
        verifiedLevel: 4, // exceeds requiredLevel (3)
        evidenceType: 'trainer_verified',
        confidenceScore: 1.0,
        lastAssessedAt: '2026-10-05',
      },
    ];

    const report = analyzeSkillGaps(
      'user-1',
      'occ-da',
      'Data Analyst',
      mockRequirements,
      mockCompetencies,
    );

    expect(report.totalRequiredSkills).toBe(4);
    // SQL gap: 4 - 2 = 2. Importance critical (weight 3.0). Priority: 2 * 3 = 6.0
    // Python gap: 3 - 1 = 2. Importance important (weight 2.0). Priority: 2 * 2 = 4.0
    // Stats gap: 4 - 0 = 4. Importance critical (weight 3.0). Priority: 4 * 3 = 12.0
    // Excel gap: max(0, 3 - 4) = 0. Strengths!
    expect(report.gaps.length).toBe(3);
    expect(report.strengths.length).toBe(1);

    const statsGap = report.gaps.find(g => g.skillId === 'skill-stats');
    expect(statsGap).toBeDefined();
    expect(statsGap?.gapSize).toBe(4);
    expect(statsGap?.priorityScore).toBe(12.0);

    const sqlGap = report.gaps.find(g => g.skillId === 'skill-sql');
    expect(sqlGap).toBeDefined();
    expect(sqlGap?.gapSize).toBe(2);
    expect(sqlGap?.effectiveLevel).toBe(2);
    expect(sqlGap?.priorityScore).toBe(6.0);

    // Strengths should include Excel
    const excelStrength = report.strengths.find(s => s.skillId === 'skill-excel');
    expect(excelStrength).toBeDefined();
    expect(excelStrength?.gapSize).toBe(0);

    // Priority ordering: highest priority first (Stats = 12, SQL = 6, Python = 4)
    expect(report.gaps[0].skillId).toBe('skill-stats');
    expect(report.gaps[1].skillId).toBe('skill-sql');
    expect(report.gaps[2].skillId).toBe('skill-python');
  });

  it('generates sequential roadmap steps with courses and assessments', () => {
    const report = analyzeSkillGaps('user-1', 'occ-da', 'Data Analyst', mockRequirements, []);
    const availableCourses = [
      { id: 'course-sql', title: 'SQL Fundamentals', skillId: 'skill-sql', estimatedHours: 20, level: 'beginner' },
      { id: 'course-stats', title: 'Statistics for Analysis', skillId: 'skill-stats', estimatedHours: 25, level: 'intermediate' },
    ];
    const availableAssessments = [
      { id: 'asm-sql', title: 'SQL Assessment', skillId: 'skill-sql' },
      { id: 'asm-stats', title: 'Stats Assessment', skillId: 'skill-stats' },
    ];

    const steps = generateRoadmap(report, availableCourses, availableAssessments);
    expect(steps.length).toBeGreaterThan(0);
    // Last step should be final assessment
    expect(steps[steps.length - 1].skillId).toBe('final');
  });
});
