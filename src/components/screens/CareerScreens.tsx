import React, { useState, useEffect } from 'react';
import { AppState, CareerModel, CareerScoreResult, CAREERS_DATA } from '../../types';
import {
  getRankedCareers,
  scoreSingleCareer,
  generateWhyText,
} from '../../services/careerEngine';
import { fetchAiCareerInsights } from '../../services/api';
import { ArrowLeft, Sparkles, Check, ExternalLink, ChevronRight } from 'lucide-react';

interface CareerScreenProps {
  state: AppState;
  onNavigate: (screen: string, arg?: string) => void;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  showToast: (msg: string) => void;
  selectedCareerId?: string;
  setSelectedCareerId?: (id: string) => void;
}

export const RecommendationsScreen: React.FC<CareerScreenProps> = ({
  state,
  onNavigate,
  onUpdateState,
  showToast,
  setSelectedCareerId,
}) => {
  if (!state.assessed) {
    return (
      <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC]">
        <div className="mb-4">
          <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
            MODULE 4 · RECOMMENDATIONS
          </div>
          <h2 className="font-display text-2xl font-bold text-[#17232E]">
            Careers that fit you.
          </h2>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E7E3D8] text-center my-auto space-y-3">
          <div className="text-3xl">🔒</div>
          <div className="font-bold text-sm text-[#17232E]">
            Complete the assessment first
          </div>
          <p className="text-xs text-[#4F6070] leading-relaxed">
            Your recommendations are computed from your RIASEC interests, analytical reasoning, and work styles. It takes about 5 minutes.
          </p>
          <button
            onClick={() => onNavigate('assessment')}
            className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
          >
            Start assessment →
          </button>
        </div>
      </div>
    );
  }

  const ranked = getRankedCareers(state);

  const handleExplore = (careerId: string) => {
    if (setSelectedCareerId) setSelectedCareerId(careerId);
    onNavigate('career', careerId);
  };

  const handleExplain = (careerId: string) => {
    if (setSelectedCareerId) setSelectedCareerId(careerId);
    onNavigate('explain', careerId);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      <div className="mb-4">
        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          MODULE 4 · RECOMMENDATIONS
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          Careers that fit you.
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          Matches combine your profile, skills, goals and target-career requirements.
        </p>
      </div>

      <div className="space-y-3 mb-5">
        {ranked.map((x, idx) => {
          const fitLabel =
            idx === 0
              ? 'Best fit'
              : x.total >= 75
              ? 'Strong fit'
              : x.total >= 60
              ? 'Good fit'
              : 'Stretch';

          const fitColor =
            idx === 0 || x.total >= 75
              ? 'bg-[#4FA88C]/15 text-[#357C67]'
              : x.total >= 60
              ? 'bg-[#E4A23C]/20 text-[#8A5A12]'
              : 'bg-[#E7E3D8] text-[#4F6070]';

          const isCurrentTarget = state.target === x.c.id;

          return (
            <div
              key={x.c.id}
              className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{x.c.icon}</span>
                  <span className="font-bold text-sm text-[#17232E]">
                    {x.c.name}
                  </span>
                </div>
                <span className="font-mono-code text-base font-bold text-[#122036]">
                  {x.total}%
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className={`font-mono-code text-[10px] font-bold px-2 py-0.5 rounded-full ${fitColor}`}>
                  {fitLabel}
                </span>
                {isCurrentTarget && (
                  <span className="font-mono-code text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4A23C]/25 text-[#8A5A12]">
                    ★ Your Pathway
                  </span>
                )}
              </div>

              <div className="text-xs text-[#4F6070] leading-relaxed mb-3">
                <span className="font-semibold text-[#17232E]">Why: </span>
                {generateWhyText(x)}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExplore(x.c.id)}
                  className="flex-1 bg-white hover:bg-[#E7E3D8] border border-[#122036] text-[#122036] font-bold py-2 px-3 rounded-xl text-xs transition cursor-pointer"
                >
                  Explore
                </button>
                <button
                  onClick={() => handleExplain(x.c.id)}
                  className="flex-1 bg-white hover:bg-[#E7E3D8] border border-[#122036] text-[#122036] font-bold py-2 px-3 rounded-xl text-xs transition cursor-pointer"
                >
                  Explain Score
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onNavigate('compare')}
        className="w-full bg-white hover:bg-[#E7E3D8] border border-[#122036] text-[#122036] font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer mt-auto"
      >
        Compare careers side by side
      </button>
    </div>
  );
};

export const CareerDetailScreen: React.FC<CareerScreenProps> = ({
  state,
  onNavigate,
  onUpdateState,
  showToast,
  selectedCareerId = 'swe',
}) => {
  const career = CAREERS_DATA.find((c) => c.id === selectedCareerId) || CAREERS_DATA[0];
  const scoreRes = scoreSingleCareer(career, state);
  const isTarget = state.target === career.id;

  const [aiInsights, setAiInsights] = useState<{
    personalizedWhy?: string;
    suggestedProjects?: string[];
    learningStrategy?: string;
  } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (state.user) {
      setLoadingAi(true);
      fetchAiCareerInsights(scoreRes, state.user).then((res) => {
        setAiInsights(res);
        setLoadingAi(false);
      });
    }
  }, [career.id]);

  const handleSelectTarget = () => {
    onUpdateState((prev) => ({
      ...prev,
      target: career.id,
    }));
    showToast(`Pathway set to ${career.name}!`);
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
          CAREER DETAIL
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E] flex items-center gap-2">
          <span>{career.icon}</span> {career.name}
        </h2>
        <p className="text-xs text-[#4F6070] mt-1 leading-relaxed">
          {career.desc}
        </p>
      </div>

      <div className="space-y-3.5 mb-5">
        {/* Match Percentage Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-sm text-[#17232E]">Your Match</span>
            <span className="font-mono-code text-lg font-bold text-[#E4A23C]">
              {scoreRes.total}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#E7E3D8] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4FA88C] to-[#E4A23C]"
              style={{ width: `${scoreRes.total}%` }}
            />
          </div>
        </div>

        {/* Required Skills Matrix */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs">
          <div className="font-bold text-sm text-[#17232E] mb-2">Required Skills</div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {career.skills.map((s) => {
              const have = Boolean(state.user?.skills?.includes(s));
              return (
                <span
                  key={s}
                  className={`font-mono-code text-xs font-bold px-2.5 py-1 rounded-full ${
                    have
                      ? 'bg-[#4FA88C]/15 text-[#357C67]'
                      : 'bg-[#E4A23C]/20 text-[#8A5A12]'
                  }`}
                >
                  {have ? '✓ ' : '○ '}
                  {s}
                </span>
              );
            })}
          </div>
          <div className="text-[11px] text-[#4F6070]">
            <span className="text-[#357C67] font-bold">Green</span> = You already hold. <span className="text-[#8A5A12] font-bold">Gold</span> = To develop in roadmap.
          </div>
        </div>

        {/* AI Career Insights Card */}
        <div className="bg-gradient-to-br from-[#122036] to-[#1B3153] text-[#EFEDE4] p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono-code font-bold text-[#E4A23C]">
            <Sparkles className="w-3.5 h-3.5 text-[#E4A23C]" />
            AI Career Strategist Analysis (Gemini 3.8 Flash)
          </div>

          <p className="text-xs text-[#EFEDE4] leading-relaxed">
            {aiInsights?.personalizedWhy || generateWhyText(scoreRes)}
          </p>

          {aiInsights?.suggestedProjects && (
            <div className="pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono-code text-[#4FA88C] block mb-1 font-bold">
                Suggested Resume Projects:
              </span>
              <ul className="text-xs text-[#A9B7C6] list-disc list-inside space-y-0.5">
                {aiInsights.suggestedProjects.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Labour Market Context */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs">
          <div className="font-bold text-sm text-[#17232E] mb-2">Labour-Market Context</div>
          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div className="bg-[#F4F2EC] p-2.5 rounded-xl">
              <div className="text-[10px] font-mono-code text-[#4F6070] uppercase">Salary Benchmark</div>
              <div className="font-bold text-[#17232E] mt-0.5">{career.averageSalary}</div>
            </div>
            <div className="bg-[#F4F2EC] p-2.5 rounded-xl">
              <div className="text-[10px] font-mono-code text-[#4F6070] uppercase">10-Year Growth</div>
              <div className="font-bold text-[#357C67] mt-0.5">{career.growthOutlook}</div>
            </div>
          </div>
          <span className="font-mono-code text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4A23C]/20 text-[#8A5A12]">
            Verified Industry Standards
          </span>
        </div>
      </div>

      <div className="space-y-2 mt-auto">
        <button
          onClick={handleSelectTarget}
          className={`w-full font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer ${
            isTarget
              ? 'bg-[#357C67] text-white'
              : 'bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4]'
          }`}
        >
          {isTarget ? '✓ Your Chosen Pathway' : 'Choose This Pathway'}
        </button>

        <button
          onClick={() => onNavigate('gap')}
          className="w-full bg-white hover:bg-[#E7E3D8] border border-[#122036] text-[#122036] font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
        >
          See My Skill Gap →
        </button>
      </div>
    </div>
  );
};

export const ExplainScoreScreen: React.FC<CareerScreenProps> = ({
  state,
  onNavigate,
  selectedCareerId = 'swe',
}) => {
  const career = CAREERS_DATA.find((c) => c.id === selectedCareerId) || CAREERS_DATA[0];
  const x = scoreSingleCareer(career, state);

  const breakdownRows = [
    { label: 'Interest Alignment (RIASEC)', weight: '30%', score: x.iFit },
    { label: 'Aptitude Benchmark vs Requirement', weight: '20%', score: x.aFit },
    { label: 'Work-Style & Team Dynamic Fit', weight: '15%', score: x.sFit },
    { label: 'Verified Technical Skills Held', weight: '20%', score: x.kFit },
    { label: 'Self-Stated Career Aspiration Fit', weight: '15%', score: x.gFit },
  ];

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
          EXPLAINABLE SCORE BREAKDOWN
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          {career.name} · {x.total}%
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          Every score is calculated mathematically from these components, so nothing is a black box.
        </p>
      </div>

      <div className="space-y-3.5 mb-5">
        {/* Component Bars Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs space-y-3">
          {breakdownRows.map((row) => (
            <div key={row.label}>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#17232E]">
                  {row.label} <span className="text-[#4F6070] font-normal font-mono-code">({row.weight})</span>
                </span>
                <span className="font-mono-code text-[#122036] font-bold">{row.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#E7E3D8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4FA88C]"
                  style={{ width: `${row.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Skills held vs skills to build */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs space-y-3">
          <div>
            <div className="font-bold text-xs text-[#17232E] mb-1.5">Skills You Already Have</div>
            <div className="flex flex-wrap gap-1.5">
              {x.have.length > 0 ? (
                x.have.map((s) => (
                  <span
                    key={s}
                    className="font-mono-code text-xs font-bold px-2.5 py-1 rounded-full bg-[#4FA88C]/15 text-[#357C67]"
                  >
                    ✓ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#4F6070]">No matched skills yet.</span>
              )}
            </div>
          </div>

          <div>
            <div className="font-bold text-xs text-[#17232E] mb-1.5">Skills to Build in Roadmap</div>
            <div className="flex flex-wrap gap-1.5">
              {x.missing.length > 0 ? (
                x.missing.map((s) => (
                  <span
                    key={s}
                    className="font-mono-code text-xs font-bold px-2.5 py-1 rounded-full bg-[#E4A23C]/20 text-[#8A5A12]"
                  >
                    ○ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#357C67] font-semibold">
                  None! You currently hold every core skill.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onNavigate('career', career.id)}
        className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer mt-auto"
      >
        Explore This Career Pathway →
      </button>
    </div>
  );
};
