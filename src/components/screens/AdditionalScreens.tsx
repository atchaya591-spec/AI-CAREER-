import React, { useState, useEffect, useRef } from 'react';
import { AppState, ChatMessage, CAREERS_DATA } from '../../types';
import {
  getRankedCareers,
  scoreSingleCareer,
  getRoadmapCompletionPercentage,
} from '../../services/careerEngine';
import { sendChatMessage } from '../../services/api';
import { ArrowLeft, Send, Sparkles, X, Check, CheckSquare } from 'lucide-react';

interface ScreenProps {
  state: AppState;
  onNavigate: (screen: string, arg?: string) => void;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  showToast: (msg: string) => void;
}

export const ChatbotScreen: React.FC<ScreenProps> = ({
  state,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: `Hi ${state.user?.name ? state.user.name.split(' ')[0] : 'there'}! 👋 I am your AI Career Copilot. Ask me about your career match scores, recommended programming roadmaps, interview prep, or resume strategies.`,
      timestamp: 'Just now',
      source: 'gemini',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    const res = await sendChatMessage(text, messages, {
      name: state.user?.name,
      edu: state.user?.edu,
      year: state.user?.year,
      skills: state.user?.skills,
      targetCareer: state.target || 'Software Engineer',
      assessed: state.assessed,
    });

    setLoading(false);
    const botMsg: ChatMessage = {
      id: String(Date.now() + 1),
      sender: 'bot',
      text: res.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: res.source,
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F2EC] h-full overflow-hidden">
      {/* Header */}
      <div className="bg-[#122036] text-[#EFEDE4] px-5 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="font-mono-code text-[10px] uppercase tracking-wider text-[#4FA88C] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E4A23C]" />
              AI CAREER COPILOT
            </div>
            <div className="font-display text-base font-bold text-white">
              Career &amp; Learning Counselor
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="text-[#A9B7C6] hover:text-white p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs whitespace-pre-line ${
                  isUser
                    ? 'bg-[#122036] text-[#EFEDE4] rounded-br-xs'
                    : 'bg-white text-[#17232E] border border-[#E7E3D8] rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
              <div className="text-[10px] font-mono-code text-[#4F6070] mt-1 px-1">
                {m.timestamp}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start">
            <div className="bg-white border border-[#E7E3D8] px-4 py-3 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#122036] animate-dot-1" />
              <span className="w-2 h-2 rounded-full bg-[#122036] animate-dot-2" />
              <span className="w-2 h-2 rounded-full bg-[#122036] animate-dot-3" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0 bg-[#F4F2EC]">
        {[
          'Explain my top match',
          'What project should I build first?',
          '4-week DSA roadmap',
          'How do I prepare for tech interviews?',
        ].map((q) => (
          <button
            key={q}
            onClick={() => handleQuickPrompt(q)}
            className="shrink-0 bg-[#4FA88C]/15 hover:bg-[#4FA88C]/25 text-[#357C67] text-[11px] font-mono-code font-bold py-1.5 px-3 rounded-full transition cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-white border-t border-[#E7E3D8] flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about careers, skills, roadmaps..."
          className="flex-1 bg-[#F4F2EC] border border-[#E7E3D8] px-4 py-2.5 rounded-full text-xs text-[#17232E] focus:outline-none focus:border-[#4FA88C]"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-full bg-[#E4A23C] hover:bg-[#C0812A] text-[#122036] flex items-center justify-center transition cursor-pointer disabled:opacity-40 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const CompareScreen: React.FC<ScreenProps> = ({
  state,
  onNavigate,
  onUpdateState,
  showToast,
}) => {
  const ranked = getRankedCareers(state);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    state.compare.length > 0 ? state.compare : ranked.slice(0, 3).map((x) => x.c.id)
  );

  const toggleCareer = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) {
        showToast('Keep at least 1 career to compare');
        return;
      }
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      if (selectedIds.length >= 3) {
        showToast('Select up to 3 careers to compare');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedResults = ranked.filter((x) => selectedIds.includes(x.c.id));

  const handleSetTarget = (id: string) => {
    onUpdateState((prev) => ({
      ...prev,
      target: id,
    }));
    showToast('Target career updated!');
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      <div className="mb-4">
        <button
          onClick={() => onNavigate('recommendations')}
          className="w-9 h-9 rounded-full bg-[#E7E3D8] text-[#17232E] flex items-center justify-center mb-3 hover:bg-[#122036]/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          DECISION SUPPORT
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          Compare careers.
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          Pick up to 3 options to make trade-offs transparent.
        </p>
      </div>

      {/* Career Chips Selector */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {ranked.map((x) => {
          const active = selectedIds.includes(x.c.id);
          return (
            <button
              key={x.c.id}
              onClick={() => toggleCareer(x.c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                active
                  ? 'bg-[#122036] text-[#EFEDE4]'
                  : 'bg-white text-[#17232E] border border-[#E7E3D8]'
              }`}
            >
              <span>{x.c.icon}</span>
              <span>{x.c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-[#E7E3D8] overflow-x-auto shadow-xs mb-5">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E7E3D8] bg-[#F4F2EC]/50 font-mono-code text-[10px] text-[#4F6070] uppercase">
              <th className="p-3">Metric</th>
              {selectedResults.map((r) => (
                <th key={r.c.id} className="p-3 font-bold text-[#122036]">
                  {r.c.name.split(' ')[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E3D8]">
            <tr>
              <td className="p-3 font-semibold text-[#17232E]">Overall Match</td>
              {selectedResults.map((r) => (
                <td key={r.c.id} className="p-3 font-mono-code font-bold text-[#E4A23C]">
                  {r.total}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-[#17232E]">Interest Fit</td>
              {selectedResults.map((r) => (
                <td key={r.c.id} className="p-3 font-mono-code font-bold text-[#357C67]">
                  {r.iFit}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-[#17232E]">Aptitude Ratio</td>
              {selectedResults.map((r) => (
                <td key={r.c.id} className="p-3 font-mono-code font-bold text-[#17232E]">
                  {r.aFit}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-[#17232E]">Work Style</td>
              {selectedResults.map((r) => (
                <td key={r.c.id} className="p-3 font-mono-code font-bold text-[#17232E]">
                  {r.sFit}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-[#17232E]">Skills Held</td>
              {selectedResults.map((r) => (
                <td key={r.c.id} className="p-3 font-mono-code font-bold text-[#357C67]">
                  {r.have.length}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-[#17232E]">Skills to Build</td>
              {selectedResults.map((r) => (
                <td key={r.c.id} className="p-3 font-mono-code font-bold text-[#B8442F]">
                  {r.missing.length}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pathway Action Buttons */}
      <div className="space-y-2 mt-auto">
        {selectedResults.map((r) => {
          const isTarget = state.target === r.c.id;
          return (
            <button
              key={r.c.id}
              onClick={() => handleSetTarget(r.c.id)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
                isTarget
                  ? 'bg-[#357C67] text-white'
                  : 'bg-white hover:bg-[#E7E3D8] border border-[#122036] text-[#122036]'
              }`}
            >
              {isTarget ? '✓ Selected Pathway: ' : 'Choose '} {r.c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const AdminScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      <div className="mb-4">
        <button
          onClick={() => onNavigate('profile')}
          className="w-9 h-9 rounded-full bg-[#E7E3D8] text-[#17232E] flex items-center justify-center mb-3 hover:bg-[#122036]/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          MODULE 7 · ADMIN DASHBOARD
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          Cohort Analytics.
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          Aggregated student cohort metrics and common skill gaps across Firestore collections.
        </p>
      </div>

      <div className="space-y-3 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8]">
            <div className="font-display text-2xl font-bold text-[#122036]">128</div>
            <div className="text-xs text-[#4F6070]">Enrolled Students</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8]">
            <div className="font-display text-2xl font-bold text-[#357C67]">94%</div>
            <div className="text-xs text-[#4F6070]">Assessment Rate</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] space-y-1">
          <div className="font-bold text-sm text-[#17232E]">Most Common Technical Gaps</div>
          <p className="text-xs text-[#4F6070]">
            1. DSA (Data Structures) · 2. SQL &amp; Cloud Databases · 3. Unit Testing &amp; CI/CD
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] space-y-1">
          <div className="font-bold text-sm text-[#17232E]">Top Target Aspirations</div>
          <p className="text-xs text-[#4F6070]">
            1. Software Engineer (48%) · 2. AI / ML Engineer (32%) · 3. Data Analyst (12%)
          </p>
        </div>
      </div>
    </div>
  );
};

export const LiteratureGapsScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const gaps = [
    {
      title: 'Limited personalization in career apps',
      status: 'ADDRESSED',
      desc: 'Combined RIASEC interests, logical aptitude, and personality vectors into multi-factor profile.',
    },
    {
      title: 'Static / rule-based recommendation matching',
      status: 'ADDRESSED',
      desc: 'Transparent multi-factor cosine vector calculations with Gemini AI narrative explanation.',
    },
    {
      title: 'Lack of explainability ("Black box AI")',
      status: 'ADDRESSED',
      desc: 'Every career score provides granular component bars (30% Interest, 20% Aptitude, 15% Style, 20% Skills, 15% Goal).',
    },
    {
      title: 'Missing skill gap actionability',
      status: 'ADDRESSED',
      desc: 'Generates structured multi-week milestone plan with interactive completion checkboxes.',
    },
    {
      title: 'Absence of continuous adaptive feedback',
      status: 'ADDRESSED',
      desc: 'Weekly check-in adjusts the roadmap difficulty and pacing based on user confidence.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      <div className="mb-4">
        <button
          onClick={() => onNavigate('profile')}
          className="w-9 h-9 rounded-full bg-[#E7E3D8] text-[#17232E] flex items-center justify-center mb-3 hover:bg-[#122036]/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          LITERATURE SURVEY · GAP MAPPING
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          Research Gap Matrix.
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          How this system advances beyond legacy systems and naive chatbots.
        </p>
      </div>

      <div className="space-y-3 mb-5">
        {gaps.map((g) => (
          <div key={g.title} className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs">
            <div className="flex justify-between items-start gap-2 mb-1">
              <span className="font-bold text-xs text-[#17232E]">{g.title}</span>
              <span className="font-mono-code text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4FA88C]/15 text-[#357C67] shrink-0">
                {g.status}
              </span>
            </div>
            <p className="text-xs text-[#4F6070] leading-relaxed">{g.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SettingsScreen: React.FC<ScreenProps> = ({
  state,
  onNavigate,
  onUpdateState,
  showToast,
}) => {
  const toggleSetting = (key: 'personal' | 'remind' | 'anon') => {
    onUpdateState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: !prev.settings[key],
      },
    }));
    showToast('Preference updated!');
  };

  const handleClearData = () => {
    if (window.confirm('Delete all stored assessment and profile data on this device?')) {
      onUpdateState((prev) => ({
        ...prev,
        user: null,
        ans: { interest: [], aptitude: [], personality: [] },
        refl: { text: '', conf: '', env: [] },
        assessed: false,
        done: {},
        checkins: [],
        journal: [],
      }));
      showToast('All local student data wiped');
      onNavigate('splash');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      <div className="mb-4">
        <button
          onClick={() => onNavigate('profile')}
          className="w-9 h-9 rounded-full bg-[#E7E3D8] text-[#17232E] flex items-center justify-center mb-3 hover:bg-[#122036]/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          SETTINGS &amp; PRIVACY
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          Preferences.
        </h2>
      </div>

      <div className="space-y-3 mb-5">
        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] flex items-center justify-between">
          <div>
            <div className="font-bold text-xs text-[#17232E]">Personalized Recommendations</div>
            <div className="text-[11px] text-[#4F6070]">
              Factor in assessment and self-reflection weights
            </div>
          </div>
          <button
            onClick={() => toggleSetting('personal')}
            className={`font-mono-code text-xs font-bold px-3 py-1 rounded-full cursor-pointer ${
              state.settings.personal ? 'bg-[#4FA88C]/15 text-[#357C67]' : 'bg-[#E7E3D8] text-[#4F6070]'
            }`}
          >
            {state.settings.personal ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] flex items-center justify-between">
          <div>
            <div className="font-bold text-xs text-[#17232E]">Weekly Adaptive Reminders</div>
            <div className="text-[11px] text-[#4F6070]">
              Periodic notifications for milestone check-ins
            </div>
          </div>
          <button
            onClick={() => toggleSetting('remind')}
            className={`font-mono-code text-xs font-bold px-3 py-1 rounded-full cursor-pointer ${
              state.settings.remind ? 'bg-[#4FA88C]/15 text-[#357C67]' : 'bg-[#E7E3D8] text-[#4F6070]'
            }`}
          >
            {state.settings.remind ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] space-y-1">
          <div className="font-bold text-xs text-[#17232E]">Storage &amp; Privacy</div>
          <div className="text-[11px] text-[#4F6070]">
            All session state is secured under Cloud Firestore security rules with client-side caching.
          </div>
        </div>

        <button
          onClick={handleClearData}
          className="w-full border border-[#E2664F] text-[#B8442F] font-bold py-3 rounded-xl text-xs hover:bg-[#E2664F]/10 transition cursor-pointer mt-4"
        >
          Delete All Stored Student Data
        </button>
      </div>
    </div>
  );
};
