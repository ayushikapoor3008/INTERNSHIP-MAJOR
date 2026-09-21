import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, UserCheck, Building2 } from 'lucide-react';

export const Navbar = ({ title }) => {
  const { user, loginAs } = useAuth();

  return (
    <header className="bg-[#0b1120]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-lg">
      {/* Page Title & Subtitle */}
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-slate-800 text-sky-400 hidden sm:block border border-slate-700">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-sky-400 font-semibold flex items-center space-x-1">
            <span>MetroHealth Central Network</span>
            <span>•</span>
            <span>Clinical Operations SaaS</span>
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Quick Role Switcher Buttons */}
        <div className="hidden lg:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 px-2 flex items-center">
            <UserCheck className="w-3.5 h-3.5 mr-1 text-sky-400" /> Persona:
          </span>
          <button
            onClick={() => loginAs('clinician')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              user?.role === 'Clinician'
                ? 'bg-blue-600 text-white shadow border border-blue-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Clinician
          </button>
          <button
            onClick={() => loginAs('executive')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              user?.role === 'Executive'
                ? 'bg-blue-600 text-white shadow border border-blue-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Executive
          </button>
          <button
            onClick={() => loginAs('data_scientist')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              user?.role === 'Data Scientist'
                ? 'bg-blue-600 text-white shadow border border-blue-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Data Scientist
          </button>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center space-x-1.5 bg-blue-950/80 text-sky-300 border border-blue-800 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          <span>XGBoost Clinical Ready</span>
        </div>

        {/* Notification Icon */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};
