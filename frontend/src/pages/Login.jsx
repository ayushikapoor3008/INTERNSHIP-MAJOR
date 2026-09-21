import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Cross, ShieldCheck, Stethoscope, Briefcase, Database, Lock, Mail, ArrowRight, Building2 } from 'lucide-react';

export const Login = () => {
  const { loginAs } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAs('clinician');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Hospital Blue Glow Backdrops */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center space-x-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-900/80 border border-blue-400/30">
            <Cross className="w-8 h-8 fill-white stroke-none" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black text-white tracking-tight">
          CarePredict <span className="text-blue-400">AI</span>
        </h2>
        <p className="mt-1.5 text-center text-xs text-blue-200/80 max-w-sm mx-auto font-semibold tracking-wide uppercase">
          Predictive Healthcare Analytics Platform • Hospital Network SaaS
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl border border-blue-900/50 sm:px-10">
          
          {/* Quick Demo Sign-In Buttons */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider mb-3 text-center">
              Fast Track Demo Access
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => loginAs('clinician')}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-950/60 border border-blue-800 hover:border-blue-400 hover:bg-blue-900/60 transition-all text-white group shadow-md"
              >
                <Stethoscope className="w-5 h-5 text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Clinician</span>
                <span className="text-[10px] text-blue-300">Risk & Details</span>
              </button>

              <button
                type="button"
                onClick={() => loginAs('executive')}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-950/60 border border-blue-800 hover:border-sky-400 hover:bg-blue-900/60 transition-all text-white group shadow-md"
              >
                <Briefcase className="w-5 h-5 text-sky-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Executive</span>
                <span className="text-[10px] text-blue-300">KPIs & Surge</span>
              </button>

              <button
                type="button"
                onClick={() => loginAs('data_scientist')}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-950/60 border border-blue-800 hover:border-indigo-400 hover:bg-blue-900/60 transition-all text-white group shadow-md"
              >
                <Database className="w-5 h-5 text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Data Scientist</span>
                <span className="text-[10px] text-blue-300">ML & Quality</span>
              </button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-900/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-blue-300/70 font-bold">or sign in with credentials</span>
            </div>
          </div>

          {/* Standard Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Hospital Staff Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-blue-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dr.jenkins@metrohealth.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-blue-950/50 border border-blue-800/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-blue-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-blue-950/50 border border-blue-800/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-blue-950 border-blue-800 text-blue-600 focus:ring-0"
                />
                <span>Remember session</span>
              </label>
              <a href="#" className="text-blue-400 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs tracking-wide shadow-lg shadow-blue-950/80 flex items-center justify-center space-x-2 transition-all mt-2 border border-blue-400/40"
            >
              <span>Sign In to Clinical Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Research Disclaimer Footer */}
          <div className="mt-6 pt-4 border-t border-blue-900/60 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-blue-300 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Synthetic EHR Data / Clinical Analytics Prototype</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
