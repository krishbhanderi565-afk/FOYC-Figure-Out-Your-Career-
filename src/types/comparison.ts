import { z } from 'zod';

export interface ComparisonDimension {
  id: string;
  label: string;
  description: string;
}

export const DEFAULT_DIMENSIONS: ComparisonDimension[] = [
  { id: 'income_speed', label: 'Speed to Income', description: 'How fast can you generate meaningful revenue or secure an entry salary?' },
  { id: 'ai_resilience', label: 'AI Resilience', description: 'Long-term resistance to automated task obsolescence over the next 5-10 years.' },
  { id: 'learning_curve', label: 'Learning Curve', description: 'Time, cognitive effort, and prerequisite mastery required to be employable.' },
  { id: 'work_life_balance', label: 'Work-Life Harmony', description: 'Typical weekly hours, stress load, autonomy, and mental sustainability.' },
  { id: 'remote_flexibility', label: 'Remote Flexibility', description: 'Ability to work asynchronously from anywhere in the world.' },
  { id: 'capital_required', label: 'Initial Investment', description: 'Financial resources required for courses, equipment, degrees, or runway.' },
];

export interface ComparedPathItem {
  id: string;
  title: string;
  category: string;
  timeHorizon: string;
  summary: string;
  scores: Record<string, number>; // 1-10 scores per dimension
  pros: string[];
  cons: string[];
  breakEvenMonths: number;
  bestFitIf: string;
}

export const ComparedPathItemSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  title: z.string().min(2, 'Path title required'),
  category: z.string().default('General'),
  timeHorizon: z.string().default('6-12 months'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  scores: z.record(z.string(), z.number().min(1).max(10)),
  pros: z.array(z.string()).min(1),
  cons: z.array(z.string()).min(1),
  breakEvenMonths: z.number().default(6),
  bestFitIf: z.string().default(''),
});

export const CareerComparisonReportSchema = z.object({
  version: z.literal('1.0'),
  comparedPaths: z.array(ComparedPathItemSchema).min(2).max(4),
  executiveSummary: z.string().min(20),
  recommendation: z.object({
    primaryPathTitle: z.string(),
    confidenceScore: z.number().min(1).max(100),
    strategicRationale: z.string().min(20),
    secondaryPathTitle: z.string().optional(),
    hedgeStrategy: z.string().optional(),
  }),
  decisionMatrix: z.array(
    z.object({
      criterion: z.string(),
      weight: z.number().min(1).max(5),
      analysis: z.record(z.string(), z.string()),
    })
  ),
  next7DayExperiment: z.object({
    title: z.string(),
    description: z.string(),
    validationMetric: z.string(),
    timeCommitmentHours: z.number(),
  }),
});

export type CareerComparisonReport = z.infer<typeof CareerComparisonReportSchema>;
