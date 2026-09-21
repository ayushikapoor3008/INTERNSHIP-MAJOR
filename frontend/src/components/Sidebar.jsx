import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Activity,
  BedDouble,
  BarChart3,
  Cpu,
  ShieldCheck,
  GitMerge,
  FileText,
  Clock,
  Settings,
  LogOut,
  ChevronRight,
  Cross
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout, activeTab, navigateTo } = useAuth();

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roleAccess: ['Clinician', 'Executive', 'Data Scientist'] },
    { id: 'patient-risk', label: 'Patient Risk', icon: Users, roleAccess: ['Clinician', 'Data Scientist'] },
    { id: 'bed-forecast', label: 'Bed Forecast', icon: BedDouble, roleAccess: ['Clinician', 'Executive', 'Data Scientist'] },
    { id: 'statistical-analysis', label: 'Statistical Analysis', icon: BarChart3, roleAccess: ['Data Scientist'] },
    { id: 'model-performance', label: 'Model Performance', icon: Cpu, roleAccess: ['Data Scientist'] },
    { id: 'data-quality', label: 'Data Quality', icon: ShieldCheck, roleAccess: ['Data Scientist'] },
    { id: 'data-pipeline', label: 'Data Pipeline', icon: GitMerge, roleAccess: ['Data Scientist'] },
    { id: 'reports', label: 'Reports', icon: FileText, roleAccess: ['Clinician', 'Executive', 'Data Scientist'] },
    { id: 'audit-logs', label: 'Audit Logs', icon: Clock, roleAccess: ['Executive', 'Data Scientist'] },
    { id: 'settings', label: 'Settings & Data Dict', icon: Settings, roleAccess: ['Clinician', 'Executive', 'Data Scientist'] },
  ];

  return (
    <aside className="w-64 bg-[#0b1120] text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800/80 select-none z-20 shadow-2xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-[#090e1a] flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 border border-blue-400/30">
          <Cross className="w-5 h-5 fill-white stroke-none" />
        </div>
        <div>
          <h1 className="font-extrabold text-white text-lg tracking-tight leading-none">
            CarePredict <span className="text-sky-400">AI</span>
          </h1>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold tracking-wide">Hospital Analytics SaaS</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Clinical Operations
        </div>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAllowed = user && item.roleAccess.includes(user.role);

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              disabled={!isAllowed}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                  : isAllowed
                  ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                  : 'text-slate-700 opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom User Info & Role */}
      <div className="p-4 border-t border-slate-800/80 bg-[#090e1a]">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 text-sky-400 font-extrabold flex items-center justify-center text-xs border border-slate-700">
            {user?.avatar || 'CP'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-100 truncate">{user?.name}</p>
            <span className="inline-block text-[10px] font-bold text-sky-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800 mt-0.5">
              {user?.role}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-800/50 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 border border-slate-700/50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
