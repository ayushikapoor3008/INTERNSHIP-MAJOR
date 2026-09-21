import React, { useEffect, useState } from 'react';
import { fetchPatientDetails } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  AlertTriangle,
  User,
  Pill,
  Activity,
  Building2,
  Stethoscope
} from 'lucide-react';

export const PatientDetails = () => {
  const { navigateTo, selectedPatientId } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientDetails(selectedPatientId || 'P-1048').then((res) => {
      setPatient(res);
      setLoading(false);
    });
  }, [selectedPatientId]);

  if (loading || !patient) {
    return (
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <div className="h-10 bg-slate-800 rounded w-1/3 animate-pulse"></div>
        <div className="h-64 bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  const { demographics, admission_history, clinical_profile, risk_assessment } = patient;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Back Button */}
      <button
        onClick={() => navigateTo('patient-risk')}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Patient Risk Directory</span>
      </button>

      {/* Header Banner */}
      <div className="bg-[#0b1120] text-white p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-blue-600/30 border border-blue-400/30">
            {patient.patient_id.split('-')[1] || 'P'}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-black tracking-tight text-white">{patient.patient_id}</h2>
              <span className={`px-3 py-0.5 rounded-full text-xs font-extrabold ${
                risk_assessment.risk_category === 'High' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                risk_assessment.risk_category === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-blue-950 text-sky-400 border border-blue-800'
              }`}>
                {risk_assessment.risk_category} Risk Tier
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Evaluated on {risk_assessment.prediction_date} • Model: XGBoost v2.1
            </p>
          </div>
        </div>

        {/* Header KPI Badge */}
        <div className="flex items-center space-x-6 bg-slate-900 px-5 py-3 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Risk Score</span>
            <span className="text-2xl font-black text-rose-400">{risk_assessment.readmission_risk_score} / 100</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confidence Interval</span>
            <span className="text-sm font-bold text-white">{risk_assessment.confidence_interval}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Probability Gauge & Risk Factors on Left, Clinical Specs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: 30-Day Readmission Gauge & Risk Factors */}
        <div className="space-y-6">
          
          {/* Readmission Probability Card */}
          <div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800 shadow-xl text-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">30-Day Readmission Probability</h3>
            
            <div className="relative inline-flex items-center justify-center my-4">
              <div className="text-5xl font-black text-white tracking-tight">
                {risk_assessment.readmission_probability_percent}%
              </div>
            </div>

            {/* Visual Probability Bar */}
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden my-3 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${risk_assessment.readmission_probability_percent}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-300 font-semibold">
              High Likelihood of Readmission within 30 days post-discharge.
            </p>
          </div>

          {/* Top Risk Factors with Importance Bars */}
          <div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white">Top Risk Factors (SHAP Drivers)</h3>
              <span className="text-[10px] font-bold text-sky-400 bg-blue-950 px-2.5 py-0.5 rounded-md border border-blue-800">
                XGBoost Attribution
              </span>
            </div>

            <div className="space-y-3">
              {risk_assessment.top_risk_factors.map((rf, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-200">
                    <span>{rf.factor}</span>
                    <span className="text-sky-400 font-extrabold">{rf.importance_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-sky-400 h-full rounded-full"
                      style={{ width: `${rf.importance_pct * 2.2}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Demographics & Clinical Profile */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Clinical Profile Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Demographics Card */}
            <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center space-x-2 text-sky-400 pb-2 border-b border-slate-800">
                <User className="w-4 h-4" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider">Demographics</h4>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-500 block text-[10px] font-semibold">Age / Gender</span><strong className="text-white font-extrabold">{demographics.age} yrs • {demographics.gender}</strong></div>
                <div><span className="text-slate-500 block text-[10px] font-semibold">Blood Type</span><strong className="text-white font-extrabold">{demographics.blood_type}</strong></div>
                <div><span className="text-slate-500 block text-[10px] font-semibold">Language</span><strong className="text-white font-extrabold">{demographics.primary_language}</strong></div>
                <div><span className="text-slate-500 block text-[10px] font-semibold">Insurance</span><strong className="text-white font-extrabold">{demographics.insurance}</strong></div>
              </div>
            </div>

            {/* Admission History Card */}
            <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center space-x-2 text-sky-400 pb-2 border-b border-slate-800">
                <Building2 className="w-4 h-4" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider">Current Admission</h4>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-500 block text-[10px] font-semibold">Ward / Unit</span><strong className="text-white font-extrabold">{admission_history.ward} ({admission_history.admission_type})</strong></div>
                <div><span className="text-slate-500 block text-[10px] font-semibold">Length of Stay</span><strong className="text-white font-extrabold">{admission_history.length_of_stay_days} Days</strong></div>
                <div><span className="text-slate-500 block text-[10px] font-semibold">Prev Admissions (12m)</span><strong className="text-white font-extrabold">{admission_history.previous_admissions_12m} Times</strong></div>
                <div><span className="text-slate-500 block text-[10px] font-semibold">Disposition</span><strong className="text-white font-extrabold">{admission_history.discharge_disposition}</strong></div>
              </div>
            </div>

          </div>

          {/* Primary Diagnosis & Comorbidities */}
          <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-sky-400 pb-2 border-b border-slate-800">
              <Stethoscope className="w-4 h-4" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider">Diagnosis & Chronic Comorbidities</h4>
            </div>

            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Primary Admission Diagnosis</span>
              <div className="p-3 bg-blue-950/80 border border-blue-800 text-sky-200 rounded-xl text-xs font-extrabold">
                {clinical_profile.primary_diagnosis}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Comorbidity Count ({clinical_profile.comorbidity_count})</span>
              <div className="flex flex-wrap gap-2">
                {clinical_profile.comorbidities.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-900 text-slate-200 rounded-lg text-xs font-bold border border-slate-800">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Active Medications */}
          <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-sky-400 pb-2 border-b border-slate-800">
              <Pill className="w-4 h-4" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider">Active Medications ({clinical_profile.medication_count})</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {clinical_profile.key_medications.map((med, i) => (
                <div key={i} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-bold flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span>{med}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Explicit Research Disclaimer Banner */}
          <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl flex items-start space-x-3 text-xs border border-slate-800">
            <AlertTriangle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold text-white">Research & Demo Prototype Disclaimer:</strong> {patient.disclaimer}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
