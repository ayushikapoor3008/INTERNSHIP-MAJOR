import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, CheckCircle2, Printer, X, ShieldCheck } from 'lucide-react';
import { ReportModal } from '../components/ReportModal';

export const Reports = () => {
  const [reports, setReports] = useState([
    { id: 1, name: "30-Day Readmission Analytics Report", type: "readmission", date: "2026-09-12 14:00 UTC", size: "3.2 MB", status: "Ready" },
    { id: 2, name: "Hospital Bed Demand & Capacity Forecast", type: "bed_forecast", date: "2026-09-12 09:30 UTC", size: "2.1 MB", status: "Ready" },
    { id: 3, name: "XGBoost Model Validation & Calibration Report", type: "model_performance", date: "2026-09-11 18:45 UTC", size: "4.5 MB", status: "Ready" },
    { id: 4, name: "Great Expectations Data Quality Audit", type: "data_quality", date: "2026-09-12 04:40 UTC", size: "1.8 MB", status: "Ready" },
    { id: 5, name: "Executive Clinical Analytics Summary", type: "executive_summary", date: "2026-09-10 12:00 UTC", size: "5.0 MB", status: "Ready" }
  ]);

  const [previewReport, setPreviewReport] = useState(null);

  const handleGenerate = (reportId) => {
    const today = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    setReports(reports.map(r => r.id === reportId ? { ...r, date: today, status: "Generated Just Now" } : r));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white">Automated Report Generator & PDF Exporter</h3>
          <p className="text-xs text-sky-400 font-semibold">Generate executive briefs, clinical risk summaries, and technical model documentation</p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((r) => (
          <div key={r.id} className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-900 text-sky-400 border border-slate-800">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-sky-400 bg-blue-950 px-2.5 py-0.5 rounded border border-blue-800">
                  {r.status}
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-white leading-snug">{r.name}</h4>
              <p className="text-xs text-slate-400 mt-2 flex items-center font-medium">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                <span>Generated: {r.date}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Est. File Size: {r.size}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between space-x-2">
              <button
                onClick={() => handleGenerate(r.id)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-colors border border-blue-400/30"
              >
                Refresh
              </button>
              <div className="flex space-x-1.5">
                <button
                  onClick={() => setPreviewReport(r)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl transition-colors border border-slate-700 flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => alert(`Downloading PDF: ${r.name}`)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors border border-slate-700 flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewReport && (
        <ReportModal report={previewReport} onClose={() => setPreviewReport(null)} />
      )}

    </div>
  );
};
