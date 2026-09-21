-- ============================================================================
-- CarePredict AI - PostgreSQL & TimescaleDB Production Database DDL
-- ============================================================================

-- Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Uncomment for TimescaleDB support on time-series telemetry tables:
-- CREATE EXTENSION IF NOT EXISTS timescaledb;

-- 1. Patients Table
CREATE TABLE patients (
    patient_id VARCHAR(32) PRIMARY KEY,
    pseudonymised_hash VARCHAR(64) UNIQUE NOT NULL,
    age INT NOT NULL CHECK (age >= 0 AND age <= 120),
    gender VARCHAR(16) NOT NULL,
    blood_type VARCHAR(8),
    primary_language VARCHAR(32) DEFAULT 'English',
    insurance_provider VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Admissions Table
CREATE TABLE admissions (
    admission_id VARCHAR(32) PRIMARY KEY,
    patient_id VARCHAR(32) REFERENCES patients(patient_id) ON DELETE CASCADE,
    ward VARCHAR(32) NOT NULL,
    admission_type VARCHAR(32) NOT NULL,
    admission_date TIMESTAMP WITH TIME ZONE NOT NULL,
    discharge_date TIMESTAMP WITH TIME ZONE,
    length_of_stay INT CHECK (length_of_stay >= 0),
    discharge_disposition VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Diagnoses Table
CREATE TABLE diagnoses (
    diagnosis_id SERIAL PRIMARY KEY,
    admission_id VARCHAR(32) REFERENCES admissions(admission_id) ON DELETE CASCADE,
    icd10_code VARCHAR(16) NOT NULL,
    diagnosis_category VARCHAR(64) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE
);

-- 4. Medications Table
CREATE TABLE medications (
    medication_id SERIAL PRIMARY KEY,
    admission_id VARCHAR(32) REFERENCES admissions(admission_id) ON DELETE CASCADE,
    rxnorm_code VARCHAR(16),
    drug_name VARCHAR(128) NOT NULL,
    dosage VARCHAR(32),
    frequency VARCHAR(32)
);

-- 5. Readmissions Table
CREATE TABLE readmissions (
    readmission_id SERIAL PRIMARY KEY,
    original_admission_id VARCHAR(32) REFERENCES admissions(admission_id) ON DELETE CASCADE,
    readmission_admission_id VARCHAR(32) REFERENCES admissions(admission_id) ON DELETE CASCADE,
    days_to_readmission INT NOT NULL,
    readmitted_within_30d BOOLEAN NOT NULL
);

-- 6. Bed Occupancy (Time-Series Hypertable ready)
CREATE TABLE bed_occupancy (
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    hospital_id VARCHAR(32) NOT NULL,
    ward VARCHAR(32) NOT NULL,
    occupied_beds INT NOT NULL,
    total_capacity INT NOT NULL,
    available_beds INT GENERATED ALWAYS AS (total_capacity - occupied_beds) STORED,
    PRIMARY KEY (timestamp, hospital_id, ward)
);
-- SELECT create_hypertable('bed_occupancy', 'timestamp'); -- TimescaleDB

-- 7. Predictions Table
CREATE TABLE predictions (
    prediction_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id VARCHAR(32) REFERENCES patients(patient_id),
    admission_id VARCHAR(32) REFERENCES admissions(admission_id),
    model_version VARCHAR(32) NOT NULL,
    risk_score INT NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    probability NUMERIC(5,4) NOT NULL,
    risk_category VARCHAR(16) NOT NULL,
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Model Runs Table
CREATE TABLE model_runs (
    run_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    model_name VARCHAR(64) NOT NULL,
    version VARCHAR(32) NOT NULL,
    roc_auc NUMERIC(4,3),
    f1_score NUMERIC(4,3),
    brier_score NUMERIC(5,4),
    training_samples INT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Data Quality Checks Table
CREATE TABLE data_quality_checks (
    check_id SERIAL PRIMARY KEY,
    batch_id VARCHAR(64) NOT NULL,
    check_name VARCHAR(128) NOT NULL,
    status VARCHAR(16) NOT NULL,
    records_checked INT NOT NULL,
    issues_found INT NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logs Table
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(64) NOT NULL,
    role VARCHAR(32) NOT NULL,
    action VARCHAR(64) NOT NULL,
    resource VARCHAR(128) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    status VARCHAR(16) NOT NULL
);

-- 11. Users Table
CREATE TABLE users (
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(128) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('Clinician', 'Executive', 'Data Scientist')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for fast querying
CREATE INDEX idx_patients_ward ON admissions(ward);
CREATE INDEX idx_predictions_patient ON predictions(patient_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(username);
