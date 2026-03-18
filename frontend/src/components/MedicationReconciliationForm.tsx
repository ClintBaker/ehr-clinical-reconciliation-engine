import React, { useState } from 'react';
import { apiClient } from '../api/client';
import type {
  MedicationReconciliationRequest,
  MedicationReconciliationResponse,
  MedicationSource,
} from '../types/api';

const sampleRequest: MedicationReconciliationRequest = {
  patient_context: {
    age: 67,
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    recent_labs: { eGFR: 45 },
  },
  sources: [
    {
      system: 'Hospital EHR',
      medication: 'Metformin 1000mg twice daily',
      last_updated: '2024-10-15',
      source_reliability: 'high',
    },
    {
      system: 'Primary Care',
      medication: 'Metformin 500mg twice daily',
      last_updated: '2025-01-20',
      source_reliability: 'high',
    },
    {
      system: 'Pharmacy',
      medication: 'Metformin 1000mg daily',
      last_filled: '2025-01-25',
      source_reliability: 'medium',
    },
  ],
};

export const MedicationReconciliationForm: React.FC = () => {
  const [payload, setPayload] = useState<MedicationReconciliationRequest>(sampleRequest);
  const [result, setResult] = useState<MedicationReconciliationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSourceChange = (index: number, updates: Partial<MedicationSource>) => {
    setPayload((prev) => {
      const nextSources = [...prev.sources];
      nextSources[index] = { ...nextSources[index], ...updates };
      return { ...prev, sources: nextSources };
    });
  };

  const addSource = () => {
    setPayload((prev) => ({
      ...prev,
      sources: [
        ...prev.sources,
        {
          system: '',
          medication: '',
          last_updated: '',
          last_filled: '',
          source_reliability: 'medium',
        },
      ],
    }));
  };

  const removeSource = (index: number) => {
    setPayload((prev) => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.reconcileMedication(payload);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResult(null);
    } finally {
      setLoading(false);
    };
  };

  const loadSample = () => {
    setPayload(sampleRequest);
    setResult(null);
    setError(null);
  };

  const confidenceColor =
    result && result.confidence_score >= 0.8
      ? 'bg-green-100 text-green-800'
      : result && result.confidence_score >= 0.5
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Medication Reconciliation</h2>
          <p className="text-sm text-slate-600">
            Enter patient context and conflicting medication records to generate a reconciled
            recommendation.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSample}
          className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
        >
          Load sample case
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        <section className="space-y-4 rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-800">Patient context</h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="mb-1 block text-slate-700">Age</label>
              <input
                type="number"
                className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                value={payload.patient_context.age}
                onChange={(e) =>
                  setPayload((prev) => ({
                    ...prev,
                    patient_context: { ...prev.patient_context, age: Number(e.target.value) },
                  }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-slate-700">Conditions (comma-separated)</label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                value={payload.patient_context.conditions.join(', ')}
                onChange={(e) =>
                  setPayload((prev) => ({
                    ...prev,
                    patient_context: {
                      ...prev.patient_context,
                      conditions: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    },
                  }))
                }
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-800">Medication sources</h3>
          <div className="space-y-3 text-sm">
            {payload.sources.map((source, index) => (
              <div key={index} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Source {index + 1}
                  </span>
                  {payload.sources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSource(index)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    placeholder="System (e.g., Hospital EHR)"
                    className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                    value={source.system}
                    onChange={(e) => handleSourceChange(index, { system: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Medication description"
                    className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                    value={source.medication}
                    onChange={(e) => handleSourceChange(index, { medication: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                      value={source.last_updated ?? ''}
                      onChange={(e) => handleSourceChange(index, { last_updated: e.target.value })}
                    />
                    <input
                      type="date"
                      className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                      value={source.last_filled ?? ''}
                      onChange={(e) => handleSourceChange(index, { last_filled: e.target.value })}
                    />
                  </div>
                  <select
                    className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                    value={source.source_reliability}
                    onChange={(e) =>
                      handleSourceChange(index, {
                        source_reliability: e.target.value as MedicationSource['source_reliability'],
                      })
                    }
                  >
                    <option value="high">High reliability</option>
                    <option value="medium">Medium reliability</option>
                    <option value="low">Low reliability</option>
                  </select>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addSource}
              className="mt-1 text-xs font-medium text-blue-700 hover:underline"
            >
              + Add another source
            </button>
          </div>
        </section>

        <div className="md:col-span-2 flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? 'Reconciling…' : 'Reconcile medication'}
          </button>
          {error && <p className="text-sm text-red-600">Error: {error}</p>}
        </div>
      </form>

      {result && (
        <section className="space-y-3 rounded-lg border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Reconciled regimen</h3>
              <p className="mt-1 text-base font-medium text-slate-900">
                {result.reconciled_medication}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${confidenceColor}`}>
                Confidence: {(result.confidence_score * 100).toFixed(0)}%
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  result.clinical_safety_check === 'PASSED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                Safety: {result.clinical_safety_check}
              </span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Reasoning
            </h4>
            <p className="mt-1 text-sm text-slate-700 whitespace-pre-line">{result.reasoning}</p>
          </div>
          {result.recommended_actions.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Recommended actions
              </h4>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {result.recommended_actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
};


