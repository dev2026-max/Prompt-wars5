import React from 'react';
import { Sparkles, Calendar, DollarSign, Users, MessageSquare, CheckSquare, Gift, Key } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenApiKeyModal, hasCustomApiKey }) {
  const navItems = [
    { id: 'plan', label: 'Event Planner', icon: Sparkles },
    { id: 'ideas', label: 'Ideas & Themes', icon: Gift },
    { id: 'budget', label: 'Smart Budget', icon: DollarSign },
    { id: 'timeline', label: 'Timeline & Tasks', icon: Calendar },
    { id: 'vendors', label: 'Vendor Guide', icon: CheckSquare },
    { id: 'invites', label: 'AI Invitations', icon: MessageSquare },
    { id: 'guests', label: 'RSVP Tracker', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-purple-500/20 bg-opacity-80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('plan')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-white font-['Outfit']">Celeb<span className="gradient-text-gold">AI</span></span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">v2.0</span>
              </div>
              <p className="text-[10px] text-purple-300/70 font-medium tracking-wide">SMART CELEBRATION PLANNER</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600/30 text-white border border-purple-500/40 shadow-sm shadow-purple-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenApiKeyModal}
              title={hasCustomApiKey ? "Custom Gemini API Key Connected" : "Configure Gemini API Key"}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                hasCustomApiKey
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{hasCustomApiKey ? "API Connected" : "API Key"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex overflow-x-auto py-2 px-3 space-x-1 border-t border-white/5 bg-black/40">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                isActive ? 'bg-purple-600/40 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
