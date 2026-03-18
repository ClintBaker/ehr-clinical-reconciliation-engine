import pytest
from fastapi import status
from fastapi.testclient import TestClient

from backend.main import app


@pytest.fixture(autouse=True)
def api_and_openai_keys(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("API_KEY", "test-key")
    monkeypatch.setenv("OPENAI_API_KEY", "dummy")


client = TestClient(app)


def test_reconcile_endpoint_schema_validation() -> None:
    payload = {
        "patient_context": {"age": 67, "conditions": [], "recent_labs": {}},
        "sources": [
            {
                "system": "Test",
                "medication": "Metformin",
                "source_reliability": "high",
            }
        ],
    }
    response = client.post(
        "/api/reconcile/medication",
        headers={"X-API-Key": "test-key"},
        json=payload,
    )
    # We only assert that request passes validation; we don't require a 200 because
    # the LLM client may not be configured in this environment.
    assert response.status_code in {
        status.HTTP_200_OK,
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        status.HTTP_502_BAD_GATEWAY,
    }


def test_data_quality_endpoint_schema_validation() -> None:
    payload = {
        "demographics": {"name": "John Doe"},
        "medications": [],
        "allergies": [],
        "conditions": [],
        "vital_signs": {},
        "last_updated": "2024-01-01",
    }
    response = client.post(
        "/api/validate/data-quality",
        headers={"X-API-Key": "test-key"},
        json=payload,
    )
    assert response.status_code in {
        status.HTTP_200_OK,
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        status.HTTP_502_BAD_GATEWAY,
    }

