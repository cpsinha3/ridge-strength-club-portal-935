import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
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
      await signIn(email, password);
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      if (msg.includes('bad_credentials')) setError('Invalid email or password.');
      else if (msg.includes('account_locked')) setError('Account locked. Try again later.');
      else setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/6389516/pexels-photo-6389516.jpeg?auto=compress&cs=tinysrgb&w=1260)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-carbon via-carbon/90 to-carbon" />

      <div className="relative z-10 w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <img src="/idfc-first-bank-logo.svg" alt="IDFC First Bank Logo" className="h-10 mx-auto mb-2" />
          <h1 className="text-2xl font-bold tracking-tight text-chalk">IDFC First Bank</h1>
          <p className="text-sm text-muted-foreground">Member Portal</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full h-10 px-3 pr-10 rounded-md bg-carbon-lighter border border-border text-chalk placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember transition-colors"
                placeholder="••••••••"
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
            Sign In
          </button>
        </form>

        <div className="text-center">
          <Link to="/signup" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-ember transition-colors">
            Create an account →
          </Link>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Photo by Tima Miroshnichenko
        </p>
      </div>
    </div>
  );
}
