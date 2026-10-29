import {
  AppState,
  CareerModel,
  CareerScoreResult,
  CAREERS_DATA,
  DIMS,
  INTEREST_QUESTIONS,
  APTITUDE_QUESTIONS,
  PERSONALITY_QUESTIONS,
  STYLES,
} from '../types';

export const LOCAL_STORAGE_KEY = 'aicp_v1';

export function createBlankState(): AppState {
  return {
    user: null,
    ans: {
      interest: [],
      aptitude: [],
      personality: [],
    },
    refl: {
      text: '',
      conf: '',
      env: [],
    },
    assessed: false,
    target: '',
    done: {},
    checkins: [],
    journal: [],
    settings: {
      personal: true,
      remind: true,
      anon: false,
      scale: 1,
    },
    compare: [],
  };
}

export function loadSavedState(): AppState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return createBlankState();
    const parsed = JSON.parse(raw);
    return { ...createBlankState(), ...parsed };
  } catch (e) {
    console.error('Failed to parse saved state:', e);
    return createBlankState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export function countAnswered(answers: (number | null)[]): number {
  return answers.filter((v) => v !== undefined && v !== null).length;
}

function cosineSimilarity(
  a: Record<string, number>,
  b: Record<string, number>,
  keys: string[]
): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const k of keys) {
    const u = a[k] || 0;
    const v = b[k] || 0;
    dot += u * v;
    magA += u * u;
    magB += v * v;
  }
  return magA && magB ? dot / Math.sqrt(magA * magB) : 0;
}

function computeResponseVector(
  questions: [string, [string, string][]][],
  answers: (number | null)[]
): Record<string, number> {
  const vec: Record<string, number> = {};
  answers.forEach((ansIdx, qIdx) => {
    if (ansIdx === null || ansIdx === undefined) return;
    const key = questions[qIdx][1][ansIdx][1];
    vec[key] = (vec[key] || 0) + 1;
  });
  return vec;
}

export function computeProfileSummary(state: AppState) {
  const interestVec = computeResponseVector(INTEREST_QUESTIONS, state.ans.interest);
  const personalityVec = computeResponseVector(PERSONALITY_QUESTIONS, state.ans.personality);

  let correctCount = 0;
  state.ans.aptitude.forEach((ansIdx, qIdx) => {
    if (ansIdx === APTITUDE_QUESTIONS[qIdx][2]) {
      correctCount += 1;
    }
  });

  const aptitudeRatio = APTITUDE_QUESTIONS.length > 0 ? correctCount / APTITUDE_QUESTIONS.length : 0;

  return {
    interestVec,
    personalityVec,
    aptitudeRatio,
    correctCount,
    totalAptitudeQ: APTITUDE_QUESTIONS.length,
  };
}

export function getUserSkills(state: AppState): string[] {
  return state.user?.skills || state.skills || [];
}

export function getUserAspiration(state: AppState): string {
  return state.user?.aspiration || state.aspiration || '';
}

export function getSkillLevel(skillName: string, state: AppState): number {
  const skills = getUserSkills(state);
  if (skills.includes(skillName)) return 85;
  const completedTasks = [0, 1, 2, 3].filter((i) => state.done[`t:${skillName}:${i}`]).length;
  return Math.round((completedTasks / 4) * 80);
}

export function scoreSingleCareer(career: CareerModel, state: AppState): CareerScoreResult {
  const p = computeProfileSummary(state);

  const iFit = cosineSimilarity(p.interestVec, career.dims, Object.keys(DIMS));
  const aFit = Math.min(1.0, p.aptitudeRatio / (career.apt || 0.6));
  const sFit = cosineSimilarity(p.personalityVec, career.style, Object.keys(STYLES));

  const userSkills = getUserSkills(state);
  const have = career.skills.filter((s) => userSkills.includes(s));
  const missing = career.skills.filter((s) => !userSkills.includes(s));
  const kFit = career.skills.length > 0 ? have.length / career.skills.length : 0;

  const aspiration = getUserAspiration(state).toLowerCase();
  let gFit = 0.5;
  if (aspiration && aspiration !== 'not sure yet') {
    if (aspiration === career.name.toLowerCase() || career.tags.some((t) => aspiration.includes(t))) {
      gFit = 1.0;
    } else {
      gFit = 0.3;
    }
  }

  // Multi-factor weighted formula matching research-backed guidance:
  // 30% Interest RIASEC fit
  // 20% Aptitude benchmark ratio
  // 15% Work style / personality fit
  // 20% Verified existing skill match
  // 15% Explicit career goal alignment
  const totalScore = Math.round(
    (iFit * 0.3 + aFit * 0.2 + sFit * 0.15 + kFit * 0.2 + gFit * 0.15) * 100
  );

  return {
    c: career,
    total: Math.max(10, Math.min(99, totalScore)),
    iFit: Math.round(iFit * 100),
    aFit: Math.round(aFit * 100),
    sFit: Math.round(sFit * 100),
    kFit: Math.round(kFit * 100),
    gFit: Math.round(gFit * 100),
    have,
    missing,
  };
}

export function getRankedCareers(state: AppState): CareerScoreResult[] {
  return CAREERS_DATA.map((c) => scoreSingleCareer(c, state)).sort(
    (a, b) => b.total - a.total
  );
}

export function getTargetCareerResult(state: AppState): CareerScoreResult {
  const ranked = getRankedCareers(state);
  if (state.target) {
    const match = ranked.find((x) => x.c.id === state.target);
    if (match) return match;
  }
  return ranked[0];
}

export function getSkillGaps(result: CareerScoreResult, state: AppState) {
  return result.c.skills
    .map((s, idx) => ({
      skill: s,
      level: getSkillLevel(s, state),
      index: idx,
    }))
    .filter((g) => g.level < 70);
}

export function getRoadmapStages(state: AppState) {
  const target = getTargetCareerResult(state);
  const gaps = getSkillGaps(target, state);
  const totalTasks = gaps.length * 4;
  const doneTasks = gaps.reduce(
    (acc, g) =>
      acc + [0, 1, 2, 3].filter((i) => state.done[`t:${g.skill}:${i}`]).length,
    0
  );

  const skillFraction = totalTasks > 0 ? doneTasks / totalTasks : 1;
  const isDone = (k: string) => !!state.done[k];

  return [
    {
      name: 'Stage 1: Foundation',
      sub: 'Profile setup & multi-factor assessment',
      items: [
        {
          key: 'a1',
          text: 'Complete student profile and initial skills inventory',
          auto: !!(state.user && getUserSkills(state).length > 0),
        },
        {
          key: 'a2',
          text: 'Complete Interest, Aptitude & Personality assessments',
          auto: state.assessed,
        },
      ],
      frac:
        state.assessed && getUserSkills(state).length > 0
          ? 1
          : getUserSkills(state).length > 0 || state.assessed
          ? 0.5
          : 0,
      manual: false,
    },
    {
      name: 'Stage 2: Core Skill Development',
      sub: `Prioritized learning for ${target.c.name}`,
      items: [
        {
          key: 'a3',
          text: `Master priority technical gaps (${doneTasks}/${totalTasks || 4} learning tasks completed)`,
          auto: skillFraction >= 1,
        },
      ],
      frac: skillFraction,
      manual: false,
    },
    {
      name: 'Stage 3: Portfolio Projects',
      sub: 'Production-ready showcase applications',
      items: [
        {
          key: 'p1',
          text: `Project 1: Domain prototype built with ${target.c.skills[0] || 'core stack'} and documented on GitHub`,
          auto: isDone('p1'),
        },
        {
          key: 'p2',
          text: 'Project 2: Full-stack application with Cloud DB & unit tests',
          auto: isDone('p2'),
        },
      ],
      frac:
        (Number(isDone('p1')) + Number(isDone('p2'))) / 2,
      manual: true,
    },
    {
      name: 'Stage 4: Practical Experience',
      sub: 'Hackathons, open source & internship trials',
      items: [
        {
          key: 'e1',
          text: 'Participate in a 48h hackathon or contribute to open-source repo',
          auto: isDone('e1'),
        },
        {
          key: 'e2',
          text: 'Complete a virtual internship simulation or capstone deployment',
          auto: isDone('e2'),
        },
      ],
      frac:
        (Number(isDone('e1')) + Number(isDone('e2'))) / 2,
      manual: true,
    },
    {
      name: 'Stage 5: Placement & Launch Ready',
      sub: 'Resume audits, system design & interview practice',
      items: [
        {
          key: 'l1',
          text: 'Tailored STAR-format resume and LinkedIn profile optimization',
          auto: isDone('l1'),
        },
        {
          key: 'l2',
          text: 'Conduct 2 mock technical & behavioral interview sessions',
          auto: isDone('l2'),
        },
        {
          key: 'l3',
          text: 'Submit 5 high-alignment applications with referral outreach',
          auto: isDone('l3'),
        },
      ],
      frac:
        (Number(isDone('l1')) + Number(isDone('l2')) + Number(isDone('l3'))) / 3,
      manual: true,
    },
  ];
}

export function getRoadmapCompletionPercentage(state: AppState): number {
  const stages = getRoadmapStages(state);
  const sum = stages.reduce((acc, s) => acc + s.frac, 0);
  return Math.round((sum / stages.length) * 100);
}

export function detectStudentStrengths(state: AppState): [string, 'mint' | 'gold'][] {
  const p = computeProfileSummary(state);
  const out: [string, 'mint' | 'gold'][] = [];
  const topInterestDims = Object.entries(p.interestVec)
    .sort((a, b) => b[1] - a[1])
    .map((e) => e[0]);

  if (p.aptitudeRatio >= 0.75) {
    out.push(['High Logical Reasoning', 'mint']);
  } else if (p.aptitudeRatio >= 0.5) {
    out.push(['Methodical Problem Solver', 'gold']);
  }

  if (topInterestDims[0] === 'A' || topInterestDims[1] === 'A') {
    out.push(['Analytical Mindset', 'mint']);
  }
  if (topInterestDims[0] === 'B' || topInterestDims[1] === 'B') {
    out.push(['Builder & Systems Craft', 'mint']);
  }
  if (topInterestDims[0] === 'C' || topInterestDims[1] === 'C') {
    out.push(['Creative & UX Sensitivity', 'gold']);
  }
  if (topInterestDims[0] === 'P' || topInterestDims[1] === 'P') {
    out.push(['Empathy & Mentorship', 'mint']);
  }
  if (topInterestDims[0] === 'L' || topInterestDims[1] === 'L') {
    out.push(['Strategic Leadership Drive', 'gold']);
  }

  const topStyle = Object.entries(p.personalityVec).sort(
    (a, b) => b[1] - a[1]
  )[0];
  if (topStyle) {
    out.push([`${STYLES[topStyle[0]]} Work Style`, 'mint']);
  }

  return out;
}

export function generateWhyText(scoreRes: CareerScoreResult): string {
  const bits: string[] = [];
  if (scoreRes.iFit >= 80) bits.push('your interest patterns align strongly with day-to-day engineering activities');
  else if (scoreRes.iFit >= 60) bits.push('solid interest overlap');

  if (scoreRes.aFit >= 90) bits.push('your aptitude benchmark score exceeds the required baseline');
  else if (scoreRes.aFit < 75) bits.push('aptitude is slightly below threshold, so dedicated practice will unlock fast gains');

  if (scoreRes.have.length > 0) bits.push(`you already hold strong foundational skills in ${scoreRes.have.join(', ')}`);
  if (scoreRes.missing.length > 0) bits.push(`target growth in ${scoreRes.missing.slice(0, 3).join(', ')}`);
  if (scoreRes.gFit === 1.0) bits.push('directly fulfills your self-selected career goal');

  return bits.join('; ') + '.';
}
