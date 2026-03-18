# Frontend (React + Vite + Tailwind)

Single-page dashboard for the clinical data reconciliation engine.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS

## Running the app

```bash
cd frontend
npm install
VITE_API_BASE_URL=http://localhost:8000/api npm run dev
```

Open `http://localhost:5173` in your browser.

## Screens

- **Medication Reconciliation**
  - Form for patient age, conditions, and multiple medication sources.
  - “Load sample case” button pre-fills the example from the assessment.
  - Results card shows reconciled regimen, confidence badge, safety indicator, reasoning, and recommended actions.

- **Data Quality**
  - Form for demographics, medications, allergies, conditions, vitals, and last-updated date.
  - “Load sample record” button pre-fills the provided example.
  - Results card shows overall score with color, per-dimension bars, and a list of issues with severity tags.

## Auth

Use the API key field in the top header to set the `X-API-Key` used for all requests. It is stored in `localStorage` under `ehr_api_key`.

