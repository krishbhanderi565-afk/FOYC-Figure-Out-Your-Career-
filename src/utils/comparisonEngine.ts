import { CareerComparisonReport, CareerComparisonReportSchema, DEFAULT_DIMENSIONS } from '../types/comparison';

export interface ComparisonInput {
  paths: { title: string; category?: string; notes?: string }[];
  currentBackground: string;
  primaryGoal: string;
  timelineMonths: number;
  selectedDimensions: string[];
  constraints: string;
}

export function generateComparisonPrompt(input: ComparisonInput): string {
  const pathList = input.paths.map((p, idx) => `${idx + 1}. **${p.title}** ${p.notes ? `(${p.notes})` : ''}`).join('\n');
  const dimensionsList = DEFAULT_DIMENSIONS
    .filter(d => input.selectedDimensions.includes(d.id))
    .map(d => `- **${d.label}**: ${d.description}`)
    .join('\n');

  return `### SYSTEM ROLE: FOYC CAREER COMPARISON & DECISION STRATEGIST

You are acting as an objective, world-class Career Decision Strategist for FOYC (Figure Out Your Career).
Your goal is to conduct a rigorous, zero-fluff comparison between ${input.paths.length} distinct career trajectories for the user.

---
### USER CONTEXT & BACKGROUND:
- **Current Background & Skills:** ${input.currentBackground || 'Not specified'}
- **Primary Career Ambition / Goal:** ${input.primaryGoal || 'Career pivot & financial clarity'}
- **Target Time Horizon:** ${input.timelineMonths || 12} months
- **Personal Constraints:** ${input.constraints || 'Standard work-life commitments'}

### PATHS TO COMPARE:
${pathList}

### EVALUATION DIMENSIONS:
${dimensionsList || '- Speed to income, AI resilience, learning curve, work-life balance, remote flexibility'}

---
### YOUR TASK:
1. Conduct an honest side-by-side trade-off analysis of the paths above.
2. Evaluate real friction points, break-even periods, and AI obsolescence risks.
3. Recommend the optimal path with highest probability of success given their context.
4. Output your analysis formatted strictly in the following JSON block for FOYC handoff.

\`\`\`json
{
  "version": "1.0",
  "executiveSummary": "A concise 2-3 sentence strategic takeaway comparing the alternatives.",
  "comparedPaths": [
    ${input.paths.map(p => `{
      "title": "${p.title}",
      "category": "Career Domain",
      "timeHorizon": "6-12 months",
      "summary": "Clear, objective overview of this path.",
      "scores": {
        "income_speed": 7,
        "ai_resilience": 8,
        "learning_curve": 6,
        "work_life_balance": 7,
        "remote_flexibility": 8,
        "capital_required": 3
      },
      "pros": ["Major advantage 1", "Major advantage 2"],
      "cons": ["Primary risk 1", "Downside 2"],
      "breakEvenMonths": 6,
      "bestFitIf": "You excel at independent problem-solving and want faster income."
    }`).join(',\n    ')}
  ],
  "recommendation": {
    "primaryPathTitle": "${input.paths[0]?.title || 'Path 1'}",
    "confidenceScore": 85,
    "strategicRationale": "Detailed justification why this path represents the highest risk-adjusted payoff for the user.",
    "secondaryPathTitle": "${input.paths[1]?.title || 'Path 2'}",
    "hedgeStrategy": "How the user can keep this second path as an optional backup without spreading themselves thin."
  },
  "decisionMatrix": [
    {
      "criterion": "Time to First \$1,000",
      "weight": 5,
      "analysis": {
        "${input.paths[0]?.title || 'Path 1'}": "Achievable within 60-90 days via freelance/consulting.",
        "${input.paths[1]?.title || 'Path 2'}": "Requires 6-9 months structured skill-building before first client."
      }
    },
    {
      "criterion": "5-Year AI Disruption Risk",
      "weight": 4,
      "analysis": {
        "${input.paths[0]?.title || 'Path 1'}": "Low to moderate; strong emphasis on high-touch strategy.",
        "${input.paths[1]?.title || 'Path 2'}": "Moderate; prompt and workflow orchestration shields this role."
      }
    }
  ],
  "next7DayExperiment": {
    "title": "Low-Risk 7-Day Reality Check",
    "description": "A concrete micro-project to test reality of the primary path before investing money.",
    "validationMetric": "Completed 1 prototype and reached out to 3 practitioners for 15-min feedback.",
    "timeCommitmentHours": 6
  }
}
\`\`\`
`;
}

export function parseComparisonHandoff(rawText: string): { success: boolean; data?: CareerComparisonReport; error?: string } {
  try {
    let clean = rawText.trim();
    // Match json block if wrapped in markdown
    const jsonMatch = clean.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      clean = jsonMatch[1].trim();
    } else {
      const firstBrace = clean.indexOf('{');
      const lastBrace = clean.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        clean = clean.substring(firstBrace, lastBrace + 1);
      }
    }

    const parsed = JSON.parse(clean);
    const validated = CareerComparisonReportSchema.safeParse(parsed);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      return {
        success: false,
        error: `Validation error at ${firstIssue.path.join('.')}: ${firstIssue.message}`,
      };
    }
    return { success: true, data: validated.data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Invalid JSON format in handoff text' };
  }
}
