// CarePredict AI - API Service Layer with Fallback Mock Data
const API_BASE = 'https://carepredict-backend.onrender.com/api';

export const fetchDashboardData = async () => {
  try {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, using rich mock payload for Dashboard");
  }
  return {
    kpis: {
      total_patients: { value: 12480, change: "+4.2%", trend: "up" },
      high_risk_patients: { value: 1284, change: "-1.8%", trend: "down" },
      readmission_rate_30d: { value: 14.8, unit: "%", change: "-0.6%", trend: "down" },
      current_bed_occupancy: { value: 82, unit: "%", change: "+2.1%", trend: "up" },
      predicted_peak_demand: { value: 94, unit: "%", change: "+3.5%", trend: "up" },
      model_auc: { value: 0.87, unit: "", status: "optimal" }
    },
    readmission_risk_distribution: [
      { category: "Low (0-30)", count: 7820, percentage: 62.7, color: "#10b981" },
      { category: "Medium (31-60)", count: 3376, percentage: 27.0, color: "#f59e0b" },
      { category: "High (61-100)", count: 1284, percentage: 10.3, color: "#ef4444" }
    ],
    readmission_trend_monthly: [
      { month: "Jan", actual: 16.2, benchmark: 15.0 },
      { month: "Feb", actual: 15.8, benchmark: 15.0 },
      { month: "Mar", actual: 15.4, benchmark: 15.0 },
      { month: "Apr", actual: 15.1, benchmark: 15.0 },
      { month: "May", actual: 14.9, benchmark: 15.0 },
      { month: "Jun", actual: 15.2, benchmark: 15.0 },
      { month: "Jul", actual: 14.7, benchmark: 15.0 },
      { month: "Aug", actual: 14.8, benchmark: 15.0 }
    ],
    ward_risk_heatmap: [
      { ward: "ICU", occupancy: 88, high_risk_count: 28, risk_level: "Critical", capacity: 60 },
      { ward: "Cardiology", occupancy: 84, high_risk_count: 42, risk_level: "High", capacity: 90 },
      { ward: "Emergency", occupancy: 88, high_risk_count: 65, risk_level: "Critical", capacity: 100 },
      { ward: "General Medicine", occupancy: 80, high_risk_count: 54, risk_level: "Medium", capacity: 130 },
      { ward: "Orthopedics", occupancy: 72, high_risk_count: 12, risk_level: "Low", capacity: 50 },
      { ward: "Neurology", occupancy: 78, high_risk_count: 16, risk_level: "Medium", capacity: 40 },
      { ward: "Pediatrics", occupancy: 73, high_risk_count: 8, risk_level: "Low", capacity: 30 }
    ],
    recent_alerts: [
      { id: 1, severity: "warning", title: "Capacity Alert", message: "ICU predicted to exceed 90% capacity tomorrow.", timestamp: "10 mins ago" },
      { id: 2, severity: "danger", title: "High Risk Patient", message: "Patient P-1048 classified as 88% 30-day readmission risk.", timestamp: "32 mins ago" },
      { id: 3, severity: "info", title: "Data Pipeline", message: "Daily dbt & feature store refresh completed successfully.", timestamp: "1 hour ago" },
      { id: 4, severity: "warning", title: "Data Quality Warning", message: "Minor missingness (0.02%) detected in lab test telemetry feed.", timestamp: "3 hours ago" }
    ]
  };
};

export const fetchPatients = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/patients?${query}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, using patient mock generator");
  }
  // Fallback patient list
  return {
    total: 10,
    page: 1,
    limit: 10,
    patients: [
      { patient_id: "P-1048", age: 74, gender: "Female", ward: "ICU", admission_type: "Emergency", previous_admissions: 4, emergency_visits: 3, length_of_stay: 9, comorbidity_count: 5, medication_count: 14, risk_score: 88, risk_category: "High", top_risk_factor: "4 Prior Admissions (12mo)", last_admission: "2026-09-02" },
      { patient_id: "P-1049", age: 68, gender: "Male", ward: "Cardiology", admission_type: "Emergency", previous_admissions: 3, emergency_visits: 2, length_of_stay: 7, comorbidity_count: 4, medication_count: 11, risk_score: 72, risk_category: "High", top_risk_factor: "Elevated Comorbidity Burden", last_admission: "2026-09-05" },
      { patient_id: "P-1050", age: 55, gender: "Female", ward: "General Medicine", admission_type: "Elective", previous_admissions: 1, emergency_visits: 0, length_of_stay: 3, comorbidity_count: 2, medication_count: 6, risk_score: 28, risk_category: "Low", top_risk_factor: "Age > 50", last_admission: "2026-09-08" },
      { patient_id: "P-1051", age: 82, gender: "Male", ward: "ICU", admission_type: "Urgent", previous_admissions: 5, emergency_visits: 4, length_of_stay: 12, comorbidity_count: 6, medication_count: 16, risk_score: 94, risk_category: "High", top_risk_factor: "Extended LOS (12 Days)", last_admission: "2026-08-28" },
      { patient_id: "P-1052", age: 42, gender: "Female", ward: "Orthopedics", admission_type: "Elective", previous_admissions: 0, emergency_visits: 0, length_of_stay: 2, comorbidity_count: 1, medication_count: 4, risk_score: 14, risk_category: "Low", top_risk_factor: "Minor Comorbidity", last_admission: "2026-09-10" },
      { patient_id: "P-1053", age: 61, gender: "Male", ward: "Neurology", admission_type: "Emergency", previous_admissions: 2, emergency_visits: 1, length_of_stay: 5, comorbidity_count: 3, medication_count: 8, risk_score: 48, risk_category: "Medium", top_risk_factor: "2 Prior Admissions", last_admission: "2026-09-04" },
      { patient_id: "P-1054", age: 79, gender: "Female", ward: "Cardiology", admission_type: "Urgent", previous_admissions: 3, emergency_visits: 2, length_of_stay: 8, comorbidity_count: 5, medication_count: 12, risk_score: 79, risk_category: "High", top_risk_factor: "Congestive Heart Failure", last_admission: "2026-09-01" },
      { patient_id: "P-1055", age: 36, gender: "Male", ward: "Emergency", admission_type: "Emergency", previous_admissions: 1, emergency_visits: 2, length_of_stay: 1, comorbidity_count: 0, medication_count: 3, risk_score: 35, risk_category: "Medium", top_risk_factor: "2 Recent ER Visits", last_admission: "2026-09-11" },
      { patient_id: "P-1056", age: 71, gender: "Female", ward: "General Medicine", admission_type: "Emergency", previous_admissions: 2, emergency_visits: 1, length_of_stay: 6, comorbidity_count: 4, medication_count: 9, risk_score: 58, risk_category: "Medium", top_risk_factor: "Diabetes + Hypertension", last_admission: "2026-09-06" },
      { patient_id: "P-1057", age: 64, gender: "Male", ward: "Pediatrics", admission_type: "Transfer", previous_admissions: 0, emergency_visits: 0, length_of_stay: 4, comorbidity_count: 1, medication_count: 5, risk_score: 18, risk_category: "Low", top_risk_factor: "Low Risk Profile", last_admission: "2026-09-09" }
    ]
  };
};

export const fetchPatientDetails = async (patientId) => {
  try {
    const res = await fetch(`${API_BASE}/patients/${patientId}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, returning patient details mock");
  }
  return {
    patient_id: patientId,
    demographics: { age: 74, gender: "Female", blood_type: "O+", primary_language: "English", insurance: "Medicare Advantage" },
    admission_history: { ward: "ICU", admission_type: "Emergency", admission_date: "2026-09-02", discharge_date: "2026-09-11", length_of_stay_days: 9, previous_admissions_12m: 4, emergency_visits_6m: 3, discharge_disposition: "Home Health Care" },
    clinical_profile: {
      primary_diagnosis: "Acute Decompensated Heart Failure (ICD-10: I50.9)",
      comorbidity_count: 5,
      comorbidities: ["Type 2 Diabetes", "Chronic Kidney Disease Stage 3", "Hypertension", "COPD", "Atrial Fibrillation"],
      medication_count: 14,
      key_medications: ["Furosemide 40mg", "Metoprolol Succinate 50mg", "Lisinopril 10mg", "Apixaban 5mg", "Metformin 500mg"]
    },
    risk_assessment: {
      prediction_date: "2026-09-12 08:30 UTC",
      readmission_risk_score: 72,
      readmission_probability_percent: 72.4,
      risk_category: "High",
      confidence_interval: "68% - 77%",
      top_risk_factors: [
        { factor: "Previous Admissions (4 in 12mo)", importance_pct: 34, impact: "High Positive" },
        { factor: "Length of Stay (9 Days)", importance_pct: 22, impact: "High Positive" },
        { factor: "Comorbidity Burden (5 Chronic Conditions)", importance_pct: 18, impact: "Medium Positive" },
        { factor: "Emergency Visits (3 in 6mo)", importance_pct: 14, impact: "Medium Positive" },
        { factor: "Age (74 Years)", importance_pct: 12, impact: "Low Positive" }
      ]
    },
    disclaimer: "This prediction is generated from synthetic data for research and demonstration purposes and must not be used as a clinical diagnosis."
  };
};

export const predictReadmission = async (formData) => {
  try {
    const res = await fetch(`${API_BASE}/predict/readmission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, executing local ML score estimator");
  }
  // Local ML estimation formula
  const age = Number(formData.age) || 60;
  const prevAdm = Number(formData.previous_admissions) || 1;
  const er = Number(formData.emergency_visits) || 0;
  const los = Number(formData.length_of_stay) || 4;
  const comorb = Number(formData.comorbidity_count) || 2;
  
  const scoreRaw = -3.2 + 0.025 * (age - 50) + 0.35 * prevAdm + 0.25 * er + 0.12 * los + 0.28 * comorb;
  const prob = 1 / (1 + Math.exp(-scoreRaw));
  const riskScore = Math.min(100, Math.max(0, Math.round(prob * 100)));
  const category = riskScore > 60 ? "High" : riskScore > 30 ? "Medium" : "Low";
  
  return {
    patient_id: "P-CALC",
    readmission_risk_score: riskScore,
    risk_category: category,
    probability: Number(prob.toFixed(3)),
    top_risk_factors: [
      { factor: "Previous Inpatient Admissions", value: `${prevAdm} admissions`, contribution: `+${prevAdm * 12}%` },
      { factor: "Length of Stay", value: `${los} days`, contribution: `+${los * 3}%` },
      { factor: "Comorbidity Burden", value: `${comorb} conditions`, contribution: `+${comorb * 8}%` }
    ],
    disclaimer: "Synthetic Data Model Output - Research Prototype Only"
  };
};

export const fetchBedForecast = async () => {
  try {
    const res = await fetch(`${API_BASE}/forecast/beds`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, returning bed forecast mock");
  }
  return {
    hospital_name: "MetroHealth Central Network",
    total_capacity: 500,
    current_occupancy: 410,
    predicted_peak: 468,
    predicted_peak_date: "2026-09-22",
    peak_occupancy_percent: 93.6,
    available_beds_at_peak: 32,
    time_series: [
      { date: "Sep 01", type: "actual", actual_occupancy: 405, predicted_occupancy: null, upper_ci: null, lower_ci: null },
      { date: "Sep 03", type: "actual", actual_occupancy: 412, predicted_occupancy: null, upper_ci: null, lower_ci: null },
      { date: "Sep 05", type: "actual", actual_occupancy: 410, predicted_occupancy: null, upper_ci: null, lower_ci: null },
      { date: "Sep 07", type: "actual", actual_occupancy: 425, predicted_occupancy: null, upper_ci: null, lower_ci: null },
      { date: "Sep 09", type: "actual", actual_occupancy: 432, predicted_occupancy: null, upper_ci: null, lower_ci: null },
      { date: "Sep 11", type: "actual", actual_occupancy: 418, predicted_occupancy: null, upper_ci: null, lower_ci: null },
      { date: "Sep 13", type: "forecast", actual_occupancy: null, predicted_occupancy: 430, upper_ci: 445, lower_ci: 415 },
      { date: "Sep 15", type: "forecast", actual_occupancy: null, predicted_occupancy: 442, upper_ci: 460, lower_ci: 424 },
      { date: "Sep 17", type: "forecast", actual_occupancy: null, predicted_occupancy: 455, upper_ci: 475, lower_ci: 435 },
      { date: "Sep 19", type: "forecast", actual_occupancy: null, predicted_occupancy: 462, upper_ci: 484, lower_ci: 440 },
      { date: "Sep 22", type: "forecast", actual_occupancy: null, predicted_occupancy: 468, upper_ci: 492, lower_ci: 444 }
    ],
    ward_forecasts: [
      { ward: "ICU", capacity: 60, current_occupancy: 53, predicted_peak: 57, peak_date: "2026-09-22", risk: "High" },
      { ward: "Cardiology", capacity: 90, current_occupancy: 76, predicted_peak: 84, peak_date: "2026-09-24", risk: "Medium" },
      { ward: "Emergency", capacity: 100, current_occupancy: 88, predicted_peak: 96, peak_date: "2026-09-18", risk: "High" },
      { ward: "General Medicine", capacity: 130, current_occupancy: 104, predicted_peak: 118, peak_date: "2026-09-21", risk: "Medium" },
      { ward: "Orthopedics", capacity: 50, current_occupancy: 36, predicted_peak: 42, peak_date: "2026-09-20", risk: "Low" },
      { ward: "Neurology", capacity: 40, current_occupancy: 31, predicted_peak: 36, peak_date: "2026-09-25", risk: "Low" },
      { ward: "Pediatrics", capacity: 30, current_occupancy: 22, predicted_peak: 26, peak_date: "2026-09-23", risk: "Low" }
    ]
  };
};

export const fetchModelPerformance = async () => {
  try {
    const res = await fetch(`${API_BASE}/model/performance`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, returning model metrics mock");
  }
  return {
    model_version: "XGBoost v2.1.0",
    training_date: "2026-09-12",
    dataset_version: "Synthetic EHR v4.2 (10,000 records)",
    metrics: { roc_auc: 0.872, precision: 0.814, recall: 0.762, f1_score: 0.787, calibration_brier: 0.0895 },
    validation_strategy: { cv_type: "Stratified 5-Fold Cross Validation" },
    roc_curve: { fpr: [0.0, 0.05, 0.14, 0.28, 0.50, 0.82, 1.0], tpr: [0.0, 0.42, 0.75, 0.91, 0.97, 1.0, 1.0] },
    pr_curve: { precision: [0.95, 0.86, 0.81, 0.68, 0.30], recall: [0.0, 0.50, 0.76, 0.92, 1.0] },
    calibration_curve: { prob_pred: [0.1, 0.3, 0.5, 0.7, 0.9], prob_true: [0.09, 0.31, 0.49, 0.72, 0.88] },
    confusion_matrix: { true_negative: 1420, false_positive: 180, false_negative: 95, true_positive: 305 },
    feature_importance: [
      { feature: "Previous Admissions", importance: 0.342 },
      { feature: "Length of Stay", importance: 0.218 },
      { feature: "Comorbidity Burden", importance: 0.165 },
      { feature: "Age Group", importance: 0.114 },
      { feature: "Emergency Visits", importance: 0.092 }
    ],
    model_comparison: [
      { model: "Logistic Regression", auc: 0.791, precision: 0.724, recall: 0.681, f1: 0.702, time_ms: 45 },
      { model: "Random Forest", auc: 0.842, precision: 0.776, recall: 0.732, f1: 0.753, time_ms: 280 },
      { model: "XGBoost (Selected)", auc: 0.872, precision: 0.814, recall: 0.762, f1: 0.787, time_ms: 140 },
      { model: "PyCaret AutoML", auc: 0.825, precision: 0.752, recall: 0.710, f1: 0.730, time_ms: 510 }
    ]
  };
};

export const fetchStatisticalAnalysis = async () => {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, returning stats mock");
  }
  return {
    hypothesis_testing: [
      { id: 1, test_name: "Two-Sample t-Test: Length of Stay", null_hypothesis: "Mean LOS equal across readmission groups.", alt_hypothesis: "Mean LOS greater for readmitted.", test_statistic: "t = 6.42", raw_p_value: 0.00012, adjusted_p_value_bonferroni: 0.00060, conclusion: "Reject H0 (Statistically Significant)" },
      { id: 2, test_name: "Chi-Square Test: Ward vs Readmission", null_hypothesis: "Readmission independent of ward.", alt_hypothesis: "Readmission rate varies across wards.", test_statistic: "χ² = 34.81", raw_p_value: 0.00004, adjusted_p_value_bonferroni: 0.00020, conclusion: "Reject H0 (Statistically Significant)" },
      { id: 3, test_name: "Mann-Whitney U Test: Prior Admissions", null_hypothesis: "Identical distributions.", alt_hypothesis: "Stochastic dominance in readmitted.", test_statistic: "U = 1420500.5", raw_p_value: 0.00008, adjusted_p_value_bonferroni: 0.00040, conclusion: "Reject H0 (Statistically Significant)" }
    ],
    bayesian_ab_testing: {
      title: "Post-Discharge Outreach Intervention A/B Test",
      control_group: { name: "Standard Care", sample_size: 2500, readmissions: 412, observed_rate: 0.1648 },
      intervention_group: { name: "Nurse Follow-Up Call (48h)", sample_size: 2500, readmissions: 305, observed_rate: 0.1220 },
      prob_intervention_better: 0.9984,
      relative_risk_reduction: 0.2597
    },
    time_series_decomposition: [
      { date: "Aug 01", observed: 412, trend: 410, seasonality: 2, residual: 0 },
      { date: "Aug 05", observed: 428, trend: 414, seasonality: 14, residual: 0 },
      { date: "Aug 10", observed: 405, trend: 418, seasonality: -13, residual: 0 },
      { date: "Aug 15", observed: 435, trend: 422, seasonality: 12, residual: 1 }
    ]
  };
};

export const fetchDataQuality = async () => {
  try {
    const res = await fetch(`${API_BASE}/data-quality`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, returning data quality mock");
  }
  return {
    summary: { batch_id: "BATCH-2026-09-12-001", rows_processed: 12480, missing_values_pct: 0.02, duplicate_records: 0, referential_integrity_pct: 100.0, schema_validation: "PASS", distribution_drift: 0.01 },
    checks: [
      { id: "DQ-01", check_name: "Completeness Check", status: "PASS", records_checked: 12480, issues: 2, last_run: "2026-09-12 04:00" },
      { id: "DQ-02", check_name: "Uniqueness Check (Patient IDs)", status: "PASS", records_checked: 12480, issues: 0, last_run: "2026-09-12 04:00" },
      { id: "DQ-03", check_name: "Referential Integrity", status: "PASS", records_checked: 12480, issues: 0, last_run: "2026-09-12 04:00" },
      { id: "DQ-04", check_name: "Schema Type Validation", status: "PASS", records_checked: 12480, issues: 0, last_run: "2026-09-12 04:00" },
      { id: "DQ-05", check_name: "Distribution Drift Check", status: "WARNING", records_checked: 12480, issues: 1, last_run: "2026-09-12 04:00" }
    ]
  };
};

export const fetchAuditLogs = async () => {
  try {
    const res = await fetch(`${API_BASE}/audit-logs`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, returning audit logs mock");
  }
  return [
    { id: "LOG-8801", timestamp: "2026-09-12 14:22:10", user: "dr.jenkins@metrohealth.org", role: "Clinician", action: "Patient Record Access", resource: "P-1048", ip: "192.168.1.45", status: "SUCCESS" },
    { id: "LOG-8802", timestamp: "2026-09-12 14:18:05", user: "coo@metrohealth.org", role: "Executive", action: "Dashboard KPI Export", resource: "Bed Occupancy Overview", ip: "192.168.1.12", status: "SUCCESS" },
    { id: "LOG-8803", timestamp: "2026-09-12 13:45:22", user: "ds.lead@metrohealth.org", role: "Data Scientist", action: "Model Pipeline Execution", resource: "XGBoost Readmission v2.1", ip: "10.0.4.88", status: "SUCCESS" }
  ];
};

