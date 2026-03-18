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
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-5">
            <h1 className="text-base font-semibold text-slate-900">
              Clinical Data Reconciliation
            </h1>
            <ApiKeyInput />
          </div>
          <nav className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('medication')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition ${
                activeTab === 'medication'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Medication
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dataQuality')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition ${
                activeTab === 'dataQuality'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Data Quality
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {activeTab === 'medication' ? <MedicationReconciliationForm /> : <DataQualityForm />}
      </main>
    </div>
  );
};

export default App;

