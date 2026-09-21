import React, { useState } from 'react';
import { predictReadmission } from '../services/api';
import { X, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

export const NewPredictionModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    age: 70,
    gender: 'Female',
    ward: 'ICU',
    admission_type: 'Emergency',
    previous_admissions: 3,
    emergency_visits: 2,
    length_of_stay: 7,
    comorbidity_count: 4,
    medication_count: 10
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await predictReadmission(formData);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-2xl max-w-xl w-full overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-[#090e1a] border-b border-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h3 className="font-extrabold text-sm tracking-tight">Run Real-time XGBoost Risk Scoring</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {!result ? (
            <form onSubmit={handlePredict} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Patient Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:border-sky-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:border-sky-400"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Ward Assignment</label>
                  <select
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:border-sky-400"
                  >
                    <option value="ICU">ICU</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Emergency">Emergency</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Neurology">Neurology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Admission Type</label>
                  <select
                    value={formData.admission_type}
                    onChange={(e) => setFormData({ ...formData, admission_type: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:border-sky-400"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="Elective">Elective</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Previous Admissions (12m)</label>
                  <input
                    type="number"
                    value={formData.previous_admissions}
                    onChange={(e) => setFormData({ ...formData, previous_admissions: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:border-sky-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Emergency Visits (6m)</label>
                  <input
                    type="number"
                    value={formData.emergency_visits}
                    onChange={(e) => setFormData({ ...formData, emergency_visits: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:border-sky-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Length of Stay (Days)</label>
                  <input
                    type="number"
                    value={formData.length_of_stay}
                    onChange={(e) => setFormData({ ...formData, length_of_stay: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:border-sky-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Comorbidity Count</label>
                  <input
                    type="number"
                    value={formData.comorbidity_count}
                    onChange={(e) => setFormData({ ...formData, comorbidity_count: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:border-sky-400"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg border border-blue-400/30 transition-all flex items-center space-x-2"
                >
                  {loading ? (
                    <span>Running Inference...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Compute ML Prediction Score</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Prediction Results */
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Calculated 30-Day Risk Score</span>
                  <div className="text-3xl font-black text-sky-400 mt-1">
                    {result.readmission_risk_score} / 100
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 font-medium">Estimated Probability: {(result.probability * 100).toFixed(1)}%</p>
                </div>
                <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold ${
                  result.risk_category === 'High' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                  result.risk_category === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-blue-950 text-sky-400 border border-blue-800'
                }`}>
                  {result.risk_category} Risk
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white mb-2">SHAP Feature Impact Drivers:</h4>
                <div className="space-y-2">
                  {result.top_risk_factors.map((f, i) => (
                    <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between text-xs">
                      <span className="font-bold text-slate-200">{f.factor} ({f.value})</span>
                      <span className="font-black text-sky-400">{f.contribution}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-300 font-medium">
                <strong className="text-white">Disclaimer:</strong> {result.disclaimer}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setResult(null)}
                  className="px-4 py-2 bg-slate-900 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-800 border border-slate-700"
                >
                  Score Another Profile
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-extrabold rounded-xl hover:bg-blue-500"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
