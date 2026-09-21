# CarePredict AI - Data Dictionary & Relational Schema

This document details the PostgreSQL / TimescaleDB relational database schema used in the CarePredict AI platform.

## 1. `patients` Table
| Column Name | Data Type | Description | Nullable | Example |
| :--- | :--- | :--- | :--- | :--- |
| `patient_id` | `VARCHAR(32)` | Unique Synthetic Patient Identifier (PK) | NO | `"P-1048"` |
| `pseudonymised_hash` | `VARCHAR(64)` | SHA-256 K-anonymised hash token | NO | `"a4f9...e810"` |
| `age` | `INT` | Patient age in years | NO | `74` |
| `gender` | `VARCHAR(16)` | Biological gender | NO | `"Female"` |
| `blood_type` | `VARCHAR(8)` | ABO Blood Group | YES | `"O+"` |
| `primary_language` | `VARCHAR(32)` | Preferred spoken language | YES | `"English"` |
| `insurance_provider` | `VARCHAR(64)` | Payer / Insurance entity | YES | `"Medicare Advantage"` |
| `created_at` | `TIMESTAMPTZ` | Record ingestion timestamp | NO | `2026-09-01 10:00:00+00` |

## 2. `admissions` Table
| Column Name | Data Type | Description | Nullable | Example |
| :--- | :--- | :--- | :--- | :--- |
| `admission_id` | `VARCHAR(32)` | Unique Admission Event ID (PK) | NO | `"ADM-8091"` |
| `patient_id` | `VARCHAR(32)` | Foreign Key to `patients.patient_id` | NO | `"P-1048"` |
| `ward` | `VARCHAR(32)` | Hospital ward / department | NO | `"ICU"` |
| `admission_type` | `VARCHAR(32)` | Admission acuity (Emergency, Elective, Urgent) | NO | `"Emergency"` |
| `admission_date` | `TIMESTAMPTZ` | Inpatient admission timestamp | NO | `2026-09-02 08:15:00+00` |
| `discharge_date` | `TIMESTAMPTZ` | Inpatient discharge timestamp | YES | `2026-09-11 14:00:00+00` |
| `length_of_stay` | `INT` | Total hospital stay in days | YES | `9` |
| `discharge_disposition` | `VARCHAR(64)` | Post-discharge care location | YES | `"Home Health Care"` |

## 3. `diagnoses` Table
| Column Name | Data Type | Description | Nullable | Example |
| :--- | :--- | :--- | :--- | :--- |
| `diagnosis_id` | `SERIAL` | Primary Key | NO | `1` |
| `admission_id` | `VARCHAR(32)` | Foreign Key to `admissions.admission_id` | NO | `"ADM-8091"` |
| `icd10_code` | `VARCHAR(16)` | Standard ICD-10 Diagnosis Code | NO | `"I50.9"` |
| `diagnosis_category` | `VARCHAR(64)` | Clinical condition category | NO | `"Heart Failure"` |
| `is_primary` | `BOOLEAN` | True if primary admission diagnosis | NO | `true` |

## 4. `medications` Table
| Column Name | Data Type | Description | Nullable | Example |
| :--- | :--- | :--- | :--- | :--- |
| `medication_id` | `SERIAL` | Primary Key | NO | `1` |
| `admission_id` | `VARCHAR(32)` | Foreign Key to `admissions.admission_id` | NO | `"ADM-8091"` |
| `rxnorm_code` | `VARCHAR(16)` | RxNorm Clinical Drug Code | YES | `"310138"` |
| `drug_name` | `VARCHAR(128)` | Prescription medication name | NO | `"Furosemide 40mg"` |
| `dosage` | `VARCHAR(32)` | Dose strength | YES | `"40mg"` |
| `frequency` | `VARCHAR(32)` | Administration schedule | YES | `"Once Daily"` |

## 5. `readmissions` Table
| Column Name | Data Type | Description | Nullable | Example |
| :--- | :--- | :--- | :--- | :--- |
| `readmission_id` | `SERIAL` | Primary Key | NO | `101` |
| `original_admission_id` | `VARCHAR(32)` | Index admission ID | NO | `"ADM-8091"` |
| `readmission_admission_id` | `VARCHAR(32)` | Subsequent readmission ID | NO | `"ADM-8512"` |
| `days_to_readmission` | `INT` | Days elapsed between discharge & readm | NO | `14` |
| `readmitted_within_30d` | `BOOLEAN` | Target variable: True if <= 30 days | NO | `true` |

## 6. `bed_occupancy` Table (TimescaleDB Hypertable)
| Column Name | Data Type | Description | Nullable | Example |
| :--- | :--- | :--- | :--- | :--- |
| `timestamp` | `TIMESTAMPTZ` | Hourly/Daily telemetry timestamp (PK) | NO | `2026-09-12 00:00:00+00` |
| `hospital_id` | `VARCHAR(32)` | Facility identifier | NO | `"HOSP-METRO-01"` |
| `ward` | `VARCHAR(32)` | Hospital department ward | NO | `"ICU"` |
| `occupied_beds` | `INT` | Currently occupied bed count | NO | `53` |
| `total_capacity` | `INT` | Total licensed beds in ward | NO | `60` |

## 7. `predictions` Table
| Column Name | Data Type | Description | Nullable | Example |
| :--- | :--- | :--- | :--- | :--- |
| `prediction_id` | `UUID` | Prediction event UUID (PK) | NO | `"f47ac10b-58cc..."` |
| `patient_id` | `VARCHAR(32)` | Patient reference ID | NO | `"P-1048"` |
| `model_version` | `VARCHAR(32)` | Model version used | NO | `"XGBoost v2.1.0"` |
| `risk_score` | `INT` | Calibrated Risk Score (0 - 100) | NO | `72` |
| `probability` | `NUMERIC(5,4)` | Raw probability estimate | NO | `0.7240` |
| `risk_category` | `VARCHAR(16)` | Risk tier (Low, Medium, High) | NO | `"High"` |

## 8. `model_runs` Table
| Column Name | Data Type | Description | Nullable | Example |
| :--- | :--- | :--- | :--- | :--- |
| `run_id` | `UUID` | ML Experiment Run UUID | NO | `"b72e109a..."` |
| `model_name` | `VARCHAR(64)` | Machine Learning Model name | NO | `"XGBoost Classifier"` |
| `version` | `VARCHAR(32)` | Model semantic version | NO | `"v2.1.0"` |
| `roc_auc` | `NUMERIC(4,3)` | Evaluation ROC-AUC metric | NO | `0.872` |
| `f1_score` | `NUMERIC(4,3)` | Evaluation F1-Score metric | NO | `0.787` |

## 9. `data_quality_checks` Table
| Column Name | Data Type | Description | Nullable | Example |
| :--- | :--- | :--- | :--- | :--- |
| `check_id` | `SERIAL` | Data Quality Execution ID | NO | `55` |
| `batch_id` | `VARCHAR(64)` | Great Expectations Batch ID | NO | `"BATCH-2026-09-12"` |
| `check_name` | `VARCHAR(128)` | Assertion test name | NO | `"Completeness Check"` |
| `status` | `VARCHAR(16)` | Outcome status (PASS, WARNING, FAIL) | NO | `"PASS"` |

## 10. `audit_logs` Table
| Column Name | Data Type | Description | Nullable | Example |
| :--- | :--- | :--- | :--- | :--- |
| `log_id` | `SERIAL` | Security audit log ID | NO | `8801` |
| `username` | `VARCHAR(64)` | Authenticated user email | NO | `"dr.smith@metrohealth.org"` |
| `role` | `VARCHAR(32)` | RBAC Role (Clinician, Executive, DS) | NO | `"Clinician"` |
| `action` | `VARCHAR(64)` | System operation performed | NO | `"Patient Record Access"` |

## 11. `users` Table
| Column Name | Data Type | Description | Nullable | Example |
| :--- | :--- | :--- | :--- | :--- |
| `user_id` | `UUID` | Unique User UUID | NO | `"e810a4f9..."` |
| `email` | `VARCHAR(128)` | User email address | NO | `"executive.admin@metrohealth.org"` |
| `role` | `VARCHAR(32)` | Platform Access Role | NO | `"Executive"` |
