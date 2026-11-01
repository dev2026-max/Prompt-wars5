import React, { useState } from 'react';
import { Key, ExternalLink, Check, X, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApiKeyModal({ isOpen, onClose, currentKey, onSaveKey }) {
  const [keyInput, setKeyInput] = useState(currentKey || '');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveKey(keyInput.trim());
    toast.success("Gemini API Key saved successfully!");
    onClose();
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveKey('');
    toast.success("API key removed. Running in fallback mode.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-purple-500/30 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">Google Gemini API Key</h3>
            <p className="text-xs text-gray-400">Enable live AI responses from Google AI Studio</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              API Key (starts with AIzaSy...)
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Paste your Gemini API Key here"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-300 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Free & Secure</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-normal">
              Your key is saved locally in your browser and used only to contact Google's official Gemini endpoint. No keys are exposed publicly.
            </p>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline font-semibold"
            >
              <span>Get a free Gemini API Key at Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex justify-between items-center pt-2">
            {currentKey && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:underline"
              >
                Clear Key
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl glass-card text-xs text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl gradient-btn text-white text-xs font-bold"
              >
                Save Key
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
