from pydantic import BaseModel
from typing import List, Optional

class PredictionRequest(BaseModel):
    age: int
    gender: str
    ward: str
    admission_type: str
    previous_admissions: int
    emergency_visits: int
    length_of_stay: int
    comorbidity_count: int
    medication_count: int

class PredictionResponse(BaseModel):
    patient_id: Optional[str] = "P-NEW"
    readmission_risk_score: int
    risk_category: str
    probability: float
    top_risk_factors: List[dict]
    disclaimer: str

class ReportRequest(BaseModel):
    report_type: str
    date_range: Optional[str] = "Last 30 Days"
    format: Optional[str] = "PDF"
