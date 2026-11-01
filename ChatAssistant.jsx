import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, Bot, User, Trash2, X } from 'lucide-react';

const SUGGESTIONS = [
  "How can I save 20% on catering costs?",
  "Suggest interactive party icebreaker games",
  "What are creative return gift ideas under ₹500?",
  "Write an RSVP reminder message for WhatsApp",
  "How much wine and beverages do I need for 100 people?"
];

export default function ChatAssistant({ chatMessages, onSendMessage, onClearChat, isChatting }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isChatting) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleChipClick = (suggestion) => {
    if (isChatting) return;
    onSendMessage(suggestion);
  };

  return (
    <div className="glass-panel rounded-2xl border border-purple-500/20 overflow-hidden flex flex-col h-[650px] shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-purple-950/40 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-['Outfit']">
              <span>CelebAI Event Concierge</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-[11px] text-purple-300/80">Always active • Powered by Gemini AI</p>
          </div>
        </div>

        {chatMessages.length > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-rose-400 px-2 py-1 rounded-md hover:bg-white/5 transition"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div className="max-w-md">
              <h4 className="text-base font-bold text-white">Ask Anything About Your Celebration!</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Need budget hacks, timeline tips, themed cocktail recipes, or guest etiquette advice? Pick a prompt or ask your own question below.
              </p>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg pt-2">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(s)}
                  className="px-3 py-1.5 rounded-full text-[11px] bg-white/5 hover:bg-purple-600/30 text-gray-300 hover:text-white border border-white/10 hover:border-purple-400/30 transition text-left cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatMessages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isUser
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-tr-none shadow-md'
                      : 'glass-card border border-white/10 text-gray-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}

        {isChatting && (
          <div className="flex items-center gap-2 text-xs text-purple-300 italic p-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>CelebAI is crafting recommendations...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-black/40 border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask CelebAI about food quantities, budget splits, party playlists..."
          className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs"
        />
        <button
          type="submit"
          disabled={!input.trim() || isChatting}
          className="p-2.5 rounded-xl gradient-btn text-white disabled:opacity-40 cursor-pointer transition hover:scale-105"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
