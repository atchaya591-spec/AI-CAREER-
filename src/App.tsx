/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppState } from './types';
import {
  createBlankState,
  loadSavedState,
  saveState,
} from './services/careerEngine';
import { AndroidEmulatorFrame } from './components/AndroidEmulatorFrame';
import { CodeExportModal } from './components/CodeExportModal';

import {
  SplashScreen,
  WelcomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
} from './components/screens/AuthScreens';

import {
  DashboardScreen,
  ProfileScreen,
} from './components/screens/DashboardAndProfile';

import {
  AssessmentScreen,
  QuizScreen,
  ReflectionScreen,
  ResultsScreen,
} from './components/screens/AssessmentScreens';

import {
  RecommendationsScreen,
  CareerDetailScreen,
  ExplainScoreScreen,
} from './components/screens/CareerScreens';

import {
  SkillGapScreen,
  LearningPlanScreen,
  RoadmapScreen,
  ProgressScreen,
} from './components/screens/RoadmapScreens';

import {
  ChatbotScreen,
  CompareScreen,
  AdminScreen,
  LiteratureGapsScreen,
  SettingsScreen,
} from './components/screens/AdditionalScreens';

import {
  Home,
  FileCheck,
  Compass,
  Milestone,
  User,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadSavedState());
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [history, setHistory] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Sub-navigation states
  const [quizSection, setQuizSection] = useState<'interest' | 'aptitude' | 'personality'>('interest');
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('swe');

  // Auto-save state to localStorage on modification
  useEffect(() => {
    saveState(state);
  }, [state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const navigate = (screen: string, arg?: string) => {
    if (arg) {
      setSelectedCareerId(arg);
    }
    const rootScreens = ['home', 'assessment', 'recommendations', 'roadmap', 'profile'];
    if (rootScreens.includes(screen)) {
      setHistory([]);
    } else {
      setHistory((prev) => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
  };

  const handleResetData = () => {
    if (window.confirm('Reset app data to default sample student profile?')) {
      const reset = createBlankState();
      reset.user = {
        name: 'Aarthi M.',
        email: 'aarthim591@gmail.com',
        edu: 'B.Tech / B.E. Computer Science',
        year: '2nd Year',
        department: 'Artificial Intelligence & Data Science',
        interests: ['Technology', 'AI & Machine Learning', 'Problem Solving'],
        skills: ['Java', 'Python', 'SQL & Databases', 'Git & GitHub'],
        aspiration: 'Software Engineer',
      };
      setState(reset);
      setCurrentScreen('home');
      showToast('Sample student profile initialized!');
    }
  };

  // Determine if Bottom Navigation should be visible
  const authScreens = ['splash', 'welcome', 'login', 'register', 'forgot-password'];
  const isAuthFlow = authScreens.includes(currentScreen);
  const isChatbotFlow = currentScreen === 'chatbot';
  const isQuizFlow = currentScreen === 'quiz';
  const showBottomNav = !isAuthFlow && !isChatbotFlow && !isQuizFlow;

  // Active Bottom Nav tab index
  const tabMap: Record<string, string> = {
    home: 'home',
    assessment: 'assessment',
    quiz: 'assessment',
    reflection: 'assessment',
    results: 'assessment',
    recommendations: 'recommendations',
    career: 'recommendations',
    explain: 'recommendations',
    compare: 'recommendations',
    gap: 'recommendations',
    learning: 'roadmap',
    roadmap: 'roadmap',
    progress: 'roadmap',
    profile: 'profile',
    admin: 'profile',
    surveygap: 'profile',
    settings: 'profile',
  };
  const activeTab = tabMap[currentScreen] || 'home';

  const renderActiveScreen = () => {
    const commonProps = {
      state,
      onNavigate: navigate,
      onUpdateState: setState,
      showToast,
    };

    switch (currentScreen) {
      case 'splash':
        return <SplashScreen {...commonProps} />;
      case 'welcome':
        return <WelcomeScreen {...commonProps} />;
      case 'login':
        return <LoginScreen {...commonProps} />;
      case 'register':
        return <RegisterScreen {...commonProps} />;
      case 'forgot-password':
        return <ForgotPasswordScreen {...commonProps} />;

      case 'home':
        return <DashboardScreen {...commonProps} />;
      case 'profile':
        return <ProfileScreen {...commonProps} />;

      case 'assessment':
        return (
          <AssessmentScreen
            {...commonProps}
            quizSection={quizSection}
            setQuizSection={setQuizSection}
            quizIndex={quizIndex}
            setQuizIndex={setQuizIndex}
          />
        );
      case 'quiz':
        return (
          <QuizScreen
            {...commonProps}
            quizSection={quizSection}
            setQuizSection={setQuizSection}
            quizIndex={quizIndex}
            setQuizIndex={setQuizIndex}
          />
        );
      case 'reflection':
        return <ReflectionScreen {...commonProps} />;
      case 'results':
        return <ResultsScreen {...commonProps} />;

      case 'recommendations':
        return (
          <RecommendationsScreen
            {...commonProps}
            selectedCareerId={selectedCareerId}
            setSelectedCareerId={setSelectedCareerId}
          />
        );
      case 'career':
        return (
          <CareerDetailScreen
            {...commonProps}
            selectedCareerId={selectedCareerId}
            setSelectedCareerId={setSelectedCareerId}
          />
        );
      case 'explain':
        return (
          <ExplainScoreScreen
            {...commonProps}
            selectedCareerId={selectedCareerId}
          />
        );
      case 'gap':
        return <SkillGapScreen {...commonProps} />;
      case 'learning':
        return <LearningPlanScreen {...commonProps} />;
      case 'roadmap':
        return <RoadmapScreen {...commonProps} />;
      case 'progress':
        return <ProgressScreen {...commonProps} />;

      case 'chatbot':
        return <ChatbotScreen {...commonProps} />;
      case 'compare':
        return <CompareScreen {...commonProps} />;
      case 'admin':
        return <AdminScreen {...commonProps} />;
      case 'surveygap':
        return <LiteratureGapsScreen {...commonProps} />;
      case 'settings':
        return <SettingsScreen {...commonProps} />;

      default:
        return <DashboardScreen {...commonProps} />;
    }
  };

  return (
    <AndroidEmulatorFrame
      onOpenCodeExport={() => setIsCodeModalOpen(true)}
      onResetData={handleResetData}
    >
      {/* Screen Render Container */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[#F4F2EC]">
        {renderActiveScreen()}

        {/* Floating Action Button (FAB) for AI Career Counselor */}
        {showBottomNav && (
          <button
            onClick={() => navigate('chatbot')}
            className="absolute right-4 bottom-16 z-30 w-13 h-13 rounded-full bg-gradient-to-br from-[#E4A23C] to-[#C0812A] text-[#122036] flex items-center justify-center shadow-lg shadow-[#E4A23C]/30 hover:scale-105 active:scale-95 transition cursor-pointer ring-4 ring-[#F4F2EC]"
            aria-label="Open AI Career Counselor"
          >
            <Sparkles className="w-5 h-5 fill-current text-[#122036]" />
          </button>
        )}

        {/* Bottom Navigation Bar */}
        {showBottomNav && (
          <nav className="h-14 bg-[#F4F2EC] border-t border-[#E7E3D8] px-2 flex items-center justify-around shrink-0 z-20 shadow-xs">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'assessment', label: 'Assess', icon: FileCheck },
              { id: 'recommendations', label: 'Careers', icon: Compass },
              { id: 'roadmap', label: 'Roadmap', icon: Milestone },
              { id: 'profile', label: 'Profile', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.id)}
                  className={`flex flex-col items-center justify-center py-1 px-3 relative transition cursor-pointer ${
                    isActive ? 'text-[#357C67]' : 'text-[#4F6070] hover:text-[#17232E]'
                  }`}
                >
                  {isActive && (
                    <span className="absolute -top-[1px] w-6 h-0.5 bg-[#357C67] rounded-full" />
                  )}
                  <div
                    className={`w-9 h-6 flex items-center justify-center rounded-lg transition ${
                      isActive ? 'bg-[#4FA88C]/15' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono-code font-bold mt-0.5">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Ephemeral Toast Alert */}
        {toastMessage && (
          <div className="absolute bottom-18 left-1/2 -translate-x-1/2 z-50 bg-[#122036] text-[#EFEDE4] px-4 py-2 rounded-full text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
            {toastMessage}
          </div>
        )}
      </div>

      {/* Android Studio Code Export & ZIP Modal */}
      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </AndroidEmulatorFrame>
  );
}
