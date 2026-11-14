import { jsPDF } from 'jspdf';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { PossibilityHandoff } from '../types/possibility';

/**
 * Client-side Vector PDF Generator for Possibility Explorer
 */
export async function generatePossibilityPdf(report: PossibilityHandoff): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 50) {
      doc.addPage();
      y = margin + 20;
    }
  };

  // Header Banner
  doc.setFillColor(253, 245, 235); // #FDF5EB
  doc.rect(0, 0, pageWidth, 110, 'F');

  doc.setFillColor(82, 107, 80); // Sage #526B50
  doc.rect(0, 106, pageWidth, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(82, 107, 80);
  doc.text('FOYC • FIGURE OUT YOUR CAREER', margin, 35);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(23, 23, 23); // #171717
  doc.text('MY POSSIBILITY REPORT', margin, 62);

  const prof = report?.profile || ({} as any);
  const expSummary = report?.exploration_summary || ({} as any);
  const possibilities = Array.isArray(report?.possibilities) ? report.possibilities : [];
  const recommendedExps = Array.isArray(report?.recommended_experiments) ? report.recommended_experiments : [];
  const nextSteps = Array.isArray(report?.next_steps) ? report.next_steps : [];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  const subtitle = `Explorer: ${prof.user_name || 'Explorer'} • Stage: ${prof.life_stage || 'Career Exploration'} • Generated on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  doc.text(subtitle, margin, 85);

  y = 135;

  // Section 1: Executive Summary
  checkPageBreak(120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(23, 23, 23);
  doc.text('1. Executive Summary & Possibility Landscape', margin, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const summaryLines = doc.splitTextToSize(expSummary.summary || 'Summary of explored possibilities.', contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 13 + 12;

  // Key Discoveries Callout Box
  if (expSummary.key_discoveries?.length > 0) {
    checkPageBreak(90);
    doc.setFillColor(244, 243, 239);
    doc.roundedRect(margin, y, contentWidth, 24 + expSummary.key_discoveries.length * 14, 6, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(82, 107, 80);
    doc.text('KEY STRATEGIC DISCOVERIES:', margin + 12, y + 16);
    y += 28;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    expSummary.key_discoveries.forEach((disc: string) => {
      const dLines = doc.splitTextToSize(`• ${disc}`, contentWidth - 24);
      doc.text(dLines, margin + 12, y);
      y += dLines.length * 12 + 2;
    });
    y += 16;
  }

  // Section 2: Understanding You
  checkPageBreak(110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(23, 23, 23);
  doc.text('2. Personal Baseline & Real-Life Grounding', margin, y);
  y += 18;

  const baselineItems = [
    `Education & Credentials: ${prof.education || 'Self-directed pathway'}`,
    `Current Context & Experience: ${prof.experience || 'In active career exploration'}`,
    `Core Natural Curiosities: ${(prof.interests || []).join(', ') || 'Interdisciplinary'}`,
    `Skills Brought to the Table: ${(prof.skills_possessed || []).join(', ') || 'General problem solving'}`,
    `Skills Targeted to Develop: ${(prof.skills_to_develop || []).join(', ') || 'Industry capabilities'}`,
    `Time Commitment & Budget: ${prof.practical_boundaries?.learning_hours_per_week || '5–15 hrs/wk'} • ${prof.practical_boundaries?.budget || 'Low cost'}`,
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  baselineItems.forEach((item) => {
    const lines = doc.splitTextToSize(`• ${item}`, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 13 + 3;
  });
  y += 16;

  // Section 3: Discovered Possibilities (Cards)
  checkPageBreak(120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(23, 23, 23);
  doc.text(`3. Explored Possibilities (${report.possibilities.length} Candidates)`, margin, y);
  y += 18;

  report.possibilities.forEach((pos, idx) => {
    checkPageBreak(150);

    // Card border box
    const isShortlisted = report.shortlisted_options?.includes(pos.name) || pos.is_shortlisted;
    doc.setFillColor(isShortlisted ? 255 : 250, isShortlisted ? 253 : 250, isShortlisted ? 245 : 250);
    doc.setDrawColor(23, 23, 23);
    doc.setLineWidth(1);
    doc.roundedRect(margin, y, contentWidth, 130, 6, 6, 'FD');

    // Title & Category
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(23, 23, 23);
    doc.text(`${idx + 1}. ${pos.name}`, margin + 12, y + 20);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(82, 107, 80);
    doc.text(`[${pos.category.toUpperCase()}] • ${pos.fit_level.toUpperCase()}${isShortlisted ? ' • SHORTLISTED' : ''}`, margin + 12, y + 33);

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    const descLines = doc.splitTextToSize(pos.description, contentWidth - 24);
    doc.text(descLines, margin + 12, y + 46);

    // Meta details
    const metaY = y + 46 + descLines.length * 11 + 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text(`Prep Time: ${pos.estimated_preparation_time} | Est. Cost: ${pos.estimated_cost}`, margin + 12, metaY);

    // Required Skills
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    const skillText = `Key Capabilities: ${(pos.required_skills || []).join(', ')}`;
    doc.text(doc.splitTextToSize(skillText, contentWidth - 24), margin + 12, metaY + 12);

    // AI Impact
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(doc.splitTextToSize(`AI Nuance: ${pos.ai_impact}`, contentWidth - 24), margin + 12, metaY + 24);

    y += 142;
  });

  // Section 4: Practical Experiments
  if (report.recommended_experiments?.length > 0) {
    checkPageBreak(120);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(23, 23, 23);
    doc.text('4. Recommended "Try Before You Commit" Experiments', margin, y);
    y += 18;

    report.recommended_experiments.forEach((exp) => {
      checkPageBreak(50);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(23, 23, 23);
      doc.text(`[${exp.type}] ${exp.title} (${exp.estimated_time})`, margin, y);
      y += 13;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      const expLines = doc.splitTextToSize(exp.description, contentWidth);
      doc.text(expLines, margin, y);
      y += expLines.length * 11 + 8;
    });
    y += 10;
  }

  // Section 5: Action Checklist
  if (report.next_steps?.length > 0) {
    checkPageBreak(100);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(23, 23, 23);
    doc.text('5. Strategic Action Checklist & Next Steps', margin, y);
    y += 18;

    report.next_steps.forEach((step) => {
      checkPageBreak(25);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);
      const taskLine = `[  ] (${step.timeframe}) ${step.task}`;
      doc.text(doc.splitTextToSize(taskLine, contentWidth), margin, y);
      y += 16;
    });
  }

  // Page numbering footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text(
      `FOYC Possibility Report • Page ${i} of ${totalPages} • Discover what you could become`,
      pageWidth / 2,
      pageHeight - 20,
      { align: 'center' }
    );
  }

  const filename = `${report.profile.user_name || 'My'}_FOYC_Possibility_Report.pdf`;
  doc.save(filename);
}

/**
 * Client-side Editable Word Document (.docx) Generator
 */
export async function generatePossibilityDocx(report: PossibilityHandoff): Promise<void> {
  const prof = report?.profile || ({} as any);
  const expSummary = report?.exploration_summary || ({} as any);
  const possibilities = Array.isArray(report?.possibilities) ? report.possibilities : [];
  const recommendedExps = Array.isArray(report?.recommended_experiments) ? report.recommended_experiments : [];
  const nextSteps = Array.isArray(report?.next_steps) ? report.next_steps : [];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'FOYC • FIGURE OUT YOUR CAREER',
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            text: 'MY POSSIBILITY REPORT',
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Explorer: ', bold: true }),
              new TextRun(`${prof.user_name || 'Explorer'} | `),
              new TextRun({ text: 'Stage: ', bold: true }),
              new TextRun(`${prof.life_stage || 'Career Exploration'} | `),
              new TextRun({ text: 'Date: ', bold: true }),
              new TextRun(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })),
            ],
          }),
          new Paragraph({ text: '' }),

          // 1. Executive Summary
          new Paragraph({ text: '1. Executive Summary & Core Landscape', heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: expSummary.summary || 'Summary of explored possibilities.' }),
          new Paragraph({ text: '' }),

          // Key discoveries
          ...(expSummary.key_discoveries || []).map(
            (k: string) =>
              new Paragraph({
                children: [
                  new TextRun({ text: '✦ Key Discovery: ', bold: true }),
                  new TextRun(k),
                ],
              })
          ),
          new Paragraph({ text: '' }),

          // 2. Personal Baseline
          new Paragraph({ text: '2. Personal Profile & Exploration Baseline', heading: HeadingLevel.HEADING_1 }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Education: ', bold: true }),
              new TextRun(prof.education || 'Self-directed pathway'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Current Context: ', bold: true }),
              new TextRun(prof.experience || 'In career exploration'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Interests: ', bold: true }),
              new TextRun((prof.interests || []).join(', ') || 'Interdisciplinary'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Skills Possessed: ', bold: true }),
              new TextRun((prof.skills_possessed || []).join(', ') || 'General problem solving'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Skills to Develop: ', bold: true }),
              new TextRun((prof.skills_to_develop || []).join(', ') || 'High-demand industry skills'),
            ],
          }),
          new Paragraph({ text: '' }),

          // 3. Explored Possibilities Table
          new Paragraph({ text: '3. Discovered Opportunities & Viability Breakdown', heading: HeadingLevel.HEADING_1 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Possibility', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Category & Fit', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Required Skills & Prep Time', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Why It Matches & AI Impact', bold: true })] })] }),
                ],
              }),
              ...possibilities.map(
                (pos) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({ children: [new TextRun({ text: pos.name, bold: true })] }),
                          new Paragraph({ text: pos.description || '' }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({ children: [new TextRun({ text: pos.category || 'Alternative Path', bold: true })] }),
                          new Paragraph({ text: `Fit: ${pos.fit_level || 'Strong Fit'}` }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({ text: `Skills: ${(pos.required_skills || []).join(', ')}` }),
                          new Paragraph({ text: `Time: ${pos.estimated_preparation_time || '3–6 months'}` }),
                          new Paragraph({ text: `Cost: ${pos.estimated_cost || 'Low'}` }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({ text: pos.why_it_matches || '' }),
                          new Paragraph({ text: `AI Note: ${pos.ai_impact || 'AI-assisted workflows'}` }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),
          new Paragraph({ text: '' }),

          // 4. Practical Experiments
          new Paragraph({ text: '4. Practical Experiments (Try Before You Commit)', heading: HeadingLevel.HEADING_1 }),
          ...recommendedExps.map(
            (exp) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `[${exp.type || 'Project'}] ${exp.title} (${exp.estimated_time || '3 hrs'}): `, bold: true }),
                  new TextRun(exp.description || ''),
                ],
              })
          ),
          new Paragraph({ text: '' }),

          // 5. Action Checklist
          new Paragraph({ text: '5. Action Checklist & Next Steps', heading: HeadingLevel.HEADING_1 }),
          ...nextSteps.map(
            (step) =>
              new Paragraph({
                text: `${step.completed ? '[X]' : '[ ]'} (${step.timeframe || 'Immediate'}) ${step.task || 'Action item'}`,
              })
          ),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${prof.user_name || 'My'}_FOYC_Possibility_Report.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
