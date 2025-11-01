'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Activity, 
  Droplet, 
  Target, 
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle2,
  Plus,
  Loader2
} from 'lucide-react';
import { getUserProfile } from '@/utils/supabase/profile';
import { getUserMedicalReports, getReportStats } from '@/utils/supabase/medical-reports';
import UploadReportModal from '@/components/dashboard/UploadReportModal';

interface UserData {
  bmi?: number;
  heart_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  blood_sugar?: number;
  weight_kg?: number;
  target_weight?: number;
  sleep_hours?: number;
}

interface MedicalReport {
  id: string;
  report_file_name?: string;
  uploaded_at?: string;
  created_at?: string;
  ai_analyzed?: boolean;
  ai_abnormal_values?: string[];
  ai_risk_level?: string;
}

interface ReportStats {
  total?: number;
  analyzed?: number;
  abnormal_count?: number;
}

const DashboardPage = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [recentReports, setRecentReports] = useState<MedicalReport[]>([]);
  const [reportStats, setReportStats] = useState<ReportStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Fetch user data and reports
  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Fetch user profile data
      const { data: userProfile } = await getUserProfile(user.id);
      setUserData(userProfile);
      
      // Fetch medical reports
      const { data: medicalReports } = await getUserMedicalReports(user.id);
      setRecentReports(medicalReports?.slice(0, 3) || []);
      
      // Fetch report statistics
      const { data: stats } = await getReportStats(user.id);
      setReportStats(stats);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle upload completion
  const handleUploadComplete = async () => {
    setShowUploadModal(false);
    await fetchDashboardData(); // Refresh data instead of page reload
  };

  // Generate stats from user data
  const stats = userData ? {
    bmi: { 
      value: userData.bmi || '--', 
      status: userData.bmi ? (
        userData.bmi < 18.5 ? 'Underweight' :
        userData.bmi < 25 ? 'Normal' :
        userData.bmi < 30 ? 'Overweight' : 'Obese'
      ) : '--',
      trend: 'neutral' as const,
      trendValue: '0'
    },
    heartRate: { 
      value: userData.heart_rate || '--', 
      unit: 'BPM', 
      trend: 'neutral' as const, 
      trendValue: '0' 
    },
    bloodPressure: { 
      value: userData.blood_pressure_systolic && userData.blood_pressure_diastolic 
        ? `${userData.blood_pressure_systolic}/${userData.blood_pressure_diastolic}` 
        : '--', 
      unit: 'mmHg', 
      trend: 'neutral' as const 
    },
    bloodSugar: { 
      value: userData.blood_sugar || '--', 
      unit: 'mg/dL', 
      trend: 'neutral' as const, 
      trendValue: '0' 
    },
  } : {
    bmi: { value: '--', status: '--', trend: 'neutral' as const, trendValue: '0' },
    heartRate: { value: '--', unit: 'BPM', trend: 'neutral' as const, trendValue: '0' },
    bloodPressure: { value: '--', unit: 'mmHg', trend: 'neutral' as const },
    bloodSugar: { value: '--', unit: 'mg/dL', trend: 'neutral' as const, trendValue: '0' },
  };

  // Health goals from user data
  const healthGoals = userData ? [
    { 
      label: 'Weight Goal', 
      value: userData.weight_kg || 0, 
      target: userData.target_weight || userData.weight_kg || 70 
    },
    { 
      label: 'Sleep Hours', 
      value: userData.sleep_hours || 0, 
      target: 8 
    },
    { 
      label: 'Reports Analyzed', 
      value: reportStats?.analyzed || 0, 
      target: reportStats?.total || 1 
    },
    { 
      label: 'Health Profile', 
      value: userData ? 1 : 0, 
      target: 1 
    },
  ] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 dark:text-green-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:via-gray-900 dark:to-green-950">
      <Sidebar />

      <main className="min-h-screen p-4 md:p-8 lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.firstName || 'User'}! 👋
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Aapki sehat ka overview — sab kuch ek nazar mein
              </p>
            </div>
            <Button 
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-xl px-4 sm:px-6 py-3 shadow-lg text-sm sm:text-base"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Upload New Report
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatsCard
              title="BMI (Body Mass Index)"
              value={stats.bmi.value}
              icon={Target}
              trend={stats.bmi.trend as 'up' | 'down' | 'neutral'}
              trendValue={stats.bmi.trendValue}
              bgColor="bg-blue-100 dark:bg-blue-900"
              iconColor="text-blue-600 dark:text-blue-400"
            />
            <StatsCard
              title="Heart Rate"
              value={stats.heartRate.value}
              unit={stats.heartRate.unit}
              icon={Heart}
              trend={stats.heartRate.trend as 'up' | 'down' | 'neutral'}
              trendValue={stats.heartRate.trendValue}
              bgColor="bg-red-100 dark:bg-red-900"
              iconColor="text-red-600 dark:text-red-400"
            />
            <StatsCard
              title="Blood Pressure"
              value={stats.bloodPressure.value}
              unit={stats.bloodPressure.unit}
              icon={Activity}
              trend={stats.bloodPressure.trend as 'up' | 'down' | 'neutral'}
              bgColor="bg-purple-100 dark:bg-purple-900"
              iconColor="text-purple-600 dark:text-purple-400"
            />
            <StatsCard
              title="Blood Sugar"
              value={stats.bloodSugar.value}
              unit={stats.bloodSugar.unit}
              icon={Droplet}
              trend={stats.bloodSugar.trend as 'up' | 'down' | 'neutral'}
              trendValue={stats.bloodSugar.trendValue}
              bgColor="bg-orange-100 dark:bg-orange-900"
              iconColor="text-orange-600 dark:text-orange-400"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Report Statistics */}
            <Card className="p-4 md:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Report Analysis Overview
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your medical reports summary
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Reports</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {reportStats?.total || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Analyzed</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {reportStats?.analyzed || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Abnormal Values</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    {reportStats?.abnormal_count || 0}
                  </span>
                </div>
              </div>
            </Card>

            {/* Health Goals Progress */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Health Goals Progress
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    This week&apos;s achievements
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <div className="space-y-4">
                {healthGoals.map((goal, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {goal.label}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {goal.value} / {goal.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                        style={{ width: `${(goal.value / goal.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Reports */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {/* Recent Reports */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Medical Reports
                </h3>
                <Button variant="ghost" size="sm" className="text-green-600 dark:text-green-400">
                  View All →
                </Button>
              </div>

              <div className="space-y-4">
                {recentReports.length > 0 ? recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {report.report_file_name || 'Medical Report'}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {new Date(report.uploaded_at || report.created_at || Date.now()).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        {report.ai_analyzed && report.ai_abnormal_values && report.ai_abnormal_values.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                            <AlertCircle className="w-3 h-3" />
                            <span>{report.ai_abnormal_values.length} abnormal value(s) found</span>
                          </div>
                        )}
                        {report.ai_risk_level && (
                          <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full mt-1 ${
                            report.ai_risk_level === 'low' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                            report.ai_risk_level === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                            report.ai_risk_level === 'high' ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' :
                            'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                          }`}>
                            Risk: {report.ai_risk_level}
                          </div>
                        )}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          report.ai_analyzed
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        }`}
                      >
                        {report.ai_analyzed ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Analyzed
                          </span>
                        ) : (
                          'Pending Analysis'
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="mb-2">No medical reports uploaded yet</p>
                    <p className="text-sm">Upload your first report to get AI analysis</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Health Insights */}
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold mb-2">💡 Today&apos;s Health Insight</h3>
                <p className="text-green-50 mb-4 text-sm sm:text-base leading-relaxed">
                  Aapka blood pressure consistent hai! Keep maintaining your healthy lifestyle.
                  Regular exercise aur balanced diet continue rakhein.
                </p>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600 text-sm sm:text-base px-4 py-2"
                  onClick={() => window.location.href = '/dashboard/reports'}
                >
                  View Detailed Analysis →
                </Button>
              </div>
              <div className="hidden sm:block">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                </div>
              </div>
            </div>
          </Card>
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
    </div>
  );
};

export default DashboardPage;
