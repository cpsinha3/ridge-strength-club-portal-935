import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
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
      toast.success('Account created! Please sign in.');
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/6389516/pexels-photo-6389516.jpeg?auto=compress&cs=tinysrgb&w=1260)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-carbon via-carbon/90 to-carbon" />

      <div className="relative z-10 w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-ember/10 border border-ember/20 mb-2">
            <Dumbbell className="w-7 h-7 text-ember" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-chalk">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join IDFC First Bank</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-chalk-dim mb-1.5">First name</label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-md bg-carbon-lighter border border-border text-chalk placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember transition-colors"
                placeholder="Rajesh"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-chalk-dim mb-1.5">Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-md bg-carbon-lighter border border-border text-chalk placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember transition-colors"
                placeholder="Kumar"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-chalk-dim mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-md bg-carbon-lighter border border-border text-chalk placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-chalk-dim mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full h-10 px-3 pr-10 rounded-md bg-carbon-lighter border border-border text-chalk placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember transition-colors"
                placeholder="8+ characters"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-chalk">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-md bg-ember text-white font-semibold text-sm hover:bg-ember-glow disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Account
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-ember transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Photo by Tima Miroshnichenko
        </p>
      </div>
    </div>
  );
}
