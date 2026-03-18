from __future__ import annotations

import json
import logging
from typing import Any, Dict, List

from openai import OpenAI

from backend.config import settings

logger = logging.getLogger(__name__)


class LLMClient:
    def __init__(self) -> None:
        self._client = OpenAI(api_key=settings.openai_api_key)
        self._model = settings.openai_model

    def _build_messages(self, system_prompt: str, user_content: str) -> List[Dict[str, str]]:
        return [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ]

    def generate_json(self, system_prompt: str, user_content: str) -> Dict[str, Any]:
        messages = self._build_messages(system_prompt, user_content)
        try:
            response = self._client.chat.completions.create(
                model=self._model,
                messages=messages,
                temperature=0.1,
                response_format={"type": "json_object"},
            )
        except Exception as exc:  # noqa: BLE001
            logger.exception("LLM call failed")
            raise RuntimeError("LLM call failed") from exc

        content = response.choices[0].message.content
        try:
            return json.loads(content or "{}")
        except json.JSONDecodeError as exc:
            logger.exception("Failed to parse LLM JSON response: %s", content)
            raise RuntimeError("Invalid JSON from LLM") from exc


llm_client = LLMClient()

