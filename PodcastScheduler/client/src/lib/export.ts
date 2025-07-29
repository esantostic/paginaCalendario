import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Export calendar to PNG image
export async function exportToImage(calendarRef: React.RefObject<HTMLElement>) {
  if (!calendarRef.current) return;
  
  try {
    const canvas = await html2canvas(calendarRef.current, {
      backgroundColor: '#F8F9FA',
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true
    });
    
    const dataUrl = canvas.toDataURL('image/png');
    
    // Create download link
    const link = document.createElement('a');
    link.download = `calendario-${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataUrl;
    link.click();
    
    return true;
  } catch (error) {
    console.error('Error exporting to image:', error);
    return false;
  }
}

// Export calendar to PDF
export async function exportToPDF(calendarRef: React.RefObject<HTMLElement>) {
  if (!calendarRef.current) return;
  
  try {
    const canvas = await html2canvas(calendarRef.current, {
      backgroundColor: '#F8F9FA',
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate PDF dimensions to maintain aspect ratio
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    const doc = new jsPDF('p', 'mm');
    let position = 0;
    
    // First page
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add new pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    doc.save(`calendario-${new Date().toISOString().split('T')[0]}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
}
