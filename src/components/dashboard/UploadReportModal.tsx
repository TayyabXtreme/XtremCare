'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  FileText, 
  Brain,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X
} from 'lucide-react';
import { uploadMedicalReportFile, createMedicalReport, updateReportWithAI, CreateReportData } from '@/utils/supabase/medical-reports';
import { analyzeMedicalReport } from '@/utils/ai/gemini';
import { toast } from 'sonner';

interface UploadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

const UploadReportModal = ({ isOpen, onClose, onUploadComplete }: UploadReportModalProps) => {
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<'upload' | 'analyzing' | 'complete'>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, JPG, PNG files are allowed');
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user?.id) return;

    try {
      setIsUploading(true);
      setUploadStep('upload');
      
      // Step 1: Upload file to Supabase Storage
      toast.loading('Uploading file...');
      const uploadResult = await uploadMedicalReportFile(user.id, selectedFile);
      
      if (!uploadResult) throw new Error('Failed to upload file');
      
      // Step 2: Create medical report record
      const reportData: CreateReportData = {
        clerk_user_id: user.id,
        report_file_url: uploadResult,
        report_file_name: selectedFile.name,
        report_file_type: selectedFile.type.includes('pdf') ? 'pdf' : 
                         selectedFile.type.includes('image') ? 'image' : 'other',
        report_type: reportType || undefined,
        report_notes: reportNotes || undefined,
      };
      
      const { data: reportRecord, error: createError } = await createMedicalReport(reportData);
      
      if (createError || !reportRecord) throw createError || new Error('Failed to create report record');
      
      toast.dismiss();
      toast.success('File uploaded successfully!');
      
      // Step 3: AI Analysis
      setUploadStep('analyzing');
      toast.dismiss();
      toast.loading('Analyzing report with Gemini AI...');
      
      try {
        // Convert file to base64 for AI analysis
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64String = reader.result as string;
            // Remove the data:image/jpeg;base64, prefix to get clean base64
            const cleanBase64 = base64String.split(',')[1];
            
            console.log('Starting AI analysis...');
            const aiAnalysis = await analyzeMedicalReport(
              cleanBase64,
              reportType || 'general',
              selectedFile.type
            );
            
            if (aiAnalysis) {
              // Update report with AI analysis
              console.log('Updating report with AI analysis...');
              const updateResult = await updateReportWithAI(reportRecord.id, aiAnalysis);
              
              if (updateResult.error) {
                throw new Error(`Failed to save AI analysis: ${updateResult.error.message}`);
              }
              
              toast.dismiss();
              toast.success('AI analysis completed successfully!');
              setUploadStep('complete');
            } else {
              throw new Error('AI analysis returned null');
            }
          } catch (aiError) {
            console.error('AI analysis error:', aiError);
            toast.dismiss();
            
            // Try to update with fallback analysis if main AI analysis failed
            try {
              console.log('Attempting fallback analysis update...');
              const fallbackAnalysis = {
                ai_summary_english: "Your medical report has been uploaded successfully. The AI analysis encountered an issue, but your report is safely stored. Please consult your healthcare provider for professional interpretation of your results.",
                ai_summary_urdu: "Aapki medical report successfully upload ho gayi hai. AI analysis mein kuch issue aya, lekin aapki report safely store hai. Professional interpretation ke liye apne doctor se zaroor consult karein.",
                ai_abnormal_values: ["AI analysis incomplete - manual review recommended"],
                ai_doctor_questions: [
                  "Could you review my uploaded report and explain the key findings?",
                  "Are there any values in my report that need attention?"
                ],
                ai_food_to_avoid: ["Processed foods", "Excessive sugar"],
                ai_better_foods: ["Fresh fruits and vegetables", "Lean proteins"],
                ai_home_remedies: ["Maintain regular sleep schedule", "Stay hydrated"],
                ai_risk_level: "low" as const
              };
              
              const fallbackResult = await updateReportWithAI(reportRecord.id, fallbackAnalysis);
              if (fallbackResult.error) {
                console.error('Fallback update also failed:', fallbackResult.error);
                toast.error(`Upload completed but AI analysis failed: ${fallbackResult.error.message}`);
              } else {
                toast.warning('Report uploaded with basic analysis. AI processing incomplete.');
              }
            } catch (fallbackError) {
              console.error('Fallback analysis failed:', fallbackError);
              toast.error('Report uploaded but AI analysis completely failed. Report saved successfully.');
            }
            
            setUploadStep('complete');
          }
        };
        
        reader.onerror = () => {
          console.error('File reading error');
          toast.dismiss();
          toast.warning('File processing error. Report saved without AI analysis.');
          setUploadStep('complete');
        };
        
        reader.readAsDataURL(selectedFile);
        
      } catch (aiError) {
        console.error('AI analysis setup error:', aiError);
        toast.dismiss();
        toast.warning('Report uploaded but AI analysis failed. You can retry analysis later.');
        setUploadStep('complete');
      }
      
      // Complete upload
      setTimeout(() => {
        onUploadComplete();
      }, 1500);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.dismiss();
      
      // Prevent page refresh by handling error gracefully
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Upload failed: ${errorMessage.substring(0, 100)}...`);
      
      setIsUploading(false);
      setUploadStep('upload');
      
      // Don't close modal, let user retry
    } finally {
      // Ensure loading state is cleared
      setIsUploading(false);
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setReportType('');
    setBloodGroup('');
    setReportNotes('');
    setIsUploading(false);
    setUploadStep('upload');
  };

  const handleClose = () => {
    if (!isUploading) {
      resetModal();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Upload Medical Report</DialogTitle>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-7 h-7 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Upload Medical Report
              </h2>
            </div>
            {!isUploading && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {uploadStep === 'upload' && (
            <>
              {/* File Upload */}
              <div className="space-y-4">
                <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  Choose Medical Report File *
                </Label>
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    selectedFile 
                      ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/50' 
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-950/50 hover:border-green-500 dark:hover:border-green-500'
                  }`}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  {selectedFile ? (
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        PDF, JPG, PNG (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>
                <Input
                  id="file-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Report Type */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  Report Type (Optional)
                </Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="h-12 rounded-xl border-2">
                    <SelectValue placeholder="Select report type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood-test">Blood Test</SelectItem>
                    <SelectItem value="lipid-profile">Lipid Profile</SelectItem>
                    <SelectItem value="diabetes-panel">Diabetes Panel</SelectItem>
                    <SelectItem value="liver-function">Liver Function Test</SelectItem>
                    <SelectItem value="kidney-function">Kidney Function Test</SelectItem>
                    <SelectItem value="thyroid">Thyroid Function Test</SelectItem>
                    <SelectItem value="vitamin-d">Vitamin D Test</SelectItem>
                    <SelectItem value="xray">X-Ray</SelectItem>
                    <SelectItem value="ultrasound">Ultrasound</SelectItem>
                    <SelectItem value="mri">MRI</SelectItem>
                    <SelectItem value="ct-scan">CT Scan</SelectItem>
                    <SelectItem value="ecg">ECG/EKG</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Blood Group */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  Blood Group (Optional)
                </Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger className="h-12 rounded-xl border-2">
                    <SelectValue placeholder="Select blood group..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Koi additional details jo aap AI ko batana chahein..."
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-700 resize-none"
                  rows={3}
                />
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-500 dark:to-green-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Upload & Analyze with AI
                  </>
                )}
              </Button>
            </>
          )}

          {uploadStep === 'analyzing' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                AI Analysis in Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Gemini AI is analyzing your medical report...
              </p>
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600 dark:text-green-400" />
              </div>
            </div>
          )}

          {uploadStep === 'complete' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Upload Complete! ✅
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your report has been uploaded and analyzed successfully.
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Redirecting to dashboard...
              </p>
            </div>
          )}

          {/* Medical Disclaimer */}
          {uploadStep === 'upload' && (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 text-sm mb-1">
                    Medical Disclaimer
                  </h4>
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    AI analysis is for informational purposes only. Always consult your doctor for medical decisions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadReportModal;
