import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const DisclaimerBanner = () => {
  return (
    <div className="bg-[#0b1329] text-slate-300 border-b border-blue-900/50 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-inner">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-sky-400 shrink-0 animate-pulse" />
        <span>
          <strong className="font-extrabold text-blue-300">SYNTHETIC RESEARCH PROTOTYPE:</strong> CarePredict AI utilizes 100% fictitious clinical datasets for predictive hospital analytics demonstration only. Predictions are not certified for real clinical decision-making.
        </span>
      </div>
      <div className="hidden md:flex items-center space-x-1.5 text-blue-300 bg-blue-950 px-2.5 py-0.5 rounded-md border border-blue-800/80">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
        <span className="text-[11px] font-bold">Synthetic EHR Engine v4.2</span>
      </div>
    </div>
  );
};
