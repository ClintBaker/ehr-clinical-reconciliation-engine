from datetime import date
from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class SourceReliability(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class ClinicalSafetyStatus(str, Enum):
    passed = "PASSED"
    flagged = "FLAGGED"


class IssueSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class PatientContext(BaseModel):
    age: int
    conditions: List[str] = Field(default_factory=list)
    recent_labs: Dict[str, float] = Field(default_factory=dict)


class MedicationSource(BaseModel):
    system: str
    medication: str
    last_updated: Optional[date] = None
    last_filled: Optional[date] = None
    source_reliability: SourceReliability = SourceReliability.medium


class DataQualityIssue(BaseModel):
    field: str
    issue: str
    severity: IssueSeverity

