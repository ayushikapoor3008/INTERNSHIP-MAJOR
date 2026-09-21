import React, { useEffect, useState } from 'react';
import { fetchPatients } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, ChevronRight, UserPlus, SlidersHorizontal, AlertTriangle, ShieldCheck } from 'lucide-react';
import { NewPredictionModal } from '../components/NewPredictionModal';

export const PatientRisk = () => {
  const { navigateTo } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [admissionFilter, setAdmissionFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPatients();
  }, [search, wardFilter, riskFilter, genderFilter, admissionFilter]);

  const loadPatients = () => {
    setLoading(true);
    fetchPatients({
      search,
      ward: wardFilter,
      risk_category: riskFilter,
      gender: genderFilter,
      admission_type: admissionFilter
    }).then((res) => {
      setPatients(res.patients || []);
      setLoading(false);
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header & Search Controls */}
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-white">Patient Readmission Risk Stratification</h3>
            <p className="text-xs text-sky-400 font-semibold">Real-time XGBoost ML 30-day readmission risk scores</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all self-start md:self-auto border border-blue-400/30"
          >
            <UserPlus className="w-4 h-4" />
            <span>Score New Patient</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-800">
          
          {/* Search ID */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Patient ID (e.g. P-1048)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-400 text-white placeholder-slate-500"
            />
          </div>

          {/* Ward Filter */}
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-sky-400"
          >
            <option value="">All Hospital Wards</option>
            <option value="ICU">ICU</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Emergency">Emergency</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>

          {/* Risk Category */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-sky-400"
          >
            <option value="">All Risk Categories</option>
            <option value="High">High (61-100)</option>
            <option value="Medium">Medium (31-60)</option>
            <option value="Low">Low (0-30)</option>
          </select>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-sky-400"
          >
            <option value="">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>

          {/* Admission Type */}
          <select
            value={admissionFilter}
            onChange={(e) => setAdmissionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-sky-400"
          >
            <option value="">All Admission Types</option>
            <option value="Emergency">Emergency</option>
            <option value="Elective">Elective</option>
            <option value="Urgent">Urgent</option>
            <option value="Transfer">Transfer</option>
          </select>

        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Patient ID</th>
                <th className="p-3.5">Age / Gender</th>
                <th className="p-3.5">Ward</th>
                <th className="p-3.5 text-center">Prev Admissions</th>
                <th className="p-3.5 text-center">LOS</th>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5">Risk Category</th>
                <th className="p-3.5">Primary Risk Factor</th>
                <th className="p-3.5">Last Admission</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-semibold text-slate-200">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={10} className="p-4"><div className="h-4 bg-slate-800 rounded w-full"></div></td>
                  </tr>
                ))
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    No patients matching the specified filter criteria.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr
                    key={p.patient_id}
                    onClick={() => navigateTo('patient-details', p.patient_id)}
                    className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 font-extrabold text-sky-400">{p.patient_id}</td>
                    <td className="p-3.5 text-slate-300">{p.age} yrs • {p.gender}</td>
                    <td className="p-3.5 font-bold text-slate-200">{p.ward}</td>
                    <td className="p-3.5 text-center font-extrabold text-white">{p.previous_admissions}</td>
                    <td className="p-3.5 text-center font-bold text-slate-400">{p.length_of_stay} d</td>
                    <td className="p-3.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full ${
                              p.risk_score > 60 ? 'bg-rose-500' : p.risk_score > 30 ? 'bg-amber-500' : 'bg-sky-400'
                            }`}
                            style={{ width: `${p.risk_score}%` }}
                          ></div>
                        </div>
                        <span className="font-extrabold text-white">{p.risk_score}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                        p.risk_category === 'High' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                        p.risk_category === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-blue-950 text-sky-400 border border-blue-800'
                      }`}>
                        {p.risk_category}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 truncate max-w-[180px] font-medium">{p.top_risk_factor}</td>
                    <td className="p-3.5 text-slate-500">{p.last_admission}</td>
                    <td className="p-3.5 text-right">
                      <button className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-sky-400 font-extrabold rounded-lg border border-slate-700 transition-colors inline-flex items-center space-x-1">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Showing 1 to {patients.length} of 12,480 total synthetic records</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg font-bold hover:bg-slate-700">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg font-extrabold shadow-sm">1</button>
            <button className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg font-bold hover:bg-slate-700">2</button>
            <button className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg font-bold hover:bg-slate-700">3</button>
            <button className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg font-bold hover:bg-slate-700">Next</button>
          </div>
        </div>
      </div>

      {/* New Prediction Modal */}
      {isModalOpen && <NewPredictionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
