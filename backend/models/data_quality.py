from typing import Dict, List

from pydantic import BaseModel, Field

from .common import DataQualityIssue


class DataQualityInput(BaseModel):
    demographics: Dict[str, str]
    medications: List[str] = Field(default_factory=list)
    allergies: List[str] = Field(default_factory=list)
    conditions: List[str] = Field(default_factory=list)
    vital_signs: Dict[str, str] = Field(default_factory=dict)
    last_updated: str


class DataQualityBreakdown(BaseModel):
    completeness: int = Field(ge=0, le=100)
    accuracy: int = Field(ge=0, le=100)
    timeliness: int = Field(ge=0, le=100)
    clinical_plausibility: int = Field(ge=0, le=100)


class DataQualityResponse(BaseModel):
    overall_score: int = Field(ge=0, le=100)
    breakdown: DataQualityBreakdown
    issues_detected: List[DataQualityIssue] = Field(default_factory=list)

