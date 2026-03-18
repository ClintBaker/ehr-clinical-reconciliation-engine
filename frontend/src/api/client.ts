import type {
  DataQualityInput,
  DataQualityResponse,
  MedicationReconciliationRequest,
  MedicationReconciliationResponse,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getApiKey(): string | null {
  return localStorage.getItem('ehr_api_key');
}

async function request<T>(path: string, options: RequestInit & { body?: unknown }): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const apiKey = getApiKey();
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(text || response.statusText, response.status);
  }

  return (await response.json()) as T;
}

export const apiClient = {
  reconcileMedication(payload: MedicationReconciliationRequest) {
    return request<MedicationReconciliationResponse>('/reconcile/medication', {
      method: 'POST',
      body: payload,
    });
  },

  validateDataQuality(payload: DataQualityInput) {
    return request<DataQualityResponse>('/validate/data-quality', {
      method: 'POST',
      body: payload,
    });
  },
};

