import React from 'react';
import { GitMerge, Database, Layers, Cpu, ArrowRight, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

export const DataPipeline = () => {
  const dagNodes = [
    { id: 'node-1', name: 'Synthetic EHR Data', type: 'Ingestion Source', status: 'SUCCESS', time: '04:00 UTC', icon: Database },
    { id: 'node-2', name: 'S3 Data Lake (Parquet)', type: 'Raw Storage', status: 'SUCCESS', time: '04:05 UTC', icon: Layers },
    { id: 'node-3', name: 'PostgreSQL Staging', type: 'Database Stage', status: 'SUCCESS', time: '04:12 UTC', icon: Database },
    { id: 'node-4', name: 'dbt Core Transformations', type: 'Data Engineering', status: 'SUCCESS', time: '04:25 UTC', icon: GitMerge },
    { id: 'node-5', name: 'Feast Feature Store', type: 'ML Ops Engine', status: 'SUCCESS', time: '04:30 UTC', icon: Cpu },
    { id: 'node-6', name: 'XGBoost Model Scoring', type: 'Inference Pipeline', status: 'SUCCESS', time: '04:35 UTC', icon: Cpu },
    { id: 'node-7', name: 'FastAPI REST Server', type: 'API Backend', status: 'SUCCESS', time: '04:38 UTC', icon: RefreshCw },
    { id: 'node-8', name: 'CarePredict UI Dashboard', type: 'Analytics SaaS', status: 'SUCCESS', time: '04:40 UTC', icon: CheckCircle2 }
  ];

  const pipelineLogs = [
    { name: "Daily Feature Refresh", status: "SUCCESS", timestamp: "2026-09-12 04:30:00 UTC", duration: "4m 12s" },
    { name: "Batch Model Scoring (12.4k Patients)", status: "SUCCESS", timestamp: "2026-09-12 04:35:00 UTC", duration: "3m 05s" },
    { name: "Dashboard Data Reload", status: "SUCCESS", timestamp: "2026-09-12 04:38:00 UTC", duration: "0m 42s" },
    { name: "Great Expectations Quality Assertions", status: "SUCCESS", timestamp: "2026-09-12 04:40:00 UTC", duration: "1m 15s" }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-white">Apache Airflow DAG & Orchestration Pipeline</h3>
          <p className="text-xs text-sky-400 font-semibold">End-to-end automated data engineering flow from EHR raw ingestion to ML prediction API</p>
        </div>
        <span className="text-xs font-bold text-sky-300 bg-blue-950 px-3 py-1 rounded-full border border-blue-800 flex items-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
          <span>DAG Schedule: Daily @ 04:00 UTC (All Healthy)</span>
        </span>
      </div>

      {/* Airflow Style Visualizer DAG Graph */}
      <div className="bg-[#0b1120] text-white p-6 rounded-3xl border border-slate-800 shadow-2xl overflow-x-auto">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">DAG Topology Map: <span className="text-sky-400">carepredict_daily_etl_ml_dag</span></h4>

        <div className="flex items-center space-x-3 min-w-[900px]">
          {dagNodes.map((node, i) => {
            const Icon = node.icon;
            return (
              <React.Fragment key={node.id}>
                <div className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-sky-400 transition-colors flex flex-col justify-between h-30 shadow-lg">
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-sky-400" />
                    <span className="text-[9px] font-bold text-sky-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800">
                      {node.status}
                    </span>
                  </div>
                  <div className="my-1">
                    <h5 className="text-xs font-bold text-white truncate">{node.name}</h5>
                    <p className="text-[10px] text-slate-400 font-medium">{node.type}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">{node.time}</span>
                </div>

                {i < dagNodes.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Execution Status Log Table */}
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h3 className="text-sm font-extrabold text-white mb-3">Pipeline Task Execution Logs</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase">
              <tr>
                <th className="p-3.5">Task Name</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Completion Timestamp</th>
                <th className="p-3.5">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-semibold text-slate-200">
              {pipelineLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60">
                  <td className="p-3.5 font-extrabold text-white">{log.name}</td>
                  <td className="p-3.5">
                    <span className="px-3 py-0.5 bg-blue-950 text-sky-400 font-extrabold rounded-full text-[10px] border border-blue-800">
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">{log.timestamp}</td>
                  <td className="p-3.5 text-slate-300 font-mono">{log.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
