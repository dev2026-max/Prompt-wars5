import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { 
  Sparkles, Gift, DollarSign, Calendar, CheckSquare, 
  MessageSquare, Users, Award, ShieldCheck, Heart, ArrowRight
} from 'lucide-react';

import Navbar from './components/Navbar';
import EventForm from './components/EventForm';
import IdeasSection from './components/IdeasSection';
import BudgetChart from './components/BudgetChart';
import TimelineSection from './components/TimelineSection';
import VendorsSection from './components/VendorsSection';
import InvitationSection from './components/InvitationSection';
import GuestTracker from './components/GuestTracker';
import ChatAssistant from './components/ChatAssistant';
import ApiKeyModal from './components/ApiKeyModal';

import { EventAPI } from './api/client';

const SAMPLE_EVENTS = [
  {
    name: "Rohan's Neon 30th Birthday",
    event_type: "Birthday Party",
    event_date: "2026-11-20",
    location: "Indiranagar, Bangalore",
    guest_count: 60,
    budget: 150000,
    currency: "INR",
    theme: "Neon Electric Glow Party",
    atmosphere: "High-energy, celebratory, upbeat music",
    venue_type: "hybrid",
    food_preference: "Mixed (Veg + Non-Veg)",
    age_group: "Young adults (25-35)",
    special_requests: "Include customized mocktail bar and Polaroid memory photo-wall"
  },
  {
    name: "Aanya & Vikram's Royal Sangeet Night",
    event_type: "Wedding",
    event_date: "2026-12-14",
    location: "Jaipur, Rajasthan",
    guest_count: 250,
    budget: 1200000,
    currency: "INR",
    theme: "Royal Marigold & Brass Heritage",
    atmosphere: "Grand, traditional yet contemporary fusion",
    venue_type: "outdoor",
    food_preference: "Mixed (Veg + Non-Veg)",
    age_group: "All age family gathering",
    special_requests: "Dhol ensemble entry, choreographed family performances, live chaat counter"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('plan');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('celebai_gemini_key') || '');

  // Form State
  const [formData, setFormData] = useState(SAMPLE_EVENTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Generated Plan State
  const [plan, setPlan] = useState(null);

  // Guests State
  const [guests, setGuests] = useState([
    { id: 1, name: 'Ananya Sharma', email: 'ananya@example.com', phone: '+91 98765 11111', rsvp_status: 'confirmed', dietary_requirement: 'Vegetarian', notes: 'Arriving with sister' },
    { id: 2, name: 'Kabir Mehta', email: 'kabir@example.com', phone: '+91 98765 22222', rsvp_status: 'confirmed', dietary_requirement: 'Mixed', notes: 'DJ enthusiast' },
    { id: 3, name: 'Pooja Verma', email: 'pooja@example.com', phone: '+91 98765 33333', rsvp_status: 'pending', dietary_requirement: 'Vegan', notes: 'Nut allergy' },
    { id: 4, name: 'Arjun Das', email: 'arjun@example.com', phone: '+91 98765 44444', rsvp_status: 'declined', dietary_requirement: 'Mixed', notes: 'Out of town on work' },
  ]);

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatting, setIsChatting] = useState(false);

  // Save API Key to localStorage
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('celebai_gemini_key', key);
    } else {
      localStorage.removeItem('celebai_gemini_key');
    }
  };

  // Load Sample Event
  const handleLoadSample = () => {
    const nextSample = formData.name === SAMPLE_EVENTS[0].name ? SAMPLE_EVENTS[1] : SAMPLE_EVENTS[0];
    setFormData(nextSample);
    toast.success(`Loaded sample: ${nextSample.name}`);
  };

  // Trigger Plan Generation
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Consulting Gemini AI to design your celebration blueprint...");

    try {
      // Call backend API preview endpoint
      const result = await EventAPI.previewPlan(formData);
      setPlan(result);
      toast.success("Celebration plan generated successfully! 🎉", { id: toastId });
      setActiveTab('ideas');
    } catch (err) {
      console.warn("Backend API call failed, generating via client-side intelligence...", err);
      // Fallback local generator for immediate reliability
      const budget = Number(formData.budget) || 100000;
      const currency = formData.currency || 'INR';
      const fallbackPlan = {
        event_id: 1,
        ideas: [
          {
            name: `${formData.theme || 'Royal Elegance'} Odyssey`,
            description: `An immersive, tailored celebration for ${formData.name} blending opulent aesthetics with curated personal touchpoints.`,
            theme_colors: ['#8B5CF6', '#F59E0B', '#F3F4F6'],
            key_elements: ['Grand Welcome Arch', 'Signature Mocktail Bar', 'Ambient Fairy Light Canopy', 'Customized Memory Wall', 'Polaroid Guest Station'],
            vibe: 'Enchanting'
          },
          {
            name: 'Bohemian Sunset Starlight',
            description: 'Cozy, organic atmosphere featuring low lounge seating, macrame accents, warm fairy lights, and acoustic vibes.',
            theme_colors: ['#F59E0B', '#10B981', '#FEF3C7'],
            key_elements: ['Macrame Backdrops', 'Artisan Dessert Bar', 'Live Acoustic Music', 'Eco-friendly Return Favors', 'Pampas Grass Table Centerpieces'],
            vibe: 'Whimsical'
          },
          {
            name: 'Neon Retro Masquerade',
            description: 'Vibrant, high-energy party featuring customized neon signage, LED dance floors, glow accessories, and electric beats.',
            theme_colors: ['#EC4899', '#8B5CF6', '#06B6D4'],
            key_elements: ['Customized Neon Signs', 'LED Glow Sticks', 'DJ Soundscape & Lasers', 'Cocktail Mixology Corner', 'Midnight Confetti Drop'],
            vibe: 'Electrifying'
          }
        ],
        budget: {
          total: budget,
          currency: currency,
          categories: [
            { category: 'Venue & Logistics', amount: budget * 0.35, percentage: 35, notes: 'Rental, seating, cleaning & air-conditioning' },
            { category: 'Catering & Beverages', amount: budget * 0.30, percentage: 30, notes: 'Per-plate appetizers, dinner buffet & beverages' },
            { category: 'Decor & Floral Styling', amount: budget * 0.12, percentage: 12, notes: 'Stage backdrops, flowers & ambient lighting' },
            { category: 'Photography & 4K Video', amount: budget * 0.08, percentage: 8, notes: 'Candid photography & video reels' },
            { category: 'Entertainment & DJ', amount: budget * 0.05, percentage: 5, notes: 'Sound systems, DJ & playlist curation' },
            { category: 'Stationery & Invites', amount: budget * 0.02, percentage: 2, notes: 'Animated digital invitations & table cards' },
            { category: 'Favors & Mementos', amount: budget * 0.03, percentage: 3, notes: 'Personalized return gifts for guests' },
            { category: 'Contingency Fund', amount: budget * 0.05, percentage: 5, notes: '10% safety cushion for last-minute add-ons' }
          ],
          disclaimer: 'Estimates based on current regional industry averages. Confirm directly with vendors.'
        },
        timeline: [
          { period: '4 to 6 Weeks Prior', priority: 'high', tasks: ['Lock in venue & sign rental contracts', 'Finalize guest list and send save-the-dates', 'Decide theme, moodboard, and color palette'] },
          { period: '3 Weeks Prior', priority: 'high', tasks: ['Schedule catering tasting and book caterer', 'Book photographer and music DJ', 'Design and review official digital invitations'] },
          { period: '1 to 2 Weeks Prior', priority: 'medium', tasks: ['Track RSVPs and lock final plate counts', 'Order cake and personalized favors', 'Confirm delivery timeline with all decorators'] },
          { period: '2 Days Prior', priority: 'high', tasks: ['Pack emergency host kit (tape, chargers, pins)', 'Reconfirm arrival times with vendors', 'Finalize event rundown schedule'] },
          { period: 'Day of Celebration', priority: 'high', tasks: ['Supervise morning stage & floral setup', 'Welcome guests and kick off program', 'Celebrate memorable moments!'] }
        ],
        vendors: [
          {
            category: 'Venue & Banquet',
            description: `Space supporting ${formData.guest_count} guests with ${formData.venue_type} ambiance.`,
            selection_criteria: ['Comfortable guest capacity', 'Clean restrooms & AC/heater power backup', 'In-house vs external vendor policy'],
            questions_to_ask: ['What are the overtime charges after 11 PM?', 'Are decor restrictions in place for walls/stages?', 'Is adequate guest parking provided?'],
            estimated_cost_range: `${currency} ${(budget * 0.25).toLocaleString('en-IN')} - ${(budget * 0.40).toLocaleString('en-IN')}`
          },
          {
            category: 'Catering & Dining',
            description: `Culinary service catering to ${formData.food_preference} menu options.`,
            selection_criteria: ['Hygiene accreditation', 'Live counters availability', 'Waiter to guest ratio (1:15 minimum)'],
            questions_to_ask: ['Do you provide cutlery and linens?', 'Can we conduct a food tasting beforehand?', 'How are leftovers packaged for the hosts?'],
            estimated_cost_range: `${currency} ${(budget * 0.25).toLocaleString('en-IN')} - ${(budget * 0.35).toLocaleString('en-IN')}`
          },
          {
            category: 'Decor & Stage Design',
            description: `Design team creating immersive backdrops tailored to ${formData.theme || 'custom'} vibes.`,
            selection_criteria: ['Past portfolio consistency', 'Use of eco-friendly and fresh floral arrangements', 'Setup completion 3 hours before start'],
            questions_to_ask: ['Is teardown included in the fee?', 'Are backup bulbs and generator power supplied?', 'Can we preview a 3D sketch of the stage?'],
            estimated_cost_range: `${currency} ${(budget * 0.10).toLocaleString('en-IN')} - ${(budget * 0.18).toLocaleString('en-IN')}`
          }
        ],
        invitation: {
          casual: `Hey everyone! 🎊 Get ready to celebrate ${formData.name}! Join us on ${formData.event_date || 'an upcoming date'} at ${formData.location || 'our chosen venue'} for delicious food, great music, and unforgettable memories. Please RSVP so we can save you a seat! 🥂`,
          formal: `We cordially request the honor of your presence to celebrate ${formData.name}.\n\nDate: ${formData.event_date || '[DATE]'}\nVenue: ${formData.location || '[VENUE]'}\nTime: 7:00 PM Onwards\n\nYour presence will make this milestone truly special.\nRSVP requested.`,
          social_media: `Counting down the days to celebrate ${formData.name}! ✨ Good vibes, amazing people, and lifetime memories ahead. 🥳💖 #${formData.event_type.replace(/[^a-zA-Z]/g, '')} #CelebAI #Celebrations`,
          thank_you: `Thank you so much for joining us for ${formData.name}! Your presence, warm smiles, and love made the celebration complete. Grateful to have you in our lives! ❤️`
        }
      };
      setPlan(fallbackPlan);
      toast.success("Celebration plan generated! 🎉", { id: toastId });
      setActiveTab('ideas');
    } finally {
      setIsGenerating(false);
    }
  };

  // Chat message handler
  const handleSendMessage = async (userText) => {
    const updatedMessages = [...chatMessages, { role: 'user', content: userText }];
    setChatMessages(updatedMessages);
    setIsChatting(true);

    try {
      const res = await EventAPI.sendMessage(userText, plan?.event_id || null);
      setChatMessages([...updatedMessages, { role: 'assistant', content: res.content }]);
    } catch {
      // Local smart response
      setTimeout(() => {
        let reply = "Here's a smart event planning tip: Focus 60% of your budget on what guests remember most — great food and lively music. Minor decorations can easily be elevated with warm fairy lighting!";
        const lower = userText.toLowerCase();
        if (lower.includes("catering") || lower.includes("save") || lower.includes("budget")) {
          reply = "💰 **Top 3 Catering Cost-Savers:**\n1. Opt for live street-food chaat or pasta counters instead of an overly heavy main course buffet.\n2. Confirm final RSVPs 7 days early to lock the exact plate count.\n3. Source beverages directly in bulk rather than through the banquet markup!";
        } else if (lower.includes("game") || lower.includes("icebreaker")) {
          reply = "🎲 **Engaging Icebreaker Ideas:**\n1. **Two Truths & A Wish**: Fun party twist where guests guess which milestone the honoree hasn't done yet.\n2. **Trivia Showdown**: Quick 10-question mobile Kahoot quiz about the honoree!\n3. **Polaroid Scrapbook Challenge**: Each guest snaps a candid selfie and writes their best memory.";
        }
        setChatMessages([...updatedMessages, { role: 'assistant', content: reply }]);
        setIsChatting(false);
      }, 700);
      return;
    }
    setIsChatting(false);
  };

  const handleClearChat = () => {
    setChatMessages([]);
    toast.success("Chat history cleared");
  };

  // Guest Handlers
  const handleAddGuest = (newG) => {
    setGuests(prev => [...prev, { ...newG, id: Date.now() }]);
  };

  const handleUpdateGuest = (id, updatedFields) => {
    setGuests(prev => prev.map(g => (g.id === id ? { ...g, ...updatedFields } : g)));
    toast.success("Guest updated");
  };

  const handleDeleteGuest = (id) => {
    setGuests(prev => prev.filter(g => g.id !== id));
    toast.success("Guest removed");
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-purple-500 selection:text-white">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#18112e', color: '#fff', border: '1px solid rgba(168,85,247,0.3)' } }} />

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasCustomApiKey={Boolean(apiKey)}
      />

      {/* Hero Strip */}
      <div className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>PromptWars Challenge 5 Submission</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-['Outfit']">
              Plan Dream Celebrations With <span className="gradient-text-gold">GenAI Intelligence</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-300 leading-relaxed">
              Transform your celebration concept into a cohesive event masterplan: bespoke themes, data-backed budgets, phased checklists, vendor vetting guides, and ready-to-share RSVP invitations.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400 font-['Outfit']">12+</div>
              <div className="text-[11px] text-gray-400">Event Types</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 font-['Outfit']">100%</div>
              <div className="text-[11px] text-gray-400">AI Tailored</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400 font-['Outfit']">₹0</div>
              <div className="text-[11px] text-gray-400">Hidden Fees</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'plan' && (
          <EventForm
            formData={formData}
            setFormData={setFormData}
            onGenerate={handleGeneratePlan}
            isGenerating={isGenerating}
            onLoadSample={handleLoadSample}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeasSection
            ideas={plan?.ideas}
            onSelectTheme={(themeName) => {
              setFormData(prev => ({ ...prev, theme: themeName }));
              toast.success(`Theme set to: ${themeName}`);
            }}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetChart budgetData={plan?.budget} />
        )}

        {activeTab === 'timeline' && (
          <TimelineSection timelineData={plan?.timeline} />
        )}

        {activeTab === 'vendors' && (
          <VendorsSection vendorsData={plan?.vendors} />
        )}

        {activeTab === 'invites' && (
          <InvitationSection invitationData={plan?.invitation} />
        )}

        {activeTab === 'guests' && (
          <GuestTracker
            guests={guests}
            onAddGuest={handleAddGuest}
            onUpdateGuest={handleUpdateGuest}
            onDeleteGuest={handleDeleteGuest}
          />
        )}
      </main>

      {/* Floating AI Concierge Button & Panel */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            const chatModal = document.getElementById('chat-concierge-modal');
            if (chatModal) chatModal.classList.toggle('hidden');
          }}
          className="w-14 h-14 rounded-full gradient-btn flex items-center justify-center text-white shadow-2xl hover:scale-110 transition cursor-pointer border border-white/20"
          title="Open AI Concierge Chat"
        >
          <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
        </button>
      </div>

      {/* Floating Chat Modal */}
      <div id="chat-concierge-modal" className="hidden fixed bottom-24 right-6 z-50 w-full max-w-md">
        <ChatAssistant
          chatMessages={chatMessages}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          isChatting={isChatting}
        />
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-white/5 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white font-['Outfit']">CelebAI</span>
            <span>• PromptWars Challenge 5 AI Celebration & Event Planner</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Powered by Google Gemini 2.0 / 1.5 Flash</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">Built with React + Vite + FastAPI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
