import React, { useEffect, useState } from 'react';

export const ApiKeyInput: React.FC = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const existing = localStorage.getItem('ehr_api_key') ?? '';
    setValue(existing);
  }, []);

  const handleBlur = () => {
    localStorage.setItem('ehr_api_key', value.trim());
  };

  return (
    <div className="flex items-center gap-2 text-xs text-slate-600">
      <label htmlFor="api-key" className="text-slate-600">
        API key
      </label>
      <input
        id="api-key"
        type="password"
        className="w-40 rounded-md border border-slate-300 px-2 py-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="X-API-Key"
      />
    </div>
  );
};

