# Clinical Data Reconciliation Engine (Mini)

Full-stack take-home implementing a mini clinical data reconciliation engine with:

- **Backend**: FastAPI, Pydantic, pytest
- **Frontend**: React, Vite, Tailwind
- **AI**: OpenAI API for clinical reasoning and data quality assessment

## Running the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

export API_KEY=your-api-key
export OPENAI_API_KEY=your-openai-key
export OPENAI_MODEL=gpt-4.1-mini  # or another compatible model

uvicorn backend.main:app --reload --port 8000
```

## Running the frontend

```bash
cd frontend
npm install
VITE_API_BASE_URL=http://localhost:8000/api npm run dev
```

Open `http://localhost:5173` in your browser.

Use the header API key field in the top bar to set the same `X-API-Key` you configured for the backend.

## Backend endpoints

- `POST /api/reconcile/medication`
  - Input: patient context + array of medication sources (see assessment example).
  - Output: reconciled medication, confidence score, reasoning, recommended actions, and clinical safety check.
- `POST /api/validate/data-quality`
  - Input: patient record (demographics, medications, allergies, conditions, vital signs, last_updated).
  - Output: overall data quality score, per-dimension breakdown, and a list of detected issues.

## Tests

From `backend/`:

```bash
pytest
```

## Design notes

- **Architecture**: Simple monorepo with `backend` and `frontend` folders. The backend exposes a minimal REST API with strict Pydantic schemas; the frontend is a single-page dashboard with two tabs (Medication Reconciliation and Data Quality).
- **AI integration**: A small `LLMClient` wrapper calls OpenAI chat completions with JSON-mode responses. Prompt builders in the services describe the task and request structured JSON matching our response models.
- **Caching**: A lightweight in-memory `SimpleCache` (dictionary + optional TTL) wraps LLM calls to avoid recomputing identical results and reduce API costs.
- **Auth**: All `/api/*` routes require a simple `X-API-Key` header that must match `API_KEY` from the environment. The health endpoint is public.
- **Product UX**: The dashboard emphasizes clarity: prefilled sample cases, color-coded confidence/quality indicators, and human-readable reasoning and issues.

