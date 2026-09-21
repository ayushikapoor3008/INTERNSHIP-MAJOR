import React, { useEffect, useState } from 'react';
import { fetchAuditLogs } from '../services/api';
import { Clock, Download, Search, ShieldCheck } from 'lucide-react';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    fetchAuditLogs().then((res) => {
      setLogs(res || []);
      setLoading(false);
    });
  }, []);

  const exportCSV = () => {
    const headers = ["ID,Timestamp,User,Role,Action,Resource,IP,Status\n"];
    const rows = logs.map(l => `${l.id},${l.timestamp},${l.user},${l.role},${l.action},${l.resource},${l.ip},${l.status}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carepredict_audit_logs_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const filteredLogs = logs.filter(l => {
    if (userFilter && !l.user.toLowerCase().includes(userFilter.toLowerCase())) return false;
    if (actionFilter && !l.action.toLowerCase().includes(actionFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Controls */}
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white">HIPAA & Platform Security Audit Logs</h3>
          <p className="text-xs text-sky-400 font-semibold">Immutable trace of user actions, patient accesses, risk scoring predictions & pipeline triggers</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all self-start md:self-auto border border-blue-400/30"
        >
          <Download className="w-4 h-4 text-white" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          placeholder="Filter by user email..."
          className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-400 text-white placeholder-slate-500"
        />
        <input
          type="text"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          placeholder="Filter by action (e.g. Patient Record Access)..."
          className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-400 text-white placeholder-slate-500"
        />
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Authenticated User</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Action Performed</th>
                <th className="p-3.5">Target Resource</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-semibold text-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/60">
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                  <td className="p-3.5 font-extrabold text-white">{log.user}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 font-extrabold rounded-md text-[10px]">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-sky-400">{log.action}</td>
                  <td className="p-3.5 text-slate-300">{log.resource}</td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">{log.ip}</td>
                  <td className="p-3.5">
                    <span className="px-3 py-0.5 bg-blue-950 text-sky-400 font-extrabold rounded-full text-[10px] border border-blue-800">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
