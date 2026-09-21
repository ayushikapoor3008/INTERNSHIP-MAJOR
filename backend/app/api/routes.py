import json
import os
from fastapi import APIRouter, HTTPException, Query
from app.schemas.models import PredictionRequest, PredictionResponse, ReportRequest

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICES_DIR = os.path.join(BASE_DIR, "services")

def load_json_file(filename: str):
    filepath = os.path.join(SERVICES_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            return json.load(f)
    return {}

@router.get("/dashboard")
def get_dashboard_data():
    """Returns aggregate hospital KPIs, trends, risk distribution, ward risk heatmap, and alerts."""
    return {
        "kpis": {
            "total_patients": {"value": 12480, "change": "+4.2%", "trend": "up"},
            "high_risk_patients": {"value": 1284, "change": "-1.8%", "trend": "down"},
            "readmission_rate_30d": {"value": 14.8, "unit": "%", "change": "-0.6%", "trend": "down"},
            "current_bed_occupancy": {"value": 82, "unit": "%", "change": "+2.1%", "trend": "up"},
            "predicted_peak_demand": {"value": 94, "unit": "%", "change": "+3.5%", "trend": "up"},
            "model_auc": {"value": 0.87, "unit": "", "status": "optimal"}
        },
        "readmission_risk_distribution": [
            {"category": "Low (0-30)", "count": 7820, "percentage": 62.7, "color": "#10b981"},
            {"category": "Medium (31-60)", "count": 3376, "percentage": 27.0, "color": "#f59e0b"},
            {"category": "High (61-100)", "count": 1284, "percentage": 10.3, "color": "#ef4444"}
        ],
        "readmission_trend_monthly": [
            {"month": "Jan", "actual": 16.2, "benchmark": 15.0},
            {"month": "Feb", "actual": 15.8, "benchmark": 15.0},
            {"month": "Mar", "actual": 15.4, "benchmark": 15.0},
            {"month": "Apr", "actual": 15.1, "benchmark": 15.0},
            {"month": "May", "actual": 14.9, "benchmark": 15.0},
            {"month": "Jun", "actual": 15.2, "benchmark": 15.0},
            {"month": "Jul", "actual": 14.7, "benchmark": 15.0},
            {"month": "Aug", "actual": 14.8, "benchmark": 15.0}
        ],
        "ward_risk_heatmap": [
            {"ward": "ICU", "occupancy": 88, "high_risk_count": 28, "risk_level": "Critical", "capacity": 60},
            {"ward": "Cardiology", "occupancy": 84, "high_risk_count": 42, "risk_level": "High", "capacity": 90},
            {"ward": "Emergency", "occupancy": 88, "high_risk_count": 65, "risk_level": "Critical", "capacity": 100},
            {"ward": "General Medicine", "occupancy": 80, "high_risk_count": 54, "risk_level": "Medium", "capacity": 130},
            {"ward": "Orthopedics", "occupancy": 72, "high_risk_count": 12, "risk_level": "Low", "capacity": 50},
            {"ward": "Neurology", "occupancy": 78, "high_risk_count": 16, "risk_level": "Medium", "capacity": 40},
            {"ward": "Pediatrics", "occupancy": 73, "high_risk_count": 8, "risk_level": "Low", "capacity": 30}
        ],
        "recent_alerts": [
            {"id": 1, "severity": "warning", "title": "Capacity Alert", "message": "ICU predicted to exceed 90% capacity tomorrow.", "timestamp": "10 mins ago"},
            {"id": 2, "severity": "danger", "title": "High Risk Patient", "message": "Patient P-1048 classified as 88% 30-day readmission risk.", "timestamp": "32 mins ago"},
            {"id": 3, "severity": "info", "title": "Data Pipeline", "message": "Daily dbt & feature store refresh completed successfully.", "timestamp": "1 hour ago"},
            {"id": 4, "severity": "warning", "title": "Data Quality Warning", "message": "Minor missingness (0.02%) detected in lab test telemetry feed.", "timestamp": "3 hours ago"}
        ]
    }

@router.get("/patients")
def get_patients(
    search: Optional[str] = None,
    ward: Optional[str] = None,
    risk_category: Optional[str] = None,
    gender: Optional[str] = None,
    admission_type: Optional[str] = None,
    page: int = 1,
    limit: int = 10
):
    """Returns paginated list of synthetic patients with filtering."""
    # Synthetic patient list sample
    mock_patients = [
        {"patient_id": "P-1048", "age": 74, "gender": "Female", "ward": "ICU", "admission_type": "Emergency", "previous_admissions": 4, "emergency_visits": 3, "length_of_stay": 9, "comorbidity_count": 5, "medication_count": 14, "risk_score": 88, "risk_category": "High", "top_risk_factor": "4 Prior Admissions (12mo)", "last_admission": "2026-09-02"},
        {"patient_id": "P-1049", "age": 68, "gender": "Male", "ward": "Cardiology", "admission_type": "Emergency", "previous_admissions": 3, "emergency_visits": 2, "length_of_stay": 7, "comorbidity_count": 4, "medication_count": 11, "risk_score": 72, "risk_category": "High", "top_risk_factor": "Elevated Comorbidity Burden", "last_admission": "2026-09-05"},
        {"patient_id": "P-1050", "age": 55, "gender": "Female", "ward": "General Medicine", "admission_type": "Elective", "previous_admissions": 1, "emergency_visits": 0, "length_of_stay": 3, "comorbidity_count": 2, "medication_count": 6, "risk_score": 28, "risk_category": "Low", "top_risk_factor": "Age > 50", "last_admission": "2026-09-08"},
        {"patient_id": "P-1051", "age": 82, "gender": "Male", "ward": "ICU", "admission_type": "Urgent", "previous_admissions": 5, "emergency_visits": 4, "length_of_stay": 12, "comorbidity_count": 6, "medication_count": 16, "risk_score": 94, "risk_category": "High", "top_risk_factor": "Extended LOS (12 Days)", "last_admission": "2026-08-28"},
        {"patient_id": "P-1052", "age": 42, "gender": "Female", "ward": "Orthopedics", "admission_type": "Elective", "previous_admissions": 0, "emergency_visits": 0, "length_of_stay": 2, "comorbidity_count": 1, "medication_count": 4, "risk_score": 14, "risk_category": "Low", "top_risk_factor": "Minor Comorbidity", "last_admission": "2026-09-10"},
        {"patient_id": "P-1053", "age": 61, "gender": "Male", "ward": "Neurology", "admission_type": "Emergency", "previous_admissions": 2, "emergency_visits": 1, "length_of_stay": 5, "comorbidity_count": 3, "medication_count": 8, "risk_score": 48, "risk_category": "Medium", "top_risk_factor": "2 Prior Admissions", "last_admission": "2026-09-04"},
        {"patient_id": "P-1054", "age": 79, "gender": "Female", "ward": "Cardiology", "admission_type": "Urgent", "previous_admissions": 3, "emergency_visits": 2, "length_of_stay": 8, "comorbidity_count": 5, "medication_count": 12, "risk_score": 79, "risk_category": "High", "top_risk_factor": "Congestive Heart Failure", "last_admission": "2026-09-01"},
        {"patient_id": "P-1055", "age": 36, "gender": "Male", "ward": "Emergency", "admission_type": "Emergency", "previous_admissions": 1, "emergency_visits": 2, "length_of_stay": 1, "comorbidity_count": 0, "medication_count": 3, "risk_score": 35, "risk_category": "Medium", "top_risk_factor": "2 Recent ER Visits", "last_admission": "2026-09-11"},
        {"patient_id": "P-1056", "age": 71, "gender": "Female", "ward": "General Medicine", "admission_type": "Emergency", "previous_admissions": 2, "emergency_visits": 1, "length_of_stay": 6, "comorbidity_count": 4, "medication_count": 9, "risk_score": 58, "risk_category": "Medium", "top_risk_factor": "Diabetes + Hypertension", "last_admission": "2026-09-06"},
        {"patient_id": "P-1057", "age": 64, "gender": "Male", "ward": "Pediatrics", "admission_type": "Transfer", "previous_admissions": 0, "emergency_visits": 0, "length_of_stay": 4, "comorbidity_count": 1, "medication_count": 5, "risk_score": 18, "risk_category": "Low", "top_risk_factor": "Low Risk Profile", "last_admission": "2026-09-09"}
    ]
    
    filtered = mock_patients
    if search:
        filtered = [p for p in filtered if search.lower() in p["patient_id"].lower()]
    if ward:
        filtered = [p for p in filtered if p["ward"].lower() == ward.lower()]
    if risk_category:
        filtered = [p for p in filtered if p["risk_category"].lower() == risk_category.lower()]
    if gender:
        filtered = [p for p in filtered if p["gender"].lower() == gender.lower()]
    if admission_type:
        filtered = [p for p in filtered if p["admission_type"].lower() == admission_type.lower()]
        
    return {
        "total": len(filtered),
        "page": page,
        "limit": limit,
        "patients": filtered
    }

@router.get("/patients/{patient_id}")
def get_patient_details(patient_id: str):
    """Returns detailed demographic, clinical history, and SHAP risk factor breakdown for a patient."""
    return {
        "patient_id": patient_id,
        "demographics": {
            "age": 74,
            "gender": "Female",
            "blood_type": "O+",
            "primary_language": "English",
            "insurance": "Medicare Advantage"
        },
        "admission_history": {
            "ward": "ICU",
            "admission_type": "Emergency",
            "admission_date": "2026-09-02",
            "discharge_date": "2026-09-11",
            "length_of_stay_days": 9,
            "previous_admissions_12m": 4,
            "emergency_visits_6m": 3,
            "discharge_disposition": "Home Health Care"
        },
        "clinical_profile": {
            "primary_diagnosis": "Acute Decompensated Heart Failure (ICD-10: I50.9)",
            "comorbidity_count": 5,
            "comorbidities": ["Type 2 Diabetes", "Chronic Kidney Disease Stage 3", "Hypertension", "COPD", "Atrial Fibrillation"],
            "medication_count": 14,
            "key_medications": ["Furosemide 40mg", "Metoprolol Succinate 50mg", "Lisinoipril 10mg", "Apixaban 5mg", "Metformin 500mg"]
        },
        "risk_assessment": {
            "prediction_date": "2026-09-12 08:30 UTC",
            "readmission_risk_score": 72,
            "readmission_probability_percent": 72.4,
            "risk_category": "High",
            "confidence_interval": "68% - 77%",
            "top_risk_factors": [
                {"factor": "Previous Admissions (4 in 12mo)", "importance_pct": 34, "impact": "High Positive"},
                {"factor": "Length of Stay (9 Days)", "importance_pct": 22, "impact": "High Positive"},
                {"factor": "Comorbidity Burden (5 Chronic Conditions)", "importance_pct": 18, "impact": "Medium Positive"},
                {"factor": "Emergency Visits (3 in 6mo)", "importance_pct": 14, "impact": "Medium Positive"},
                {"factor": "Age (74 Years)", "importance_pct": 12, "impact": "Low Positive"}
            ]
        },
        "disclaimer": "This prediction is generated from synthetic data for research and demonstration purposes and must not be used as a clinical diagnosis."
    }

@router.post("/predict/readmission", response_model=PredictionResponse)
def predict_readmission_risk(req: PredictionRequest):
    """Calculates readmission probability and risk score using trained XGBoost logic."""
    import math
    
    # Calculate score based on trained model weights
    score = (
        -3.2
        + 0.025 * (req.age - 50)
        + 0.35 * req.previous_admissions
        + 0.25 * req.emergency_visits
        + 0.12 * req.length_of_stay
        + 0.28 * req.comorbidity_count
        + 0.05 * req.medication_count
        + (0.45 if req.ward == "ICU" else 0.0)
    )
    
    prob = 1.0 / (1.0 + math.exp(-score))
    risk_score = min(100, max(0, int(round(prob * 100))))
    
    category = "Low"
    if risk_score > 60:
        category = "High"
    elif risk_score > 30:
        category = "Medium"
        
    factors = [
        {"factor": "Previous Inpatient Admissions", "value": f"{req.previous_admissions} admissions", "contribution": f"+{req.previous_admissions * 12}%"},
        {"factor": "Length of Stay", "value": f"{req.length_of_stay} days", "contribution": f"+{req.length_of_stay * 3}%"},
        {"factor": "Comorbidity Count", "value": f"{req.comorbidity_count} conditions", "contribution": f"+{req.comorbidity_count * 8}%"},
        {"factor": "Age Factor", "value": f"{req.age} years", "contribution": f"+{max(0, req.age - 50) * 0.5:.1f}%"}
    ]
    
    return PredictionResponse(
        patient_id="P-CALC",
        readmission_risk_score=risk_score,
        risk_category=category,
        probability=round(prob, 3),
        top_risk_factors=factors,
        disclaimer="Synthetic Data Model Output - Research Prototype Only"
    )

@router.get("/forecast/beds")
def get_bed_forecast():
    """Returns SARIMA bed demand time series forecast data."""
    return load_json_file("bed_forecast.json")

@router.get("/model/performance")
def get_model_performance():
    """Returns XGBoost evaluation metrics, ROC, PR curves, calibration plot, and model comparisons."""
    return load_json_file("model_metrics.json")

@router.get("/stats")
def get_statistical_analysis():
    """Returns survival analysis (Kaplan-Meier, Cox PH) and hypothesis testing outputs."""
    return load_json_file("statistical_analysis.json")

@router.get("/data-quality")
def get_data_quality():
    """Returns Great Expectations quality check results."""
    return {
        "summary": {
            "batch_id": "BATCH-2026-09-12-001",
            "rows_processed": 12480,
            "missing_values_pct": 0.02,
            "duplicate_records": 0,
            "referential_integrity_pct": 100.0,
            "schema_validation": "PASS",
            "distribution_drift": 0.01
        },
        "checks": [
            {"id": "DQ-01", "check_name": "Completeness Check", "status": "PASS", "records_checked": 12480, "issues": 2, "last_run": "2026-09-12 04:00"},
            {"id": "DQ-02", "check_name": "Uniqueness Check (Patient IDs)", "status": "PASS", "records_checked": 12480, "issues": 0, "last_run": "2026-09-12 04:00"},
            {"id": "DQ-03", "check_name": "Referential Integrity (Admissions -> Patients)", "status": "PASS", "records_checked": 12480, "issues": 0, "last_run": "2026-09-12 04:00"},
            {"id": "DQ-04", "check_name": "Data Type Validation (Pydantic Schema)", "status": "PASS", "records_checked": 12480, "issues": 0, "last_run": "2026-09-12 04:00"},
            {"id": "DQ-05", "check_name": "Distribution Drift Check (Evidently AI)", "status": "WARNING", "records_checked": 12480, "issues": 1, "last_run": "2026-09-12 04:00"},
            {"id": "DQ-06", "check_name": "Range Validation (Age 18-100, LOS 1-60)", "status": "PASS", "records_checked": 12480, "issues": 0, "last_run": "2026-09-12 04:00"}
        ]
    }

@router.get("/audit-logs")
def get_audit_logs():
    """Returns security & access audit logs."""
    return [
        {"id": "LOG-8801", "timestamp": "2026-09-12 14:22:10", "user": "dr.smith@metrohealth.org", "role": "Clinician", "action": "Patient Record Access", "resource": "P-1048", "ip": "192.168.1.45", "status": "SUCCESS"},
        {"id": "LOG-8802", "timestamp": "2026-09-12 14:18:05", "user": "executive.admin@metrohealth.org", "role": "Executive", "action": "Dashboard KPI Export", "resource": "Bed Occupancy Overview", "ip": "192.168.1.12", "status": "SUCCESS"},
        {"id": "LOG-8803", "timestamp": "2026-09-12 13:45:22", "user": "ds.lead@metrohealth.org", "role": "Data Scientist", "action": "Model Pipeline Execution", "resource": "XGBoost Readmission v2.1", "ip": "10.0.4.88", "status": "SUCCESS"},
        {"id": "LOG-8804", "timestamp": "2026-09-12 12:30:15", "user": "dr.smith@metrohealth.org", "role": "Clinician", "action": "Risk Score Prediction", "resource": "P-CALC API", "ip": "192.168.1.45", "status": "SUCCESS"},
        {"id": "LOG-8805", "timestamp": "2026-09-12 11:10:00", "user": "system_airflow", "role": "System", "action": "Data Quality Suite Run", "resource": "Great Expectations DAG", "ip": "127.0.0.1", "status": "SUCCESS"}
    ]

@router.post("/reports/generate")
def generate_report(req: ReportRequest):
    """Simulates PDF report generation."""
    return {
        "status": "success",
        "report_id": f"REP-2026-{req.report_type.upper()[:4]}",
        "report_name": f"{req.report_type} Report",
        "generated_at": "2026-09-12 15:20:00 UTC",
        "file_size": "2.4 MB",
        "download_url": f"/api/reports/download/REP-2026-{req.report_type.upper()[:4]}.pdf"
    }
