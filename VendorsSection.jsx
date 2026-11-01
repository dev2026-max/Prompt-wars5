import React from 'react';
import { CheckSquare, HelpCircle, ShieldAlert, Sparkles, Tag } from 'lucide-react';

export default function VendorsSection({ vendorsData }) {
  if (!vendorsData || vendorsData.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center border border-purple-500/20">
        <CheckSquare className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-60" />
        <h3 className="text-lg font-bold text-white">No Vendor Guidelines Available</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
          Generate an event plan to access expert vendor vetting criteria, contract safeguards, and interview questions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-purple-400" />
            <span>Vendor Vetting & Booking Playbook</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Category-level checklists and direct interview questions so you book the right professionals with zero surprises.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vendorsData.map((vendor, idx) => (
          <div
            key={idx}
            className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between hover:border-purple-500/40 transition"
          >
            <div>
              {/* Category Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{vendor.category}</span>
                </h3>
                {vendor.estimated_cost_range && (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    <Tag className="w-3 h-3" />
                    <span>{vendor.estimated_cost_range}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                {vendor.description}
              </p>

              {/* Selection Criteria */}
              {vendor.selection_criteria && vendor.selection_criteria.length > 0 && (
                <div className="mb-4 bg-white/5 p-3.5 rounded-xl border border-white/5">
                  <div className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Key Selection Criteria</span>
                  </div>
                  <ul className="space-y-1.5">
                    {vendor.selection_criteria.map((crit, cIdx) => (
                      <li key={cIdx} className="text-xs text-gray-300 flex items-start gap-1.5">
                        <span className="text-purple-400 text-sm leading-none">•</span>
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Questions to Ask */}
              {vendor.questions_to_ask && vendor.questions_to_ask.length > 0 && (
                <div className="bg-purple-950/20 p-3.5 rounded-xl border border-purple-500/20">
                  <div className="text-xs font-semibold text-amber-300 mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Questions to Ask Before Signing</span>
                  </div>
                  <ul className="space-y-1.5">
                    {vendor.questions_to_ask.map((q, qIdx) => (
                      <li key={qIdx} className="text-xs text-gray-300 flex items-start gap-1.5">
                        <span className="text-amber-400 text-sm leading-none font-bold">?</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[10px] text-gray-400">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span>{vendor.disclaimer || "AI-generated guideline. Review agreements thoroughly before booking."}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
