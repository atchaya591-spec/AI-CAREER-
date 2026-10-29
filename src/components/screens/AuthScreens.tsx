import React, { useState } from 'react';
import { AppState, UserProfile } from '../../types';
import { ArrowLeft, Sparkles, User, Mail, Lock, ShieldCheck, CheckCircle } from 'lucide-react';

interface AuthScreenProps {
  state: AppState;
  onNavigate: (screen: string) => void;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  showToast: (msg: string) => void;
}

export const SplashScreen: React.FC<AuthScreenProps> = ({ state, onNavigate }) => {
  const firstName = state.user?.name ? state.user.name.trim().split(/\s+/)[0] : null;

  return (
    <div className="flex-1 flex flex-col justify-between p-7 bg-gradient-to-b from-[#1B3153] to-[#122036] text-[#EFEDE4]">
      {/* Top Branding */}
      <div>
        <div className="w-13 h-13 rounded-full bg-gradient-to-br from-[#E4A23C] to-[#C0812A] text-[#122036] flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#E4A23C]/20 mb-6">
          ✦
        </div>
        <div className="font-mono-code text-[11px] tracking-widest uppercase text-[#4FA88C] mb-3">
          AI-ENHANCED CAREER GUIDANCE
        </div>
        <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight">
          Every career <br />
          is a trail. <br />
          <span className="italic text-[#E4A23C]">Find yours.</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#A9B7C6] max-w-[290px]">
          Personalized guidance using interests, aptitude, personality, values, skills and goals, with an explainable pathway you can act on.
        </p>
      </div>

      {/* Steps & Action Button */}
      <div className="mt-auto pt-6">
        <div className="flex items-center gap-6 mb-6">
          <div>
            <div className="font-mono-code text-[11px] text-[#E4A23C] font-bold">01</div>
            <div className="text-xs text-[#A9B7C6]">Understand</div>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <div className="font-mono-code text-[11px] text-[#E4A23C] font-bold">02</div>
            <div className="text-xs text-[#A9B7C6]">Recommend</div>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <div className="font-mono-code text-[11px] text-[#E4A23C] font-bold">03</div>
            <div className="text-xs text-[#A9B7C6]">Grow</div>
          </div>
        </div>

        <button
          onClick={() => onNavigate(state.user ? 'home' : 'welcome')}
          className="w-full bg-[#E4A23C] hover:bg-[#C0812A] text-[#122036] font-bold py-4 px-6 rounded-2xl text-base transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          {state.user ? `Continue as ${firstName} →` : 'Start my journey →'}
        </button>
      </div>
    </div>
  );
};

export const WelcomeScreen: React.FC<AuthScreenProps> = ({ onNavigate, onUpdateState, showToast }) => {
  const handleGuest = () => {
    onUpdateState((prev) => ({
      ...prev,
      user: {
        name: 'Guest Scholar',
        email: 'guest@student.edu',
        edu: 'B.Tech / B.E. Computer Science',
        year: '2nd Year',
        interests: ['Technology', 'AI & Machine Learning', 'Problem Solving'],
        skills: ['Java', 'DSA (Data Structures)', 'Git & GitHub'],
        aspiration: 'Software Engineer',
        guest: true,
      },
    }));
    showToast('Logged in as Guest');
    onNavigate('profile');
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC]">
      <div className="mb-4">
        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] mb-1 font-bold">
          WELCOME
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E] leading-snug">
          A career plan built around you.
        </h2>
        <p className="text-xs text-[#4F6070] mt-1 leading-relaxed">
          We combine multiple dimensions so your recommendation is not based on a single generic quiz.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="bg-white p-3.5 rounded-2xl border border-[#E7E3D8] shadow-xs">
          <div className="font-bold text-sm text-[#17232E] flex items-center gap-2">
            🎯 Interests
          </div>
          <div className="text-xs text-[#4F6070] mt-0.5">What you naturally enjoy doing daily.</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#E7E3D8] shadow-xs">
          <div className="font-bold text-sm text-[#17232E] flex items-center gap-2">
            🧠 Aptitude
          </div>
          <div className="text-xs text-[#4F6070] mt-0.5">Logical, numerical and analytical problem-solving strengths.</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#E7E3D8] shadow-xs">
          <div className="font-bold text-sm text-[#17232E] flex items-center gap-2">
            💡 Personality &amp; Values
          </div>
          <div className="text-xs text-[#4F6070] mt-0.5">How you prefer to work and what matters to you.</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#E7E3D8] shadow-xs">
          <div className="font-bold text-sm text-[#17232E] flex items-center gap-2">
            🛠 Skills &amp; Experience
          </div>
          <div className="text-xs text-[#4F6070] mt-0.5">What you can already do and what you have built.</div>
        </div>
      </div>

      <div className="mt-auto space-y-2.5">
        <button
          onClick={() => onNavigate('register')}
          className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer"
        >
          Create account
        </button>

        <button
          onClick={() => onNavigate('login')}
          className="w-full bg-white hover:bg-[#E7E3D8] border border-[#122036] text-[#122036] font-bold py-3 px-4 rounded-xl text-sm transition cursor-pointer"
        >
          I already have an account
        </button>

        <button
          onClick={handleGuest}
          className="w-full text-xs text-[#4F6070] hover:text-[#17232E] py-2 transition font-mono-code font-semibold cursor-pointer text-center"
        >
          Continue as guest (Instant Preview)
        </button>
      </div>
    </div>
  );
};

export const LoginScreen: React.FC<AuthScreenProps> = ({ state, onNavigate, onUpdateState, showToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate Firebase Auth verification
      const existingUser = state.user;
      const userProfile: UserProfile = {
        name: existingUser?.name || email.split('@')[0],
        email,
        edu: existingUser?.edu || 'B.Tech / B.E. Computer Science',
        year: existingUser?.year || '2nd Year',
        interests: existingUser?.interests || ['Technology', 'AI & Machine Learning'],
        skills: existingUser?.skills || ['Java', 'SQL & Databases', 'Git & GitHub'],
        aspiration: existingUser?.aspiration || 'Software Engineer',
      };

      onUpdateState((prev) => ({
        ...prev,
        user: userProfile,
      }));

      showToast(`Welcome back, ${userProfile.name}!`);
      onNavigate('home');
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC]">
      <button
        onClick={() => onNavigate('welcome')}
        className="w-9 h-9 rounded-full bg-[#E7E3D8] text-[#17232E] flex items-center justify-center mb-4 hover:bg-[#122036]/10 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="mb-6">
        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          ACCOUNT
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          Welcome back.
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          Log in with your academic or personal credentials.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1 font-semibold">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@university.edu"
            className="w-full px-4 py-3 bg-white border border-[#E7E3D8] rounded-xl text-sm focus:outline-none focus:border-[#4FA88C]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1 font-semibold">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-white border border-[#E7E3D8] rounded-xl text-sm focus:outline-none focus:border-[#4FA88C]"
          />
        </div>

        {error && (
          <div className="text-xs text-[#B8442F] font-semibold bg-[#E2664F]/10 p-2.5 rounded-lg border border-[#E2664F]/20">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between text-xs pt-1">
          <button
            type="button"
            onClick={() => onNavigate('forgot-password')}
            className="text-[#4F6070] hover:text-[#122036] font-mono-code underline cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer disabled:opacity-60"
        >
          {loading ? 'Authenticating with Firebase...' : 'Login'}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('register')}
          className="w-full bg-white hover:bg-[#E7E3D8] border border-[#122036] text-[#122036] font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
        >
          New here? Create account
        </button>
      </form>
    </div>
  );
};

export const RegisterScreen: React.FC<AuthScreenProps> = ({ onNavigate, onUpdateState, showToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [degree, setDegree] = useState('B.Tech Computer Science');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userProfile: UserProfile = {
        name: name.trim(),
        email: email.trim(),
        edu: degree,
        year: '2nd Year',
        interests: ['Technology', 'Problem Solving'],
        skills: ['Java', 'Git & GitHub'],
        aspiration: 'Software Engineer',
      };

      onUpdateState((prev) => ({
        ...prev,
        user: userProfile,
      }));

      showToast('Firebase account created! Welcome aboard.');
      onNavigate('profile');
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC]">
      <button
        onClick={() => onNavigate('welcome')}
        className="w-9 h-9 rounded-full bg-[#E7E3D8] text-[#17232E] flex items-center justify-center mb-4 hover:bg-[#122036]/10 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="mb-5">
        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          ACCOUNT
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          Create your account
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          Your profile powers the personalized career pathway.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-3.5">
        <div>
          <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1 font-semibold">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aarthi M."
            className="w-full px-4 py-2.5 bg-white border border-[#E7E3D8] rounded-xl text-sm focus:outline-none focus:border-[#4FA88C]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1 font-semibold">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aarthi@example.com"
            className="w-full px-4 py-2.5 bg-white border border-[#E7E3D8] rounded-xl text-sm focus:outline-none focus:border-[#4FA88C]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1 font-semibold">
            Current Degree / Specialization
          </label>
          <input
            type="text"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            placeholder="e.g. B.Tech Computer Science & AI"
            className="w-full px-4 py-2.5 bg-white border border-[#E7E3D8] rounded-xl text-sm focus:outline-none focus:border-[#4FA88C]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1 font-semibold">
            Password (min 6 characters)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-white border border-[#E7E3D8] rounded-xl text-sm focus:outline-none focus:border-[#4FA88C]"
          />
        </div>

        {error && (
          <div className="text-xs text-[#B8442F] font-semibold bg-[#E2664F]/10 p-2.5 rounded-lg border border-[#E2664F]/20">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer mt-2 disabled:opacity-60"
        >
          {loading ? 'Creating Firebase Account...' : 'Register & Continue →'}
        </button>

        <p className="text-center text-xs text-[#4F6070] pt-2">
          Already registered?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-[#122036] font-bold underline cursor-pointer"
          >
            Log in here
          </button>
        </p>
      </form>
    </div>
  );
};

export const ForgotPasswordScreen: React.FC<AuthScreenProps> = ({ onNavigate, showToast }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;
    setSent(true);
    showToast('Reset email sent via Firebase Auth!');
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F4F2EC]">
      <button
        onClick={() => onNavigate('login')}
        className="w-9 h-9 rounded-full bg-[#E7E3D8] text-[#17232E] flex items-center justify-center mb-4 hover:bg-[#122036]/10 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="mb-6">
        <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#357C67] font-bold">
          SECURITY
        </div>
        <h2 className="font-display text-2xl font-bold text-[#17232E]">
          Reset password
        </h2>
        <p className="text-xs text-[#4F6070] mt-1">
          We will send a password reset verification link to your registered email address.
        </p>
      </div>

      {sent ? (
        <div className="bg-[#4FA88C]/15 border border-[#4FA88C]/30 p-4 rounded-2xl text-center space-y-2">
          <CheckCircle className="w-8 h-8 text-[#357C67] mx-auto" />
          <h3 className="font-bold text-sm text-[#17232E]">Email Dispatched!</h3>
          <p className="text-xs text-[#4F6070]">
            Check your inbox at <span className="font-mono-code font-bold">{email}</span> and follow the instructions.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="mt-3 inline-block text-xs font-bold font-mono-code text-[#122036] underline cursor-pointer"
          >
            Back to login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono-code uppercase text-[#4F6070] mb-1 font-semibold">
              Your registered email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 bg-white border border-[#E7E3D8] rounded-xl text-sm focus:outline-none focus:border-[#4FA88C]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#122036] hover:bg-[#1B3153] text-[#EFEDE4] font-bold py-3.5 px-4 rounded-xl text-sm transition cursor-pointer"
          >
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
};
