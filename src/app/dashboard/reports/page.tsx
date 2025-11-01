'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Brain,
  Loader2,
  Plus,
  Eye,
  RefreshCw,
  WifiOff
} from 'lucide-react';
import { getUserMedicalReports } from '@/utils/supabase/medical-reports';
import UploadReportModal from '@/components/dashboard/UploadReportModal';
import ReportDetailsModal from '@/components/dashboard/ReportDetailsModal';

interface MedicalReport {
  id: string;
  report_file_name?: string;
  report_type?: string;
  uploaded_at?: string;
  created_at?: string;
  ai_analyzed?: boolean;
  ai_abnormal_values?: string[];
  ai_risk_level?: "low" | "medium" | "high" | "critical";
  ai_summary_english?: string;
  ai_summary_urdu?: string;
  report_file_url?: string;
}

const ReportsPage = () => {
  const { user } = useUser();
  const [medicalReports, setMedicalReports] = useState<MedicalReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);

  // Fetch user's medical reports
  const fetchReports = async (isRefresh = false) => {
    if (!user?.id) return;
    
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      const { data: reports, error: fetchError } = await getUserMedicalReports(user.id);
      
      if (fetchError) {
        throw new Error(fetchError.message || 'Failed to fetch reports');
      }
      
      setMedicalReports(reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError(error instanceof Error ? error.message : 'Failed to load reports');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Handle successful upload completion
  const handleUploadComplete = async () => {
    setShowUploadModal(false);
    await fetchReports(true); // Refresh data instead of page reload
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 dark:text-green-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your medical reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:via-gray-900 dark:to-green-950">
      <Sidebar />

      <main className="min-h-screen p-3 sm:p-4 md:p-8 lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Medical Reports 📋
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                View your uploaded reports and AI analysis results
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => fetchReports(true)}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-xl px-3 sm:px-4 md:px-6 py-2 sm:py-3 shadow-lg text-sm sm:text-base"
                onClick={() => setShowUploadModal(true)}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Upload</span>
                <span className="hidden sm:inline"> New Report</span>
              </Button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Card className="p-4 sm:p-6 bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <WifiOff className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                    Failed to Load Reports
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                    {error}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => fetchReports()}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Reports List or Empty State */}
          {medicalReports.length === 0 ? (
            <Card className="p-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No Medical Reports Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Upload your first medical report to get AI-powered analysis with insights in English and Roman Urdu.
                </p>
                <Button 
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-500 dark:to-green-600 text-white rounded-xl px-6 py-3 shadow-lg"
                  onClick={() => setShowUploadModal(true)}
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Upload Your First Report
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Card className="p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{medicalReports.length}</p>
                    </div>
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </Card>
                <Card className="p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">AI Analyzed</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                        {medicalReports.filter(r => r.ai_analyzed).length}
                      </p>
                    </div>
                    <Brain className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600 dark:text-green-400" />
                  </div>
                </Card>
                <Card className="p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 sm:col-span-1 col-span-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Abnormal Values</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                        {medicalReports.reduce((acc, r) => acc + (r.ai_abnormal_values?.length || 0), 0)}
                      </p>
                    </div>
                    <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-600 dark:text-red-400" />
                  </div>
                </Card>
              </div>

              {/* Loading overlay for refresh */}
              {isRefreshing && (
                <div className="fixed inset-0 bg-black/10 dark:bg-white/10 backdrop-blur-sm z-40 flex items-center justify-center">
                  <Card className="p-4 bg-white dark:bg-gray-800 shadow-xl">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                      <span className="text-sm font-medium">Refreshing reports...</span>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Medical Reports List */}
          {medicalReports.length > 0 && (
            <div className="space-y-6">
              {/* Reports Grid */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {medicalReports.map((report) => (
                  <Card key={report.id} className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                              {report.report_file_name || 'Medical Report'}
                            </h3>
                          </div>
                          {report.report_type && (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 capitalize self-start">
                              {report.report_type.replace('-', ' ')}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Uploaded: {new Date(report.uploaded_at || report.created_at || Date.now()).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                          <span className="hidden sm:inline">
                            {' '}at {new Date(report.uploaded_at || report.created_at || Date.now()).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </p>
                        
                        {/* AI Analysis Status */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
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
                                <span className="hidden sm:inline">Pending</span>
                                <span className="sm:hidden">...</span>
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

                          {/* Abnormal Values Indicator */}
                          {report.ai_abnormal_values && report.ai_abnormal_values.length > 0 && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-medium">
                              <AlertCircle className="w-3 h-3" />
                              <span>{report.ai_abnormal_values.length}</span>
                              <span className="hidden sm:inline"> abnormal</span>
                            </div>
                          )}
                        </div>

                        {/* AI Summary Preview */}
                        {report.ai_summary_english && (
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                            {report.ai_summary_english.substring(0, 120)}
                            {report.ai_summary_english.length > 120 && '...'}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex sm:flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report);
                            setShowDetailsModal(true);
                          }}
                          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 py-2 flex-1 sm:flex-none"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="sm:hidden">View</span>
                          <span className="hidden sm:inline">View Details</span>
                        </Button>
                        
                        {/* Download Button */}
                        {report.report_file_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(report.report_file_url, '_blank')}
                            className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                          >
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Open</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}



        </div>
      </main>

      {/* Upload Report Modal */}
      {showUploadModal && (
        <UploadReportModal 
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* Report Details Modal */}
      {showDetailsModal && selectedReport && (
        <ReportDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedReport(null);
          }}
          report={selectedReport}
        />
      )}
    </div>
  );
};

export default ReportsPage;
