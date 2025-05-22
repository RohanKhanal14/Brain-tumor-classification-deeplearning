import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

interface ReportData {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  scanDate?: string;
  uploadedFileName: string;
  fileSize: string;
  tumorDetected: boolean;
  confidenceScore?: number;
  tumorType?: string;
  recommendations: string[];
  // Additional properties that might be in Report interface
  location?: string;
  dimensions?: string;
  volume?: string;
  boundaries?: string;
  id?: string;
  date?: string;
  title?: string;
  type?: string;
  status?: string;
  patientId?: string;
}

// Function to ensure consistent report data structure regardless of source
const normalizeReportData = (data: any): ReportData => {
  // Determine if a tumor is detected
  // Check both explicit boolean flag and prediction/tumorType field
  const isTumorDetected = typeof data.tumorDetected === 'boolean'
    ? data.tumorDetected
    : data.tumorType 
      ? data.tumorType.toLowerCase() !== 'normal' && data.tumorType.toLowerCase() !== 'no tumor'
      : data.prediction 
        ? data.prediction.toLowerCase() !== 'normal' && data.prediction.toLowerCase() !== 'no tumor'
        : false;
        
  // Ensure we have recommendations array in the correct format
  let recommendations: string[] = [];
  
  if (data.recommendations && Array.isArray(data.recommendations)) {
    recommendations = data.recommendations;
  } else if (isTumorDetected) {
    recommendations = [
      "Consult with a neurologist or neurosurgeon",
      "Consider biopsy for definitive diagnosis",
      "Schedule follow-up MRI in 4-6 weeks",
      "Additional MRI with contrast recommended"
    ];
  } else {
    recommendations = [
      "No immediate follow-up required based on imaging",
      "Continue with standard clinical care",
      "Consider routine follow-up scan in 12 months if clinically indicated"
    ];
  }
  
  // Get tumor type from multiple possible sources
  const tumorType = isTumorDetected 
    ? (data.tumorType || data.prediction || 'Unspecified')
    : 'No Tumor';
    
  // Get confidence score from multiple possible sources and formats
  let confidenceScore = 0;
  if (typeof data.confidenceScore === 'number') {
    confidenceScore = data.confidenceScore;
  } else if (typeof data.confidence === 'number') {
    // If confidence is between 0 and 1, it's probably a decimal percentage
    confidenceScore = data.confidence > 1 ? data.confidence : Math.round(data.confidence * 100);
  }
  
  return {
    patientName: data.patientName || 'Not specified',
    patientAge: data.patientAge || 'Not specified',
    patientGender: data.patientGender || 'Not specified',
    scanDate: data.scanDate || (data.date || new Date().toISOString().split('T')[0]),
    uploadedFileName: data.uploadedFileName || data.originalImage || 'scan.jpg',
    fileSize: data.fileSize || '10 MB',
    tumorDetected: isTumorDetected,
    confidenceScore: confidenceScore,
    tumorType: tumorType,
    recommendations: recommendations,
    location: data.location || 'Not specified',
    dimensions: data.dimensions || 'Not specified',
    volume: data.volume || 'Not specified',
    boundaries: data.boundaries || 'Not specified',
    id: data.id || data._id || undefined,
    date: data.date || (data.timestamp ? new Date(data.timestamp).toISOString().split('T')[0] : undefined),
    title: data.title || 'Brain MRI Analysis',
    type: data.type || 'MRI',
    status: data.status || 'Complete',
    patientId: data.patientId || data._id || undefined
  };
};

export const generatePdfReport = (data: any, imageUrl: string) => {
  // Normalize data to ensure consistent report structure
  const normalizedData = normalizeReportData(data);
  
  // Use normalizedData instead of data from this point forward
  // Create new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Add header with logo
  doc.setFillColor(30, 136, 229); // neuraiBlue
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("NeurAI Detect", 20, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("MRI Analysis Report", pageWidth - 20, 20, { align: "right" });

  // Add date
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), "PPP")}`, margin, 40);

  // Add patient information if available
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Information", margin, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  let yPos = 60;
  const lineHeight = 7;

  if (
    normalizedData.patientName ||
    normalizedData.patientAge ||
    normalizedData.patientGender
  ) {
    
    if (normalizedData.patientName) {
      doc.text(`Patient Name: ${normalizedData.patientName}`, margin, yPos);
      yPos += lineHeight;
    }

    if (normalizedData.patientAge) {
      doc.text(`Age: ${normalizedData.patientAge} years`, margin, yPos);
      yPos += lineHeight;
    }

    if (normalizedData.patientGender) {
      doc.text(`Gender: ${normalizedData.patientGender}`, margin, yPos);
      yPos += lineHeight;
    }

    if (normalizedData.scanDate) {
      doc.text(`Scan Date: ${normalizedData.scanDate}`, margin, yPos);
      yPos += lineHeight;
    }
  } else {
    doc.text("No patient information provided", margin, yPos);
    yPos += lineHeight;
  }

  yPos += 5;

  // Add scan information
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Scan Information", margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  yPos += 10;
  doc.text(`Filename: ${normalizedData.uploadedFileName}`, margin, yPos);
  yPos += lineHeight;
  doc.text(`File Size: ${normalizedData.fileSize}`, margin, yPos);
  yPos += lineHeight * 2;

  // Add MRI image if available
  if (imageUrl) {
    try {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("MRI Scan", margin, yPos);
      yPos += 10;

      // Add the MRI image
      const imgWidth = 170;
      const imgHeight = 100;
      
      // Check if we're dealing with a remote URL or data URL
      if (imageUrl.startsWith('http')) {
        // For remote URLs, we notify that the image won't be included
        // This is because jsPDF can't directly fetch remote images
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("Image preview available in the application", margin, yPos + 50);
        yPos += imgHeight + 15;
      } else {
        // For data URLs generated within the application, add them directly
        doc.addImage(imageUrl, "JPEG", margin, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 15;
      }
    } catch (error) {
      console.error("Error adding image to PDF:", error);
      yPos += 10;
    }
  }

  // Add analysis results
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Analysis Results", margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  yPos += 10;

  // Status indicator
  if (normalizedData.tumorDetected && normalizedData.tumorType === "Meningioma" || normalizedData.tumorType === "Glioma" || normalizedData.tumorType === "Pituitary") {
    doc.setTextColor(255, 152, 0); // orange/warning color
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("⚠️ Potential tumor detected", margin, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  } else {
    doc.setTextColor(76, 175, 80); // green/success color
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("✓ No tumor detected", margin, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  }

  yPos += lineHeight * 2;

  // If tumor details are available
  if (normalizedData.tumorDetected) {
    // Create a details table
    autoTable(doc, {
      startY: yPos,
      head: [["Property", "Value"]],
      body: [
        ["Tumor Type", normalizedData.tumorType || "Not specified"],
        [
          "Confidence Score",
          normalizedData.confidenceScore ? `${normalizedData.confidenceScore}%` : "Not specified",
        ],
        // Include additional details if available
        ...(normalizedData.location ? [["Location", normalizedData.location]] : []),
        ...(normalizedData.dimensions ? [["Dimensions", normalizedData.dimensions]] : []),
        ...(normalizedData.volume ? [["Volume", normalizedData.volume]] : []),
      ],
      theme: "striped",
      headStyles: {
        fillColor: [30, 136, 229],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    // @ts-ignore - The type definition doesn't include this property but it exists
    yPos = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.text(
      "The scan appears normal with no signs of tumors or significant abnormalities.",
      margin,
      yPos
    );
    yPos += lineHeight * 2;
  }

  // Add recommendations
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 30;
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Recommendations", margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  yPos += 10;

  if (normalizedData.recommendations && normalizedData.recommendations.length > 0) {
    normalizedData.recommendations.forEach((recommendation) => {
      doc.text(`• ${recommendation}`, margin, yPos);
      yPos += lineHeight;

      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 30;
      }
    });
  } else {
    doc.text("No specific recommendations provided.", margin, yPos);
  }

  // Add disclaimer
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 30;
  } else {
    yPos += lineHeight * 2;
  }

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "DISCLAIMER: This report was generated by NeurAI Detect, an AI-based medical imaging analysis tool. " +
      "All findings should be reviewed by a qualified healthcare professional. This tool is designed to assist, " +
      "not replace, clinical judgment.",
    margin,
    yPos,
    { maxWidth: pageWidth - margin * 2 }
  );

  yPos += lineHeight * 3;
  doc.text(
    `Report ID: ${Math.random().toString(36).substring(2, 15)}`,
    margin,
    yPos
  );

  // Save the PDF
  doc.save(`NeurAI_Report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
};
