import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowLeft, Mail, Lock, User, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import auth from '@/lib/shared/kliv-auth.js';

export default function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const name = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (name.length < 2) throw new Error('Name is too short');
      if (!email.includes('@')) throw new Error('Invalid email address');
      if (password.length < 8) throw new Error('Password must be at least 8 characters');

      await auth.signUp(email, password, name);
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed';
      if (msg.includes('user_exists')) setError('An account with this email already exists.');
      else if (msg.includes('weak_password')) setError('Password is too weak. Use 8+ characters with mix of letters, numbers.');
      else if (msg.includes('invalid_email')) setError('Invalid email format.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden py-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3760059/pexels-photo-3760059.jpeg?auto=compress&cs=tinysrgb&w=1260')] bg-cover bg-center opacity-10" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Back button */}
        <div className="flex items-center gap-2 text-slate-400">
          <Link to="/login" className="flex items-center gap-1.5 text-sm hover:text-slate-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <img src="/idfc-first-bank-logo.svg" alt="IDFC First Bank" className="h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
            <p className="text-sm text-slate-400">Join IDFC First Bank Customer Portal</p>
          </div>
        </div>

        {/* Signup form */}
        <div className="bg-slate-800/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <User className="w-4 h-4" />
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  className="w-full h-12 px-4 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                  placeholder="Rajesh"
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Building2 className="w-4 h-4" />
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  className="w-full h-12 px-4 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                  placeholder="Kumar"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full h-12 px-4 pr-12 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                  placeholder="8+ characters"
                  autoComplete="new-password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">Must be at least 8 characters with a mix of letters and numbers</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
                Sign in →
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-amber-500 hover:text-amber-400">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-amber-500 hover:text-amber-400">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
