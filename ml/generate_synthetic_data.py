"""
CarePredict AI - Synthetic Hospital Data Generator
Generates realistic fictitious patient records, admissions, bed occupancy time series,
and readmission target labels for research and demonstration purposes.
"""

import numpy as np
import pandas as pd
import json
import os
from datetime import datetime, timedelta

def generate_synthetic_patient_dataset(num_patients=10000, random_seed=42):
    np.random.seed(random_seed)
    
    wards = ["ICU", "Cardiology", "Emergency", "General Medicine", "Orthopedics", "Neurology", "Pediatrics"]
    ward_weights = [0.10, 0.20, 0.25, 0.25, 0.10, 0.05, 0.05]
    
    genders = ["Male", "Female", "Other"]
    gender_weights = [0.49, 0.50, 0.01]
    
    admission_types = ["Emergency", "Elective", "Urgent", "Transfer"]
    admission_weights = [0.55, 0.25, 0.15, 0.05]
    
    diagnoses = [
        "Heart Failure", "Diabetes with Complications", "Pneumonia", 
        "COPD", "Acute Kidney Injury", "Sepsis", "Stroke", 
        "Hip Fracture", "Gastrointestinal Bleed", "Hypertension"
    ]
    
    discharge_dispositions = ["Home", "Home Health Care", "Skilled Nursing Facility", "Rehab", "Against Medical Advice"]
    discharge_weights = [0.60, 0.20, 0.12, 0.06, 0.02]
    
    patient_ids = [f"P-{1000 + i}" for i in range(num_patients)]
    ages = np.random.normal(loc=62, scale=16, size=num_patients).astype(int)
    ages = np.clip(ages, 18, 95)
    
    assigned_wards = np.random.choice(wards, size=num_patients, p=ward_weights)
    assigned_genders = np.random.choice(genders, size=num_patients, p=gender_weights)
    assigned_adm_types = np.random.choice(admission_types, size=num_patients, p=admission_weights)
    assigned_diagnoses = np.random.choice(diagnoses, size=num_patients)
    assigned_discharges = np.random.choice(discharge_dispositions, size=num_patients, p=discharge_weights)
    
    previous_admissions = np.random.poisson(lam=1.4, size=num_patients)
    previous_admissions = np.clip(previous_admissions, 0, 12)
    
    emergency_visits = np.random.poisson(lam=0.8, size=num_patients)
    emergency_visits = np.clip(emergency_visits, 0, 10)
    
    length_of_stay = np.random.exponential(scale=4.5, size=num_patients).astype(int) + 1
    length_of_stay = np.clip(length_of_stay, 1, 30)
    
    comorbidity_count = np.random.poisson(lam=2.2, size=num_patients)
    comorbidity_count = np.clip(comorbidity_count, 0, 8)
    
    medication_count = np.random.normal(loc=6.5, scale=3.5, size=num_patients).astype(int)
    medication_count = np.clip(medication_count, 1, 22)
    
    # Calculate clinically realistic readmission risk probability (logit equation)
    logit = (
        -3.2 
        + 0.025 * (ages - 50)
        + 0.35 * previous_admissions
        + 0.25 * emergency_visits
        + 0.12 * length_of_stay
        + 0.28 * comorbidity_count
        + 0.05 * medication_count
        + (0.45 if "ICU" in assigned_wards else 0.0)
        + (0.30 if "Cardiology" in assigned_wards else 0.0)
    )
    
    prob_readmission = 1.0 / (1.0 + np.exp(-logit))
    readmitted_30d = (np.random.rand(num_patients) < prob_readmission).astype(int)
    
    # Generate risk scores 0-100
    risk_scores = np.round(prob_readmission * 100).astype(int)
    
    risk_categories = []
    for score in risk_scores:
        if score <= 30:
            risk_categories.append("Low")
        elif score <= 60:
            risk_categories.append("Medium")
        else:
            risk_categories.append("High")
            
    # Dates
    start_date = datetime(2025, 1, 1)
    admission_dates = [
        (start_date + timedelta(days=int(np.random.randint(0, 365)))).strftime("%Y-%m-%d")
        for _ in range(num_patients)
    ]
    
    df = pd.DataFrame({
        "patient_id": patient_ids,
        "age": ages,
        "gender": assigned_genders,
        "ward": assigned_wards,
        "admission_type": assigned_adm_types,
        "diagnosis_category": assigned_diagnoses,
        "previous_admissions": previous_admissions,
        "emergency_visits": emergency_visits,
        "length_of_stay": length_of_stay,
        "comorbidity_count": comorbidity_count,
        "medication_count": medication_count,
        "discharge_disposition": assigned_discharges,
        "admission_date": admission_dates,
        "readmission_risk_score": risk_scores,
        "risk_category": risk_categories,
        "readmitted_30d": readmitted_30d
    })
    
    return df

def generate_bed_occupancy_time_series(days=180, total_capacity=500):
    np.random.seed(42)
    start_date = datetime(2026, 3, 1)
    
    dates = [(start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(days)]
    
    # Base pattern: 80% occupancy + weekly seasonality + trend + noise
    t = np.arange(days)
    trend = 0.05 * t
    seasonality = 15 * np.sin(2 * np.pi * t / 7) + 8 * np.cos(2 * np.pi * t / 30)
    noise = np.random.normal(0, 8, size=days)
    
    actual_occupancy = (380 + trend + seasonality + noise).astype(int)
    actual_occupancy = np.clip(actual_occupancy, 250, 490)
    
    return pd.DataFrame({
        "date": dates,
        "actual_occupancy": actual_occupancy,
        "total_capacity": [total_capacity] * days
    })

if __name__ == "__main__":
    os.makedirs("../data", exist_ok=True)
    df_patients = generate_synthetic_patient_dataset(10000)
    df_patients.to_csv("../data/synthetic_patients_10k.csv", index=False)
    print(f"Generated 10,000 synthetic patient records at ../data/synthetic_patients_10k.csv")
    
    df_beds = generate_bed_occupancy_time_series(180)
    df_beds.to_csv("../data/bed_occupancy_time_series.csv", index=False)
    print(f"Generated 180 days bed occupancy time series at ../data/bed_occupancy_time_series.csv")
