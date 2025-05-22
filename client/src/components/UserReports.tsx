import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { generatePdfReport } from '@/utils/reportGenerator';
import { toast } from 'sonner';
import { getResults } from '@/services/api';

// Define interfaces for API response items
interface ResultItem {
  _id: string;
  timestamp: string;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  scanDate?: string;
  originalImage?: string;
  prediction: string;
  confidence: number;
}

// Define the Report interface for better type safety
interface Report {
  id: string;
  date: string;
  title: string;
  type: string;
  status: string;
  patientId: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  scanDate: string;
  uploadedFileName: string;
  fileSize: string;
  tumorDetected: boolean;
  confidenceScore: number;
  tumorType: string;
  location?: string;
  dimensions?: string;
  volume?: string;
  boundaries?: string;
  recommendations: string[];
  imageUrl: string;
}

const UserReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const data = await getResults();
        
        // Transform the data to match our component's expected format
        // Using 'as any' here as a temporary workaround for type issues
        // In a real-world app, we would align the API types more precisely
        const apiData = data as any[];
        
        const formattedReports: Report[] = apiData.map((item) => ({
          id: item._id,
          date: new Date(item.timestamp).toISOString().split('T')[0],
          title: `Brain MRI Analysis`,
          type: 'MRI',
          status: 'Complete',
          patientId: item._id,
          patientName: item.patientName || 'Not specified',
          patientAge: item.patientAge || 'Not specified',
          patientGender: item.patientGender || 'Not specified',
          scanDate: item.scanDate || new Date(item.timestamp).toISOString().split('T')[0],
          uploadedFileName: item.originalImage || 'scan.jpg',
          fileSize: '10 MB', // This would need to come from the server in a real app
          tumorDetected: item.prediction !== 'No Tumor',
          confidenceScore: Math.round(item.confidence * 100),
          tumorType: item.prediction,
          location: 'Not specified', // Would need more data from the server
          recommendations: item.prediction !== 'No Tumor' 
            ? [
                "Consult with a neurologist or neurosurgeon",
                "Consider biopsy for definitive diagnosis",
                "Schedule follow-up MRI in 4-6 weeks",
                "Additional MRI with contrast recommended"
              ]
            : [
                "No immediate follow-up required based on imaging",
                "Continue with standard clinical care",
                "Consider routine follow-up scan in 12 months if clinically indicated"
              ],
          imageUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/uploads/${item.originalImage}`
        }));
        
        setReports(formattedReports);
        setError(null);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports. Please try again later.");
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, []);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const handleDownloadReport = () => {
    if (selectedReport) {
      try {
        // We pass the report data object and the image URL
        // The normalized data handling in reportGenerator will ensure consistency
        generatePdfReport(selectedReport, selectedReport.imageUrl);
        toast.success("Report downloaded successfully");
      } catch (error) {
        console.error("Error downloading report:", error);
        toast.error("Failed to download report");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Recent Reports</h2>
          <FileText className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading reports...</span>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : reports.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.date}</TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewReport(report)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No reports available yet.</p>
            <Link to="/analysis">
              <Button variant="outline" className="mt-4">Create Your First Report</Button>
            </Link>
          </div>
        )}
      </CardContent>

      {/* Report Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedReport && (
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedReport.title}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                  {selectedReport.status}
                </span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-medium border-b pb-2 mb-2">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Patient ID:</span> {selectedReport.patientId}</div>
                  <div><span className="font-medium">Age:</span> {selectedReport.patientAge}</div>
                  <div><span className="font-medium">Gender:</span> {selectedReport.patientGender}</div>
                  <div><span className="font-medium">Scan Date:</span> {selectedReport.scanDate}</div>
                </div>
              </div>
              
              {/* Scan Information */}
              <div>
                <h3 className="text-lg font-medium border-b pb-2 mb-2">Scan Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">File:</span> {selectedReport.uploadedFileName}</div>
                  <div><span className="font-medium">Size:</span> {selectedReport.fileSize}</div>
                  <div><span className="font-medium">Type:</span> {selectedReport.type}</div>
                  <div><span className="font-medium">Report Date:</span> {selectedReport.date}</div>
                </div>
              </div>
              
              {/* Scan Preview */}
              <div>
                <h3 className="text-lg font-medium border-b pb-2 mb-2">Scan Preview</h3>
                <div className="flex justify-center">
                  <img 
                    src={selectedReport.imageUrl} 
                    alt="Scan preview" 
                    className="max-h-64 object-contain border rounded"
                  />
                </div>
              </div>
              
              {/* Results */}
              <div>
                <h3 className="text-lg font-medium border-b pb-2 mb-2">Analysis Results</h3>
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedReport.tumorDetected 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400' 
                      : 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                  }`}>
                    {selectedReport.tumorDetected ? '⚠️ Potential tumor detected' : '✓ No tumor detected'}
                  </span>
                </div>
                
                {selectedReport.tumorDetected && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-2">
                    {selectedReport.tumorType && (
                      <div><span className="font-medium">Tumor Type:</span> {selectedReport.tumorType}</div>
                    )}
                    {selectedReport.confidenceScore && (
                      <div><span className="font-medium">Confidence:</span> {selectedReport.confidenceScore}%</div>
                    )}
                    {selectedReport.location && (
                      <div><span className="font-medium">Location:</span> {selectedReport.location}</div>
                    )}
                    {selectedReport.dimensions && (
                      <div><span className="font-medium">Dimensions:</span> {selectedReport.dimensions}</div>
                    )}
                    {selectedReport.volume && (
                      <div><span className="font-medium">Volume:</span> {selectedReport.volume}</div>
                    )}
                    {selectedReport.boundaries && (
                      <div><span className="font-medium">Boundaries:</span> {selectedReport.boundaries}</div>
                    )}
                  </div>
                )}
                
                {!selectedReport.tumorDetected && (
                  <p className="text-sm">
                    The scan appears normal with no signs of tumors or significant abnormalities.
                  </p>
                )}
              </div>
              
              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-medium border-b pb-2 mb-2">Recommendations</h3>
                {selectedReport.recommendations && selectedReport.recommendations.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {selectedReport.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">No specific recommendations provided.</p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
              <Button onClick={handleDownloadReport} className="flex items-center gap-1">
                <Download className="h-4 w-4" /> 
                Download PDF Report
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </Card>
  );
};

export default UserReports;
