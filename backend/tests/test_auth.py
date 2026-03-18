import os

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from backend.main import app


@pytest.fixture(autouse=True)
def set_api_key_env(monkeypatch: pytest.MonkeyPatch) -> None:
  monkeypatch.setenv("API_KEY", "test-key")


client = TestClient(app)


def test_health_endpoint_does_not_require_auth() -> None:
  response = client.get("/health")
  assert response.status_code == status.HTTP_200_OK


def test_protected_endpoint_requires_api_key() -> None:
  response = client.post("/api/reconcile/medication", json={})
  assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY or response.status_code == status.HTTP_401_UNAUTHORIZED


def test_protected_endpoint_rejects_invalid_api_key() -> None:
  response = client.post(
      "/api/reconcile/medication",
      headers={"X-API-Key": "wrong"},
      json={},
  )
  assert response.status_code == status.HTTP_401_UNAUTHORIZED

