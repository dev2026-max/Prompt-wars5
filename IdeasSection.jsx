import React from 'react';
import { Gift, Palette, Sparkles, Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IdeasSection({ ideas, onSelectTheme }) {
  if (!ideas || ideas.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center border border-purple-500/20">
        <Gift className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-60" />
        <h3 className="text-lg font-bold text-white">No Themes Generated Yet</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
          Fill in your celebration details in the Event Planner tab and tap "Generate Complete AI Event Plan" to explore bespoke themes.
        </p>
      </div>
    );
  }

  const copyIdea = (idea) => {
    const text = `${idea.name}\n${idea.description}\nKey Elements: ${idea.key_elements?.join(', ')}`;
    navigator.clipboard.writeText(text);
    toast.success(`Copied "${idea.name}" to clipboard!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-400" />
            <span>AI Concept Themes & Aesthetics</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Tailored creative themes complete with curated color palettes and signature event elements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ideas.map((idea, idx) => (
          <div
            key={idx}
            className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/40"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Concept 0{idx + 1}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  {idea.vibe || 'Festive'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                {idea.name}
              </h3>

              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                {idea.description}
              </p>

              {/* Theme Colors */}
              {idea.theme_colors && idea.theme_colors.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-2">
                    <Palette className="w-3.5 h-3.5 text-pink-400" />
                    <span>Palette Swatches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {idea.theme_colors.map((color, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-1">
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                        <span className="text-[10px] text-gray-400 font-mono">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Highlights */}
              {idea.key_elements && idea.key_elements.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-xs font-medium text-gray-400 mb-2">Signature Highlights</div>
                  <ul className="space-y-1.5">
                    {idea.key_elements.map((el, eIdx) => (
                      <li key={eIdx} className="text-xs text-gray-300 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => copyIdea(idea)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </button>
              {onSelectTheme && (
                <button
                  type="button"
                  onClick={() => onSelectTheme(idea.name)}
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 transition"
                >
                  Adopt Theme
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
