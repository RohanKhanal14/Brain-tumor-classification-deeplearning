import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { generatePdfReport } from "@/utils/reportGenerator";
import { analyzeMRI, uploadFileWithProgress } from "@/services/api";


const Analysis = () => {
  
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [tumorDetected, setTumorDetected] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [tumorType, setTumorType] = useState("");
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [zoom, setZoom] = useState(100);
  const [isPanning, setIsPanning] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });

  // New state for patient information
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [scanDate, setScanDate] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // Helper function for uploading files with real progress tracking
  const handleFileUploadWithProgress = (file: File) => {
    if (!file) return;

    // Prepare for actual file upload
    setIsUploading(true);
    setUploadProgress(0);

    uploadFileWithProgress(
      file,
      // Progress callback
      (progress) => {
        setUploadProgress(progress);
      },
      // Complete callback
      (response) => {
        setTimeout(() => {
          setUploadedFile(file);
          setIsUploading(false);
          setStep(2);
          toast({
            title: "Upload Complete",
            description: "MRI scan uploaded successfully.",
            variant: "default",
          });
        }, 500);
      },
      // Error callback
      (error) => {
        console.error('Upload error:', error);
        toast({
          title: "Upload Failed",
          description: error.message || "There was a problem uploading your file.",
          variant: "destructive",
        });
        setIsUploading(false);
      }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUploadWithProgress(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-neuraiBlue");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-neuraiBlue");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-neuraiBlue");

    const file = e.dataTransfer.files[0];
    if (file) {
      console.log('Dropped file:', file.name);
      handleFileUploadWithProgress(file);
    }
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Log the patient information and uploaded file
    console.log("Form submitted with the following data:");
    console.log({
      fileName: uploadedFile?.name,
      fileSize: uploadedFile ? `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'No file',
      patientName,
      patientAge,
      patientGender,
      scanDate
    });
    
    // Show a notification that analysis has started
    toast({
      title: "Analysis Started",
      description: "Processing your MRI scan with patient information",
      variant: "default",
    });

    try {
      if (!uploadedFile) {
        throw new Error("No file to analyze");
      }
      
      // Prepare patient data for API call
      const patientData = {
        patientName,
        patientAge,
        patientGender,
        scanDate
      };
      
      // Progress simulation for better UX during API call
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          // Progress more slowly than in the simulation to account for real API time
          const newProgress = prev + Math.random() * 4;
          return newProgress >= 90 ? 90 : newProgress; // Cap at 90% until API responds
        });
      }, 300);
      
      // Use the analyzeMRI function from api.ts service
      const analysisResult = await analyzeMRI(uploadedFile, patientData);
      
      clearInterval(progressInterval);
      
      toast({
        title: "Analysis Complete",
        description: "Your MRI scan has been analyzed successfully.",
        variant: "default",
      });
      
      // Update state with API results
      setAnalysisProgress(100);
      
      // Set tumor detection based on API response
      const prediction = analysisResult.result.prediction || '';
      const isTumorDetected = prediction.toLowerCase() !== 'normal';
      
      setTumorDetected(isTumorDetected);
      
      if (isTumorDetected) {
        // Convert API confidence to a percentage
        const confidencePercent = Math.round(analysisResult.result.confidence * 100);
        setConfidenceScore(confidencePercent);
        
        // Set tumor type from API prediction
        setTumorType(prediction || "Unspecified");
      }
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        setStep(3);
      }, 500);
      
    } catch (error) {
      console.error("Error during analysis:", error);
      
      toast({
        title: "Analysis Error",
        description: "There was an error processing the image. Using simulated results instead.",
        variant: "destructive",
      });
      
      // Fall back to simulated results if API fails
      setAnalysisProgress(100);
      
      // Simulate analysis results (for demo purposes)
      const detectedTumor = Math.random() > 0.3; // 70% chance of tumor detection for demo
      setTumorDetected(detectedTumor);

      if (detectedTumor) {
        const confidence = 70 + Math.random() * 25; // Generate confidence between 70-95%
        setConfidenceScore(Math.round(confidence));

        // Randomly select tumor type for demo
        const tumorTypes = [
          "Glioma",
          "Meningioma",
          "Pituitary",
          "Metastatic",
        ];
        setTumorType(
          tumorTypes[Math.floor(Math.random() * tumorTypes.length)]
        );
      }
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        setStep(3);
      }, 500);
    }
  };

  const resetAnalysis = () => {
    setUploadedFile(null);
    setAnalysisComplete(false);
    setTumorDetected(false);
    setConfidenceScore(0);
    setTumorType("");
    setBrightness(50);
    setContrast(50);
    setZoom(100);
    setPanPosition({ x: 0, y: 0 });
    setStep(1);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (analysisComplete) {
      setIsPanning(true);
      setStartPanPosition({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && analysisComplete) {
      setPanPosition({
        x: e.clientX - startPanPosition.x,
        y: e.clientY - startPanPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  const generateReport = () => {
    if (!uploadedFile) return;

    // Convert the current image to a data URL for inclusion in the PDF
    let imageUrl = "";
    if (imageRef.current) {
      try {
        // Create a canvas to capture the image with applied filters
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (context && imageRef.current.complete) {
          canvas.width = imageRef.current.naturalWidth;
          canvas.height = imageRef.current.naturalHeight;

          // Apply brightness and contrast
          context.filter = `brightness(${brightness / 50}) contrast(${
            contrast / 50
          })`;
          context.drawImage(imageRef.current, 0, 0);

          // If tumor is detected, draw a highlight
          if (tumorDetected) {
            context.strokeStyle = "red";
            context.lineWidth = 3;
            context.beginPath();
            context.arc(
              canvas.width * 0.6, // x position
              canvas.height * 0.4, // y position
              40, // radius
              0, // start angle
              Math.PI * 2 // end angle (full circle)
            );
            context.stroke();

            // Add semi-transparent fill
            context.fillStyle = "rgba(255, 0, 0, 0.3)";
            context.fill();
          }

          imageUrl = canvas.toDataURL("image/jpeg");
        }
      } catch (error) {
        console.error("Error creating image for report:", error);
      }
    }

    // Define recommendations based on findings
    const recommendations = tumorDetected
      ? [
          "Consult with a neurologist or neurosurgeon",
          "Consider biopsy for definitive diagnosis",
          "Schedule follow-up MRI in 4-6 weeks",
          "Additional MRI with contrast recommended",
        ]
      : [
          "No immediate follow-up required based on imaging",
          "Continue with standard clinical care",
          "Consider routine follow-up scan in 12 months if clinically indicated",
        ];

    // Prepare report data - these fields match the structure expected by reportGenerator's normalizeReportData function
    const reportData = {
      patientName,
      patientAge,
      patientGender,
      scanDate,
      uploadedFileName: uploadedFile.name,
      fileSize: `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`,
      tumorDetected,
      confidenceScore: tumorDetected ? confidenceScore : 0,
      tumorType: tumorDetected ? tumorType : 'No Tumor',
      recommendations,
      date: new Date().toISOString().split('T')[0],
      title: 'Brain MRI Analysis',
      type: 'MRI',
      status: 'Complete',
      // Include additional fields for tumor details if available
      location: tumorDetected ? 'Detected in scan' : undefined,
      dimensions: tumorDetected ? 'See scan visualization' : undefined,
    };

    // Generate and download the PDF report
    generatePdfReport(reportData, imageUrl);

    toast({
      title: "Report Generated",
      description: "Your analysis report has been downloaded.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (step === 2 && uploadedFile) {
            startAnalysis();
          }
        }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              MRI Analysis Demo
            </h1>
            <p className="text-gray-600 mb-10">
              Experience NeurAI Detect's brain tumor detection capabilities.
              Upload a sample MRI scan for analysis.
            </p>

            {/* Steps indicator */}
            <div className="mb-10">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= 1
                      ? "bg-neuraiBlue text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > 1 ? "bg-neuraiBlue" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= 2
                      ? "bg-neuraiBlue text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > 2 ? "bg-neuraiBlue" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= 3
                      ? "bg-neuraiBlue text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="w-10 text-center">Upload</span>
                <span className="w-10 text-center ml-auto mr-auto">Review</span>
                <span className="w-10 text-center">Results</span>
              </div>
            </div>

            {/* Step 1: Upload */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Upload MRI Scan
                </h2>
                <p className="text-gray-600 mb-6">
                  Upload a brain MRI scan in DICOM, NIfTI, or common image
                  formats (JPG, PNG). For this demo, any image file will work.
                </p>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    isUploading
                      ? "bg-gray-50"
                      : "hover:bg-gray-50 cursor-pointer"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                    // {...register("uploadedFile")}
                    accept="image/*"
                  />

                  {isUploading ? (
                    <div className="py-4">
                      <div className="mb-2 text-neuraiBlue font-medium">
                        Uploading...
                      </div>
                      <Progress value={uploadProgress} className="h-2 mb-2" />
                      <div className="text-sm text-gray-500">
                        {Math.round(uploadProgress)}%
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="mx-auto h-16 w-16 text-gray-400 mb-4"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="text-lg font-medium text-gray-900 mb-1">
                        Drag and drop MRI image
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        Or click to browse files
                      </div>
                      <Button className="bg-neuraiBlue hover:bg-neuraiBlue-dark">
                        Select File
                      </Button>
                    </>
                  )}
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="shrink-0 text-blue-500">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Demo Information
                      </h3>
                      <div className="text-sm text-blue-700 mt-1">
                        <p>
                          This is a demonstration of NeurAI Detect's interface.
                          For the demo, any image file will be accepted.
                        </p>
                        <p className="mt-1">
                          Analysis results are simulated for demonstration
                          purposes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Review & Analyze */}
            {step === 2 && uploadedFile && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Review & Analyze
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="bg-black rounded-lg mb-4 overflow-hidden">
                      <img
                        src={URL.createObjectURL(uploadedFile)}
                        alt="Uploaded MRI scan"
                        className="w-full h-auto"
                      />
                    </div>

                    <div className="text-sm text-gray-600 mb-6">
                      <div className="flex justify-between mb-1">
                        <span>Filename:</span>
                        <span className="font-medium">{uploadedFile.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-medium">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Patient Information (Optional)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., John Doe"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Age
                        </label>
                        <input
                          type="number"
                          placeholder="e.g., 45"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Gender
                        </label>
                        <Select onValueChange={(value) => setPatientGender(value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Scan Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={scanDate}
                          onChange={(e) => setScanDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Analysis Options
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="full_analysis"
                          className="h-4 w-4 text-neuraiBlue"
                          checked
                        />
                        <label
                          htmlFor="full_analysis"
                          className="ml-2 text-gray-700"
                        >
                          Comprehensive tumor analysis
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="tumor_class"
                          className="h-4 w-4 text-neuraiBlue"
                          checked
                        />
                        <label
                          htmlFor="tumor_class"
                          className="ml-2 text-gray-700"
                        >
                          Tumor classification
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="measurements"
                          className="h-4 w-4 text-neuraiBlue"
                          checked
                        />
                        <label
                          htmlFor="measurements"
                          className="ml-2 text-gray-700"
                        >
                          Size measurements
                        </label>
                      </div>
                    </div>

                    {isAnalyzing ? (
                      <div className="bg-neuraiBlue/5 rounded-lg p-6 text-center">
                        <div className="mb-3 text-neuraiBlue font-medium">
                          Analyzing MRI scan...
                        </div>
                        <Progress
                          value={analysisProgress}
                          className="h-2 mb-2"
                        />
                        <div className="text-sm text-gray-500">
                          {Math.round(analysisProgress)}%
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          This may take a few moments
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-3">
                        <Button
                          type="submit"
                          className="flex-1 bg-neuraiBlue hover:bg-neuraiBlue-dark"
                        >
                          Start Analysis
                        </Button>
                        <Button
                          onClick={resetAnalysis}
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Results */}
            {step === 3 && analysisComplete && uploadedFile && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Analysis Results
                  </h2>
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    className="border-neuraiBlue text-neuraiBlue hover:bg-neuraiBlue/5"
                  >
                    Start New Analysis
                  </Button>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="flex items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mr-6 ${
                        tumorDetected && (tumorType === "Meningioma" || tumorType === "Glioma" || tumorType === "Pituitary")
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {tumorDetected && (tumorType === "Meningioma" || tumorType === "Glioma" || tumorType === "Pituitary") ? (
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {tumorDetected && (tumorType === "Meningioma" || tumorType === "Glioma" || tumorType === "Pituitary")
                          ? "Potential tumor detected"
                          : "No tumor detected"}
                      </h3>
                      <p className="text-gray-600">
                        {tumorDetected && (tumorType === "Meningioma" || tumorType === "Glioma" || tumorType === "Pituitary")
                          ? `Confidence: ${confidenceScore}% - Classification: ${tumorType} tumor`
                          : "Analysis completed. No suspicious areas identified."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      MRI Visualization
                    </h3>

                    <div
                      className="bg-black rounded-lg mb-4 overflow-hidden relative cursor-move"
                      style={{ height: "450px" }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          transform: `translate(${panPosition.x}px, ${
                            panPosition.y
                          }px) scale(${zoom / 100})`,
                          filter: `brightness(${brightness / 50}) contrast(${
                            contrast / 50
                          })`,
                        }}
                      >
                        <img
                          ref={imageRef}
                          src={URL.createObjectURL(uploadedFile)}
                          alt="MRI scan with analysis"
                          className="max-w-full max-h-full"
                        />
                      </div>

                      {/* Zoom controls */}
                      <div className="absolute top-4 right-4 bg-black/50 rounded-lg p-2">
                        <button
                          onClick={() =>
                            setZoom((prev) => Math.min(prev + 10, 200))
                          }
                          className="text-white p-1 hover:bg-white/20 rounded"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zm0 0v8m-4 8h.01M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            ></path>
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            setZoom((prev) => Math.max(prev - 10, 50))
                          }
                          className="text-white p-1 hover:bg-white/20 rounded ml-1"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                            ></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setZoom(100);
                            setPanPosition({ x: 0, y: 0 });
                          }}
                          className="text-white p-1 hover:bg-white/20 rounded ml-1"
                          title="Reset view"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            ></path>
                          </svg>
                        </button>
                      </div>

                      {/* Information overlay */}
                      {tumorDetected && (
                        <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg text-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span>Classification:</span>
                            <span className="font-semibold">
                              {tumorType} tumor
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                          Brightness
                        </label>
                        <Slider
                          value={[brightness]}
                          onValueChange={(values) => setBrightness(values[0])}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                          Contrast
                        </label>
                        <Slider
                          value={[contrast]}
                          onValueChange={(values) => setContrast(values[0])}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                          Zoom
                        </label>
                        <Slider
                          value={[zoom]}
                          onValueChange={(values) => setZoom(values[0])}
                          min={50}
                          max={200}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          if (imageRef.current) {
                            const link = document.createElement("a");
                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");

                            if (context && imageRef.current.complete) {
                              canvas.width = imageRef.current.naturalWidth;
                              canvas.height = imageRef.current.naturalHeight;
                              context.filter = `brightness(${
                                brightness / 50
                              }) contrast(${contrast / 50})`;
                              context.drawImage(imageRef.current, 0, 0);

                              link.download = "neurai-mri-analysis.jpg";
                              link.href = canvas.toDataURL("image/jpeg");
                              link.click();

                              toast({
                                title: "Image Exported",
                                description:
                                  "MRI image has been saved to your downloads.",
                                variant: "default",
                              });
                            }
                          }
                        }}
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          ></path>
                        </svg>
                        Export Image
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={generateReport}
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          ></path>
                        </svg>
                        Generate Report
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Tabs defaultValue="details">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="recommendations">
                          Recommendations
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="details" className="mt-4">
                        {tumorDetected && (tumorType === "Meningioma" || tumorType === "Glioma" || tumorType === "Pituitary") ? (
                          <Card>
                            <CardContent className="p-4 space-y-4">
                              <div>
                                <div className="text-sm font-medium text-gray-500">
                                  Tumor Type
                                </div>
                                <div className="font-semibold text-gray-900">
                                  {tumorType}
                                </div>
                              </div>

                              <div>
                                <div className="text-sm font-medium text-gray-500">
                                  Confidence Score
                                </div>
                                <div className="flex items-center">
                                  <div className="font-semibold text-gray-900 mr-2">
                                    {confidenceScore}%
                                  </div>
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={cn(
                                        "h-full",
                                        confidenceScore > 90
                                          ? "bg-red-500"
                                          : confidenceScore > 75
                                          ? "bg-orange-500"
                                          : "bg-yellow-500"
                                      )}
                                      style={{ width: `${confidenceScore}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-center h-40">
                                <div className="text-center">
                                  <svg
                                    className="mx-auto h-12 w-12 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    ></path>
                                  </svg>
                                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                                    No abnormalities detected
                                  </h3>
                                  <p className="mt-1 text-sm text-gray-500">
                                    The scan appears normal with no signs of
                                    tumors or significant abnormalities.
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>

                      <TabsContent value="recommendations" className="mt-4">
                        <Card>
                          <CardContent className="p-4">
                            {tumorDetected ? (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    Suggested Next Steps
                                  </h4>
                                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start">
                                      <svg
                                        className="h-5 w-5 text-neuraiBlue shrink-0 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        ></path>
                                      </svg>
                                      <span>
                                        Consult with a neurologist or
                                        neurosurgeon
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <svg
                                        className="h-5 w-5 text-neuraiBlue shrink-0 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        ></path>
                                      </svg>
                                      <span>
                                        Consider biopsy for definitive diagnosis
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <svg
                                        className="h-5 w-5 text-neuraiBlue shrink-0 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        ></path>
                                      </svg>
                                      <span>
                                        Schedule follow-up MRI in 4-6 weeks
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <svg
                                        className="h-5 w-5 text-neuraiBlue shrink-0 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        ></path>
                                      </svg>
                                      <span>
                                        Additional MRI with contrast recommended
                                      </span>
                                    </li>
                                  </ul>
                                </div>

                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    Additional Tests to Consider
                                  </h4>
                                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                    <li>• Functional MRI (fMRI)</li>
                                    <li>• CT scan with contrast</li>
                                    <li>• PET scan</li>
                                    <li>• Neurological assessment</li>
                                  </ul>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    Follow-Up Recommendations
                                  </h4>
                                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start">
                                      <svg
                                        className="h-5 w-5 text-green-500 shrink-0 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M5 13l4 4L19 7"
                                        ></path>
                                      </svg>
                                      <span>
                                        No immediate follow-up required based on
                                        imaging
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <svg
                                        className="h-5 w-5 text-green-500 shrink-0 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M5 13l4 4L19 7"
                                        ></path>
                                      </svg>
                                      <span>
                                        Continue with standard clinical care
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <svg
                                        className="h-5 w-5 text-green-500 shrink-0 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M5 13l4 4L19 7"
                                        ></path>
                                      </svg>
                                      <span>
                                        Consider routine follow-up scan in 12
                                        months if clinically indicated
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>

                    {tumorDetected && (
                      <div className="mt-6">
                        <Button className="w-full bg-neuraiPurple hover:bg-neuraiPurple-dark">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          Get Second Opinion
                        </Button>
                      </div>
                    )}

                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                      <div className="flex">
                        <div className="shrink-0 text-blue-500">
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">
                            Demo Disclaimer
                          </h3>
                          <div className="text-sm text-blue-700 mt-1">
                            <p>
                              This is a demonstration with simulated results. In
                              a real clinical setting, results would be based on
                              actual MRI analysis by our AI.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Analysis;
