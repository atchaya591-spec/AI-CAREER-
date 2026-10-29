import React, { useState } from 'react';
import { AppState, INTERESTS_LIST, SKILLS_LIST, CAREERS_DATA } from '../../types';
import {
  getRankedCareers,
  getTargetCareerResult,
  getSkillGaps,
  getRoadmapCompletionPercentage,
  countAnswered,
} from '../../services/careerEngine';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Compass,
  Hammer,
  TrendingUp,
  Settings,
  BookOpen,
  LogOut,
  Plus,
  Check,
} from 'lucide-react';

interface ScreenProps {
  state: AppState;
  onNavigate: (screen: string, arg?: string) => void;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  showToast: (msg: string) => void;
}

export const DashboardScreen: React.FC<ScreenProps> = ({ state, onNavigate }) => {
  const firstName = state.user?.name ? state.user.name.trim().split(/\s+/)[0] : 'Scholar';
  const ranked = getRankedCareers(state);
  const topMatch = ranked[0];
  const target = getTargetCareerResult(state);
  const priorityGaps = state.assessed ? getSkillGaps(target, state).length : '–';
  const roadmapPct = getRoadmapCompletionPercentage(state);

  // Compute what the next best action is
  const totalAns =
    countAnswered(state.ans.interest) +
    countAnswered(state.ans.aptitude) +
    countAnswered(state.ans.personality);

  let nextAction = {
    screen: 'profile',
    title: 'Finish your profile',
    sub: 'Add your current degree, skills and interests',
  };

  if (!state.user || (state.user.skills && state.user.skills.length === 0)) {
    nextAction = {
      screen: 'profile',
      title: 'Setup student skills',
      sub: 'Select existing technical skills in your profile',
    };
  } else if (!state.assessed) {
    nextAction = {
      screen: 'assessment',
      title: 'Complete your assessment',
      sub: `${totalAns} of 24 questions answered so far`,
    };
  } else {
    const gaps = getSkillGaps(target, state);
    const firstGap = gaps[0]?.skill || 'Portfolio Project';
    nextAction = {
      screen: 'learning',
      title: 'Continue your learning plan',
      sub: `Next priority skill: ${firstGap}`,
    };
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F4F2EC]">
      {/* Hero Header */}
      <div className="bg-[#122036] text-[#EFEDE4] px-6 pt-7 pb-6 rounded-b-[28px] shadow-sm">
        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#A9B7C6] font-semibold">
          YOUR DASHBOARD
        </div>
        <div className="font-display text-2xl font-bold mt-1 text-white flex items-center justify-between">
          <span>Hello, {firstName} 👋</span>
          <span className="text-xs font-mono-code font-normal text-[#E4A23C] bg-white/10 px-2.5 py-1 rounded-full">
            {state.user?.aspiration || 'Career Explorer'}
          </span>
        </div>
        <p className="text-xs text-[#A9B7C6] mt-1">Your next best step is ready.</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2.5 mt-4">
          <div className="bg-white/10 rounded-xl p-3 border border-white/5">
            <div className="font-mono-code text-xl font-bold text-[#E4A23C]">
              {state.assessed ? `${topMatch.total}%` : '–'}
            </div>
            <div className="text-[11px] text-[#A9B7C6] mt-0.5">Top match</div>
          </div>

          <div className="bg-white/10 rounded-xl p-3 border border-white/5">
            <div className="font-mono-code text-xl font-bold text-[#4FA88C]">
              {roadmapPct}%
            </div>
            <div className="text-[11px] text-[#A9B7C6] mt-0.5">Roadmap</div>
          </div>

          <div className="bg-white/10 rounded-xl p-3 border border-white/5">
            <div className="font-mono-code text-xl font-bold text-white">
              {priorityGaps}
            </div>
            <div className="text-[11px] text-[#A9B7C6] mt-0.5">Priority gaps</div>
          </div>
        </div>
      </div>

      {/* Main Action Cards */}
      <div className="p-5 space-y-3">
        <div className="font-display text-lg font-bold text-[#17232E]">
          Continue your journey
        </div>

        {/* Dynamic Next Step Card */}
        <div
          onClick={() => onNavigate(nextAction.screen)}
          className="bg-white hover:bg-white/90 p-4 rounded-2xl border border-[#E7E3D8] shadow-xs cursor-pointer transition active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-[#17232E] flex items-center gap-1.5">
                <span>⭐</span> {nextAction.title}
              </div>
              <div className="text-xs text-[#4F6070] mt-1">{nextAction.sub}</div>
            </div>
            <span className="font-mono-code text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E4A23C]/20 text-[#8A5A12]">
              Next ›
            </span>
          </div>
        </div>

        {/* 1. Assessment Card */}
        <div
          onClick={() => onNavigate('assessment')}
          className="bg-white hover:bg-white/90 p-4 rounded-2xl border border-[#E7E3D8] shadow-xs cursor-pointer transition active:scale-[0.99] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4FA88C]/15 text-[#357C67] flex items-center justify-center font-bold">
              🧠
            </div>
            <div>
              <div className="font-bold text-sm text-[#17232E]">Career Assessment</div>
              <div className="text-xs text-[#4F6070]">Interests, Aptitude, Values, Reflection</div>
            </div>
          </div>
          <span
            className={`font-mono-code text-[11px] font-bold px-2.5 py-1 rounded-full ${
              state.assessed
                ? 'bg-[#4FA88C]/15 text-[#357C67]'
                : 'bg-[#E4A23C]/20 text-[#8A5A12]'
            }`}
          >
            {state.assessed ? 'Done ✓' : `${totalAns}/24 Q`}
          </span>
        </div>

        {/* 2. Recommendations Card */}
        <div
          onClick={() => onNavigate('recommendations')}
          className="bg-white hover:bg-white/90 p-4 rounded-2xl border border-[#E7E3D8] shadow-xs cursor-pointer transition active:scale-[0.99] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E4A23C]/15 text-[#C0812A] flex items-center justify-center font-bold">
              🎯
            </div>
            <div>
              <div className="font-bold text-sm text-[#17232E]">View Recommendations</div>
              <div className="text-xs text-[#4F6070]">
                {state.assessed ? `Top: ${topMatch.c.name}` : 'Calculated from assessment'}
              </div>
            </div>
          </div>
          <span
            className={`font-mono-code text-[11px] font-bold px-2.5 py-1 rounded-full ${
              state.assessed
                ? 'bg-[#E4A23C]/20 text-[#8A5A12]'
                : 'bg-[#E7E3D8] text-[#4F6070]'
            }`}
          >
            {state.assessed ? `${topMatch.total}%` : 'Locked'}
          </span>
        </div>

        {/* 3. Skill Gap Card */}
        <div
          onClick={() => onNavigate('gap')}
          className="bg-white hover:bg-white/90 p-4 rounded-2xl border border-[#E7E3D8] shadow-xs cursor-pointer transition active:scale-[0.99] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E2664F]/15 text-[#B8442F] flex items-center justify-center font-bold">
              🛠
            </div>
            <div>
              <div className="font-bold text-sm text-[#17232E]">Close Skill Gaps</div>
              <div className="text-xs text-[#4F6070]">
                Compare your current skills with {target.c.name}
              </div>
            </div>
          </div>
          <span className="font-mono-code text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E2664F]/15 text-[#B8442F]">
            {priorityGaps} Gaps
          </span>
        </div>

        {/* 4. Adaptive Check-in Card */}
        <div
          onClick={() => onNavigate('progress')}
          className="bg-white hover:bg-white/90 p-4 rounded-2xl border border-[#E7E3D8] shadow-xs cursor-pointer transition active:scale-[0.99] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4FA88C]/15 text-[#357C67] flex items-center justify-center font-bold">
              📈
            </div>
            <div>
              <div className="font-bold text-sm text-[#17232E]">Weekly Adaptive Check-in</div>
              <div className="text-xs text-[#4F6070]">Report confidence &amp; adjust roadmap</div>
            </div>
          </div>
          <span className="font-mono-code text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#4FA88C]/15 text-[#357C67]">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};

export const ProfileScreen: React.FC<ScreenProps> = ({ state, onNavigate, onUpdateState, showToast }) => {
  const user = state.user;
  const initialChar = (user?.name ? user.name[0] : 'S').toUpperCase();

  const [edu, setEdu] = useState(user?.edu || 'B.Tech / B.E. Computer Science');
  const [year, setYear] = useState(user?.year || '2nd Year');
  const [department, setDepartment] = useState(user?.department || 'Information Technology');
  const [aspiration, setAspiration] = useState(user?.aspiration || 'Software Engineer');
  const [customSkill, setCustomSkill] = useState('');

  const currentInterests = user?.interests || [];
  const currentSkills = user?.skills || [];

  const handleToggleInterest = (item: string) => {
    const updated = currentInterests.includes(item)
      ? currentInterests.filter((x) => x !== item)
      : [...currentInterests, item];

    onUpdateState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, interests: updated } : null,
    }));
  };

  const handleToggleSkill = (skill: string) => {
    const updated = currentSkills.includes(skill)
      ? currentSkills.filter((x) => x !== skill)
      : [...currentSkills, skill];

    onUpdateState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, skills: updated } : null,
    }));
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (!trimmed) {
      showToast('Type a skill name first');
      return;
    }
    if (!currentSkills.includes(trimmed)) {
      onUpdateState((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, skills: [...(prev.user.skills || []), trimmed] } : null,
      }));
      setCustomSkill('');
      showToast(`Added ${trimmed}`);
    }
  };

  const handleSaveProfile = () => {
    onUpdateState((prev) => ({
      ...prev,
      user: prev.user
        ? {
            ...prev.user,
            edu,
            year,
            department,
            aspiration,
          }
        : null,
    }));
    showToast('Student profile synced to Firestore!');
  };

  const handleLogout = () => {
    onUpdateState((prev) => ({
      ...prev,
      user: null,
    }));
    showToast('Signed out of session');
    onNavigate('splash');
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      <div className="mb-4">
        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          MODULE 1 · STUDENT PROFILE
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          Tell us about you.
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          A richer profile closes the gap between generic tests and personalized guidance.
        </p>
      </div>

      {/* Profile Header Avatar */}
      <div className="flex items-center gap-3.5 mb-5 bg-white p-3.5 rounded-2xl border border-[#E7E3D8]">
        <div className="w-13 h-13 rounded-full bg-gradient-to-br from-[#4FA88C] to-[#357C67] flex items-center justify-center text-white font-display text-xl font-bold shadow-xs">
          {initialChar}
        </div>
        <div>
          <div className="font-bold text-sm text-[#17232E]">{user?.name || 'Student Scholar'}</div>
          <div className="text-xs text-[#4F6070] font-mono-code">{user?.email || 'student@university.edu'}</div>
          <span className="inline-block mt-1 text-[10px] font-mono-code font-bold bg-[#4FA88C]/15 text-[#357C67] px-2 py-0.5 rounded-full">
            Firestore UID: {user?.email ? user.email.split('@')[0] : 'local-user'}
          </span>
        </div>
      </div>

      {/* Academic Fields */}
      <div className="space-y-3.5">
        <div>
          <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1 font-semibold">
            Degree / Education
          </label>
          <input
            type="text"
            value={edu}
            onChange={(e) => setEdu(e.target.value)}
            placeholder="e.g. B.E. / B.Tech Computer Science"
            className="w-full px-4 py-2.5 bg-white border border-[#E7E3D8] rounded-xl text-sm focus:outline-none focus:border-[#4FA88C]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1 font-semibold">
              Year / Stage
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 2nd Year"
              className="w-full px-4 py-2.5 bg-white border border-[#E7E3D8] rounded-xl text-sm focus:outline-none focus:border-[#4FA88C]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1 font-semibold">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. CS / IT / AI"
              className="w-full px-4 py-2.5 bg-white border border-[#E7E3D8] rounded-xl text-sm focus:outline-none focus:border-[#4FA88C]"
            />
          </div>
        </div>

        {/* Interests Selector */}
        <div>
          <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1.5 font-semibold">
            Interests (tap to select)
          </label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS_LIST.map((interest) => {
              const active = currentInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleToggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-[#122036] text-[#EFEDE4]'
                      : 'bg-white text-[#17232E] border border-[#E7E3D8] hover:bg-[#E7E3D8]'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Technical Skills Selector */}
        <div>
          <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1.5 font-semibold">
            Current Skills (tap to select)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {Array.from(new Set([...SKILLS_LIST, ...currentSkills])).map((skill) => {
              const active = currentSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleToggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-[#122036] text-[#EFEDE4]'
                      : 'bg-white text-[#17232E] border border-[#E7E3D8] hover:bg-[#E7E3D8]'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>

          {/* Add custom skill input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="Add another skill (e.g. Flutter, Kotlin)..."
              className="flex-1 px-4 py-2 bg-white border border-[#E7E3D8] rounded-xl text-xs focus:outline-none focus:border-[#4FA88C]"
            />
            <button
              type="button"
              onClick={handleAddCustomSkill}
              className="bg-[#E4A23C] hover:bg-[#C0812A] text-[#122036] text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Career Aspiration */}
        <div>
          <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1 font-semibold">
            Career Aspiration / Target Goal
          </label>
          <select
            value={aspiration}
            onChange={(e) => setAspiration(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-[#E7E3D8] rounded-xl text-sm focus:outline-none focus:border-[#4FA88C]"
          >
            <option>Not sure yet</option>
            {CAREERS_DATA.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveProfile}
          className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer shadow-sm"
        >
          Save Profile &amp; Sync
        </button>

        {/* Assessment shortcut */}
        <button
          onClick={() => onNavigate('assessment')}
          className="w-full bg-white hover:bg-[#E7E3D8] border border-[#122036] text-[#122036] font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
        >
          {state.assessed ? 'Retake 3-Part Assessment' : 'Start Full Assessment →'}
        </button>

        {/* Extra Modules & Settings */}
        <div className="pt-3 border-t border-[#E7E3D8] space-y-2">
          <div className="font-mono-code text-[11px] text-[#4F6070] uppercase font-bold">
            Project &amp; Research Modules
          </div>

          <a
            href="/api/download/android-project.zip"
            download="AI_Career_Guidance_Android_Project.zip"
            className="bg-[#E4A23C]/15 hover:bg-[#E4A23C]/25 border border-[#E4A23C]/40 p-3 rounded-xl flex items-center justify-between text-xs cursor-pointer text-[#8A5A12] transition block"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">📦</span>
              <span className="font-bold text-[#122036]">Download Android Studio Project (.ZIP)</span>
            </div>
            <span className="font-mono-code font-bold text-[10px] bg-[#E4A23C] text-[#122036] px-2 py-0.5 rounded-md">ZIP ⬇</span>
          </a>

          <a
            href="/api/download/full-system.zip"
            download="AI_Career_Guidance_Full_System.zip"
            className="bg-white p-3 rounded-xl border border-[#E7E3D8] flex items-center justify-between text-xs cursor-pointer hover:bg-[#E7E3D8] text-[#17232E] block"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">💾</span>
              <span className="font-semibold text-[#17232E]">Download Complete Source Code (.ZIP)</span>
            </div>
            <span className="font-mono-code text-[10px] text-[#4F6070]">Full Zip ›</span>
          </a>

          <div
            onClick={() => onNavigate('admin')}
            className="bg-white p-3 rounded-xl border border-[#E7E3D8] flex items-center justify-between text-xs cursor-pointer hover:bg-[#E7E3D8]"
          >
            <span className="font-semibold text-[#17232E]">📋 Admin Dashboard (Cohort Analytics)</span>
            <span>›</span>
          </div>

          <div
            onClick={() => onNavigate('surveygap')}
            className="bg-white p-3 rounded-xl border border-[#E7E3D8] flex items-center justify-between text-xs cursor-pointer hover:bg-[#E7E3D8]"
          >
            <span className="font-semibold text-[#17232E]">📚 Literature Gap Mapping Matrix</span>
            <span>›</span>
          </div>

          <div
            onClick={() => onNavigate('settings')}
            className="bg-white p-3 rounded-xl border border-[#E7E3D8] flex items-center justify-between text-xs cursor-pointer hover:bg-[#E7E3D8]"
          >
            <span className="font-semibold text-[#17232E]">⚙️ Privacy &amp; Notification Settings</span>
            <span>›</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full border border-[#E2664F] text-[#B8442F] font-bold py-2.5 rounded-xl text-xs hover:bg-[#E2664F]/10 transition cursor-pointer mt-2"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
