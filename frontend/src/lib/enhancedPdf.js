import { jsPDF } from 'jspdf';

export const generateEnhancedItineraryPDF = async (itinerary) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 20;

  const checkPage = (needed = 15) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // Header with gradient effect
  doc.setFillColor(124, 92, 252);
  doc.rect(0, 0, pageW, 50, 'F');
  
  // Add emoji/icon
  doc.setFontSize(32);
  doc.text(itinerary.emoji || '✈️', margin, 30);
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(itinerary.title || 'My India Trip', margin + 20, 25);
  
  // Route
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(itinerary.route || '', margin + 20, 35);
  
  // TripTuner branding
  doc.setFontSize(10);
  doc.text('Powered by TripTuner & Tripi AI', pageW - margin, 45, { align: 'right' });

  y = 60;

  // Stats Cards
  const stats = [
    { icon: '⏱️', label: 'Duration', value: itinerary.duration || '-' },
    { icon: '👥', label: 'Group', value: itinerary.groupSize || '-' },
    { icon: '💰', label: 'Budget', value: itinerary.budgetTotal?.mid ? `₹${itinerary.budgetTotal.mid.toLocaleString('en-IN')}` : '-' },
    { icon: '💵', label: 'Per Person', value: itinerary.budgetPerPerson?.mid ? `₹${itinerary.budgetPerPerson.mid.toLocaleString('en-IN')}` : '-' },
  ];

  const cardW = (contentW - 12) / 4;
  stats.forEach((stat, i) => {
    const x = margin + i * (cardW + 4);
    
    // Card background
    doc.setFillColor(245, 244, 250);
    doc.roundedRect(x, y, cardW, 22, 3, 3, 'F');
    
    // Icon
    doc.setFontSize(16);
    doc.text(stat.icon, x + cardW / 2, y + 8, { align: 'center' });
    
    // Label
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 160);
    doc.setFont('helvetica', 'normal');
    doc.text(stat.label, x + cardW / 2, y + 13, { align: 'center' });
    
    // Value
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 100);
    doc.setFont('helvetica', 'bold');
    const lines = doc.splitTextToSize(stat.value, cardW - 4);
    doc.text(lines, x + cardW / 2, y + 18, { align: 'center' });
  });

  y += 30;

  // Description Section
  if (itinerary.description) {
    checkPage(20);
    doc.setFillColor(255, 248, 225);
    doc.roundedRect(margin, y, contentW, 'auto', 3, 3, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(80, 60, 180);
    doc.setFont('helvetica', 'bold');
    doc.text('About This Trip', margin + 4, y + 7);
    
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 80);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(itinerary.description, contentW - 8);
    doc.text(descLines, margin + 4, y + 13);
    
    y += 13 + (descLines.length * 5) + 4;
  }

  y += 5;

  // Highlights Section
  if (itinerary.highlights && itinerary.highlights.length > 0) {
    checkPage(30);
    
    doc.setFontSize(14);
    doc.setTextColor(124, 92, 252);
    doc.setFont('helvetica', 'bold');
    doc.text('✨ Trip Highlights', margin, y);
    y += 8;

    itinerary.highlights.forEach((highlight, index) => {
      checkPage(8);
      
      // Highlight box
      doc.setFillColor(250, 250, 255);
      doc.roundedRect(margin, y - 4, contentW, 8, 2, 2, 'F');
      
      // Bullet
      doc.setFontSize(10);
      doc.setTextColor(255, 77, 141);
      doc.text('●', margin + 3, y + 2);
      
      // Text
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 80);
      doc.setFont('helvetica', 'normal');
      doc.text(highlight, margin + 8, y + 2);
      
      y += 10;
    });
  }

  y += 5;

  // Day-wise Itinerary
  if (itinerary.days && itinerary.days.length > 0) {
    checkPage(20);
    
    doc.setFontSize(14);
    doc.setTextColor(124, 92, 252);
    doc.setFont('helvetica', 'bold');
    doc.text('📋 Day-wise Itinerary', margin, y);
    y += 10;

    itinerary.days.forEach((day, index) => {
      checkPage(45);
      
      // Day header
      doc.setFillColor(124, 92, 252);
      doc.roundedRect(margin, y, contentW, 12, 3, 3, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Day ${day.day}: ${day.title}`, margin + 4, y + 8);
      
      y += 16;

      // Activities
      const activities = [
        { icon: '🌅', time: 'Morning', text: day.morning },
        { icon: '☀️', time: 'Afternoon', text: day.afternoon },
        { icon: '🌆', time: 'Evening', text: day.evening },
        { icon: '🏨', time: 'Stay', text: day.stay },
      ];

      activities.forEach(activity => {
        checkPage(12);
        
        // Activity box
        doc.setFillColor(248, 248, 252);
        doc.roundedRect(margin + 2, y, contentW - 4, 'auto', 2, 2, 'F');
        
        // Icon and time
        doc.setFontSize(9);
        doc.setTextColor(124, 92, 252);
        doc.setFont('helvetica', 'bold');
        doc.text(`${activity.icon} ${activity.time}`, margin + 5, y + 5);
        
        // Activity text
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 80);
        doc.setFont('helvetica', 'normal');
        const activityLines = doc.splitTextToSize(activity.text, contentW - 14);
        doc.text(activityLines, margin + 5, y + 10);
        
        y += 10 + (activityLines.length * 4);
      });

      y += 6;
    });
  }

  // Budget Breakdown
  if (itinerary.budgetTotal) {
    checkPage(40);
    
    doc.setFontSize(14);
    doc.setTextColor(124, 92, 252);
    doc.setFont('helvetica', 'bold');
    doc.text('💰 Budget Breakdown', margin, y);
    y += 10;

    // Table header
    doc.setFillColor(124, 92, 252);
    doc.rect(margin, y, contentW, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const colW = contentW / 4;
    doc.text('Category', margin + 2, y + 6);
    doc.text('Budget', margin + colW + 2, y + 6);
    doc.text('Mid-Range', margin + colW * 2 + 2, y + 6);
    doc.text('Premium', margin + colW * 3 + 2, y + 6);
    
    y += 12;

    // Table rows
    const budgetRows = [
      { label: 'Total Trip', budget: itinerary.budgetTotal.budget, mid: itinerary.budgetTotal.mid, premium: itinerary.budgetTotal.premium },
      { label: 'Per Person', budget: itinerary.budgetPerPerson?.budget, mid: itinerary.budgetPerPerson?.mid, premium: itinerary.budgetPerPerson?.premium },
    ];

    budgetRows.forEach((row, index) => {
      const bgColor = index % 2 === 0 ? [250, 250, 255] : [255, 255, 255];
      doc.setFillColor(...bgColor);
      doc.rect(margin, y, contentW, 8, 'F');
      
      doc.setTextColor(60, 60, 80);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(row.label, margin + 2, y + 5);
      
      doc.setFont('helvetica', 'normal');
      doc.text(row.budget ? `₹${row.budget.toLocaleString('en-IN')}` : '-', margin + colW + 2, y + 5);
      doc.text(row.mid ? `₹${row.mid.toLocaleString('en-IN')}` : '-', margin + colW * 2 + 2, y + 5);
      doc.text(row.premium ? `₹${row.premium.toLocaleString('en-IN')}` : '-', margin + colW * 3 + 2, y + 5);
      
      y += 8;
    });

    y += 5;

    // Budget note
    doc.setFillColor(255, 248, 225);
    doc.roundedRect(margin, y, contentW, 12, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(245, 124, 0);
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize('💡 Budget includes accommodation, food, local transport, entry fees, and activities. Flight/train tickets to starting point not included.', contentW - 4);
    doc.text(noteLines, margin + 2, y + 4);
    
    y += 14;
  }

  // Footer on all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer background
    doc.setFillColor(245, 244, 250);
    doc.rect(0, pageH - 15, pageW, 15, 'F');
    
    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 160);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by TripTuner | Powered by Tripi AI | triptuner.in', margin, pageH - 8);
    doc.text(`Page ${i} of ${totalPages}`, pageW - margin, pageH - 8, { align: 'right' });
    
    // Add date
    const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Generated on: ${date}`, pageW / 2, pageH - 8, { align: 'center' });
  }

  // Save PDF
  const fileName = (itinerary.title || 'trip').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`${fileName}_triptuner_itinerary.pdf`);
};

// Export the original function as well for backward compatibility
export { generateItineraryPDF } from './pdf';
