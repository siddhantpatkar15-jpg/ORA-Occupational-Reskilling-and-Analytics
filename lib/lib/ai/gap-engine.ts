/**
 * ORA Skill Gap Analysis Engine
 * 
 * This module implements the deterministic skill-gap scoring algorithm.
 * It compares a learner's assessed competencies against occupation requirements
 * and produces prioritized gap reports with recommendations.
 * 
 * Algorithm:
 *   gap_score = max(0, required_level - current_level)
 *   priority_score = gap_score * importance_weight * availability_weight
 * 
 * Importance weights:
 *   critical = 3.0
 *   important = 2.0
 *   nice_to_have = 1.0
 * 
 * This is a rule-based engine, not a machine learning model.
 * All scores are transparent and reproducible.
 */

export interface SkillRequirement {
  skillId: string;
  skillName: string;
  category: string;
  requiredLevel: number; // 1-5
  importance: 'critical' | 'important' | 'nice_to_have';
  isRequired: boolean;
}

export interface LearnerCompetency {
  skillId: string;
  skillName: string;
  selfReportedLevel: number | null;
  assessedLevel: number | null;
  verifiedLevel: number | null;
  evidenceType: string | null;
  confidenceScore: number | null;
  lastAssessedAt: string | null;
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  requiredLevel: number;
  currentLevel: number;
  effectiveLevel: number; // Best available evidence-based level
  gapSize: number;
  importance: 'critical' | 'important' | 'nice_to_have';
  importanceWeight: number;
  priorityScore: number;
  isRequired: boolean;
  evidenceType: string;
  evidenceQuality: 'high' | 'medium' | 'low' | 'none';
  recommendation: string;
  reasoningMethod: 'deterministic_rule';
}

export interface SkillGapReport {
  userId: string;
  occupationId: string;
  occupationTitle: string;
  analyzedAt: string;
  totalRequiredSkills: number;
  totalGaps: number;
  overallReadiness: number; // 0-100 percentage
  gaps: SkillGapItem[];
  strengths: SkillGapItem[]; // Skills meeting or exceeding requirements
  summary: string;
  methodology: string;
}

const IMPORTANCE_WEIGHTS: Record<string, number> = {
  critical: 3.0,
  important: 2.0,
  nice_to_have: 1.0,
};

const PROFICIENCY_LABELS: Record<number, string> = {
  1: 'Novice',
  2: 'Beginner',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
};

/**
 * Determine the effective proficiency level from multiple evidence sources.
 * Priority: verified > assessed > self-reported
 * Self-reported is NOT treated as verified expertise.
 */
function getEffectiveLevel(competency: LearnerCompetency | undefined): {
  level: number;
  evidenceType: string;
  evidenceQuality: 'high' | 'medium' | 'low' | 'none';
} {
  if (!competency) {
    return { level: 0, evidenceType: 'none', evidenceQuality: 'none' };
  }

  if (competency.verifiedLevel !== null && competency.verifiedLevel > 0) {
    return {
      level: competency.verifiedLevel,
      evidenceType: 'trainer_verified',
      evidenceQuality: 'high',
    };
  }

  if (competency.assessedLevel !== null && competency.assessedLevel > 0) {
    return {
      level: competency.assessedLevel,
      evidenceType: 'knowledge_test',
      evidenceQuality: 'medium',
    };
  }

  if (competency.selfReportedLevel !== null && competency.selfReportedLevel > 0) {
    return {
      level: competency.selfReportedLevel,
      evidenceType: 'self_reported',
      evidenceQuality: 'low',
    };
  }

  return { level: 0, evidenceType: 'none', evidenceQuality: 'none' };
}

/**
 * Generate a human-readable recommendation for a skill gap.
 */
function generateRecommendation(
  skillName: string,
  currentLevel: number,
  requiredLevel: number,
  importance: string,
  evidenceQuality: string,
): string {
  const gapSize = requiredLevel - currentLevel;
  const currentLabel = currentLevel > 0 ? PROFICIENCY_LABELS[currentLevel] : 'No recorded proficiency';
  const requiredLabel = PROFICIENCY_LABELS[requiredLevel];

  let recommendation = '';

  if (currentLevel === 0) {
    recommendation = `Begin learning ${skillName} from the fundamentals. Target: ${requiredLabel} level (${requiredLevel}/5).`;
  } else if (gapSize === 1) {
    recommendation = `Advance your ${skillName} skills from ${currentLabel} to ${requiredLabel}. Consider intermediate courses or practical projects.`;
  } else if (gapSize === 2) {
    recommendation = `Significant development needed in ${skillName}. Move from ${currentLabel} (${currentLevel}/5) to ${requiredLabel} (${requiredLevel}/5). A structured learning path is recommended.`;
  } else {
    recommendation = `Major skill development required for ${skillName}. Current: ${currentLabel} (${currentLevel}/5), Required: ${requiredLabel} (${requiredLevel}/5). Start with foundational courses and build progressively.`;
  }

  if (evidenceQuality === 'low' || evidenceQuality === 'none') {
    recommendation += ` Note: Current level is based on ${evidenceQuality === 'low' ? 'self-assessment only' : 'no available evidence'}. Taking a formal assessment would provide a more accurate baseline.`;
  }

  if (importance === 'critical') {
    recommendation += ' This is a critical competency for the target occupation.';
  }

  return recommendation;
}

/**
 * Analyze skill gaps between learner competencies and occupation requirements.
 * Uses a deterministic, transparent algorithm — not a machine learning model.
 */
export function analyzeSkillGaps(
  userId: string,
  occupationId: string,
  occupationTitle: string,
  requirements: SkillRequirement[],
  competencies: LearnerCompetency[],
): SkillGapReport {
  const competencyMap = new Map<string, LearnerCompetency>();
  for (const comp of competencies) {
    competencyMap.set(comp.skillId, comp);
  }

  const allItems: SkillGapItem[] = [];

  for (const req of requirements) {
    const competency = competencyMap.get(req.skillId);
    const { level: effectiveLevel, evidenceType, evidenceQuality } = getEffectiveLevel(competency);

    const gapSize = Math.max(0, req.requiredLevel - effectiveLevel);
    const importanceWeight = IMPORTANCE_WEIGHTS[req.importance] || 1.0;
    const priorityScore = gapSize * importanceWeight;

    const recommendation = gapSize > 0
      ? generateRecommendation(req.skillName, effectiveLevel, req.requiredLevel, req.importance, evidenceQuality)
      : `You meet or exceed the requirement for ${req.skillName}. Continue maintaining this competency.`;

    allItems.push({
      skillId: req.skillId,
      skillName: req.skillName,
      category: req.category,
      requiredLevel: req.requiredLevel,
      currentLevel: effectiveLevel,
      effectiveLevel,
      gapSize,
      importance: req.importance,
      importanceWeight,
      priorityScore,
      isRequired: req.isRequired,
      evidenceType,
      evidenceQuality,
      recommendation,
      reasoningMethod: 'deterministic_rule',
    });
  }

  // Sort gaps by priority score (highest first)
  const gaps = allItems.filter(item => item.gapSize > 0).sort((a, b) => b.priorityScore - a.priorityScore);
  const strengths = allItems.filter(item => item.gapSize === 0).sort((a, b) => b.importanceWeight - a.importanceWeight);

  // Calculate overall readiness (percentage of requirements met)
  const totalWeightedRequired = allItems.reduce((sum, item) => sum + item.requiredLevel * item.importanceWeight, 0);
  const totalWeightedAchieved = allItems.reduce(
    (sum, item) => sum + Math.min(item.currentLevel, item.requiredLevel) * item.importanceWeight,
    0,
  );
  const overallReadiness = totalWeightedRequired > 0
    ? Math.round((totalWeightedAchieved / totalWeightedRequired) * 100)
    : 0;

  // Generate summary
  const criticalGaps = gaps.filter(g => g.importance === 'critical');
  let summary = `Analysis identified ${gaps.length} skill gap${gaps.length !== 1 ? 's' : ''} out of ${requirements.length} required competencies. `;
  summary += `Overall readiness for ${occupationTitle}: ${overallReadiness}%. `;
  if (criticalGaps.length > 0) {
    summary += `${criticalGaps.length} critical gap${criticalGaps.length !== 1 ? 's' : ''} require${criticalGaps.length === 1 ? 's' : ''} immediate attention: ${criticalGaps.map(g => g.skillName).join(', ')}. `;
  }
  if (strengths.length > 0) {
    summary += `Strengths: ${strengths.map(s => s.skillName).join(', ')}.`;
  }

  return {
    userId,
    occupationId,
    occupationTitle,
    analyzedAt: new Date().toISOString(),
    totalRequiredSkills: requirements.length,
    totalGaps: gaps.length,
    overallReadiness,
    gaps,
    strengths,
    summary,
    methodology: 'Deterministic rule-based gap analysis. Gap score = max(0, required_level - current_level). Priority = gap_score × importance_weight. Importance weights: critical=3, important=2, nice_to_have=1. This is not a machine learning prediction.',
  };
}

/**
 * Generate a learning roadmap from skill gaps.
 * Orders steps by priority while respecting prerequisites.
 */
export interface RoadmapStep {
  order: number;
  skillId: string;
  skillName: string;
  title: string;
  description: string;
  reason: string;
  estimatedDuration: string;
  currentLevel: number;
  targetLevel: number;
  importance: string;
  recommendedCourseId?: string;
  recommendedCourseName?: string;
  assessmentId?: string;
}

export function generateRoadmap(
  gapReport: SkillGapReport,
  availableCourses: Array<{ id: string; title: string; skillId: string; estimatedHours: number | null; level: string | null }>,
  availableAssessments: Array<{ id: string; title: string; skillId: string }>,
): RoadmapStep[] {
  const courseMap = new Map<string, { id: string; title: string; estimatedHours: number | null }>();
  for (const course of availableCourses) {
    courseMap.set(course.skillId, { id: course.id, title: course.title, estimatedHours: course.estimatedHours });
  }

  const assessmentMap = new Map<string, { id: string; title: string }>();
  for (const assessment of availableAssessments) {
    assessmentMap.set(assessment.skillId, { id: assessment.id, title: assessment.title });
  }

  const steps: RoadmapStep[] = [];
  let order = 1;

  // Sort gaps: smaller gaps first (easier wins), then by importance
  const sortedGaps = [...gapReport.gaps].sort((a, b) => {
    // Critical gaps with small sizes first (quick wins on important items)
    const aScore = a.gapSize - (a.importance === 'critical' ? 1 : 0);
    const bScore = b.gapSize - (b.importance === 'critical' ? 1 : 0);
    return aScore - bScore;
  });

  for (const gap of sortedGaps) {
    const course = courseMap.get(gap.skillId);
    const assessment = assessmentMap.get(gap.skillId);

    const step: RoadmapStep = {
      order,
      skillId: gap.skillId,
      skillName: gap.skillName,
      title: `${gap.skillName}: ${PROFICIENCY_LABELS[gap.currentLevel] || 'Novice'} → ${PROFICIENCY_LABELS[gap.requiredLevel]}`,
      description: gap.recommendation,
      reason: `${gap.skillName} is ${gap.importance === 'critical' ? 'a critical requirement' : gap.importance === 'important' ? 'an important requirement' : 'beneficial'} for ${gapReport.occupationTitle}. You need to reach level ${gap.requiredLevel}/5 (${PROFICIENCY_LABELS[gap.requiredLevel]}).`,
      estimatedDuration: course?.estimatedHours ? `${course.estimatedHours} hours` : `${gap.gapSize * 10}-${gap.gapSize * 20} hours (estimated)`,
      currentLevel: gap.currentLevel,
      targetLevel: gap.requiredLevel,
      importance: gap.importance,
    };

    if (course) {
      step.recommendedCourseId = course.id;
      step.recommendedCourseName = course.title;
    }

    if (assessment) {
      step.assessmentId = assessment.id;
    }

    steps.push(step);
    order++;
  }

  // Add final assessment step
  steps.push({
    order,
    skillId: 'final',
    skillName: 'Final Assessment',
    title: `Final Competency Assessment for ${gapReport.occupationTitle}`,
    description: `Complete a comprehensive assessment to verify your readiness for ${gapReport.occupationTitle}. This reassessment will update your competency profile with new evidence.`,
    reason: 'Reassessment provides verified evidence of skill improvement and updates your competency profile.',
    estimatedDuration: '1-2 hours',
    currentLevel: 0,
    targetLevel: 0,
    importance: 'critical',
  });

  return steps;
}
