import React, { useState } from 'react';
import { AppState, CareerModel } from '../../types';
import {
  getTargetCareerResult,
  getSkillGaps,
  getSkillLevel,
  getRoadmapStages,
  getRoadmapCompletionPercentage,
} from '../../services/careerEngine';
import { ArrowLeft, Check, Sparkles, BookOpen, Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface RoadmapScreenProps {
  state: AppState;
  onNavigate: (screen: string, arg?: string) => void;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  showToast: (msg: string) => void;
}

export const SkillGapScreen: React.FC<RoadmapScreenProps> = ({
  state,
  onNavigate,
  onUpdateState,
}) => {
  if (!state.assessed) {
    return (
      <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC]">
        <div className="mb-4">
          <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
            MODULE 5 · SKILL GAP
          </div>
          <h2 className="font-display text-2xl font-bold text-[#17232E]">
            What to learn next.
          </h2>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E7E3D8] text-center my-auto space-y-3">
          <div className="text-3xl">🛠️</div>
          <div className="font-bold text-sm text-[#17232E]">
            Complete your assessment first
          </div>
          <p className="text-xs text-[#4F6070]">
            Skill gaps are computed against your recommended or chosen career pathway.
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

  const target = getTargetCareerResult(state);

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      <div className="mb-4">
        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          MODULE 5 · SKILL GAP ANALYSIS
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          What to learn next.
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          Your verified skills compared against <span className="font-bold text-[#17232E]">{target.c.name}</span>.
        </p>
      </div>

      <div className="space-y-3 mb-5">
        {target.c.skills.map((skillName, idx) => {
          const level = getSkillLevel(skillName, state);
          const isStrong = level >= 70;

          return (
            <div
              key={skillName}
              className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs"
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-sm text-[#17232E]">{skillName}</span>
                <span
                  className={`font-mono-code text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isStrong
                      ? 'bg-[#4FA88C]/15 text-[#357C67]'
                      : 'bg-[#E4A23C]/20 text-[#8A5A12]'
                  }`}
                >
                  {isStrong ? 'Strong' : 'Develop'}
                </span>
              </div>

              {/* Skill Proficiency Bar */}
              <div className="w-full h-1.5 bg-[#E7E3D8] rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full transition-all duration-300 ${
                    isStrong ? 'bg-[#4FA88C]' : 'bg-[#E4A23C]'
                  }`}
                  style={{ width: `${level}%` }}
                />
              </div>

              {!isStrong && (
                <div className="text-[11px] text-[#4F6070] flex items-center gap-2">
                  <span>Priority: {idx < 2 ? 'High' : 'Medium'}</span>
                  <span>•</span>
                  <span>~2 weeks estimated</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-2 mt-auto">
        <button
          onClick={() => onNavigate('learning')}
          className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer"
        >
          Get Personalized Learning Plan →
        </button>

        <button
          onClick={() => onNavigate('recommendations')}
          className="w-full bg-white hover:bg-[#E7E3D8] border border-[#122036] text-[#122036] font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
        >
          Change Target Career
        </button>
      </div>
    </div>
  );
};

export const LearningPlanScreen: React.FC<RoadmapScreenProps> = ({
  state,
  onNavigate,
  onUpdateState,
  showToast,
}) => {
  const target = getTargetCareerResult(state);
  const gaps = getSkillGaps(target, state);
  const totalWeeks = gaps.length * 2 + 3;

  const [expandedSkill, setExpandedSkill] = useState<string>(gaps[0]?.skill || '');

  const toggleTask = (taskKey: string) => {
    onUpdateState((prev) => ({
      ...prev,
      done: {
        ...prev.done,
        [taskKey]: !prev.done[taskKey],
      },
    }));
    showToast('Task status saved to Firestore!');
  };

  let weekCounter = 1;

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      <div className="mb-4">
        <button
          onClick={() => onNavigate('gap')}
          className="w-9 h-9 rounded-full bg-[#E7E3D8] text-[#17232E] flex items-center justify-center mb-3 hover:bg-[#122036]/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          PERSONALIZED LEARNING PLAN
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          Your {totalWeeks}-week plan.
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          Prioritized from your largest gaps for {target.c.name}.
        </p>
      </div>

      <div className="space-y-3.5 mb-5">
        {gaps.length === 0 ? (
          <div className="bg-white p-5 rounded-2xl border border-[#E7E3D8] text-center space-y-2">
            <div className="text-2xl">🎉</div>
            <div className="font-bold text-sm text-[#17232E]">No Priority Gaps Found</div>
            <p className="text-xs text-[#4F6070]">
              You already hold all core foundational skills. You can advance straight to portfolio projects!
            </p>
          </div>
        ) : (
          gaps.map((g, idx) => {
            const currentWeekStart = weekCounter;
            const currentWeekEnd = weekCounter + 1;
            weekCounter += 2;

            const tasks = [
              { key: `t:${g.skill}:0`, text: `Learn core syntax & fundamentals of ${g.skill}` },
              { key: `t:${g.skill}:1`, text: `Complete 4 hands-on practice exercises in ${g.skill}` },
              { key: `t:${g.skill}:2`, text: `Build a functional mini-project using ${g.skill}` },
              { key: `t:${g.skill}:3`, text: `Self-test and code review ${g.skill} integration` },
            ];

            const completedCount = tasks.filter((t) => state.done[t.key]).length;
            const isMilestoneComplete = completedCount === 4;
            const isExpanded = expandedSkill === g.skill;

            return (
              <div key={g.skill} className="flex gap-3">
                {/* Milestone dot */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono-code font-bold shrink-0 border-2 ${
                    isMilestoneComplete
                      ? 'bg-[#357C67] border-[#357C67] text-white'
                      : 'bg-white border-[#4F6070] text-[#4F6070]'
                  }`}
                >
                  {isMilestoneComplete ? '✓' : idx + 1}
                </div>

                {/* Milestone card */}
                <div className="flex-1 bg-white rounded-2xl border border-[#E7E3D8] p-4 shadow-xs">
                  <div
                    onClick={() => setExpandedSkill(isExpanded ? '' : g.skill)}
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-sm text-[#17232E]">
                        Week {currentWeekStart}–{currentWeekEnd} · {g.skill}
                      </div>
                      <div className="text-xs text-[#4F6070] mt-0.5">
                        {completedCount}/4 tasks · {idx < 2 ? 'High' : 'Medium'} priority
                      </div>
                    </div>
                    <span className="text-xs font-mono-code text-[#4F6070]">
                      {isExpanded ? '▾' : '▸'}
                    </span>
                  </div>

                  {/* Tasks List */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[#E7E3D8] space-y-2">
                      {tasks.map((task) => {
                        const done = Boolean(state.done[task.key]);
                        return (
                          <button
                            key={task.key}
                            type="button"
                            onClick={() => toggleTask(task.key)}
                            className="w-full text-left flex items-start gap-2.5 text-xs text-[#17232E] hover:bg-[#F4F2EC] p-1.5 rounded-lg transition cursor-pointer"
                          >
                            <span
                              className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                                done
                                  ? 'bg-[#357C67] border-[#357C67] text-white font-bold'
                                  : 'border-[#4F6070] bg-white'
                              }`}
                            >
                              {done && '✓'}
                            </span>
                            <span className={done ? 'line-through text-[#4F6070]' : ''}>
                              {task.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Portfolio Milestone */}
        <div className="flex gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono-code font-bold shrink-0 border-2 ${
              state.done['proj']
                ? 'bg-[#357C67] border-[#357C67] text-white'
                : 'bg-[#E4A23C] border-[#E4A23C] text-[#122036]'
            }`}
          >
            {state.done['proj'] ? '✓' : '★'}
          </div>

          <div className="flex-1 bg-white rounded-2xl border border-[#E7E3D8] p-4 shadow-xs">
            <div className="font-bold text-sm text-[#17232E]">
              Week {weekCounter}–{weekCounter + 2} · Portfolio Capstone Project
            </div>
            <div className="text-xs text-[#4F6070] mt-0.5">
              Build, document and publish one end-to-end full-cycle application on GitHub.
            </div>

            <button
              type="button"
              onClick={() => toggleTask('proj')}
              className="mt-3 flex items-center gap-2 text-xs font-bold font-mono-code cursor-pointer"
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                  state.done['proj']
                    ? 'bg-[#357C67] border-[#357C67] text-white'
                    : 'border-[#4F6070] bg-white'
                }`}
              >
                {state.done['proj'] && '✓'}
              </span>
              <span className={state.done['proj'] ? 'text-[#357C67]' : 'text-[#122036]'}>
                {state.done['proj'] ? 'Project Published ✓' : 'Mark Project as Published'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => onNavigate('roadmap')}
        className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer mt-auto"
      >
        View Full Career Roadmap →
      </button>
    </div>
  );
};

export const RoadmapScreen: React.FC<RoadmapScreenProps> = ({
  state,
  onNavigate,
  onUpdateState,
  showToast,
}) => {
  const target = getTargetCareerResult(state);
  const stages = getRoadmapStages(state);
  const pct = getRoadmapCompletionPercentage(state);

  const toggleTask = (taskKey: string) => {
    onUpdateState((prev) => ({
      ...prev,
      done: {
        ...prev.done,
        [taskKey]: !prev.done[taskKey],
      },
    }));
    showToast('Roadmap step updated!');
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      <div className="mb-4">
        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          MODULE 6 · CAREER ROADMAP
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          From student to career.
        </h2>
        <div className="flex items-center justify-between text-xs text-[#4F6070] mt-1">
          <span>{pct}% complete</span>
          <span className="font-mono-code font-bold text-[#122036]">
            Pathway: {target.c.name}
          </span>
        </div>

        {/* Global Progress Track */}
        <div className="w-full h-2 bg-[#E7E3D8] rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-[#4FA88C] to-[#357C67] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="space-y-4 mb-5">
        {stages.map((stage, sIdx) => {
          const isDone = stage.frac >= 1;

          return (
            <div key={stage.name} className="flex gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono-code font-bold shrink-0 border-2 ${
                  isDone
                    ? 'bg-[#357C67] border-[#357C67] text-white'
                    : 'bg-white border-[#122036] text-[#122036]'
                }`}
              >
                {isDone ? '✓' : sIdx + 1}
              </div>

              <div className="flex-1 bg-white rounded-2xl border border-[#E7E3D8] p-4 shadow-xs">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-bold text-sm text-[#17232E]">{stage.name}</div>
                  <span className="font-mono-code text-[11px] text-[#357C67] font-bold">
                    {Math.round(stage.frac * 100)}%
                  </span>
                </div>
                <div className="text-xs text-[#4F6070] mb-3">{stage.sub}</div>

                <div className="space-y-2">
                  {stage.items.map((item) => {
                    return stage.manual ? (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => toggleTask(item.key)}
                        className="w-full text-left flex items-start gap-2.5 text-xs text-[#17232E] hover:bg-[#F4F2EC] p-1.5 rounded-lg transition cursor-pointer"
                      >
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                            item.auto
                              ? 'bg-[#357C67] border-[#357C67] text-white font-bold'
                              : 'border-[#4F6070] bg-white'
                          }`}
                        >
                          {item.auto && '✓'}
                        </span>
                        <span className={item.auto ? 'line-through text-[#4F6070]' : ''}>
                          {item.text}
                        </span>
                      </button>
                    ) : (
                      <div
                        key={item.key}
                        className="flex items-start gap-2.5 text-xs text-[#17232E] p-1.5"
                      >
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                            item.auto
                              ? 'bg-[#357C67] border-[#357C67] text-white font-bold'
                              : 'border-[#4F6070] bg-white'
                          }`}
                        >
                          {item.auto && '✓'}
                        </span>
                        <span className={item.auto ? 'line-through text-[#4F6070]' : ''}>
                          {item.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 mt-auto">
        <button
          onClick={() => onNavigate('learning')}
          className="w-full bg-white hover:bg-[#E7E3D8] border border-[#122036] text-[#122036] font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
        >
          Open Weekly Learning Plan
        </button>

        <button
          onClick={() => onNavigate('progress')}
          className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer"
        >
          Track Adaptive Progress Loop →
        </button>
      </div>
    </div>
  );
};

export const ProgressScreen: React.FC<RoadmapScreenProps> = ({
  state,
  onNavigate,
  onUpdateState,
  showToast,
}) => {
  const target = getTargetCareerResult(state);
  const gaps = getSkillGaps(target, state);
  const activeSkill = gaps[0]?.skill || target.c.skills[0];
  const pct = getRoadmapCompletionPercentage(state);

  const [journalText, setJournalText] = useState('');
  const lastCheckin = state.checkins[state.checkins.length - 1];

  let adaptiveAdvice = 'Complete your assessment to unlock adaptive pathway adjustments.';
  if (state.assessed) {
    if (gaps.length === 0) {
      adaptiveAdvice =
        'You have mastered all core skills! The adaptive system shifts your milestones to competitive interview mocks and open-source contributions.';
    } else {
      if (lastCheckin && lastCheckin.level === 'Low') {
        adaptiveAdvice = `You noted confidence in ${lastCheckin.skill} as Low. The algorithm has expanded foundational exercises by 15 mins daily before moving to advanced design.`;
      } else if (lastCheckin && lastCheckin.level === 'Confident') {
        adaptiveAdvice = `High confidence in ${lastCheckin.skill}! Pacing has accelerated to introduce portfolio project milestones immediately.`;
      } else {
        adaptiveAdvice = `Maintain consistent pace on ${activeSkill}. Complete the remaining tasks to unlock the next milestone.`;
      }
    }
  }

  const handleCheckin = (level: string) => {
    const record = {
      level,
      skill: activeSkill,
      date: new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
    };
    onUpdateState((prev) => ({
      ...prev,
      checkins: [...prev.checkins, record],
    }));
    showToast(`Weekly check-in recorded (${level})!`);
  };

  const handleSaveJournal = () => {
    const trimmed = journalText.trim();
    if (!trimmed) {
      showToast('Write a brief thought first');
      return;
    }
    const entry = {
      text: trimmed,
      date: new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
    };
    onUpdateState((prev) => ({
      ...prev,
      journal: [...prev.journal, entry],
    }));
    setJournalText('');
    showToast('Reflection journal entry saved!');
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC] overflow-y-auto">
      <div className="mb-4">
        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          ADAPTIVE FEEDBACK &amp; TRACKING
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          Your progress loop.
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          The pathway adapts as you complete tasks and report confidence.
        </p>
      </div>

      <div className="space-y-3.5 mb-5">
        {/* Roadmap completion */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-bold text-sm text-[#17232E]">Roadmap Completion</span>
            <span className="font-mono-code font-bold text-sm text-[#357C67]">{pct}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#E7E3D8] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4FA88C] to-[#357C67]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Weekly Check-in */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs space-y-2">
          <div className="font-bold text-sm text-[#17232E]">Weekly Adaptive Check-in</div>
          <p className="text-xs text-[#4F6070]">
            How confident do you feel about <span className="font-bold text-[#17232E]">{activeSkill}</span> right now?
          </p>

          <div className="flex gap-2 pt-1">
            {[
              { label: 'Low', color: 'bg-[#E2664F]/15 text-[#B8442F]' },
              { label: 'Okay', color: 'bg-[#E4A23C]/20 text-[#8A5A12]' },
              { label: 'Confident', color: 'bg-[#4FA88C]/15 text-[#357C67]' },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => handleCheckin(c.label)}
                className={`flex-1 py-2 px-3 rounded-xl font-mono-code text-xs font-bold transition cursor-pointer hover:opacity-80 ${c.color}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {lastCheckin && (
            <div className="text-[11px] text-[#4F6070] font-mono-code pt-1">
              Last: {lastCheckin.skill} · {lastCheckin.level} · {lastCheckin.date}
            </div>
          )}
        </div>

        {/* AI Adaptive Advice Preview */}
        <div className="bg-gradient-to-br from-[#122036] to-[#1B3153] text-[#EFEDE4] p-4 rounded-2xl shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono-code font-bold text-[#E4A23C]">
            <Sparkles className="w-3.5 h-3.5" />
            Adaptive Algorithm Output
          </div>
          <p className="text-xs leading-relaxed text-[#A9B7C6]">{adaptiveAdvice}</p>
        </div>

        {/* Reflection Journal */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E3D8] shadow-xs space-y-2.5">
          <div className="font-bold text-sm text-[#17232E]">Reflection Journal</div>
          <textarea
            rows={3}
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="What technical concept or milestone did you conquer this week?"
            className="w-full p-3 bg-[#F4F2EC] border border-[#E7E3D8] rounded-xl text-xs focus:outline-none focus:border-[#4FA88C]"
          />
          <button
            onClick={handleSaveJournal}
            className="w-full bg-white hover:bg-[#E7E3D8] border border-[#122036] text-[#122036] font-bold py-2 rounded-xl text-xs transition cursor-pointer"
          >
            Save Reflection Entry
          </button>

          {state.journal.length > 0 && (
            <div className="pt-2 border-t border-[#E7E3D8] space-y-2">
              {state.journal.slice(-3).reverse().map((j, i) => (
                <div key={i} className="text-xs bg-[#F4F2EC] p-2.5 rounded-xl">
                  <div className="text-[10px] font-mono-code text-[#4F6070] mb-0.5">{j.date}</div>
                  <div className="text-[#17232E]">{j.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => onNavigate('compare')}
        className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer mt-auto"
      >
        Compare Career Pathways →
      </button>
    </div>
  );
};
