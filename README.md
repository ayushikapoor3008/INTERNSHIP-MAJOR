# CarePredict AI – Predictive Healthcare Analytics Platform

"CarePredict AI" is a production-grade predictive healthcare analytics SaaS platform developed as a Data Science internship major project for a fictitious hospital network (MetroHealth Central Network). 

It provides executive KPIs, clinician-level patient readmission risk predictions (XGBoost), hospital bed demand forecasting (SARIMA), biostatistical & survival analysis (Kaplan-Meier, Cox Proportional Hazards, Bayesian A/B testing), automated data quality monitoring (Great Expectations style), data engineering DAG orchestration (Airflow style), security audit trails, privacy governance (k-anonymity, differential privacy), and automated PDF reporting.

> [!IMPORTANT]
> **Synthetic Data / Research Prototype Disclaimer**: CarePredict AI utilizes 100% synthetic, fictitious patient datasets. All predictive scores, clinical risk profiles, and bed demand forecasts are generated for research and demonstration purposes only and must not be used for real clinical decision-making.

---

## 1. Project Structure

```
c:\Users\ayush\INTERNSHIP MAJOR\
├── frontend/                     # React + Vite + Tailwind CSS + Recharts + Lucide Icons
│   ├── public/
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, Disclaimer, Modals, Risk Gauge
│   │   ├── context/              # AuthContext (RBAC: Clinician, Executive, Data Scientist)
│   │   ├── pages/                # 12 major application views
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PatientRisk.jsx
│   │   │   ├── PatientDetails.jsx
│   │   │   ├── BedForecast.jsx
│   │   │   ├── StatisticalAnalysis.jsx
│   │   │   ├── ModelPerformance.jsx
│   │   │   ├── DataQuality.jsx
│   │   │   ├── DataPipeline.jsx
│   │   │   ├── AuditLogs.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── Settings.jsx      # Settings, Data Governance & Data Dictionary
│   │   ├── services/             # REST API service wrappers & mock fallbacks
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                      # Python FastAPI REST API Backend
│   ├── app/
│   │   ├── main.py               # FastAPI entry point & CORS
│   │   ├── api/                  # 9 REST API endpoint handlers
│   │   ├── schemas/              # Pydantic data schemas
│   │   └── services/             # JSON data engines & ML metrics
│   ├── requirements.txt
│   └── .env.example
│
├── ml/                           # Data Science & Machine Learning Pipeline
│   ├── generate_synthetic_data.py # Generates 10,000 synthetic patient records
│   ├── train_model.py            # XGBoost classifier, ROC-AUC, calibration & metrics export
│   ├── forecasting.py            # SARIMA bed occupancy time-series model
│   ├── survival_analysis.py      # Kaplan-Meier & Cox Proportional Hazards fitting
│   └── statistical_tests.py     # Hypothesis testing with Bonferroni correction & Bayesian A/B
│
├── database/                     # PostgreSQL & TimescaleDB Database Specs
│   ├── schema.sql                # Production DDL for 11 relational tables
│   └── data_dictionary.md        # Column descriptions, data types, and example values
│
├── docker/                       # Docker Containerization
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
└── README.md                     # Complete project documentation & setup instructions
```

---

## 2. How to Run Frontend

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Setup & Launch
```bash
cd frontend
npm install
npm run dev
```
The application will launch locally at `http://localhost:3000`.

---

## 3. How to Run Backend

### Prerequisites
- Python 3.10+ or Python 3.13 (`py` launcher on Windows)

### Setup & Launch
```bash
# Navigate to project root
cd backend

# Install required packages
pip install -r requirements.txt

# Start FastAPI server via Uvicorn
uvicorn app.main:app --reload --port 8000
```
The API server will run at `http://localhost:8000` with interactive Swagger API docs available at `http://localhost:8000/docs`.

---

## 4. Required Python Packages

```txt
fastapi>=0.100.0
uvicorn>=0.22.0
pydantic>=2.0.0
python-dotenv>=1.0.0
numpy>=1.24.0
pandas>=2.0.0
scikit-learn>=1.3.0
xgboost>=1.7.0
statsmodels>=0.14.0
lifelines>=0.27.0
```

---

## 5. Environment Variables (`.env`)

Create a `.env` file in `backend/`:
```env
PORT=8000
HOST=0.0.0.0
ENV=development

POSTGRES_USER=carepredict_user
POSTGRES_PASSWORD=carepredict_pass
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=carepredict_db

SECRET_KEY=carepredict_jwt_secret_key_demo_2026
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

---

## 6. Database Setup Instructions (PostgreSQL / TimescaleDB)

1. Create a PostgreSQL database named `carepredict_db`.
2. Execute the DDL schema in `database/schema.sql`:
```bash
psql -U carepredict_user -d carepredict_db -f database/schema.sql
```
3. (Optional) For TimescaleDB hypertable acceleration on `bed_occupancy`:
```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
SELECT create_hypertable('bed_occupancy', 'timestamp');
```

---

## 7. API Documentation (REST Endpoints)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Aggregate hospital KPIs, readmission risk distribution, monthly trends, ward heatmap & alerts |
| `GET` | `/api/patients` | Searchable, paginated synthetic patient risk directory |
| `GET` | `/api/patients/{id}` | Detailed clinical profile, demographics, and SHAP risk factor breakdown |
| `POST` | `/api/predict/readmission` | Real-time XGBoost inference endpoint for scoring custom patient features |
| `GET` | `/api/forecast/beds` | SARIMA time-series bed occupancy forecast dataset with 95% confidence bounds |
| `GET` | `/api/model/performance` | XGBoost ROC-AUC (0.872), F1 score, calibration curve, confusion matrix & feature importances |
| `GET` | `/api/stats` | Survival analysis (Kaplan-Meier, Cox PH), Bonferroni hypothesis tests & Bayesian A/B tests |
| `GET` | `/api/data-quality` | Great Expectations suite assertions and distribution drift scores |
| `GET` | `/api/audit-logs` | Compliance security audit log trail |
| `POST` | `/api/reports/generate` | Generates report metadata & PDF layout payload |

---

## 8. Sample Credentials & Role-Based Access Control (RBAC)

Click any fast-track login button on the Login screen to switch demo personas:

| Role | Demo User Email | Accessible Views |
| :--- | :--- | :--- |
| 🩺 **Clinician** | `dr.jenkins@metrohealth.org` | Dashboard, Patient Risk, Patient Details, Bed Forecast, Reports, Settings |
| 📊 **Executive** | `coo@metrohealth.org` | Dashboard, Bed Forecast, Reports, Audit Logs, Settings |
| 🔬 **Data Scientist** | `ds.lead@metrohealth.org` | **All 12 Views** (including Statistical Analysis, Model Performance, Data Quality, Airflow Pipeline) |

---

## 9. Machine Learning Pipeline Explanation (XGBoost Readmission Classifier)

1. **Feature Engineering**:
   - `age`: Continuous numerical feature.
   - `previous_admissions`: Prior 12-month inpatient admissions (highest Gini gain: 34.2%).
   - `length_of_stay`: Inpatient duration in days (21.8% Gini gain).
   - `comorbidity_count`: Chronic disease count (16.5% Gini gain).
   - `emergency_visits`: ER visits in past 6 months (9.2% Gini gain).
   - `medication_count`: Active discharge medications (6.9% Gini gain).

2. **Training & Validation**:
   - Trained using **XGBoost Classifier** (`n_estimators=120, max_depth=4, learning_rate=0.05`).
   - Validated via **Stratified 5-Fold Cross-Validation** to preserve target imbalance (~15% readmission rate).

3. **Probability Calibration**:
   - Calibrated using `CalibratedClassifierCV` (Isotonic Regression) to yield accurate empirical risk probabilities (Brier Score = 0.0895).

4. **Performance Metrics**:
   - **ROC-AUC**: `0.872`
   - **Precision**: `0.814`
   - **Recall**: `0.762`
   - **F1 Score**: `0.787`

---

## 10. Bed Demand Forecasting Pipeline Explanation (SARIMA)

1. **Time-Series Telemetry**:
   - Tracks 180 days of historical hourly bed occupancy across 7 clinical wards (ICU, Cardiology, Emergency, General Medicine, Orthopedics, Neurology, Pediatrics).

2. **SARIMA Model Architecture**:
   - Models seasonal weekly oscillation cycles ($s=7$) alongside baseline occupancy trend.
   - Outputs 7-day, 14-day, and 30-day forecast horizons with upper and lower 95% confidence intervals to warn hospital administration prior to bed capacity surges.
