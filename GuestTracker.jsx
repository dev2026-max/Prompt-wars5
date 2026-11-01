import React, { useState } from 'react';
import { Users, UserPlus, CheckCircle2, Clock, XCircle, HelpCircle, Trash2, Search, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GuestTracker({ guests, onAddGuest, onUpdateGuest, onDeleteGuest }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    rsvp_status: 'pending',
    dietary_requirement: 'Mixed',
    notes: '',
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newGuest.name.trim()) return;
    onAddGuest(newGuest);
    setNewGuest({
      name: '',
      email: '',
      phone: '',
      rsvp_status: 'pending',
      dietary_requirement: 'Mixed',
      notes: '',
    });
    setShowAddForm(false);
    toast.success("Guest added to registry!");
  };

  // Metrics
  const total = guests.length;
  const confirmed = guests.filter(g => g.rsvp_status === 'confirmed').length;
  const pending = guests.filter(g => g.rsvp_status === 'pending').length;
  const declined = guests.filter(g => g.rsvp_status === 'declined').length;

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.email && g.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || g.rsvp_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Guest List & RSVP Tracker</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Track confirmations, headcounts, dietary requirements, and meal preferences.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-btn text-white text-xs font-semibold self-start sm:self-auto cursor-pointer shadow-lg"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Add New Guest'}</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-white/5">
          <span className="text-xs text-gray-400 font-medium">Total Guests</span>
          <div className="text-2xl font-extrabold text-white font-['Outfit'] mt-1">{total}</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10">
          <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmed</span>
          </span>
          <div className="text-2xl font-extrabold text-emerald-400 font-['Outfit'] mt-1">{confirmed}</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-amber-500/20 bg-amber-950/10">
          <span className="text-xs text-amber-300 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
          <div className="text-2xl font-extrabold text-amber-400 font-['Outfit'] mt-1">{pending}</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-rose-500/20 bg-rose-950/10">
          <span className="text-xs text-rose-300 font-medium flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Declined</span>
          </span>
          <div className="text-2xl font-extrabold text-rose-400 font-['Outfit'] mt-1">{declined}</div>
        </div>
      </div>

      {/* Add Guest Modal/Panel */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="glass-panel rounded-2xl p-6 border border-purple-500/30 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-purple-300">
            Register Guest
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newGuest.name}
                onChange={e => setNewGuest({ ...newGuest, name: e.target.value })}
                placeholder="Guest Name"
                className="w-full px-3 py-2 rounded-lg glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Phone / WhatsApp</label>
              <input
                type="text"
                value={newGuest.phone}
                onChange={e => setNewGuest({ ...newGuest, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-lg glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={newGuest.email}
                onChange={e => setNewGuest({ ...newGuest, email: e.target.value })}
                placeholder="guest@example.com"
                className="w-full px-3 py-2 rounded-lg glass-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">RSVP Status</label>
              <select
                value={newGuest.rsvp_status}
                onChange={e => setNewGuest({ ...newGuest, rsvp_status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg glass-input text-xs bg-gray-900"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
                <option value="maybe">Maybe</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Dietary Requirement</label>
              <select
                value={newGuest.dietary_requirement}
                onChange={e => setNewGuest({ ...newGuest, dietary_requirement: e.target.value })}
                className="w-full px-3 py-2 rounded-lg glass-input text-xs bg-gray-900"
              >
                <option value="Mixed">Mixed / No Preference</option>
                <option value="Vegetarian">Pure Vegetarian</option>
                <option value="Jain">Jain Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-Free">Gluten-Free</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Notes / Plus-ones</label>
              <input
                type="text"
                value={newGuest.notes}
                onChange={e => setNewGuest({ ...newGuest, notes: e.target.value })}
                placeholder="e.g. Bringing +1, needs ramp access"
                className="w-full px-3 py-2 rounded-lg glass-input text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg glass-card text-xs text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg gradient-btn text-white text-xs font-bold"
            >
              Save Guest
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search guests by name or email..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          {['all', 'confirmed', 'pending', 'declined'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filterStatus === status
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-purple-950/40 border-b border-white/10 text-gray-300 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Guest</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">RSVP Status</th>
                <th className="p-3.5">Dietary</th>
                <th className="p-3.5">Notes</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No guests matching criteria.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((g, idx) => (
                  <tr key={g.id || idx} className="hover:bg-white/5 transition">
                    <td className="p-3.5 font-bold text-white">{g.name}</td>
                    <td className="p-3.5 text-gray-400">
                      <div>{g.phone || '—'}</div>
                      <div className="text-[10px] text-gray-400">{g.email}</div>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={g.rsvp_status}
                        onChange={(e) => onUpdateGuest(g.id || idx, { ...g, rsvp_status: e.target.value })}
                        className={`text-[11px] font-bold px-2 py-1 rounded-md border bg-gray-900 cursor-pointer ${
                          g.rsvp_status === 'confirmed'
                            ? 'text-emerald-300 border-emerald-500/40'
                            : g.rsvp_status === 'declined'
                            ? 'text-rose-300 border-rose-500/40'
                            : 'text-amber-300 border-amber-500/40'
                        }`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="declined">Declined</option>
                        <option value="maybe">Maybe</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-gray-300 flex items-center gap-1">
                      <Utensils className="w-3 h-3 text-purple-400" />
                      <span>{g.dietary_requirement || 'Mixed'}</span>
                    </td>
                    <td className="p-3.5 text-gray-400 max-w-xs truncate">{g.notes || '—'}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onDeleteGuest(g.id || idx)}
                        className="text-gray-400 hover:text-rose-400 p-1 transition"
                        title="Delete guest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
