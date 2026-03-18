# Backend (FastAPI)

FastAPI backend for the clinical data reconciliation engine.

## Stack

- FastAPI
- Pydantic & pydantic-settings
- OpenAI Python SDK
- Pytest

## Configuration

Environment variables:

- `API_KEY` – value required in the `X-API-Key` header for all `/api/*` routes.
- `OPENAI_API_KEY` – secret key for OpenAI.
- `OPENAI_MODEL` – chat model name (default: `gpt-4.1-mini`).
- `CACHE_TTL_SECONDS` – optional TTL for LLM response cache (default: 600).

## Key modules

- `main.py` – FastAPI app, CORS, routing, `/health`.
- `config.py` – settings via `pydantic-settings`.
- `auth.py` – `X-API-Key` header check.
- `models/` – Pydantic request/response schemas.
- `routes/` – API route handlers for reconciliation and data quality.
- `services/cache.py` – simple in-memory cache.
- `services/llm_client.py` – OpenAI client wrapper (JSON responses).
- `services/reconciliation_service.py` – medication reconciliation logic and prompt.
- `services/data_quality_service.py` – data quality scoring logic and prompt.

## API contracts

### POST `/api/reconcile/medication`

Request body (simplified):

- `patient_context`: `{ age: number, conditions: string[], recent_labs: Record<string, number> }`
- `sources`: array of:
  - `system`: string
  - `medication`: string
  - `last_updated` / `last_filled`: ISO date (optional)
  - `source_reliability`: `"low" | "medium" | "high"`

Response:

- `reconciled_medication`: string
- `confidence_score`: number 0–1
- `reasoning`: string
- `recommended_actions`: string[]
- `clinical_safety_check`: `"PASSED" | "FLAGGED"`

### POST `/api/validate/data-quality`

Request body:

- `demographics`: record (name, dob, gender, etc.)
- `medications`: string[]
- `allergies`: string[]
- `conditions`: string[]
- `vital_signs`: record (e.g. `blood_pressure`, `heart_rate`)
- `last_updated`: ISO date string

Response:

- `overall_score`: 0–100
- `breakdown`: `{ completeness, accuracy, timeliness, clinical_plausibility }`
- `issues_detected`: `{ field, issue, severity }[]`

## Running tests

From this directory:

```bash
pytest
```

