import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LessonPlan } from '../types';

export async function exportLessonPlanToPdf(elementId: string, filename: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id '${elementId}' not found for PDF export.`);
    return false;
  }

  try {
    // Show temporary rendering state
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution for Japanese text legibility
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename.replace(/[^a-zA-Z0-9_\-]/g, '_')}_PCPP_Plan.pdf`);
    return true;
  } catch (err) {
    console.error('PDF Export Error:', err);
    // Fallback: Trigger standard browser print which user can save to PDF
    window.print();
    return true;
  }
}
