import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Share2, Mail, Smartphone, Camera, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InvitationSection({ invitationData }) {
  const [activeTab, setActiveTab] = useState('casual');

  if (!invitationData) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center border border-purple-500/20">
        <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-60" />
        <h3 className="text-lg font-bold text-white">No Invitations Generated Yet</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
          Generate an event plan to craft customized formal invites, WhatsApp messages, and social media captions.
        </p>
      </div>
    );
  }

  // Normalize data if it was stringified JSON or plain string
  let invites = invitationData;
  if (typeof invitationData === 'string') {
    try {
      invites = JSON.parse(invitationData);
    } catch {
      invites = { casual: invitationData };
    }
  }

  const styles = [
    { id: 'casual', label: 'WhatsApp / Casual', icon: Smartphone, content: invites.casual },
    { id: 'formal', label: 'Formal Invitation', icon: Mail, content: invites.formal },
    { id: 'social_media', label: 'Instagram / Social', icon: Camera, content: invites.social_media },
    { id: 'thank_you', label: 'Thank You Note', icon: HeartHandshake, content: invites.thank_you },
  ];

  const currentStyle = styles.find(s => s.id === activeTab) || styles[0];

  const copyContent = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`, { icon: '📋' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            <span>AI Invitation & Messaging Suite</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Personalized copies ready to send across WhatsApp, email, social feeds, and follow-ups.
          </p>
        </div>
      </div>

      {/* Style Tabs */}
      <div className="flex flex-wrap gap-2">
        {styles.map((style) => {
          const Icon = style.icon;
          const isActive = activeTab === style.id;
          return (
            <button
              key={style.id}
              onClick={() => setActiveTab(style.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400'
                  : 'glass-panel text-gray-300 hover:text-white hover:border-purple-500/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{style.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Copy Display */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-purple-500/20 relative">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <currentStyle.icon className="w-4 h-4 text-amber-400" />
            <span>{currentStyle.label} Preview</span>
          </span>
          <button
            onClick={() => copyContent(currentStyle.content, currentStyle.label)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/30 text-amber-300 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Text</span>
          </button>
        </div>

        <div className="whitespace-pre-line text-sm sm:text-base text-gray-200 leading-relaxed font-sans bg-black/30 p-6 rounded-xl border border-white/5 select-all">
          {currentStyle.content || "No copy text available for this format."}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 justify-end text-[11px] text-gray-400">
          <span>Tip: Replace bracketed tokens like [VENUE] and [TIME] before dispatching to guests.</span>
        </div>
      </div>
    </div>
  );
}
