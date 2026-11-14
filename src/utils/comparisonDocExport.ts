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
import { CareerComparisonReport, DEFAULT_DIMENSIONS } from '../types/comparison';

export async function generateComparisonPdf(report: CareerComparisonReport): Promise<void> {
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
  doc.text('FOYC • FIGURE OUT YOUR CAREER | CAREER PATH COMPARISON', margin, 32);

  doc.setFontSize(20);
  doc.setTextColor(23, 23, 23);
  doc.text('STRATEGIC CAREER COMPARISON REPORT', margin, 60);

  const paths = Array.isArray(report?.comparedPaths) ? report.comparedPaths : [];
  const rec = report?.recommendation || ({} as any);
  const execSummary = report?.executiveSummary || 'Objective side-by-side trade-off evaluation.';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • Paths Evaluated: ${paths.length}`, margin, 82);

  y = 135;

  // Recommendation Card
  checkPageBreak(120);
  doc.setFillColor(254, 250, 247);
  doc.setDrawColor(23, 23, 23);
  doc.setLineWidth(1.5);
  doc.roundedRect(margin, y, contentWidth, 90, 8, 8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(82, 107, 80);
  doc.text('TOP RECOMMENDED DIRECTION:', margin + 16, y + 24);

  doc.setFontSize(16);
  doc.setTextColor(23, 23, 23);
  doc.text(`${rec.primaryPathTitle || paths[0]?.title || 'Recommended Path'} (${rec.confidenceScore || 85}% Confidence)`, margin + 16, y + 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);
  const rationaleLines = doc.splitTextToSize(rec.strategicRationale || 'Highest risk-adjusted feasibility and strategic alignment.', contentWidth - 32);
  doc.text(rationaleLines.slice(0, 2), margin + 16, y + 66);

  y += 110;

  // Executive Summary
  checkPageBreak(80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(23, 23, 23);
  doc.text('Executive Strategic Takeaway', margin, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  const summaryLines = doc.splitTextToSize(report.executiveSummary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 14 + 20;

  // Compared Paths Breakdown
  checkPageBreak(60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(23, 23, 23);
  doc.text('Side-by-Side Path Breakdown', margin, y);
  y += 16;

  report.comparedPaths.forEach((path) => {
    checkPageBreak(130);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(1);
    doc.roundedRect(margin, y, contentWidth, 120, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(23, 23, 23);
    doc.text(`${path.title} [${path.category}]`, margin + 14, y + 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Time Horizon: ${path.timeHorizon} | Est. Break-Even: ${path.breakEvenMonths} months`, margin + 14, y + 36);

    const descLines = doc.splitTextToSize(path.summary, contentWidth - 28);
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    doc.text(descLines.slice(0, 2), margin + 14, y + 54);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(82, 107, 80);
    doc.text(`Pros: ${path.pros.slice(0, 2).join(' • ')}`, margin + 14, y + 84);

    doc.setTextColor(180, 70, 70);
    doc.text(`Cons / Risks: ${path.cons.slice(0, 2).join(' • ')}`, margin + 14, y + 98);

    doc.setTextColor(80, 80, 80);
    doc.text(`Best fit if: ${path.bestFitIf || 'Seeking direct market traction.'}`, margin + 14, y + 112);

    y += 135;
  });

  // Next 7-Day Action Experiment
  if (report.next7DayExperiment) {
    checkPageBreak(90);
    doc.setFillColor(255, 247, 237);
    doc.setDrawColor(234, 88, 12);
    doc.setLineWidth(1);
    doc.roundedRect(margin, y, contentWidth, 80, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(234, 88, 12);
    doc.text(`Recommended 7-Day Validation Experiment: ${report.next7DayExperiment.title}`, margin + 14, y + 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    const expLines = doc.splitTextToSize(report.next7DayExperiment.description, contentWidth - 28);
    doc.text(expLines.slice(0, 2), margin + 14, y + 40);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    doc.text(`Success Metric: ${report.next7DayExperiment.validationMetric} (${report.next7DayExperiment.timeCommitmentHours} hrs required)`, margin + 14, y + 68);
  }

  doc.save(`FOYC_Career_Comparison_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export async function generateComparisonDocx(report: CareerComparisonReport): Promise<void> {
  const paths = Array.isArray(report?.comparedPaths) ? report.comparedPaths : [];
  const rec = report?.recommendation || ({} as any);
  const execSummary = report?.executiveSummary || 'Objective side-by-side trade-off evaluation.';

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'FOYC • Figure Out Your Career',
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            text: 'Career Path Comparison Report',
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated: ${new Date().toLocaleDateString()} | Paths: ${paths.map(p => p.title).join(' vs ') || 'Options'}`,
                italics: true,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Top Recommendation',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${rec.primaryPathTitle || paths[0]?.title || 'Recommended Path'} (${rec.confidenceScore || 85}% Confidence)\n`,
                bold: true,
              }),
              new TextRun({ text: rec.strategicRationale || 'Highest strategic feasibility and alignment.' }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Executive Strategic Summary',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: execSummary }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Paths Evaluated',
            heading: HeadingLevel.HEADING_2,
          }),
          ...paths.flatMap((p) => [
            new Paragraph({
              children: [
                new TextRun({ text: `• ${p.title} (${p.category || 'Career Field'}) - Horizon: ${p.timeHorizon || '6-12 months'}\n`, bold: true }),
                new TextRun({ text: `${p.summary || ''}\n` }),
                new TextRun({ text: `Pros: ${(p.pros || []).join(', ')}\n`, color: '2E7D32' }),
                new TextRun({ text: `Risks: ${p.cons.join(', ')}\n`, color: 'C62828' }),
                new TextRun({ text: `Best Fit: ${p.bestFitIf}\n`, italics: true }),
              ],
            }),
            new Paragraph({ text: '' }),
          ]),
          new Paragraph({
            text: 'Next 7-Day Experiment',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${report.next7DayExperiment.title}: `, bold: true }),
              new TextRun({ text: `${report.next7DayExperiment.description}\n` }),
              new TextRun({ text: `Metric: ${report.next7DayExperiment.validationMetric} (${report.next7DayExperiment.timeCommitmentHours} hrs)` }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FOYC_Career_Comparison_${new Date().toISOString().slice(0, 10)}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
