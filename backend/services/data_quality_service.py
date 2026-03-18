from __future__ import annotations

import hashlib
import json
from typing import Dict

from backend.config import settings
from backend.models.data_quality import (
    DataQualityInput,
    DataQualityResponse,
)
from backend.services.cache import cache
from backend.services.llm_client import llm_client


def _serialize_input(record: DataQualityInput) -> str:
    return record.model_dump_json()


def _cache_key(record: DataQualityInput) -> str:
    payload = _serialize_input(record)
    digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    return f"data_quality:{digest}"


def _build_data_quality_prompt(record: DataQualityInput) -> Dict[str, str]:
    system_prompt = (
        "You are a clinical data quality auditor reviewing EHR records. "
        "Identify missing or implausible data and score data quality. "
        "You must always respond with a single JSON object only."
    )
    user_instructions = {
        "task": "Assess the data quality of the following patient record.",
        "requirements": [
            "Return overall_score (0-100).",
            "Return breakdown object with completeness, accuracy, timeliness, clinical_plausibility (each 0-100 integer).",
            "Return issues_detected as an array of objects with field, issue, severity ('low'|'medium'|'high').",
            "Flag physiologically impossible vital signs and obviously stale data.",
            "The response must be a single JSON object only, with no additional commentary.",
        ],
        "input": record.model_dump(mode="json"),
    }
    user_content = json.dumps(user_instructions)
    return {"system_prompt": system_prompt, "user_content": user_content}


async def assess_data_quality(record: DataQualityInput) -> DataQualityResponse:
    key = _cache_key(record)
    cached = cache.get(key)
    if cached:
        return DataQualityResponse.model_validate(cached)

    prompts = _build_data_quality_prompt(record)
    llm_json = llm_client.generate_json(
        system_prompt=prompts["system_prompt"],
        user_content=prompts["user_content"],
    )
    response = DataQualityResponse.model_validate(llm_json)
    cache.set(key, response.model_dump(), ttl_seconds=settings.cache_ttl_seconds)
    return response

