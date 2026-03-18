from __future__ import annotations

import hashlib
import json
from datetime import date
from typing import Dict

from backend.config import settings
from backend.models.reconciliation import (
    MedicationReconciliationRequest,
    MedicationReconciliationResponse,
)
from backend.services.cache import cache
from backend.services.llm_client import llm_client


def _serialize_request(request: MedicationReconciliationRequest) -> str:
    return request.model_dump_json()


def _cache_key(request: MedicationReconciliationRequest) -> str:
    payload = _serialize_request(request)
    digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    return f"reconcile:{digest}"


def _build_reconciliation_prompt(request: MedicationReconciliationRequest) -> Dict[str, str]:
    system_prompt = (
        "You are a clinical decision support assistant helping reconcile conflicting "
        "medication records across healthcare systems. You must be conservative and "
        "safety-focused. You must always respond with a single JSON object only."
    )

    user_payload: Dict[str, object] = request.model_dump(mode="json")
    user_instructions = {
        "task": "Determine the most likely true current outpatient medication regimen for the patient.",
        "requirements": [
            "Consider recency of each source (last_updated / last_filled).",
            "Weigh source_reliability (high > medium > low).",
            "Consider patient_context (age, conditions, recent_labs) for safety (e.g., kidney function for metformin).",
            "Return a single JSON object with keys: reconciled_medication (string), confidence_score (0-1 float), "
            "reasoning (string), recommended_actions (array of strings), clinical_safety_check ('PASSED' or 'FLAGGED').",
        ],
        "input": user_payload,
    }

    user_content = json.dumps(user_instructions)
    return {"system_prompt": system_prompt, "user_content": user_content}


async def reconcile_medication(
    request: MedicationReconciliationRequest,
) -> MedicationReconciliationResponse:
    key = _cache_key(request)
    cached = cache.get(key)
    if cached:
        return MedicationReconciliationResponse.model_validate(cached)

    prompts = _build_reconciliation_prompt(request)
    llm_json = llm_client.generate_json(
        system_prompt=prompts["system_prompt"],
        user_content=prompts["user_content"],
    )

    response = MedicationReconciliationResponse.model_validate(llm_json)
    cache.set(key, response.model_dump(), ttl_seconds=settings.cache_ttl_seconds)
    return response

