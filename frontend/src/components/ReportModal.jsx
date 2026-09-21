import React from 'react';
import { X, Printer, Download, ShieldCheck, Activity } from 'lucide-react';

export const ReportModal = ({ report, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Controls */}
        <div className="p-4 bg-[#090e1a] border-b border-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-sky-400" />
            <h3 className="font-extrabold text-sm tracking-tight">PDF Preview: {report.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => window.print()} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-200 font-bold flex items-center space-x-1 border border-slate-700">
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Preview Document */}
        <div className="p-8 overflow-y-auto space-y-6 bg-slate-900 text-slate-200 text-xs font-sans">
          
          <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">CarePredict AI • Clinical Report</h1>
              <p className="text-xs text-sky-400 mt-1 font-extrabold">{report.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">MetroHealth Central Network • Hospital Analytics Division</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-blue-950 text-sky-300 font-extrabold text-[10px] rounded-lg border border-blue-800">
                CONFIDENTIAL
              </span>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">Generated: {report.date}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-extrabold text-white uppercase tracking-wider text-[11px]">1. Executive Summary</h3>
            <p className="text-slate-300 leading-relaxed font-semibold">
              This document synthesizes population-level 30-day readmission risk analytics and bed demand trajectory metrics for MetroHealth Central Network. All statistical models utilize calibrated XGBoost decision trees and SARIMA time-series algorithms based on synthetic health record datasets.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-[#0f172a] rounded-2xl border border-slate-800 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Population</span>
              <div className="text-lg font-black text-white mt-0.5">12,480 Patients</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Readmission Rate</span>
              <div className="text-lg font-black text-sky-400 mt-0.5">14.8% (Target 15%)</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Model Discriminative AUC</span>
              <div className="text-lg font-black text-purple-400 mt-0.5">0.872 (Optimal)</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-extrabold text-white uppercase tracking-wider text-[11px]">2. Key Recommendations</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300 font-semibold">
              <li>Initiate 48-hour nurse tele-outreach intervention for all patients in the High Risk tier (&gt;60 score).</li>
              <li>Prepare ICU unit for surge bed capacity expected on September 22.</li>
              <li>Maintain daily Great Expectations schema assertions on lab telemetry streams.</li>
            </ul>
          </div>

          <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded-xl text-[10px] text-slate-400 font-medium">
            <strong className="text-white font-extrabold">RESEARCH & DEMO PROTOTYPE DISCLAIMER:</strong> This report is generated from synthetic, fictitious patient data for research demonstration purposes. Not intended for direct patient management or clinical diagnosis.
          </div>

        </div>

      </div>
    </div>
  );
};
