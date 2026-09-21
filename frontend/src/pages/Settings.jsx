import React, { useState } from 'react';
import { ShieldCheck, Lock, Database, Table, Layers, CheckCircle2, UserCheck } from 'lucide-react';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('privacy');
  const [selectedTable, setSelectedTable] = useState('patients');

  const privacySettings = [
    { title: "Patient Identifiers", status: "Pseudonymised", desc: "SHA-256 K-anonymity hash tokens replace all PII before ML processing." },
    { title: "Data Source", status: "Synthetic EHR", desc: "100% fictitious patient dataset generated for clinical research." },
    { title: "Export Protection", status: "K-Anonymity (k=5) + Differential Privacy", desc: "Noise injection & aggregation thresholds prevent re-identification." },
    { title: "Access Control (RBAC)", status: "Enabled", desc: "Strict role isolation (Clinician, Executive, Data Scientist)." },
    { title: "Audit Trail", status: "Active & Immutable", desc: "All patient queries & prediction requests logged to compliance audit log." }
  ];

  const dataDictionary = {
    patients: [
      { column: "patient_id", type: "VARCHAR(32)", desc: "Unique synthetic patient ID (PK)", nullable: "NO", example: "P-1048" },
      { column: "pseudonymised_hash", type: "VARCHAR(64)", desc: "SHA-256 anonymised token", nullable: "NO", example: "a4f9e810..." },
      { column: "age", type: "INT", desc: "Patient age in years", nullable: "NO", example: "74" },
      { column: "gender", type: "VARCHAR(16)", desc: "Biological gender", nullable: "NO", example: "Female" },
      { column: "primary_language", type: "VARCHAR(32)", desc: "Preferred spoken language", nullable: "YES", example: "English" }
    ],
    admissions: [
      { column: "admission_id", type: "VARCHAR(32)", desc: "Unique admission event ID (PK)", nullable: "NO", example: "ADM-8091" },
      { column: "patient_id", type: "VARCHAR(32)", desc: "Foreign key to patients", nullable: "NO", example: "P-1048" },
      { column: "ward", type: "VARCHAR(32)", desc: "Hospital ward/unit", nullable: "NO", example: "ICU" },
      { column: "length_of_stay", type: "INT", desc: "Inpatient stay in days", nullable: "YES", example: "9" },
      { column: "discharge_disposition", type: "VARCHAR(64)", desc: "Discharge location", nullable: "YES", example: "Home Health Care" }
    ],
    diagnoses: [
      { column: "diagnosis_id", type: "SERIAL", desc: "Primary key", nullable: "NO", example: "1" },
      { column: "admission_id", type: "VARCHAR(32)", desc: "Foreign key to admissions", nullable: "NO", example: "ADM-8091" },
      { column: "icd10_code", type: "VARCHAR(16)", desc: "ICD-10 clinical code", nullable: "NO", example: "I50.9" },
      { column: "diagnosis_category", type: "VARCHAR(64)", desc: "Disease category", nullable: "NO", example: "Heart Failure" }
    ],
    medications: [
      { column: "medication_id", type: "SERIAL", desc: "Primary Key", nullable: "NO", example: "101" },
      { column: "admission_id", type: "VARCHAR(32)", desc: "Foreign key to admissions", nullable: "NO", example: "ADM-8091" },
      { column: "rxnorm_code", type: "VARCHAR(16)", desc: "RxNorm drug code", nullable: "YES", example: "310138" },
      { column: "drug_name", type: "VARCHAR(128)", desc: "Medication name", nullable: "NO", example: "Furosemide 40mg" }
    ],
    readmissions: [
      { column: "readmission_id", type: "SERIAL", desc: "Primary Key", nullable: "NO", example: "55" },
      { column: "original_admission_id", type: "VARCHAR(32)", desc: "Index admission ID", nullable: "NO", example: "ADM-8091" },
      { column: "days_to_readmission", type: "INT", desc: "Days elapsed before readmission", nullable: "NO", example: "14" },
      { column: "readmitted_within_30d", type: "BOOLEAN", desc: "Target outcome label", nullable: "NO", example: "true" }
    ],
    bed_occupancy: [
      { column: "timestamp", type: "TIMESTAMPTZ", desc: "Telemetry timestamp (PK)", nullable: "NO", example: "2026-09-12 00:00:00" },
      { column: "ward", type: "VARCHAR(32)", desc: "Department ward name", nullable: "NO", example: "ICU" },
      { column: "occupied_beds", type: "INT", desc: "Occupied bed count", nullable: "NO", example: "53" },
      { column: "total_capacity", type: "INT", desc: "Ward bed capacity", nullable: "NO", example: "60" }
    ],
    predictions: [
      { column: "prediction_id", type: "UUID", desc: "Prediction UUID (PK)", nullable: "NO", example: "f47ac10b..." },
      { column: "patient_id", type: "VARCHAR(32)", desc: "Patient reference ID", nullable: "NO", example: "P-1048" },
      { column: "risk_score", type: "INT", desc: "Calibrated risk score (0-100)", nullable: "NO", example: "72" },
      { column: "probability", type: "NUMERIC(5,4)", desc: "Raw prediction probability", nullable: "NO", example: "0.7240" }
    ],
    model_runs: [
      { column: "run_id", type: "UUID", desc: "ML experiment run UUID", nullable: "NO", example: "b72e109a..." },
      { column: "model_name", type: "VARCHAR(64)", desc: "ML model name", nullable: "NO", example: "XGBoost Classifier" },
      { column: "roc_auc", type: "NUMERIC(4,3)", desc: "Evaluation ROC-AUC metric", nullable: "NO", example: "0.872" }
    ],
    data_quality_checks: [
      { column: "check_id", type: "SERIAL", desc: "Execution ID", nullable: "NO", example: "1" },
      { column: "check_name", type: "VARCHAR(128)", desc: "Great Expectations test name", nullable: "NO", example: "Completeness Check" },
      { column: "status", type: "VARCHAR(16)", desc: "Outcome (PASS, WARNING, FAIL)", nullable: "NO", example: "PASS" }
    ],
    audit_logs: [
      { column: "log_id", type: "SERIAL", desc: "Audit log ID", nullable: "NO", example: "8801" },
      { column: "username", type: "VARCHAR(64)", desc: "User email address", nullable: "NO", example: "dr.smith@metrohealth.org" },
      { column: "action", type: "VARCHAR(64)", desc: "Action performed", nullable: "NO", example: "Patient Record Access" }
    ],
    users: [
      { column: "user_id", type: "UUID", desc: "User UUID (PK)", nullable: "NO", example: "e810a4f9..." },
      { column: "email", type: "VARCHAR(128)", desc: "User email", nullable: "NO", example: "coo@metrohealth.org" },
      { column: "role", type: "VARCHAR(32)", desc: "RBAC Role", nullable: "NO", example: "Executive" }
    ]
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Tab Toggle */}
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white">Platform Settings, Governance & Schema Dictionary</h3>
          <p className="text-xs text-sky-400 font-semibold">Data privacy policies, role-based access matrix, and PostgreSQL table schemas</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'privacy' ? 'bg-blue-600 text-white shadow border border-blue-500/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            Privacy & Governance
          </button>
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'dictionary' ? 'bg-blue-600 text-white shadow border border-blue-500/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            Data Dictionary (11 Tables)
          </button>
        </div>
      </div>

      {activeTab === 'privacy' ? (
        /* Privacy & Security Section */
        <div className="space-y-6">
          <div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-sky-400 pb-3 border-b border-slate-800">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-sm font-extrabold text-white">HIPAA & Privacy Protection Standard</h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              "Patient identifiers are pseudonymised before analytics processing. Aggregate exports are protected using privacy-preserving techniques."
            </p>

            <div className="space-y-3 pt-2">
              {privacySettings.map((s, i) => (
                <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-white">{s.title}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.desc}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-950 text-sky-400 font-extrabold rounded-full text-xs border border-blue-800">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Data Dictionary Section */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Table Selector */}
          <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl space-y-2">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">PostgreSQL Tables</h4>
            {Object.keys(dataDictionary).map((tbl) => (
              <button
                key={tbl}
                onClick={() => setSelectedTable(tbl)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  selectedTable === tbl ? 'bg-blue-600 text-white shadow border border-blue-500/50' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span>{tbl}</span>
                <Table className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          {/* Table Schema Viewer */}
          <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-extrabold text-white">Table Schema: <span className="text-sky-400 font-black">{selectedTable}</span></h4>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">PostgreSQL DDL</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="p-3.5">Column Name</th>
                    <th className="p-3.5">Data Type</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5 text-center">Nullable</th>
                    <th className="p-3.5">Example Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-semibold text-slate-200">
                  {dataDictionary[selectedTable].map((col, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60">
                      <td className="p-3.5 font-extrabold text-white">{col.column}</td>
                      <td className="p-3.5 font-mono text-purple-400 font-bold text-[11px]">{col.type}</td>
                      <td className="p-3.5 text-slate-300">{col.desc}</td>
                      <td className="p-3.5 text-center font-bold text-slate-400">{col.nullable}</td>
                      <td className="p-3.5 font-mono text-sky-400 text-[11px]">{col.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
