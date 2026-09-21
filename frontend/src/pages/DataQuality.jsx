import React, { useEffect, useState } from 'react';
import { fetchDataQuality } from '../services/api';
import { ShieldCheck, AlertTriangle, CheckCircle, Database, FileCheck, RefreshCw } from 'lucide-react';

export const DataQuality = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataQuality().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <div className="h-10 bg-slate-800 rounded w-1/3 animate-pulse"></div>
        <div className="h-64 bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  const { summary, checks } = data;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white">Great Expectations Data Quality & Drift Suite</h3>
          <p className="text-xs text-sky-400 font-semibold">Automated ingestion batch assertions, schema integrity, and distribution drift checks</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <Database className="w-4 h-4 text-sky-400" />
          <span>Batch ID: {summary.batch_id}</span>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Rows Processed</span>
          <div className="text-2xl font-black text-white mt-1">{summary.rows_processed.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Latest EHR Batch</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Missing Values %</span>
          <div className="text-2xl font-black text-sky-400 mt-1">{summary.missing_values_pct}%</div>
          <span className="text-[10px] text-sky-400 font-bold">Completeness PASS</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Duplicate Records</span>
          <div className="text-2xl font-black text-white mt-1">{summary.duplicate_records}</div>
          <span className="text-[10px] text-slate-500">Zero Dupes</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Referential Integrity</span>
          <div className="text-2xl font-black text-white mt-1">{summary.referential_integrity_pct}%</div>
          <span className="text-[10px] text-sky-400 font-bold">Foreign Keys Valid</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Schema Validation</span>
          <div className="text-xl font-black text-sky-400 mt-1.5 flex items-center space-x-1">
            <CheckCircle className="w-5 h-5 text-sky-400" />
            <span>{summary.schema_validation}</span>
          </div>
          <span className="text-[10px] text-slate-500">Pydantic Assertion</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Distribution Drift</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{summary.distribution_drift}</div>
          <span className="text-[10px] text-amber-400 font-bold">Evidently AI Drift Check</span>
        </div>

      </div>

      {/* Data Quality Checks Table */}
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h3 className="text-sm font-extrabold text-white mb-3">Great Expectations Execution Matrix</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Check ID</th>
                <th className="p-3.5">Assertion Test Name</th>
                <th className="p-3.5 text-center">Records Inspected</th>
                <th className="p-3.5 text-center">Issues Detected</th>
                <th className="p-3.5">Outcome Status</th>
                <th className="p-3.5">Execution Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-semibold text-slate-200">
              {checks.map((c) => (
                <tr key={c.id} className="hover:bg-slate-900/60">
                  <td className="p-3.5 font-extrabold text-sky-400">{c.id}</td>
                  <td className="p-3.5 font-bold text-white">{c.check_name}</td>
                  <td className="p-3.5 text-center text-slate-300">{c.records_checked.toLocaleString()}</td>
                  <td className="p-3.5 text-center font-extrabold text-white">{c.issues}</td>
                  <td className="p-3.5">
                    <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold ${
                      c.status === 'PASS' ? 'bg-blue-950 text-sky-400 border border-blue-800' :
                      c.status === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">{c.last_run}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
