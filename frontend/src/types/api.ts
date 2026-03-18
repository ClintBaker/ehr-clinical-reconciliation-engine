export type SourceReliability = 'low' | 'medium' | 'high';
export type ClinicalSafetyStatus = 'PASSED' | 'FLAGGED';
export type IssueSeverity = 'low' | 'medium' | 'high';

export interface PatientContext {
  age: number;
  conditions: string[];
  recent_labs: Record<string, number>;
}

export interface MedicationSource {
  system: string;
  medication: string;
  last_updated?: string;
  last_filled?: string;
  source_reliability: SourceReliability;
}

export interface MedicationReconciliationRequest {
  patient_context: PatientContext;
  sources: MedicationSource[];
}

export interface MedicationReconciliationResponse {
  reconciled_medication: string;
  confidence_score: number;
  reasoning: string;
  recommended_actions: string[];
  clinical_safety_check: ClinicalSafetyStatus;
}

export interface DataQualityInput {
  demographics: Record<string, string>;
  medications: string[];
  allergies: string[];
  conditions: string[];
  vital_signs: Record<string, string>;
  last_updated: string;
}

export interface DataQualityBreakdown {
  completeness: number;
  accuracy: number;
  timeliness: number;
  clinical_plausibility: number;
}

export interface DataQualityIssue {
  field: string;
  issue: string;
  severity: IssueSeverity;
}

export interface DataQualityResponse {
  overall_score: number;
  breakdown: DataQualityBreakdown;
  issues_detected: DataQualityIssue[];
}

