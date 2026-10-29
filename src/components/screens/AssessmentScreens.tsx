import React, { useState } from 'react';
import {
  AppState,
  INTEREST_QUESTIONS,
  APTITUDE_QUESTIONS,
  PERSONALITY_QUESTIONS,
  ENVS_LIST,
  DIMS,
} from '../../types';
import {
  countAnswered,
  computeProfileSummary,
  detectStudentStrengths,
  getRankedCareers,
  getTargetCareerResult,
} from '../../services/careerEngine';
import { ArrowLeft, Check, Sparkles, CheckCircle2 } from 'lucide-react';

interface AssessmentScreenProps {
  state: AppState;
  onNavigate: (screen: string, arg?: string) => void;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  showToast: (msg: string) => void;
  quizSection?: 'interest' | 'aptitude' | 'personality';
  setQuizSection?: (sec: 'interest' | 'aptitude' | 'personality') => void;
  quizIndex?: number;
  setQuizIndex?: (idx: number) => void;
}

export const AssessmentScreen: React.FC<AssessmentScreenProps> = ({
  state,
  onNavigate,
  onUpdateState,
  showToast,
  setQuizSection,
  setQuizIndex,
}) => {
  const sections = [
    {
      id: 'interest' as const,
      title: '1. Career Interests',
      sub: 'RIASEC model mapping to work activities',
      total: INTEREST_QUESTIONS.length,
      done: countAnswered(state.ans.interest),
    },
    {
      id: 'aptitude' as const,
      title: '2. Aptitude & Reasoning',
      sub: 'Logical, numerical and problem solving check',
      total: APTITUDE_QUESTIONS.length,
      done: countAnswered(state.ans.aptitude),
    },
    {
      id: 'personality' as const,
      title: '3. Personality & Values',
      sub: 'Work styles, team dynamics and preferences',
      total: PERSONALITY_QUESTIONS.length,
      done: countAnswered(state.ans.personality),
    },
  ];

  const reflectionDone = Boolean(state.refl.text && state.refl.text.trim().length >= 3);
  const allCoreDone = sections.every((s) => s.done === s.total);

  const handleStartSection = (sec: 'interest' | 'aptitude' | 'personality') => {
    if (setQuizSection) setQuizSection(sec);
    if (setQuizIndex) setQuizIndex(Math.min(countAnswered(state.ans[sec]), sections.find(s=>s.id===sec)!.total - 1));
    onNavigate('quiz');
  };

  const handleResume = () => {
    const unfinished = sections.find((s) => s.done < s.total);
    if (unfinished) {
      handleStartSection(unfinished.id);
    } else {
      onNavigate('reflection');
    }
  };

  const handleReset = () => {
    if (window.confirm('Clear all assessment answers and retake?')) {
      onUpdateState((prev) => ({
        ...prev,
        ans: { interest: [], aptitude: [], personality: [] },
        refl: { text: '', conf: '', env: [] },
        assessed: false,
      }));
      showToast('Assessment reset');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      <div className="mb-4">
        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          MODULE 2 · ASSESSMENT
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          Understand your profile.
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          Four parts cover interest, aptitude, personality and self-reflection. Your progress is saved in Firestore.
        </p>
      </div>

      {/* Sections List */}
      <div className="space-y-3 mb-5">
        {sections.map((s) => {
          const isComplete = s.done === s.total;
          const pct = Math.round((s.done / s.total) * 100);

          return (
            <div
              key={s.id}
              onClick={() => handleStartSection(s.id)}
              className="bg-white hover:bg-white/90 p-4 rounded-2xl border border-[#E7E3D8] shadow-xs cursor-pointer transition active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="font-bold text-sm text-[#17232E]">{s.title}</div>
                <span
                  className={`font-mono-code text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isComplete
                      ? 'bg-[#4FA88C]/15 text-[#357C67]'
                      : s.done > 0
                      ? 'bg-[#E4A23C]/20 text-[#8A5A12]'
                      : 'bg-[#E7E3D8] text-[#4F6070]'
                  }`}
                >
                  {isComplete ? 'Done ✓' : `${s.done}/${s.total} Q`}
                </span>
              </div>
              <div className="text-xs text-[#4F6070] mb-2">{s.sub}</div>

              {/* Progress track */}
              <div className="w-full h-1.5 bg-[#E7E3D8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#4FA88C] to-[#357C67] transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* 4. Self Reflection Card */}
        <div
          onClick={() => onNavigate('reflection')}
          className="bg-white hover:bg-white/90 p-4 rounded-2xl border border-[#E7E3D8] shadow-xs cursor-pointer transition active:scale-[0.99] flex items-center justify-between"
        >
          <div>
            <div className="font-bold text-sm text-[#17232E]">4. Self-Reflection</div>
            <div className="text-xs text-[#4F6070]">Goals, confidence level &amp; work environment</div>
          </div>
          <span
            className={`font-mono-code text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              reflectionDone
                ? 'bg-[#4FA88C]/15 text-[#357C67]'
                : 'bg-[#E7E3D8] text-[#4F6070]'
            }`}
          >
            {reflectionDone ? 'Done ✓' : '4 Q'}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2 mt-auto">
        <button
          onClick={allCoreDone ? () => onNavigate('reflection') : handleResume}
          className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer"
        >
          {allCoreDone ? 'Continue to reflection →' : 'Resume assessment'}
        </button>

        {state.assessed && (
          <>
            <button
              onClick={() => onNavigate('results')}
              className="w-full bg-white hover:bg-[#E7E3D8] border border-[#122036] text-[#122036] font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
            >
              View My Results &amp; Strengths
            </button>

            <button
              onClick={handleReset}
              className="w-full border border-[#E2664F] text-[#B8442F] font-bold py-2.5 rounded-xl text-xs hover:bg-[#E2664F]/10 transition cursor-pointer"
            >
              Clear answers and retake
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const QuizScreen: React.FC<AssessmentScreenProps> = ({
  state,
  onNavigate,
  onUpdateState,
  showToast,
  quizSection = 'interest',
  setQuizSection,
  quizIndex = 0,
  setQuizIndex,
}) => {
  const questions =
    quizSection === 'interest'
      ? INTEREST_QUESTIONS
      : quizSection === 'aptitude'
      ? APTITUDE_QUESTIONS
      : PERSONALITY_QUESTIONS;

  const currentQ = questions[quizIndex];
  const totalQ = questions.length;
  const currentAnswer = state.ans[quizSection][quizIndex];

  const sectionMeta = {
    interest: {
      tag: 'ASSESSMENT · 1/4',
      title: 'Career Interests',
      why: 'Interest patterns identify roles that match what you naturally enjoy building and exploring.',
    },
    aptitude: {
      tag: 'ASSESSMENT · 2/4',
      title: 'Aptitude Check',
      why: 'Reasoning and quantitative questions assess your analytical baseline. Take your time.',
    },
    personality: {
      tag: 'ASSESSMENT · 3/4',
      title: 'Work Style & Values',
      why: 'Work-style dimensions prevent recommending roles that clash with your team or collaboration preferences.',
    },
  }[quizSection];

  const progressPercent = Math.round(((quizIndex + (currentAnswer !== null && currentAnswer !== undefined ? 1 : 0)) / totalQ) * 100);

  const handlePickOption = (optionIndex: number) => {
    onUpdateState((prev) => {
      const updatedArr = [...prev.ans[quizSection]];
      updatedArr[quizIndex] = optionIndex;
      return {
        ...prev,
        ans: {
          ...prev.ans,
          [quizSection]: updatedArr,
        },
      };
    });
  };

  const handlePrev = () => {
    if (quizIndex > 0 && setQuizIndex) {
      setQuizIndex(quizIndex - 1);
    } else {
      onNavigate('assessment');
    }
  };

  const handleNext = () => {
    if (currentAnswer === null || currentAnswer === undefined) return;

    if (quizIndex < totalQ - 1) {
      if (setQuizIndex) setQuizIndex(quizIndex + 1);
    } else {
      // Finished section
      showToast(`${sectionMeta.title} complete!`);
      const order: ('interest' | 'aptitude' | 'personality')[] = ['interest', 'aptitude', 'personality'];
      const nextSec = order[order.indexOf(quizSection) + 1];

      if (nextSec && setQuizSection && setQuizIndex) {
        setQuizSection(nextSec);
        setQuizIndex(Math.min(countAnswered(state.ans[nextSec]), questions.length - 1));
      } else {
        onNavigate('reflection');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      {/* Top Header */}
      <div className="mb-4">
        <button
          onClick={() => onNavigate('assessment')}
          className="w-9 h-9 rounded-full bg-[#E7E3D8] text-[#17232E] flex items-center justify-center mb-3 hover:bg-[#122036]/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          {sectionMeta.tag}
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          {sectionMeta.title}
        </h2>

        {/* Linear Progress Bar */}
        <div className="w-full h-1.5 bg-[#E7E3D8] rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-gradient-to-r from-[#4FA88C] to-[#357C67] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Count & Text */}
      <div className="font-mono-code text-[11px] text-[#4F6070] uppercase font-semibold mb-1">
        QUESTION {quizIndex + 1} / {totalQ}
      </div>

      <div className="font-display text-lg font-bold text-[#17232E] leading-snug mb-5">
        {currentQ[0]}
      </div>

      {/* Options List */}
      <div className="space-y-2.5 mb-6">
        {(quizSection === 'aptitude'
          ? (currentQ[1] as string[])
          : (currentQ[1] as [string, string][]).map((o) => o[0])
        ).map((optionText, optIdx) => {
          const isSelected = currentAnswer === optIdx;

          return (
            <button
              key={optIdx}
              onClick={() => handlePickOption(optIdx)}
              className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'border-[#357C67] bg-[#4FA88C]/15 font-bold text-[#17232E] shadow-xs'
                  : 'border-[#E7E3D8] bg-white text-[#17232E] hover:bg-white/80'
              }`}
            >
              <div className="flex items-center gap-2.5 leading-snug">
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                  isSelected ? 'border-[#357C67] bg-[#357C67] text-white' : 'border-[#4F6070]/40 text-transparent'
                }`}>
                  ✓
                </span>
                <span>{optionText}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Why We Ask Card */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E7E3D8] text-xs text-[#4F6070] mb-5">
        <span className="font-bold text-[#17232E] block mb-0.5">Why we ask</span>
        {sectionMeta.why}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 mt-auto">
        <button
          onClick={handlePrev}
          className="flex-1 bg-white hover:bg-[#E7E3D8] border border-[#122036] text-[#122036] font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          disabled={currentAnswer === null || currentAnswer === undefined}
          className="flex-1 bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-xs transition cursor-pointer disabled:opacity-40"
        >
          {quizIndex === totalQ - 1 ? 'Finish Section' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export const ReflectionScreen: React.FC<AssessmentScreenProps> = ({
  state,
  onNavigate,
  onUpdateState,
  showToast,
}) => {
  const [reflectionText, setReflectionText] = useState(state.refl.text || '');
  const [confidence, setConfidence] = useState(state.refl.conf || 'Moderate');
  const [environments, setEnvironments] = useState<string[]>(state.refl.env || ['Hybrid', 'Collaborative']);
  const [error, setError] = useState('');

  const handleToggleEnv = (env: string) => {
    setEnvironments((prev) =>
      prev.includes(env) ? prev.filter((e) => e !== env) : [...prev, env]
    );
  };

  const handleGenerate = () => {
    setError('');

    const interestDone = countAnswered(state.ans.interest);
    const aptDone = countAnswered(state.ans.aptitude);
    const persDone = countAnswered(state.ans.personality);

    if (
      interestDone < INTEREST_QUESTIONS.length ||
      aptDone < APTITUDE_QUESTIONS.length ||
      persDone < PERSONALITY_QUESTIONS.length
    ) {
      setError('Please finish all 3 assessment sections first.');
      return;
    }

    if (reflectionText.trim().length < 3) {
      setError('Please write a short reflection on your goals.');
      return;
    }

    onUpdateState((prev) => ({
      ...prev,
      refl: {
        text: reflectionText.trim(),
        conf: confidence,
        env: environments,
      },
      assessed: true,
    }));

    showToast('Assessment profile generated & saved!');
    onNavigate('results');
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      <div className="mb-4">
        <button
          onClick={() => onNavigate('assessment')}
          className="w-9 h-9 rounded-full bg-[#E7E3D8] text-[#17232E] flex items-center justify-center mb-3 hover:bg-[#122036]/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          ASSESSMENT · 4/4
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          A little reflection.
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          Grounding recommendations with your subjective vision and working preferences.
        </p>
      </div>

      <div className="space-y-4 mb-5">
        <div>
          <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1.5 font-semibold">
            What would make you proud one year from now?
          </label>
          <textarea
            rows={4}
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="e.g. Build an impressive open-source mobile app with Firestore and secure a competitive engineering internship..."
            className="w-full p-3.5 bg-white border border-[#E7E3D8] rounded-xl text-xs leading-relaxed focus:outline-none focus:border-[#4FA88C]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1.5 font-semibold">
            Confidence in your current career direction
          </label>
          <div className="flex gap-2">
            {[
              { label: 'Low', color: 'coral' },
              { label: 'Moderate', color: 'gold' },
              { label: 'High', color: 'mint' },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => setConfidence(c.label)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono-code font-bold transition cursor-pointer ${
                  confidence === c.label
                    ? 'bg-[#122036] text-[#EFEDE4] ring-2 ring-[#122036]'
                    : 'bg-white text-[#17232E] border border-[#E7E3D8]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1.5 font-semibold">
            Preferred working environment
          </label>
          <div className="flex flex-wrap gap-2">
            {ENVS_LIST.map((env) => {
              const active = environments.includes(env);
              return (
                <button
                  key={env}
                  type="button"
                  onClick={() => handleToggleEnv(env)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-[#122036] text-[#EFEDE4]'
                      : 'bg-white text-[#17232E] border border-[#E7E3D8]'
                  }`}
                >
                  {env}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="text-xs text-[#B8442F] font-semibold bg-[#E2664F]/10 p-2.5 rounded-lg border border-[#E2664F]/20">
            {error}
          </div>
        )}
      </div>

      <button
        onClick={handleGenerate}
        className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer mt-auto"
      >
        Generate my profile →
      </button>
    </div>
  );
};

export const ResultsScreen: React.FC<AssessmentScreenProps> = ({ state, onNavigate }) => {
  const p = computeProfileSummary(state);
  const ranked = getRankedCareers(state);
  const top = ranked[0];
  const target = getTargetCareerResult(state);
  const strengths = detectStudentStrengths(state);
  const missingDev = target.missing.slice(0, 3);

  const topInterestPattern = Object.entries(p.interestVec)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((e) => DIMS[e[0]])
    .join(' · ');

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      <div className="mb-4">
        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          MODULE 3 · PROFILE INSIGHTS
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          Your career profile.
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          A multi-factor view of strengths, interests and preferences.
        </p>
      </div>

      <div className="space-y-3.5 mb-5">
        {/* Top Pattern Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs">
          <div className="font-mono-code text-[11px] uppercase text-[#4F6070] font-bold">
            Dominant RIASEC Pattern
          </div>
          <div className="font-display text-lg font-bold text-[#17232E] mt-0.5">
            {topInterestPattern || 'Build · Analyse · Create'}
          </div>
        </div>

        {/* Dimension Scores Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs space-y-3">
          <div className="font-bold text-sm text-[#17232E]">Dimension Scores</div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Interest Alignment</span>
              <span className="font-mono-code text-[#4F6070]">{top.iFit}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E7E3D8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4FA88C]"
                style={{ width: `${top.iFit}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Aptitude Benchmark ({p.correctCount}/{p.totalAptitudeQ} correct)</span>
              <span className="font-mono-code text-[#4F6070]">
                {Math.round(p.aptitudeRatio * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#E7E3D8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E4A23C]"
                style={{ width: `${Math.round(p.aptitudeRatio * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Work-Style Fit</span>
              <span className="font-mono-code text-[#4F6070]">{top.sFit}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E7E3D8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4FA88C]"
                style={{ width: `${top.sFit}%` }}
              />
            </div>
          </div>
        </div>

        {/* Strengths Detected */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs">
          <div className="font-bold text-sm text-[#17232E] mb-2">Detected Strengths</div>
          <div className="flex flex-wrap gap-2">
            {strengths.map(([st, color]) => (
              <span
                key={st}
                className={`font-mono-code text-xs font-bold px-2.5 py-1 rounded-full ${
                  color === 'mint'
                    ? 'bg-[#4FA88C]/15 text-[#357C67]'
                    : 'bg-[#E4A23C]/20 text-[#8A5A12]'
                }`}
              >
                ✦ {st}
              </span>
            ))}
          </div>
        </div>

        {/* Areas to develop */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs">
          <div className="font-bold text-sm text-[#17232E] mb-1">Areas to Develop</div>
          <p className="text-xs text-[#4F6070] leading-relaxed">
            {missingDev.length > 0
              ? `Prioritize mastering ${missingDev.join(', ')} to maximize placement readiness for ${top.c.name}.`
              : `You already hold the core technical competencies required for ${top.c.name}.`}
          </p>
        </div>
      </div>

      <button
        onClick={() => onNavigate('recommendations')}
        className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer mt-auto"
      >
        See explainable recommendations →
      </button>
    </div>
  );
};
