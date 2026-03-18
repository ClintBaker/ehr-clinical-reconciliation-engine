from unittest.mock import patch

from backend.models.data_quality import DataQualityInput
from backend.services.data_quality_service import assess_data_quality


async def _call_with_mocked_llm() -> None:
    record = DataQualityInput(
        demographics={"name": "John Doe", "dob": "1955-03-15", "gender": "M"},
        medications=["Metformin 500mg"],
        allergies=[],
        conditions=["Type 2 Diabetes"],
        vital_signs={"blood_pressure": "340/180", "heart_rate": "72"},
        last_updated="2024-06-15",
    )

    mock_response = {
        "overall_score": 62,
        "breakdown": {
            "completeness": 60,
            "accuracy": 50,
            "timeliness": 70,
            "clinical_plausibility": 40,
        },
        "issues_detected": [
            {
                "field": "allergies",
                "issue": "No allergies documented - likely incomplete",
                "severity": "medium",
            }
        ],
    }

    with patch("backend.services.data_quality_service.llm_client") as mock_client:
        mock_client.generate_json.return_value = mock_response
        result = await assess_data_quality(record)

    assert result.overall_score == 62
    assert result.breakdown.clinical_plausibility == 40
    assert result.issues_detected


def test_dummy_wrapper_for_async() -> None:
    import asyncio

    asyncio.run(_call_with_mocked_llm())

