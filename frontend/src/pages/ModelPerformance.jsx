import React, { useEffect, useState } from 'react';
import { fetchModelPerformance } from '../services/api';
import { Cpu, ShieldCheck, Activity, BarChart2, CheckCircle2, Sliders, Layers } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const ModelPerformance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelPerformance().then((res) => {
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

  const { model_version, training_date, dataset_version, metrics, validation_strategy, roc_curve, pr_curve, calibration_curve, confusion_matrix, feature_importance, model_comparison } = data;

  const rocChartData = roc_curve.fpr.map((fpr, i) => ({
    fpr,
    tpr: roc_curve.tpr[i],
    random: fpr
  }));

  const calibChartData = calibration_curve.prob_pred.map((pred, i) => ({
    pred,
    true_prob: calibration_curve.prob_true[i],
    perfect: pred
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Model Version</span>
          <div className="text-lg font-black text-white mt-1">{model_version}</div>
          <span className="text-[10px] font-bold text-sky-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">Production</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Training Date</span>
          <div className="text-base font-bold text-slate-200 mt-1.5">{training_date}</div>
          <span className="text-[10px] text-slate-500">Automated Pipeline</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">ROC-AUC Score</span>
          <div className="text-2xl font-black text-sky-400 mt-1">{metrics.roc_auc}</div>
          <span className="text-[11px] font-bold text-sky-400">Optimal Discrimination</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">F1 Score</span>
          <div className="text-2xl font-black text-white mt-1">{metrics.f1_score}</div>
          <span className="text-[11px] font-bold text-slate-400">Precision: {metrics.precision}</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Calibration Brier</span>
          <div className="text-2xl font-black text-purple-400 mt-1">{metrics.calibration_brier}</div>
          <span className="text-[11px] font-bold text-purple-400">Low Calibration Error</span>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 block">Dataset Scope</span>
          <div className="text-xs font-bold text-slate-200 mt-2">{dataset_version}</div>
          <span className="text-[10px] text-slate-500">Stratified 80/20 Split</span>
        </div>

      </div>

      {/* ROC Curve & Calibration Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ROC Curve Chart */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-white">Receiver Operating Characteristic (ROC Curve)</h3>
              <p className="text-xs text-slate-400 font-medium">True Positive Rate vs False Positive Rate (AUC = {metrics.roc_auc})</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="fpr" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#fff' }} />
                <Line type="monotone" dataKey="tpr" stroke="#38bdf8" strokeWidth={3} dot={false} name="XGBoost v2.1 (AUC = 0.872)" />
                <Line type="monotone" dataKey="random" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Random Chance (AUC = 0.50)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Probability Calibration Curve */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-white">Probability Calibration Reliability Curve</h3>
              <p className="text-xs text-slate-400 font-medium">Predicted Risk Probability vs True Empirical Outcome (Isotonic Calibrated)</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calibChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="pred" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'Mean Predicted Risk', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'Empirical Readmit Rate', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#fff' }} />
                <Line type="monotone" dataKey="true_prob" stroke="#c084fc" strokeWidth={3} dot={{ r: 4 }} name="Calibrated XGBoost" />
                <Line type="monotone" dataKey="perfect" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Perfect Reliability" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Confusion Matrix & Feature Importances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Confusion Matrix Visualizer */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white mb-1">Confusion Matrix</h3>
            <p className="text-xs text-slate-400 mb-4">Test set (N=2,000 synthetic holdout records)</p>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-emerald-400 block">True Negative (TN)</span>
                <div className="text-2xl font-black text-white mt-1">{confusion_matrix.true_negative}</div>
                <span className="text-[10px] text-emerald-400 font-semibold">Correctly Unreadmitted</span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-amber-400 block">False Positive (FP)</span>
                <div className="text-2xl font-black text-white mt-1">{confusion_matrix.false_positive}</div>
                <span className="text-[10px] text-amber-400 font-semibold">False Alarm</span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-rose-400 block">False Negative (FN)</span>
                <div className="text-2xl font-black text-white mt-1">{confusion_matrix.false_negative}</div>
                <span className="text-[10px] text-rose-400 font-semibold">Missed Readmission</span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-sky-400 block">True Positive (TP)</span>
                <div className="text-2xl font-black text-white mt-1">{confusion_matrix.true_positive}</div>
                <span className="text-[10px] text-sky-400 font-semibold">Correct High Risk</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400 mt-4">
            <strong>Sensitivity (Recall):</strong> {(metrics.recall * 100).toFixed(1)}% • <strong>Specificity:</strong> 88.7%
          </div>
        </div>

        {/* Feature Importance Chart */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl lg:col-span-2">
          <h3 className="text-sm font-extrabold text-white mb-1">XGBoost Feature Importance Weights</h3>
          <p className="text-xs text-slate-400 mb-4">Gini impurity gain importance across clinical input variables</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={feature_importance} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: '#f8fafc' }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} formatter={(val) => [(val * 100).toFixed(1) + '%', 'Importance']} />
                <Bar dataKey="importance" fill="#38bdf8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Model Validation Architecture & Algorithm Comparison Table */}
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white">Model Benchmark & Algorithm Comparison Matrix</h3>
            <p className="text-xs text-slate-400 font-medium">Cross-validation benchmarks comparing baseline classifiers against selected XGBoost model</p>
          </div>
          <span className="text-xs font-bold text-sky-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            {validation_strategy.cv_type}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase">
              <tr>
                <th className="p-3.5">Model Candidate</th>
                <th className="p-3.5 text-center">ROC-AUC</th>
                <th className="p-3.5 text-center">Precision</th>
                <th className="p-3.5 text-center">Recall</th>
                <th className="p-3.5 text-center">F1 Score</th>
                <th className="p-3.5 text-center">Training Latency</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-semibold text-slate-200">
              {model_comparison.map((m, idx) => {
                const isSelected = m.model.includes('XGBoost');
                return (
                  <tr key={idx} className={isSelected ? 'bg-blue-950/60 font-bold text-white' : 'hover:bg-slate-900/60'}>
                    <td className="p-3.5">{m.model}</td>
                    <td className="p-3.5 text-center font-extrabold text-sky-400">{m.auc}</td>
                    <td className="p-3.5 text-center">{m.precision}</td>
                    <td className="p-3.5 text-center">{m.recall}</td>
                    <td className="p-3.5 text-center font-bold text-white">{m.f1}</td>
                    <td className="p-3.5 text-center text-slate-400">{m.time_ms} ms</td>
                    <td className="p-3.5">
                      {isSelected ? (
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-extrabold shadow-sm inline-flex items-center space-x-1 border border-blue-400/40">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Selected Model</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Baseline</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
