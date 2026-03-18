import React, { useState } from 'react';
import { MedicationReconciliationForm } from './components/MedicationReconciliationForm';
import { DataQualityForm } from './components/DataQualityForm';
import { ApiKeyInput } from './components/ApiKeyInput';

const tabs = ['medication', 'dataQuality'] as const;
type Tab = (typeof tabs)[number];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('medication');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-slate-900">
              Clinical Data Reconciliation Engine
            </h1>
            <ApiKeyInput />
          </div>
          <nav className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('medication')}
              className={`rounded-full px-3 py-1 text-sm ${
                activeTab === 'medication'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              Medication Reconciliation
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dataQuality')}
              className={`rounded-full px-3 py-1 text-sm ${
                activeTab === 'dataQuality'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              Data Quality
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {activeTab === 'medication' ? <MedicationReconciliationForm /> : <DataQualityForm />}
      </main>
    </div>
  );
};

export default App;

