import React, { useEffect, useState } from 'react';
import { fetchBedForecast } from '../services/api';
import { BedDouble, Calendar, TrendingUp, AlertCircle, ShieldCheck, Filter } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

export const BedForecast = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [horizon, setHorizon] = useState('30');
  const [selectedWard, setSelectedWard] = useState('All');

  useEffect(() => {
    fetchBedForecast().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <div className="h-10 bg-slate-800 rounded w-1/3 animate-pulse"></div>
        <div className="h-80 bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  const { total_capacity, current_occupancy, predicted_peak, predicted_peak_date, peak_occupancy_percent, available_beds_at_peak, time_series, ward_forecasts } = data;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Control Header & Filters */}
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white">Hospital Bed Demand & Surge Forecasting</h3>
          <p className="text-xs text-sky-400 font-semibold">SARIMA time-series model with 95% upper and lower confidence bounds</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 px-2">Horizon:</span>
            <button
              onClick={() => setHorizon('7')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                horizon === '7' ? 'bg-blue-600 text-white shadow border border-blue-500/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setHorizon('14')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                horizon === '14' ? 'bg-blue-600 text-white shadow border border-blue-500/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setHorizon('30')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                horizon === '30' ? 'bg-blue-600 text-white shadow border border-blue-500/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
          </div>

          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-200"
          >
            <option value="All">All Hospital Wards</option>
            <option value="ICU">ICU</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Emergency">Emergency</option>
            <option value="General Medicine">General Medicine</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Total Hospital Capacity</span>
          <div className="text-2xl font-black text-white mt-1">{total_capacity} beds</div>
          <span className="text-[11px] font-semibold text-slate-500">Licensed beds</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Current Occupancy</span>
          <div className="text-2xl font-black text-sky-400 mt-1">{current_occupancy} beds</div>
          <span className="text-[11px] font-bold text-sky-400">82.0% occupied</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Predicted Surge Peak</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{predicted_peak} beds</div>
          <span className="text-[11px] font-bold text-amber-400">{peak_occupancy_percent}% capacity</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Predicted Peak Date</span>
          <div className="text-lg font-black text-white mt-1.5">{predicted_peak_date}</div>
          <span className="text-[11px] font-semibold text-slate-500">Surge Window</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Min Available Beds</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{available_beds_at_peak} beds</div>
          <span className="text-[11px] font-bold text-emerald-400">Safety margin</span>
        </div>

      </div>

      {/* Main Time-Series Forecast Chart with Shaded Confidence Interval */}
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white">Bed Occupancy Trajectory & 95% Confidence Interval</h3>
            <p className="text-xs text-slate-400 font-medium">Historical occupancy (cyan) vs SARIMA prediction bounds (amber shaded)</p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={time_series} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[300, 520]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#fff' }} />
              
              {/* Shaded Upper CI */}
              <Area type="monotone" dataKey="upper_ci" stroke="none" fill="#f59e0b" fillOpacity={0.15} name="95% Confidence Interval" />
              
              {/* Actual Occupancy Line */}
              <Line type="monotone" dataKey="actual_occupancy" stroke="#38bdf8" strokeWidth={3} dot={{ r: 3 }} name="Actual Occupancy" />
              
              {/* Predicted Occupancy Line */}
              <Line type="monotone" dataKey="predicted_occupancy" stroke="#f59e0b" strokeWidth={3} strokeDasharray="4 4" dot={false} name="Predicted Bed Demand" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ward Level Forecast Breakdown Table */}
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h3 className="text-sm font-extrabold text-white mb-3">Ward-Level Surge Breakdown & Capacity Alerts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Ward</th>
                <th className="p-3.5">Licensed Capacity</th>
                <th className="p-3.5">Current Occupancy</th>
                <th className="p-3.5">Predicted Peak Beds</th>
                <th className="p-3.5">Expected Peak Date</th>
                <th className="p-3.5">Surge Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-semibold text-slate-200">
              {ward_forecasts.map((w, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60">
                  <td className="p-3.5 font-extrabold text-white">{w.ward}</td>
                  <td className="p-3.5 text-slate-400">{w.capacity} beds</td>
                  <td className="p-3.5 font-bold text-slate-200">{w.current_occupancy} beds ({Math.round(w.current_occupancy/w.capacity*100)}%)</td>
                  <td className="p-3.5 font-extrabold text-amber-400">{w.predicted_peak} beds ({Math.round(w.predicted_peak/w.capacity*100)}%)</td>
                  <td className="p-3.5 text-slate-400">{w.peak_date}</td>
                  <td className="p-3.5">
                    <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold ${
                      w.risk === 'High' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      w.risk === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-blue-950 text-sky-400 border border-blue-800'
                    }`}>
                      {w.risk} Risk
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
