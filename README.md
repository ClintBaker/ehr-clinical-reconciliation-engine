# Clinical Data Reconciliation Engine (Mini)

A mini clinical data reconciliation engine that uses LLMs to reconcile conflicting medication records and assess EHR data quality, with a FastAPI backend and a React/Tailwind dashboard.

## Tech stack

- **Backend**: FastAPI, Pydantic, pydantic-settings, pytest
- **Frontend**: React, Vite, Tailwind CSS
- **AI**: OpenAI Chat Completions API for clinical reasoning and data quality assessment
- **Storage**: In-memory cache (no persistent DB)

## Running the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# required
export API_KEY=your-api-key
export OPENAI_API_KEY=your-openai-key

# optional (default: gpt-4.1-mini or similar)
export OPENAI_MODEL=gpt-4.1-mini

uvicorn backend.main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`.

## Running the frontend

```bash
cd frontend
npm install

# or set this in frontend/.env.local as VITE_API_BASE_URL
VITE_API_BASE_URL=http://localhost:8000/api npm run dev
```

Open `http://localhost:5173` in your browser.

In the header, use the API key field to set the same `X-API-Key` value you configured for the backend (`API_KEY`). This key is stored in `localStorage` and attached to all API calls.

## Backend endpoints

- `POST /api/reconcile/medication`
  - **Input**: patient context + array of medication sources (system, medication, dates, source reliability).
  - **Output**: reconciled medication, confidence score, reasoning, recommended actions, and clinical safety check.
- `POST /api/validate/data-quality`
  - **Input**: patient record (demographics, medications, allergies, conditions, vital signs, last_updated).
  - **Output**: overall data quality score, per-dimension breakdown, and a list of detected issues with severities.

## Running tests

From `backend/`:

```bash
pytest
```

Tests cover:

- Auth dependency (`X-API-Key`).
- In-memory cache behavior.
- Reconciliation/data-quality services with mocked LLM responses.
- Basic endpoint schema validation via FastAPI `TestClient`.

## Key design decisions and trade-offs

- **Architecture**: Simple monorepo with `backend` and `frontend` folders. The backend exposes a small REST API with strict Pydantic schemas; the frontend is a single-page dashboard with two tabs (Medication Reconciliation and Data Quality).
- **AI integration**: A small `LLMClient` wrapper calls OpenAI chat completions with JSON-mode responses. Prompt builders in the services describe the task, include clinical context, and request structured JSON matching the response models.
- **Caching**: A lightweight in-memory `SimpleCache` (dictionary + optional TTL) wraps LLM calls to avoid recomputing identical results and reduce API costs. This keeps the implementation simple while still being cost-aware.
- **Auth**: All `/api/*` routes require a simple `X-API-Key` header that must match `API_KEY` from the environment. The `/health` endpoint is public for lightweight monitoring.
- **Product UX**: The dashboard emphasizes clarity over complexity: prefilled sample cases, color-coded confidence/quality indicators, and human-readable reasoning and issues. The UI is intentionally minimal but clinician-friendly.

## What I would improve with more time

- **Deeper clinical logic**: Add more explicit, non-LLM heuristics for dose adjustments, drug–disease interactions, and source reliability weighting to complement the LLM.
- **Confidence calibration**: Calibrate confidence scores based on agreement between sources, recency, and source reliability, instead of relying purely on the LLM’s raw confidence.
- **Persistence and audit trail**: Introduce a lightweight database to store reconciled decisions, user approvals/rejections, and timestamps for later review.
- **More robust error reporting**: Add structured error responses with error codes and better surfacing of LLM / network issues in the frontend.
- **UI polish and accessibility**: Improve keyboard navigation, add focus states, and enhance contrast for accessibility; potentially layer in a component library if this grew into a larger product.

## Estimated time spent

Approximately **6–8 hours** end-to-end, including reading the spec, designing the architecture, implementing the backend and frontend, integrating the OpenAI API with caching, writing tests, and local testing. 
