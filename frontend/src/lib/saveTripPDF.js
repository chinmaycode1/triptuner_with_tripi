import jsPDF from 'jspdf';
import { saveTripAsPDF } from './api';
import { showToast } from '../components/Toast';

// Universal function to save any itinerary as PDF
export const saveItineraryAsPDF = async (itineraryData) => {
  try {
    const {
      destination,
      itinerary, // The full itinerary text
      duration = 5,
      groupSize = 2,
      budget = 25000,
      budgetPerPerson,
      category = 'Adventure',
      state = ''
    } = itineraryData;

    // Generate PDF using jsPDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFont(undefined, 'normal');
      }
      
      const lines = doc.splitTextToSize(text, maxWidth);
      
      // Check if we need a new page
      if (yPosition + (lines.length * fontSize * 0.5) > doc.internal.pageSize.height - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * fontSize * 0.5 + 5;
    };

    // Add header
    addText(`${destination} Trip Itinerary`, 20, true);
    if (state) {
      addText(`${state}, India`, 14);
    }
    yPosition += 10;

    // Add trip details
    addText(`Duration: ${duration} days`, 12, true);
    addText(`Group Size: ${groupSize} people`, 12, true);
    addText(`Total Budget: ₹${budget.toLocaleString('en-IN')}`, 12, true);
    if (budgetPerPerson) {
      addText(`Per Person: ₹${budgetPerPerson.toLocaleString('en-IN')}`, 12, true);
    }
    addText(`Category: ${category}`, 12, true);
    yPosition += 15;

    // Add itinerary content
    addText('Detailed Itinerary:', 16, true);
    yPosition += 5;
    
    // Clean and format the itinerary text
    const cleanItinerary = itinerary
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
      .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
      .replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newlines
      .replace(/<[^>]*>/g, '') // Remove any other HTML tags
      .trim();

    addText(cleanItinerary, 10);

    // Add footer
    yPosition += 20;
    addText(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 8);
    addText('Created with TripTuner - Your AI Travel Architect', 8);

    // Convert PDF to blob
    const pdfBlob = doc.output('blob');

    // Save to Supabase Storage
    const result = await saveTripAsPDF(destination, pdfBlob);
    
    showToast('Trip saved and PDF stored successfully! ✅', 'success');
    return result;

  } catch (error) {
    console.error('Error saving trip as PDF:', error);
    showToast(`Failed to save trip: ${error.message}`, 'error');
    throw error;
  }
};

// Helper function to extract trip data from different sources
export const extractTripData = (source, type = 'chat') => {
  if (type === 'chat') {
    // Extract from chat message content
    const content = source.content || source;
    
    return {
      destination: extractDestination(content),
      itinerary: content,
      duration: extractDuration(content),
      groupSize: extractGroupSize(content),
      budget: extractBudget(content),
      category: 'Adventure'
    };
  }
  
  if (type === 'form') {
    // Extract from form data (Plan Trip page)
    return {
      destination: source.destination,
      itinerary: source.plan || source.itinerary,
      duration: source.duration || source.duration_days,
      groupSize: source.groupSize || source.group_size,
      budget: source.budget || source.budget_total,
      budgetPerPerson: source.budgetPerPerson || Math.round((source.budget || source.budget_total) / (source.groupSize || source.group_size || 2)),
      category: source.tripType || source.trip_type || 'Adventure',
      state: source.state
    };
  }
  
  if (type === 'generated') {
    // Extract from generated itinerary (NearMe, DestinationCard)
    return {
      destination: source.destination,
      itinerary: source.itinerary,
      duration: source.duration,
      groupSize: source.groupSize || 2,
      budget: source.budget,
      budgetPerPerson: source.budgetPerDay,
      category: source.category,
      state: source.state
    };
  }

  return source; // Return as-is if unknown type
};

// Helper functions to extract data from text
const extractDestination = (content) => {
  const destMatch = content.match(/(?:trip to|visit|explore|plan.*?(?:to|for))\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  return destMatch ? destMatch[1] : 'India Trip';
};

const extractDuration = (content) => {
  const daysMatch = content.match(/(\d+)[\s-]*(?:day|days)/i);
  return daysMatch ? parseInt(daysMatch[1]) : 5;
};

const extractGroupSize = (content) => {
  const groupMatch = content.match(/(\d+)\s*(?:people|person|pax|travelers)/i);
  return groupMatch ? parseInt(groupMatch[1]) : 2;
};

const extractBudget = (content) => {
  const budgetMatch = content.match(/₹\s*([0-9,]+)/);
  return budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : 25000;
};