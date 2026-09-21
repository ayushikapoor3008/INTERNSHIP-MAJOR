import React from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PatientRisk } from './pages/PatientRisk';
import { PatientDetails } from './pages/PatientDetails';
import { BedForecast } from './pages/BedForecast';
import { StatisticalAnalysis } from './pages/StatisticalAnalysis';
import { ModelPerformance } from './pages/ModelPerformance';
import { DataQuality } from './pages/DataQuality';
import { DataPipeline } from './pages/DataPipeline';
import { AuditLogs } from './pages/AuditLogs';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

const MainLayout = () => {
  const { user, activeTab } = useAuth();

  if (!user) {
    return <Login />;
  }

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Executive & Clinical Analytics Dashboard';
      case 'patient-risk': return 'Patient Readmission Risk Stratification';
      case 'patient-details': return 'Patient Deep Clinical Analytics';
      case 'bed-forecast': return 'Hospital Bed Demand & Surge Forecasting';
      case 'statistical-analysis': return 'Biostatistical & Survival Analysis';
      case 'model-performance': return 'XGBoost Model Validation & Calibration';
      case 'data-quality': return 'Great Expectations Data Quality Suite';
      case 'data-pipeline': return 'Airflow DAG Orchestration & Data Pipeline';
      case 'reports': return 'Report Generator & PDF Export';
      case 'audit-logs': return 'Security & Access Audit Logs';
      case 'settings': return 'Governance, Settings & Data Dictionary';
      default: return 'CarePredict AI Platform';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'patient-risk': return <PatientRisk />;
      case 'patient-details': return <PatientDetails />;
      case 'bed-forecast': return <BedForecast />;
      case 'statistical-analysis': return <StatisticalAnalysis />;
      case 'model-performance': return <ModelPerformance />;
      case 'data-quality': return <DataQuality />;
      case 'data-pipeline': return <DataPipeline />;
      case 'reports': return <Reports />;
      case 'audit-logs': return <AuditLogs />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[#090d16]">
        <DisclaimerBanner />
        <Navbar title={getPageTitle(activeTab)} />
        <main className="flex-1 pb-12 overflow-y-auto bg-[#090d16]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
