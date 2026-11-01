import React from 'react';
import { 
  Sparkles, Calendar, MapPin, Users, IndianRupee, Utensils, 
  Smile, Wind, Check, RefreshCw 
} from 'lucide-react';

const EVENT_TYPES = [
  { id: 'Birthday Party', label: 'Birthday Party', icon: '🎂', badge: 'Popular' },
  { id: 'Wedding', label: 'Wedding / Sangeet', icon: '💍', badge: 'Grand' },
  { id: 'Anniversary', label: 'Anniversary', icon: '🥂', badge: 'Romantic' },
  { id: 'Corporate Event', label: 'Corporate Event', icon: '💼', badge: 'Formal' },
  { id: 'Baby Shower', label: 'Baby Shower', icon: '🍼', badge: 'Sweet' },
  { id: 'Graduation', label: 'Graduation Party', icon: '🎓', badge: 'Youth' },
  { id: 'Housewarming', label: 'Housewarming / Griha Pravesh', icon: '🏡', badge: 'Auspicious' },
  { id: 'Farewell Party', label: 'Farewell / Send-off', icon: '✈️', badge: 'Memories' },
  { id: 'Festival Celebration', label: 'Festival / Diwali / Holi', icon: '🪔', badge: 'Cultural' },
  { id: 'Kids Party', label: 'Kids Themed Party', icon: '🎈', badge: 'Fun' },
  { id: 'Retirement Party', label: 'Retirement Honor', icon: '🌅', badge: 'Milestone' },
  { id: 'Custom Event', label: 'Custom Celebration', icon: '✨', badge: 'Bespoke' },
];

const BUDGET_PRESETS = [
  { label: '₹25K', value: 25000 },
  { label: '₹75K', value: 75000 },
  { label: '₹1.5 Lakh', value: 150000 },
  { label: '₹5 Lakh', value: 500000 },
  { label: '₹15 Lakh', value: 1500000 },
  { label: '₹50 Lakh', value: 5000000 },
];

export default function EventForm({ formData, setFormData, onGenerate, isGenerating, onLoadSample }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guest_count' || name === 'budget' ? Number(value) : value
    }));
  };

  const handleEventTypeSelect = (typeId) => {
    setFormData(prev => ({ ...prev, event_type: typeId }));
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-purple-500/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/10 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>🎉</span>
            <span className="gradient-text-purple">Celebration Intake</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Provide details below and Gemini AI will curate themes, timelines, checklists, and budgets.
          </p>
        </div>
        <button
          type="button"
          onClick={onLoadSample}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Load Sample Event</span>
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onGenerate(); }} className="space-y-6">
        {/* 1. Event Type Selection Grid */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3">
            1. Select Event Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {EVENT_TYPES.map((type) => {
              const selected = formData.event_type === type.id;
              return (
                <div
                  key={type.id}
                  onClick={() => handleEventTypeSelect(type.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border flex flex-col justify-between ${
                    selected
                      ? 'bg-purple-600/30 border-purple-400 ring-2 ring-purple-500/40 shadow-lg shadow-purple-900/40'
                      : 'bg-white/5 border-white/10 hover:border-purple-400/40 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{type.icon}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      selected ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-black/30 text-gray-400'
                    }`}>
                      {type.badge}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-white truncate">
                    {type.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Basic Info (Name, Date, Location) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Event Title / Honoree Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Aarav's 30th Birthday Bash"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Event Date</span>
            </label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>City / Destination</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bangalore, Goa, Mumbai"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        {/* 3. Guests and Budget Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Guest Count */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Estimated Guests</span>
              </label>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-200 border border-purple-500/30">
                {formData.guest_count} attendees
              </span>
            </div>
            <input
              type="range"
              name="guest_count"
              min="5"
              max="1500"
              step="5"
              value={formData.guest_count}
              onChange={handleChange}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>Intimate (10)</span>
              <span>Medium (100)</span>
              <span>Grand (500+)</span>
            </div>
          </div>

          {/* Budget */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-amber-400" />
                <span>Total Budget ({formData.currency})</span>
              </label>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {formData.currency} {Number(formData.budget).toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              name="budget"
              min="10000"
              max="5000000"
              step="10000"
              value={formData.budget}
              onChange={handleChange}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {BUDGET_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => setFormData(prev => ({ ...prev, budget: p.value }))}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded transition ${
                    formData.budget === p.value
                      ? 'bg-amber-400 text-black font-bold'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Atmospheric Details (Venue Type, Food, Vibe) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Venue Preference
            </label>
            <select
              name="venue_type"
              value={formData.venue_type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-gray-900"
            >
              <option value="indoor">Indoor (Banquet / Hall / Lounge)</option>
              <option value="outdoor">Outdoor (Lawn / Beach / Garden)</option>
              <option value="hybrid">Hybrid (Indoor + Terrace/Lawn)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-purple-400" />
              <span>Catering & Food</span>
            </label>
            <select
              name="food_preference"
              value={formData.food_preference}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-gray-900"
            >
              <option value="Mixed (Veg + Non-Veg)">Mixed (Veg + Non-Veg)</option>
              <option value="Pure Vegetarian">Pure Vegetarian</option>
              <option value="Jain Vegetarian">Jain Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="International Cuisine">International Gourmet</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-amber-400" />
              <span>Vibe / Atmosphere</span>
            </label>
            <input
              type="text"
              name="atmosphere"
              value={formData.atmosphere}
              onChange={handleChange}
              placeholder="e.g. Elegant, high energy, cozy boho"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        {/* 5. Special Notes & Desired Themes */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Special Requests, Desired Themes, or Dietary Notes
          </label>
          <textarea
            name="special_requests"
            rows={2}
            value={formData.special_requests || ''}
            onChange={handleChange}
            placeholder="e.g. Include a surprise video montage for the grandparents, prefer eco-friendly decor, mocktail bar required"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 px-6 rounded-xl gradient-btn text-white font-bold text-base tracking-wide flex items-center justify-center space-x-2.5 shadow-xl hover:shadow-purple-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
                <span>Generating AI Celebration Blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>Generate Complete AI Event Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
