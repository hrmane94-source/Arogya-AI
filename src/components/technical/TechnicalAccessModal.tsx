import React, { useState } from 'react';
import { ShieldCheck, Key, AlertCircle, X, Terminal, CheckCircle2 } from 'lucide-react';

interface TechnicalAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccessGranted: () => void;
}

export const TechnicalAccessModal: React.FC<TechnicalAccessModalProps> = ({
  isOpen,
  onClose,
  onAccessGranted
}) => {
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/technical-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: secretKey.trim() })
      });

      const data = await res.json();
      if (res.ok && data.verified) {
        sessionStorage.setItem('arogya_technical_auth', 'true');
        onAccessGranted();
        onClose();
      } else {
        setError(data.error || 'Invalid technical authorization key.');
      }
    } catch (err) {
      console.error('Technical verification error:', err);
      // Fallback for demo security check
      if (secretKey.trim() === 'arogya-tech-2026') {
        sessionStorage.setItem('arogya_technical_auth', 'true');
        onAccessGranted();
        onClose();
      } else {
        setError('Network error validating technical access.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-md">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 font-mono">
              TECHNICAL CONSOLE ACCESS
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Restricted engineering and system telemetry console
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 font-mono mb-1.5">
              Technical Authorization Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter technical key (e.g. arogya-tech-2026)"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-1.5">
              Default demo key: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-bold">arogya-tech-2026</code>
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2 font-mono text-xs">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !secretKey.trim()}
              className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-emerald-400 font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              {isLoading ? 'Verifying...' : 'Authenticate ➔'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
