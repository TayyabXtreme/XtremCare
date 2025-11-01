'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  X,
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Download,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Loader2
} from 'lucide-react';

interface MedicalReport {
  id: string;
  report_file_name?: string;
  report_file_url?: string;
  report_file_type?: string;
  report_type?: string;
  report_notes?: string;
  uploaded_at?: string;
  created_at?: string;
  ai_analyzed?: boolean;
  ai_analyzed_at?: string;
  ai_risk_level?: 'low' | 'medium' | 'high' | 'critical';
  ai_summary_english?: string;
  ai_summary_urdu?: string;
  ai_abnormal_values?: string[];
  ai_doctor_questions?: string[];
  ai_food_to_avoid?: string[];
  ai_better_foods?: string[];
  ai_home_remedies?: string[];
}

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: MedicalReport | null;
}

const ReportDetailsModal = ({ isOpen, onClose, report }: ReportDetailsModalProps) => {
  const [showReportImage, setShowReportImage] = useState(true);

  if (!report) return null;

  const handleDownloadReport = () => {
    if (report.report_file_url) {
      window.open(report.report_file_url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[95vh] overflow-y-auto p-3 sm:p-6">
        <DialogTitle className="sr-only">{report.report_file_name || 'Medical Report'}</DialogTitle>
        <DialogHeader>
          <div className="flex items-center justify-between pr-2 sm:pr-6">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-green-600 dark:text-green-400 flex-shrink-0" />
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {report.report_file_name || 'Medical Report'}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 p-1">
          {/* Report Header Info */}
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                  {report.report_type && (
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-blue-600 text-white font-semibold capitalize">
                      {report.report_type.replace('-', ' ')}
                    </span>
                  )}
                  <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    report.ai_analyzed
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {report.ai_analyzed ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">AI </span>Analyzed
                      </>
                    ) : (
                      <>
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        <span className="hidden sm:inline">Pending </span>Analysis
                      </>
                    )}
                  </div>
                  {report.ai_risk_level && (
                    <div className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      report.ai_risk_level === 'low' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                      report.ai_risk_level === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                      report.ai_risk_level === 'high' ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' :
                      'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}>
                      {report.ai_risk_level === 'low' ? '🟢' : 
                       report.ai_risk_level === 'medium' ? '🟡' : 
                       report.ai_risk_level === 'high' ? '🟠' : '🔴'} 
                      <span className="hidden sm:inline">{report.ai_risk_level} Risk</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Uploaded: {new Date(report.uploaded_at || report.created_at || 0).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}</span>
                  </div>
                  {report.ai_analyzed_at && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Analyzed: {new Date(report.ai_analyzed_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}</span>
                    </div>
                  )}
                </div>
                
                {report.report_notes && (
                  <div className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <strong>Notes:</strong> {report.report_notes}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReportImage(!showReportImage)}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  {showReportImage ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                  <span className="hidden sm:inline">{showReportImage ? 'Hide' : 'Show'} </span>Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadReport}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Report Image Display */}
          {showReportImage && report.report_file_url && (
            <Card className="p-3 sm:p-4 md:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                Original Report
              </h3>
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                {report.report_file_type?.includes('pdf') ? (
                  <div className="aspect-[4/5] sm:aspect-[3/4] flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <div className="text-center p-4">
                      <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">PDF Document</p>
                      <Button onClick={handleDownloadReport} className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Open PDF
                      </Button>
                    </div>
                  </div>
                ) : (
                  <img
                    src={report.report_file_url}
                    alt="Medical Report"
                    className="w-full h-auto max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="aspect-[4/5] flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                            <div class="text-center">
                              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                              <p class="text-gray-600 dark:text-gray-400 mb-4">Unable to display image</p>
                              <button onclick="window.open('${report.report_file_url}', '_blank')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                View Original File
                              </button>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                )}
              </div>
            </Card>
          )}

          {/* AI Analysis Results */}
          {report.ai_analyzed && (
            <div className="space-y-6">
              {/* AI Analysis Header */}
              <Card className="p-4 sm:p-6 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">🧠 AI Analysis Results</h3>
                    <p className="text-green-50 text-sm sm:text-base">
                      Powered by Gemini AI<span className="hidden sm:inline"> • Bilingual Analysis Available</span>
                    </p>
                  </div>
                  <div className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm lg:text-base font-bold self-start sm:self-auto ${
                    report.ai_risk_level === 'low' 
                      ? 'bg-white/20' 
                      : report.ai_risk_level === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}>
                    {report.ai_risk_level === 'low' ? '🟢 Low Risk' : 
                     report.ai_risk_level === 'medium' ? '🟡 Medium Risk' : 
                     report.ai_risk_level === 'high' ? '🟠 High Risk' : '🔴 Critical Risk'}
                  </div>
                </div>
              </Card>

              {/* AI Summary - Bilingual */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-lg sm:text-xl">🇬🇧</span>
                    <span>English Summary</span>
                  </h3>
                  <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {report.ai_summary_english || 'No English summary available.'}
                  </div>
                </Card>

                <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-lg sm:text-xl">🇵🇰</span>
                    <span>Roman Urdu Summary</span>
                  </h3>
                  <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {report.ai_summary_urdu || 'Roman Urdu summary nahi mil raha.'}
                  </div>
                </Card>
              </div>

              {/* Abnormal Values */}
              {report.ai_abnormal_values && report.ai_abnormal_values.length > 0 && (
                <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-l-4 border-l-red-500">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600 dark:text-red-400" />
                    <span>Abnormal Values Found ({report.ai_abnormal_values.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {report.ai_abnormal_values.map((value: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-900 dark:text-white font-medium text-xs sm:text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Doctor Questions */}
              {report.ai_doctor_questions && report.ai_doctor_questions.length > 0 && (
                <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-l-4 border-l-blue-500">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    💬 Questions to Ask Your Doctor
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {report.ai_doctor_questions.map((question: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs sm:text-sm font-bold text-white flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">{question}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Food Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {report.ai_food_to_avoid && report.ai_food_to_avoid.length > 0 && (
                  <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-l-4 border-l-red-500">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                      🚫 Foods to Avoid
                    </h3>
                    <ul className="space-y-2">
                      {report.ai_food_to_avoid.map((food: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                          <span className="text-red-600 dark:text-red-400">❌</span>
                          {food}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {report.ai_better_foods && report.ai_better_foods.length > 0 && (
                  <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-l-4 border-l-green-500">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                      ✅ Better Foods to Eat
                    </h3>
                    <ul className="space-y-2">
                      {report.ai_better_foods.map((food: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                          <span className="text-green-600 dark:text-green-400">✓</span>
                          {food}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>

              {/* Home Remedies */}
              {report.ai_home_remedies && report.ai_home_remedies.length > 0 && (
                <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-l-4 border-l-purple-500">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    🏠 Home Remedies & Lifestyle Tips
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {report.ai_home_remedies.map((remedy: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">{remedy}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Medical Disclaimer */}
              <Card className="p-6 bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                      ⚠️ Important Medical Disclaimer
                    </h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      This AI analysis is for informational purposes only and should not replace professional medical advice. 
                      Always consult your doctor before making any health decisions. Kisi bhi decision se pehle apne doctor se zaroor consult karein.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* No Analysis Available */}
          {!report.ai_analyzed && (
            <Card className="p-8 text-center bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                AI Analysis Pending
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This report is currently being processed. AI analysis results will appear here once complete.
              </p>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsModal;
