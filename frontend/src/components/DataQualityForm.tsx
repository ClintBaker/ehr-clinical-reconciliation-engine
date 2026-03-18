import React, { useState } from 'react';
import { apiClient } from '../api/client';
import type { DataQualityInput, DataQualityResponse } from '../types/api';

const sampleRecord: DataQualityInput = {
  demographics: { name: 'John Doe', dob: '1955-03-15', gender: 'M' },
  medications: ['Metformin 500mg', 'Lisinopril 10mg'],
  allergies: [],
  conditions: ['Type 2 Diabetes'],
  vital_signs: { blood_pressure: '340/180', heart_rate: '72' },
  last_updated: '2024-06-15',
};

export const DataQualityForm: React.FC = () => {
  const [record, setRecord] = useState<DataQualityInput>(sampleRecord);
  const [result, setResult] = useState<DataQualityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.validateDataQuality(record);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setRecord(sampleRecord);
    setResult(null);
    setError(null);
  };

  const overallColor =
    result && result.overall_score >= 80
      ? 'text-emerald-600'
      : result && result.overall_score >= 60
      ? 'text-amber-600'
      : 'text-red-600';

  const barColor = (score: number) =>
    score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Data Quality Assessment</h2>
          <p className="text-sm text-slate-600">
            Provide a patient record to assess data quality, completeness, and clinical
            plausibility.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSample}
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Load sample record
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Demographics & clinical</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Name"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={record.demographics.name ?? ''}
              onChange={(e) =>
                setRecord((prev) => ({
                  ...prev,
                  demographics: { ...prev.demographics, name: e.target.value },
                }))
              }
            />
            <input
              type="date"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={record.demographics.dob ?? ''}
              onChange={(e) =>
                setRecord((prev) => ({
                  ...prev,
                  demographics: { ...prev.demographics, dob: e.target.value },
                }))
              }
            />
            <input
              type="text"
              placeholder="Gender"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={record.demographics.gender ?? ''}
              onChange={(e) =>
                setRecord((prev) => ({
                  ...prev,
                  demographics: { ...prev.demographics, gender: e.target.value },
                }))
              }
            />
            <div>
              <label className="mb-1 block text-slate-700">
                Conditions (comma-separated)
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={record.conditions.join(', ')}
                onChange={(e) =>
                  setRecord((prev) => ({
                    ...prev,
                    conditions: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Medications, allergies & vitals</h3>
          <div className="space-y-2">
            <div>
              <label className="mb-1 block text-slate-700">
                Medications (comma-separated)
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={record.medications.join(', ')}
                onChange={(e) =>
                  setRecord((prev) => ({
                    ...prev,
                    medications: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-slate-700">
                Allergies (comma-separated)
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={record.allergies.join(', ')}
                onChange={(e) =>
                  setRecord((prev) => ({
                    ...prev,
                    allergies: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Blood pressure (e.g., 120/80)"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={record.vital_signs.blood_pressure ?? ''}
                onChange={(e) =>
                  setRecord((prev) => ({
                    ...prev,
                    vital_signs: {
                      ...prev.vital_signs,
                      blood_pressure: e.target.value,
                    },
                  }))
                }
              />
              <input
                type="text"
                placeholder="Heart rate"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={record.vital_signs.heart_rate ?? ''}
                onChange={(e) =>
                  setRecord((prev) => ({
                    ...prev,
                    vital_signs: {
                      ...prev.vital_signs,
                      heart_rate: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-slate-700">Last updated</label>
              <input
                type="date"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={record.last_updated}
                onChange={(e) =>
                  setRecord((prev) => ({
                    ...prev,
                    last_updated: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </section>

        <div className="md:col-span-2 flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {loading ? 'Evaluating…' : 'Evaluate data quality'}
          </button>
          {error && <p className="text-sm text-red-600">Error: {error}</p>}
        </div>
      </form>

      {result && (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Overall score</h3>
              <p className={`mt-1 text-3xl font-semibold ${overallColor}`}>
                {result.overall_score}
                <span className="ml-1 text-base text-slate-500">/ 100</span>
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-2 md:max-w-md">
              {(
                Object.entries(result.breakdown) as Array<
                  [keyof DataQualityResponse['breakdown'], number]
                >
              ).map(([dim, score]) => (
                <div key={dim}>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="capitalize">{dim.replace('_', ' ')}</span>
                    <span>{score}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className={`h-1.5 rounded-full ${barColor(score)}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result.issues_detected.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Issues detected
              </h4>
              <ul className="mt-2 space-y-2 text-sm">
                {result.issues_detected.map((issue, idx) => (
                  <li
                    key={`${issue.field}-${idx}`}
                    className="rounded-md border border-slate-200 bg-slate-50 p-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-800">
                        {issue.field}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          issue.severity === 'high'
                            ? 'bg-red-50 text-red-700'
                            : issue.severity === 'medium'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {issue.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-700">{issue.issue}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
};


