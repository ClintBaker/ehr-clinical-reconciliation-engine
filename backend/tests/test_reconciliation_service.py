from unittest.mock import patch

from backend.models.common import ClinicalSafetyStatus, MedicationSource, PatientContext, SourceReliability
from backend.models.reconciliation import MedicationReconciliationRequest
from backend.services.reconciliation_service import reconcile_medication


async def _call_with_mocked_llm() -> None:
    patient_context = PatientContext(age=67, conditions=["Type 2 Diabetes"], recent_labs={"eGFR": 45})
    sources = [
        MedicationSource(
            system="Hospital EHR",
            medication="Metformin 1000mg twice daily",
            source_reliability=SourceReliability.high,
        ),
        MedicationSource(
            system="Primary Care",
            medication="Metformin 500mg twice daily",
            source_reliability=SourceReliability.high,
        ),
    ]
    request = MedicationReconciliationRequest(patient_context=patient_context, sources=sources)

    mock_response = {
        "reconciled_medication": "Metformin 500mg twice daily",
        "confidence_score": 0.88,
        "reasoning": "Primary care record is most recent and safer for kidney function.",
        "recommended_actions": ["Update Hospital EHR dose"],
        "clinical_safety_check": ClinicalSafetyStatus.passed,
    }

    with patch("backend.services.reconciliation_service.llm_client") as mock_client:
        mock_client.generate_json.return_value = mock_response
        result = await reconcile_medication(request)

    assert result.reconciled_medication == "Metformin 500mg twice daily"
    assert 0 <= result.confidence_score <= 1


def test_dummy_wrapper_for_async(monkeypatch) -> None:
    import asyncio

    asyncio.run(_call_with_mocked_llm())

