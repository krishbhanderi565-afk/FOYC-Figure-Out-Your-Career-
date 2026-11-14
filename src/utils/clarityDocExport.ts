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
  AlignmentType,
} from 'docx';
import { ClarityHandoff } from '../types/clarity';

/**
 * High-Quality Client-Side PDF Generator for Clarity Compass
 */
export async function generateClarityPdf(report: ClarityHandoff): Promise<void> {
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

  // Helper for adding new page with header/footer
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 50) {
      doc.addPage();
      y = margin + 20;
    }
  };

  // 1. Cover / Top Header Banner
  doc.setFillColor(253, 245, 235); // Light saffron #FDF5EB
  doc.rect(0, 0, pageWidth, 110, 'F');

  doc.setFillColor(82, 107, 80); // Sage #526B50
  doc.rect(0, 106, pageWidth, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(82, 107, 80);
  doc.text('FOYC • FIGURE OUT YOUR CAREER | CLARITY COMPASS', margin, 32);

  doc.setFontSize(22);
  doc.setTextColor(23, 23, 23); // #171717
  doc.text(report.report_title || 'MY PERSONAL CLARITY REPORT', margin, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(
    `Prepared for: ${report.user_name || 'Explorer'}  •  Stage: ${report.current_stage || 'Exploration'}  •  Date: ${new Date().toLocaleDateString()}`,
    margin,
    80
  );
  doc.text(
    `Primary Uncertainty Focus: ${report.primary_uncertainty || 'General Direction'}`,
    margin,
    96
  );

  y = 135;

  const renderSectionHeader = (title: string, num: string) => {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(82, 107, 80);
    doc.text(`${num}. ${title.toUpperCase()}`, margin, y);
    y += 5;
    doc.setDrawColor(232, 229, 222);
    doc.line(margin, y, margin + contentWidth, y);
    y += 15;
  };

  const renderParagraph = (text: string, fontSize = 9.5, isBold = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(text, contentWidth);
    checkPageBreak(lines.length * (fontSize + 3.5) + 6);
    doc.text(lines, margin, y);
    y += lines.length * (fontSize + 3.5) + 6;
  };

  // Section 1: Executive Summary
  renderSectionHeader('Executive Summary', '01');
  const execSummary = typeof report.executive_summary === 'string'
    ? report.executive_summary
    : report.executive_summary?.summary || 'Executive summary exploring clarity and high-alignment opportunities.';
  renderParagraph(execSummary);

  const keyInsight = typeof report.executive_summary === 'object' ? report.executive_summary?.key_insight : '';
  if (keyInsight) {
    checkPageBreak(30);
    doc.setFillColor(255, 253, 248);
    doc.setDrawColor(255, 231, 107);
    doc.rect(margin, y, contentWidth, 26, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(23, 23, 23);
    doc.text(`Key Insight: ${keyInsight}`, margin + 8, y + 16);
    y += 34;
  }

  // Section 2: Understanding You
  renderSectionHeader('Understanding You', '02');
  const und = report.understanding_you || ({} as any);
  renderParagraph(`Background: ${und.education_and_background || 'Personal background exploration'}`);
  renderParagraph(`Interests: ${(Array.isArray(und.interests) ? und.interests : []).join(', ') || 'Exploratory'}`);
  renderParagraph(`Core Strengths: ${(Array.isArray(und.strengths_possessed) ? und.strengths_possessed : []).join(', ') || 'Foundational competencies'}`);
  renderParagraph(`Skills to Develop: ${(Array.isArray(und.skills_to_develop) ? und.skills_to_develop : []).join(', ') || 'High-leverage industry capabilities'}`);
  renderParagraph(`Work Style Preferences: ${und.work_preferences || 'Flexible / Adaptive'}`);

  // Section 3: Strategic Direction
  renderSectionHeader('Strategic Direction', '03');
  const strat = report.strategic_direction || ({} as any);
  renderParagraph(`Selected Trajectory: ${strat.selected_direction || strat.primary_title || 'Selected Career Direction'}`, 10.5, true);
  renderParagraph(`Rationale: ${strat.rationale || 'High alignment with your personal competencies and career ambitions.'}`);
  if (strat.next_decisions_to_investigate?.length) {
    renderParagraph(
      `Next Decision Checkpoints: ${strat.next_decisions_to_investigate.join(' • ')}`
    );
  }

  // Section 4: Explored Career Directions
  if (report.explored_directions?.length) {
    renderSectionHeader('Explored Directions & Trade-Offs', '04');
    report.explored_directions.forEach((dir) => {
      checkPageBreak(45);
      renderParagraph(`• ${dir.title}: ${dir.reasoning}`, 9.5, true);
      if (dir.pros?.length) renderParagraph(`  Advantages: ${dir.pros.join(', ')}`);
      if (dir.cons?.length) renderParagraph(`  Trade-offs / Friction: ${dir.cons.join(', ')}`);
    });
  }

  // Section 5: Roadmap Timeline
  if (report.roadmap?.length) {
    renderSectionHeader('Roadmap & Progression Timeline', '05');
    report.roadmap.forEach((phase) => {
      checkPageBreak(35);
      renderParagraph(`${phase.timeframe} — ${phase.title}`, 10, true);
      if (phase.description) renderParagraph(phase.description);
      if (phase.milestones?.length) {
        phase.milestones.forEach((m) => renderParagraph(`  [ ] ${m}`));
      }
      y += 4;
    });
  }

  // Section 6: Skills Development Plan
  if (report.skills_plan?.length) {
    renderSectionHeader('Skills Development Plan', '06');
    report.skills_plan.forEach((sk) => {
      checkPageBreak(35);
      renderParagraph(`Skill: ${sk.skill_name} (${sk.importance})`, 9.5, true);
      renderParagraph(`Learning Strategy: ${sk.learning_activity}`);
      renderParagraph(`Proof of Work: ${sk.evidence_of_progress}`);
      y += 4;
    });
  }

  // Section 7: Action Checklist
  if (report.action_checklist?.length) {
    renderSectionHeader('Action Checklist & Immediate Momentum', '07');
    report.action_checklist.forEach((act) => {
      checkPageBreak(18);
      const mark = act.completed ? '[✓]' : '[ ]';
      renderParagraph(`${mark} (${act.timeframe}) ${act.task}`);
    });
  }

  // Section 8: Personal Commitment & Next Step
  renderSectionHeader('Personal Commitment & Reassessment', '08');
  const commit = report.personal_commitment || ({} as any);
  const reassess = report.reassessment || ({} as any);
  renderParagraph(`Immediate Next Step: ${commit.first_concrete_step || 'Begin Phase 1 foundational deliverables'}`, 10, true);
  renderParagraph(`Commitment Statement: "${commit.commitment_statement || 'I commit to continuous progress and daily proof of work.'}"`);
  renderParagraph(
    `Recommended Reassessment Date: ${reassess.recommended_date || new Date().toISOString().split('T')[0]} — "${reassess.reflection_prompt || 'Review milestone progress and calibrate weekly habits.'}"`
  );

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `FOYC Clarity Compass • figureoutyourcareer.com • Page ${i} of ${totalPages}`,
      margin,
      pageHeight - 20
    );
  }

  // Trigger download
  const filename = `FOYC-Clarity-Report-${(report.user_name || 'My-Direction').replace(/\s+/g, '-')}.pdf`;
  doc.save(filename);
}

/**
 * High-Quality Client-Side DOCX Generator for Clarity Compass
 * Creates an editable Microsoft Word (.docx) document
 */
export async function generateClarityDocx(report: ClarityHandoff): Promise<void> {
  const und = report.understanding_you || ({} as any);
  const strat = report.strategic_direction || ({} as any);
  const commit = report.personal_commitment || ({} as any);
  const reassess = report.reassessment || ({} as any);
  const execSummary = typeof report.executive_summary === 'string'
    ? report.executive_summary
    : report.executive_summary?.summary || 'Executive summary exploring clarity and high-alignment opportunities.';
  const keyInsight = typeof report.executive_summary === 'object' ? report.executive_summary?.key_insight || '' : '';

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header / Title
          new Paragraph({
            text: 'FOYC • FIGURE OUT YOUR CAREER',
            style: 'Heading2',
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: report.report_title || 'MY PERSONAL CLARITY REPORT',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Prepared for: ${report.user_name || 'Explorer'}  |  Date: ${new Date().toLocaleDateString()}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Current Stage: ${report.current_stage || 'Career Exploration'}  |  Primary Uncertainty: ${report.primary_uncertainty || 'Career Direction'}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),

          // 1. Executive Summary
          new Paragraph({ text: '1. Executive Summary', heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: execSummary }),
          ...(keyInsight
            ? [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Key Insight: ', bold: true }),
                    new TextRun({ text: keyInsight, italics: true }),
                  ],
                }),
              ]
            : []),
          new Paragraph({ text: '' }),

          // 2. Understanding You
          new Paragraph({ text: '2. Understanding You', heading: HeadingLevel.HEADING_1 }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Background: ', bold: true }),
              new TextRun(und.education_and_background || 'Personal background exploration'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Interests: ', bold: true }),
              new TextRun((Array.isArray(und.interests) ? und.interests : []).join(', ') || 'Exploratory'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Core Strengths: ', bold: true }),
              new TextRun((Array.isArray(und.strengths_possessed) ? und.strengths_possessed : []).join(', ') || 'General capabilities'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Skills to Develop: ', bold: true }),
              new TextRun((Array.isArray(und.skills_to_develop) ? und.skills_to_develop : []).join(', ') || 'High-leverage industry skills'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Work & Lifestyle Preferences: ', bold: true }),
              new TextRun(und.work_preferences || 'Flexible / Adaptive'),
            ],
          }),
          new Paragraph({ text: '' }),

          // 3. Strategic Direction
          new Paragraph({ text: '3. Strategic Direction', heading: HeadingLevel.HEADING_1 }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Target Trajectory: ', bold: true }),
              new TextRun({ text: strat.selected_direction || strat.primary_title || 'Selected Career Direction', bold: true }),
            ],
          }),
          new Paragraph({ text: strat.rationale || 'High alignment with your personal competencies and career ambitions.' }),
          ...(strat.next_decisions_to_investigate?.length
            ? [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Decisions to Investigate: ', bold: true }),
                    new TextRun(strat.next_decisions_to_investigate.join(' • ')),
                  ],
                }),
              ]
            : []),
          new Paragraph({ text: '' }),

          // 4. Explored Directions Table
          new Paragraph({ text: '4. Explored Trajectories & Trade-Offs', heading: HeadingLevel.HEADING_1 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Direction', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Advantages', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Trade-offs & Friction', bold: true })] })] }),
                ],
              }),
              ...(Array.isArray(report.explored_directions) ? report.explored_directions : []).map(
                (dir) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({ children: [new TextRun({ text: dir.title, bold: true })] }),
                          new Paragraph({ text: dir.reasoning || '' }),
                        ],
                      }),
                      new TableCell({
                        children: (Array.isArray(dir.pros) ? dir.pros : []).map((p) => new Paragraph({ text: `• ${p}` })),
                      }),
                      new TableCell({
                        children: (Array.isArray(dir.cons) ? dir.cons : []).map((c) => new Paragraph({ text: `• ${c}` })),
                      }),
                    ],
                  })
              ),
            ],
          }),
          new Paragraph({ text: '' }),

          // 5. Roadmap Timeline
          new Paragraph({ text: '5. Career Roadmap', heading: HeadingLevel.HEADING_1 }),
          ...(Array.isArray(report.roadmap) ? report.roadmap : []).flatMap((r) => [
            new Paragraph({ text: `${r.timeframe || 'Phase'} — ${r.title || 'Execution Phase'}`, heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: r.description || '' }),
            ...(Array.isArray(r.milestones) ? r.milestones : []).map((m) => new Paragraph({ text: `  [ ] ${m}` })),
            new Paragraph({ text: '' }),
          ]),

          // 6. Skills Plan
          new Paragraph({ text: '6. Skills Development Plan', heading: HeadingLevel.HEADING_1 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Skill', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Why it Matters', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Learning Action & Proof', bold: true })] })] }),
                ],
              }),
              ...(Array.isArray(report.skills_plan) ? report.skills_plan : []).map(
                (sk) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: sk.skill_name, bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ text: sk.importance || 'Core Priority' })] }),
                      new TableCell({
                        children: [
                          new Paragraph({ text: `Action: ${sk.learning_activity || 'Hands-on practice'}` }),
                          new Paragraph({ text: `Proof: ${sk.evidence_of_progress || 'Portfolio item'}` }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),
          new Paragraph({ text: '' }),

          // 7. Action Checklist
          new Paragraph({ text: '7. Action Checklist', heading: HeadingLevel.HEADING_1 }),
          ...(Array.isArray(report.action_checklist) ? report.action_checklist : []).map(
            (act) =>
              new Paragraph({
                text: `${act.completed ? '[X]' : '[ ]'} (${act.timeframe || 'Immediate'}) ${act.task || act.text || 'Action item'}`,
              })
          ),
          new Paragraph({ text: '' }),

          // 8. Personal Commitment
          new Paragraph({ text: '8. Personal Commitment', heading: HeadingLevel.HEADING_1 }),
          new Paragraph({
            children: [
              new TextRun({ text: 'First Action: ', bold: true }),
              new TextRun(commit.first_concrete_step || 'Start Phase 1 roadmap tasks'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Commitment Statement: ', bold: true }),
              new TextRun({ text: `"${commit.commitment_statement || 'I commit to steady execution and building real proof of work.'}"`, italics: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Reassessment Target Date: ', bold: true }),
              new TextRun(reassess.recommended_date || new Date().toISOString().split('T')[0]),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `FOYC-Clarity-Report-${(report.user_name || 'My-Direction').replace(/\s+/g, '-')}.docx`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
