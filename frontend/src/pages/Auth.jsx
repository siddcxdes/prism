import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Network, Database, Lock, Search } from 'lucide-react';

export default function Auth() {
  const { login, adminRegister, register, user, org } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', org_name: '', invite_code: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const showingInvite = useRef(false);

  if (user && org && !showingInvite.current) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        navigate('/dashboard');
      } else if (mode === 'create') {
        showingInvite.current = true;
        const result = await adminRegister(form.name, form.email, form.password, form.org_name);
        setInviteCode(result.invite_code);
      } else if (mode === 'join') {
        await register(form.name, form.email, form.password, form.invite_code);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (inviteCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-6">
        <div className="w-full max-w-sm animate-fade-in text-center">
          <div className="w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-6">
            <Lock size={20} className="text-accent" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2 tracking-tight">Team Code Generated</h2>
          <p className="text-[13px] text-text-secondary mb-8">
            Share this code with your group so they can join.
          </p>
          <div className="card mb-8 text-center bg-[#050505]">
            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-3">Invite Code</p>
            <p className="text-2xl font-mono font-bold text-accent tracking-[0.25em]">{inviteCode}</p>
          </div>
          <button
            onClick={() => { showingInvite.current = false; navigate('/dashboard'); }}
            className="btn-primary w-full text-black"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'login', label: 'Sign In' },
    { key: 'create', label: 'Create Org' },
    { key: 'join', label: 'Join Org' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left — Image & Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-black items-center justify-center">
        {/* The aesthetic background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: `url('/auth-bg.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <h1 className="text-7xl font-bold text-white tracking-tighter drop-shadow-2xl">prism.</h1>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 lg:max-w-lg flex flex-col items-center justify-center p-8 bg-bg relative">
        <div className="w-full max-w-sm animate-fade-in relative z-10">
          <div className="lg:hidden mb-12">
            <h1 className="text-3xl font-bold text-white tracking-tighter">prism.</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-text-primary mb-2 tracking-tight">
              {mode === 'login' ? 'Hey there' : mode === 'create' ? 'Start a team' : 'Join a team'}
            </h2>
            <p className="text-[13px] text-text-secondary">
              {mode === 'login' ? 'Log in to your account' : mode === 'create' ? 'Create a workspace for your group' : 'Got an invite code? Enter it below'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-[12px] text-danger border-l-2 border-danger pl-3 py-1 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block"></span>
                {error}
              </div>
            )}

            {mode !== 'login' && (
              <div>
                <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-[0.1em] mb-2">Display Name</label>
                <input type="text" value={form.name} onChange={update('name')} required placeholder="John Doe" className="input bg-[#0A0A0A]" />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-[0.1em] mb-2">Email Address</label>
              <input type="email" value={form.email} onChange={update('email')} required placeholder="name@school.edu" className="input bg-[#0A0A0A]" />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-[0.1em] mb-2">Password</label>
              <input type="password" value={form.password} onChange={update('password')} required placeholder="••••••••" className="input bg-[#0A0A0A]" />
            </div>

            {mode === 'create' && (
              <div className="pt-2">
                <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-[0.1em] mb-2">Team Name</label>
                <input type="text" value={form.org_name} onChange={update('org_name')} required placeholder="Finance Project Group" className="input bg-[#0A0A0A]" />
              </div>
            )}

            {mode === 'join' && (
              <div className="pt-2">
                <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-[0.1em] mb-2">Invite Code</label>
                <input type="text" value={form.invite_code} onChange={update('invite_code')} required placeholder="Enter code" className="input bg-[#0A0A0A] font-mono tracking-widest" />
              </div>
            )}

            <div className="pt-4">
              <button type="submit" disabled={loading} className="btn-primary w-full text-black">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  mode === 'login' ? 'Sign In' : mode === 'create' ? 'Create Team' : 'Join Team'
                )}
              </button>
            </div>
          </form>

          {/* Simple toggle links instead of pill tabs */}
          <div className="mt-8 flex flex-wrap gap-4 text-[12px] text-text-muted justify-center">
            {mode !== 'login' && <button type="button" onClick={() => { setMode('login'); setError(''); }} className="hover:text-white transition-colors cursor-pointer">Sign In</button>}
            {mode !== 'create' && <button type="button" onClick={() => { setMode('create'); setError(''); }} className="hover:text-white transition-colors cursor-pointer">Create Team</button>}
            {mode !== 'join' && <button type="button" onClick={() => { setMode('join'); setError(''); }} className="hover:text-white transition-colors cursor-pointer">Join Team</button>}
          </div>

        </div>
      </div>
    </div>
  );
}
