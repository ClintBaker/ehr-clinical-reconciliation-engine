from typing import List

from pydantic import BaseModel, Field

from .common import ClinicalSafetyStatus, MedicationSource, PatientContext


class MedicationReconciliationRequest(BaseModel):
    patient_context: PatientContext
    sources: List[MedicationSource] = Field(..., min_items=1)


class MedicationReconciliationResponse(BaseModel):
    reconciled_medication: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    reasoning: str
    recommended_actions: List[str] = Field(default_factory=list)
    clinical_safety_check: ClinicalSafetyStatus

