import React, { useEffect, useState } from 'react';
import { fetchDashboardData } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  AlertTriangle,
  Activity,
  BedDouble,
  TrendingUp,
  TrendingDown,
  Cpu,
  ArrowUpRight,
  ChevronRight,
  Bell,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export const Dashboard = () => {
  const { navigateTo } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <div className="h-8 bg-slate-800 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-800/60 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const { kpis, readmission_risk_distribution, readmission_trend_monthly, ward_risk_heatmap, recent_alerts } = data;

  const mockBedOccupancyTimeSeries = [
    { date: 'Sep 01', actual: 405, predicted: 408 },
    { date: 'Sep 03', actual: 412, predicted: 415 },
    { date: 'Sep 05', actual: 410, predicted: 412 },
    { date: 'Sep 07', actual: 425, predicted: 428 },
    { date: 'Sep 09', actual: 432, predicted: 430 },
    { date: 'Sep 11', actual: 418, predicted: 422 },
    { date: 'Sep 13', actual: null, predicted: 445 },
    { date: 'Sep 15', actual: null, predicted: 458 },
    { date: 'Sep 17', actual: null, predicted: 468 },
    { date: 'Sep 19', actual: null, predicted: 462 }
  ];

  const darkPieColors = ["#38bdf8", "#f59e0b", "#f87171"];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* KPI Cards Row (6 Dark Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Total Patients */}
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Total Patients</span>
            <div className="p-1.5 rounded-xl bg-blue-950 text-sky-400 border border-blue-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{kpis.total_patients.value.toLocaleString()}</div>
          <div className="flex items-center text-[11px] font-bold text-sky-400 mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            <span>{kpis.total_patients.change} vs last month</span>
          </div>
        </div>

        {/* High Risk Patients */}
        <div 
          onClick={() => navigateTo('patient-risk')}
          className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl hover:border-rose-900/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold group-hover:text-rose-400 transition-colors">High Risk Patients</span>
            <div className="p-1.5 rounded-xl bg-rose-950 text-rose-400 border border-rose-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-400">{kpis.high_risk_patients.value.toLocaleString()}</div>
          <div className="flex items-center text-[11px] font-bold text-sky-400 mt-1">
            <TrendingDown className="w-3 h-3 mr-0.5" />
            <span>{kpis.high_risk_patients.change} improved</span>
          </div>
        </div>

        {/* 30-Day Readmission Rate */}
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">30d Readmit Rate</span>
            <div className="p-1.5 rounded-xl bg-sky-950 text-sky-400 border border-sky-800">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{kpis.readmission_rate_30d.value}%</div>
          <div className="flex items-center text-[11px] font-bold text-sky-400 mt-1">
            <TrendingDown className="w-3 h-3 mr-0.5" />
            <span>{kpis.readmission_rate_30d.change} lower</span>
          </div>
        </div>

        {/* Bed Occupancy */}
        <div 
          onClick={() => navigateTo('bed-forecast')}
          className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl hover:border-sky-900/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold group-hover:text-sky-400 transition-colors">Current Bed Occupancy</span>
            <div className="p-1.5 rounded-xl bg-blue-950 text-sky-400 border border-blue-800">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{kpis.current_bed_occupancy.value}%</div>
          <div className="flex items-center text-[11px] font-bold text-amber-400 mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            <span>{kpis.current_bed_occupancy.change} capacity</span>
          </div>
        </div>

        {/* Predicted Peak Demand */}
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Predicted Peak</span>
            <div className="p-1.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-sky-400">{kpis.predicted_peak_demand.value}%</div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">Peak expected Sep 22</div>
        </div>

        {/* Model AUC */}
        <div 
          onClick={() => navigateTo('model-performance')}
          className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl hover:border-purple-900/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold group-hover:text-purple-400 transition-colors">XGBoost ROC-AUC</span>
            <div className="p-1.5 rounded-xl bg-purple-950 text-purple-400 border border-purple-800">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{kpis.model_auc.value}</div>
          <div className="flex items-center space-x-1 text-[11px] font-bold text-sky-400 mt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Calibrated v2.1</span>
          </div>
        </div>

      </div>

      {/* Main Grid Section 1: Readmission Risk Distribution & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Readmission Risk Distribution */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-white">Readmission Risk Distribution</h3>
              <p className="text-xs text-slate-400 font-medium">Population stratification</p>
            </div>
            <span className="text-[10px] font-bold bg-slate-800 text-sky-400 border border-slate-700 px-2 py-0.5 rounded-md">N=12,480</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={readmission_risk_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {readmission_risk_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={darkPieColors[index % darkPieColors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-3 text-center">
            {readmission_risk_distribution.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: darkPieColors[idx] }}></span>
                  <span className="text-[11px] font-bold text-slate-300">{item.category.split(' ')[0]}</span>
                </div>
                <div className="text-xs font-black text-white mt-0.5">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Readmission Monthly Trend */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-white">30-Day Readmission Monthly Trend</h3>
              <p className="text-xs text-slate-400 font-medium">Actual hospital rate vs 15.0% clinical target benchmark</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-bold">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-1 bg-sky-400 rounded"></span>
                <span className="text-slate-300">Actual Rate (%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-slate-500 border-t border-dashed border-slate-500"></span>
                <span className="text-slate-400">Benchmark (15%)</span>
              </div>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readmission_trend_monthly} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[12, 18]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="actual" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#38bdf8' }} />
                <Line type="monotone" dataKey="benchmark" stroke="#64748b" strokeDasharray="4 4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Main Grid Section 2: Bed Occupancy Forecast & Ward Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bed Occupancy Time Series (Actual vs Predicted) */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-white">Bed Occupancy Telemetry & SARIMA Forecast</h3>
              <p className="text-xs text-slate-400 font-medium">Historical occupancy + 7-day predictive surge horizon</p>
            </div>
            <button 
              onClick={() => navigateTo('bed-forecast')}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center bg-blue-950 px-3 py-1.5 rounded-xl border border-blue-800"
            >
              <span>Full Forecast View</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockBedOccupancyTimeSeries} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[350, 500]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="actual" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} strokeWidth={2.5} name="Actual Occupancy" />
                <Area type="monotone" dataKey="predicted" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2.5} strokeDasharray="4 4" name="Predicted Horizon" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Alerts Feed */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center">
                <Bell className="w-4 h-4 text-sky-400 mr-2" />
                <span>Clinical Alerts</span>
              </h3>
              <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                4 Active
              </span>
            </div>

            <div className="space-y-3">
              {recent_alerts.map((alert) => (
                <div key={alert.id} className="p-3 rounded-xl border bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      alert.severity === 'danger' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      alert.severity === 'warning' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-blue-950 text-sky-400 border border-blue-800'
                    }`}>
                      {alert.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 mt-1.5">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => navigateTo('audit-logs')}
            className="mt-4 w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-sky-300 text-xs font-bold rounded-xl transition-colors border border-slate-700"
          >
            View System Audit Trail
          </button>
        </div>

      </div>

      {/* Ward Risk Heatmap Table */}
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white">Hospital Ward Risk & Occupancy Heatmap</h3>
            <p className="text-xs text-slate-400 font-medium">Real-time status across major clinical departments</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Ward / Department</th>
                <th className="p-3.5">Total Capacity</th>
                <th className="p-3.5">Current Occupancy</th>
                <th className="p-3.5">High Risk Patients</th>
                <th className="p-3.5">Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-semibold text-slate-200">
              {ward_risk_heatmap.map((ward, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3.5 font-extrabold text-white">{ward.ward}</td>
                  <td className="p-3.5 text-slate-400">{ward.capacity} beds</td>
                  <td className="p-3.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-28 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            ward.occupancy >= 85 ? 'bg-rose-500' : ward.occupancy >= 78 ? 'bg-amber-500' : 'bg-sky-400'
                          }`}
                          style={{ width: `${ward.occupancy}%` }}
                        ></div>
                      </div>
                      <span className="font-extrabold text-white">{ward.occupancy}%</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-extrabold text-white">{ward.high_risk_count} patients</td>
                  <td className="p-3.5">
                    <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold ${
                      ward.risk_level === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      ward.risk_level === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      ward.risk_level === 'Medium' ? 'bg-blue-950 text-sky-400 border border-blue-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {ward.risk_level}
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
