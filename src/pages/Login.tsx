import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'cpsinha3@gmail.com', password: 'cplikes3', tier: 'Primary owner' },
  { role: 'Staff', email: 'coach@ridgestrength.com', password: 'Rg$tR3ngt#2024x', tier: 'Full access' },
  { role: 'Member (Unlimited)', email: 'sarah@example.com', password: 'Member2024!', tier: 'Unlimited' },
  { role: 'Member (8-Pack)', email: 'jake@example.com', password: 'Member2024!', tier: '8 classes/mo' },
  { role: 'Member (Drop-in)', email: 'maria@example.com', password: 'Member2024!', tier: 'Pay per class' },
];

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('cpsinha3@gmail.com');
  const [password, setPassword] = useState('cplikes3');
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

  const quickLogin = async (acct: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acct.email);
    setPassword(acct.password);
    setError('');
    setLoading(true);
    try {
      await signIn(acct.email, acct.password);
      toast.success(`Signed in as ${acct.role}`);
      navigate('/');
    } catch {
      setError('Demo login failed. Please try manually.');
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-ember/10 border border-ember/20 mb-2">
            <Dumbbell className="w-7 h-7 text-ember" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-chalk">RIDGE STRENGTH CLUB</h1>
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

        {/* Demo accounts */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-carbon px-3 text-xs text-muted-foreground">Demo Accounts</span></div>
          </div>
          <div className="grid gap-2">
            {DEMO_ACCOUNTS.map(acct => (
              <button
                key={acct.email}
                onClick={() => quickLogin(acct)}
                disabled={loading}
                className="flex items-center justify-between px-3 py-2.5 rounded-md border border-border bg-carbon-light hover:bg-carbon-lighter hover:border-ember/30 transition-all text-left group disabled:opacity-50"
              >
                <div>
                  <div className="text-sm font-medium text-chalk group-hover:text-ember transition-colors">{acct.role}</div>
                  <div className="text-xs text-muted-foreground">{acct.email}</div>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium bg-carbon-lighter px-2 py-0.5 rounded">
                  {acct.tier}
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Photo by Tima Miroshnichenko
        </p>
      </div>
    </div>
  );
}
