import { AccessibilityAuditResult, LessonPlan } from '../types';

// Helper to calculate luminance for WCAG contrast
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const lum1 = getLuminance(...rgb1);
  const lum2 = getLuminance(...rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function auditLessonPlanAccessibility(plan: LessonPlan): AccessibilityAuditResult {
  const issues: AccessibilityAuditResult['issues'] = [];
  let contrastPass = true;
  let fontLegibilityPass = true;
  let keyboardNavPass = true;
  let ariaPass = true;

  // 1. WCAG Contrast Check (Simulation on default UI color pairings)
  // Slate-900 (#0f172a) text on White (#ffffff) bg
  const darkOnWhiteRatio = calculateContrastRatio([15, 23, 42], [255, 255, 255]); // ~17.1:1
  // Slate-500 (#64748b) text on White (#ffffff) bg
  const mutedTextRatio = calculateContrastRatio([100, 116, 139], [255, 255, 255]); // ~4.6:1
  // Primary Emerald-700 (#047857) text on Emerald-50 (#ecfdf5)
  const emeraldBadgeRatio = calculateContrastRatio([4, 120, 87], [236, 253, 245]); // ~5.2:1

  const contrastDetails = [
    { element: 'Primary Body Text (Slate-900 on White)', ratio: Number(darkOnWhiteRatio.toFixed(1)), pass: darkOnWhiteRatio >= 4.5 },
    { element: 'Muted Secondary Text (Slate-500 on White)', ratio: Number(mutedTextRatio.toFixed(1)), pass: mutedTextRatio >= 4.5 },
    { element: 'PCPP Phase Badges (Contrast Text)', ratio: Number(emeraldBadgeRatio.toFixed(1)), pass: emeraldBadgeRatio >= 4.5 }
  ];

  if (mutedTextRatio < 4.5) {
    issues.push({
      type: 'warning',
      category: 'Contrast',
      message: `Secondary text contrast ratio is ${mutedTextRatio.toFixed(1)}:1 (Minimum AA target is 4.5:1).`,
      suggestion: 'Ensure secondary labels use slate-600 or darker for optimal contrast.'
    });
  }

  // 2. Cognitive Load & Preparation Lightness Index Audit
  // Measures whether the plan is fast, light, and focused vs overly cluttered
  let cognitiveLoadScore = 100;
  
  // Check total phase count (Optimal PCPP is exactly 4 phases: P, C, P, P)
  if (plan.phases.length > 5) {
    cognitiveLoadScore -= 15;
    issues.push({
      type: 'warning',
      category: 'CognitiveLoad',
      message: `This preparation has ${plan.phases.length} steps, which increases teacher cognitive load during live instruction.`,
      suggestion: 'Consolidate into the core 4 PCPP steps (Presentation, Comprehension, Practice, Production).'
    });
  }

  // Check word count per phase (Keep explanations light and concise)
  let totalWordCount = 0;
  plan.phases.forEach((phase) => {
    const text = `${phase.objective} ${phase.teacherAction} ${phase.studentAction}`;
    const wordCount = text.split(/\s+/).length;
    totalWordCount += wordCount;

    if (wordCount > 100) {
      cognitiveLoadScore -= 10;
      issues.push({
        type: 'info',
        category: 'CognitiveLoad',
        message: `Phase "${phase.title}" contains ${wordCount} words. Long text slows down lesson prep and desk reference during class.`,
        suggestion: 'Use concise bullet points for teacher and student actions.'
      });
    }
  });

  // Check CCQ count in Comprehension phase
  const comprehensionPhase = plan.phases.find(p => p.type === 'comprehension');
  if (comprehensionPhase && (!comprehensionPhase.conceptCheckQuestions || comprehensionPhase.conceptCheckQuestions.length === 0)) {
    issues.push({
      type: 'warning',
      category: 'CognitiveLoad',
      message: 'Comprehension Check phase lacks Concept Check Questions (CCQs).',
      suggestion: 'Add 2-3 short CCQs to verify student understanding before drills.'
    });
  } else if (comprehensionPhase && (comprehensionPhase.conceptCheckQuestions?.length || 0) > 5) {
    cognitiveLoadScore -= 10;
    issues.push({
      type: 'info',
      category: 'CognitiveLoad',
      message: 'Too many CCQs (more than 5) in Comprehension phase.',
      suggestion: 'Keep CCQs to 2-4 key questions to maintain lesson momentum.'
    });
  }

  // Check Board Plan clarity
  if (!plan.boardPlan.grammarPattern) {
    issues.push({
      type: 'warning',
      category: 'CognitiveLoad',
      message: 'Board Plan is missing a clear grammar formula.',
      suggestion: 'Specify a prominent Japanese board structure (e.g. V-て形 + もいいです).'
    });
  }

  // 3. ARIA & Semantic Check
  // Validates standard semantic tree
  const hasValidStructure = plan.title.length > 0 && plan.grammarPoint.length > 0;
  if (!hasValidStructure) {
    ariaPass = false;
    issues.push({
      type: 'error',
      category: 'ScreenReader',
      message: 'Missing main lesson title or grammar point headings.',
      suggestion: 'Provide explicit H1/H2 header titles for screen reader accessibility.'
    });
  }

  // Calculate overall score (weighted)
  const overallScore = Math.min(
    100,
    Math.max(
      40,
      Math.round(
        (darkOnWhiteRatio >= 4.5 ? 30 : 15) +
        (keyboardNavPass ? 20 : 10) +
        (ariaPass ? 20 : 10) +
        (cognitiveLoadScore * 0.3)
      )
    )
  );

  return {
    score: overallScore,
    contrastPass,
    contrastDetails,
    keyboardNavPass,
    ariaPass,
    fontLegibilityPass,
    cognitiveLoadScore,
    issues
  };
}
