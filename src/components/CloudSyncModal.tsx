import React, { useState } from 'react';
import { Cloud, X, Copy, Check, Download, Upload, Smartphone, Laptop, CheckCircle2 } from 'lucide-react';
import { LessonPlan } from '../types';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: LessonPlan;
  onPlanLoaded: (plan: LessonPlan) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  plan,
  onPlanLoaded
}) => {
  const [syncCode, setSyncCode] = useState(() => plan.syncId || 'JP-' + Math.floor(1000 + Math.random() * 9000));
  const [inputCode, setInputCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const response = await fetch('/api/sync/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syncCode,
          plan: { ...plan, syncId: syncCode }
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to sync to cloud.');
      }
      setStatusMessage({ type: 'success', text: `Plan successfully synced to cloud with code: ${syncCode}` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Cloud sync failed.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadFromCloud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setIsLoading(true);
    setStatusMessage(null);
    try {
      const code = inputCode.trim().toUpperCase();
      const response = await fetch(`/api/sync/load/${code}`);
      const data = await response.json();

      if (!response.ok || !data.success || !data.data?.plan) {
        throw new Error(data.error || 'Sync code not found or expired.');
      }

      onPlanLoaded(data.data.plan);
      setStatusMessage({ type: 'success', text: `Successfully loaded plan "${data.data.plan.title}" from cloud!` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to fetch plan from cloud.' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${plan.title.replace(/[^a-zA-Z0-9_\-]/g, '_')}_Backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.title && parsed.phases) {
            onPlanLoaded(parsed);
            setStatusMessage({ type: 'success', text: 'Lesson plan imported successfully from file!' });
          } else {
            throw new Error('Invalid JSON lesson plan file.');
          }
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: 'Failed to import JSON file. ' + err.message });
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto print:hidden">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-lg">
              <Cloud className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Multi-Device Cloud Sync</h2>
              <p className="text-xs text-slate-400">Access your Japanese lesson plans across desktop, iPad & phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close cloud sync modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          {statusMessage && (
            <div className={`p-3.5 rounded-xl border flex items-center gap-2 ${
              statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : '⚠️'}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Device Transfer Diagram */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-around text-center">
            <div className="flex flex-col items-center">
              <Laptop className="w-6 h-6 text-slate-700" />
              <span className="text-[10px] font-medium text-slate-500 mt-1">Laptop</span>
            </div>
            <div className="text-sky-500 font-bold text-xs animate-pulse">⇄ Sync Code ⇄</div>
            <div className="flex flex-col items-center">
              <Smartphone className="w-6 h-6 text-slate-700" />
              <span className="text-[10px] font-medium text-slate-500 mt-1">Tablet / Mobile</span>
            </div>
          </div>

          {/* Section 1: Save Current Plan to Cloud */}
          <div className="p-4 bg-sky-50/60 border border-sky-200 rounded-xl space-y-3">
            <div className="font-bold text-sky-950 text-sm">1. Save Current Plan to Cloud</div>
            <p className="text-sky-900 text-xs">
              Generates a unique sync code for <strong>"{plan.title}"</strong>:
            </p>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white border border-sky-300 rounded-xl px-3 py-2 font-mono font-bold text-sky-950 text-base text-center">
                {syncCode}
              </div>
              <button
                onClick={copyCode}
                className="px-3 py-2 bg-white hover:bg-sky-100 text-sky-800 border border-sky-300 rounded-xl transition flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-sky-600" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2"
            >
              <Cloud className="w-4 h-4 text-sky-100" />
              <span>{isSaving ? 'Syncing...' : 'Sync Current Plan to Cloud'}</span>
            </button>
          </div>

          {/* Section 2: Load Plan from Cloud */}
          <form onSubmit={handleLoadFromCloud} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="font-bold text-slate-900 text-sm">2. Fetch Plan from Another Device</div>
            <p className="text-slate-600 text-xs">Enter 6-digit device sync code to download lesson plan:</p>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="e.g. JP-8492"
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-sm uppercase text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition text-xs"
              >
                {isLoading ? 'Loading...' : 'Fetch Plan'}
              </button>
            </div>
          </form>

          {/* Section 3: File Backup / Restore */}
          <div className="pt-2 flex justify-between gap-3 border-t border-slate-200">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 font-medium transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export JSON File</span>
            </button>

            <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 font-medium transition flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Import JSON File</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>

        </div>

      </div>
    </div>
  );
};
