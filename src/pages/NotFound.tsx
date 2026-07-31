import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-carbon-lighter">
          <Dumbbell className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-chalk">404</h1>
        <p className="text-muted-foreground">This page doesn't exist. Maybe it's rest day.</p>
        <button
          onClick={() => navigate('/customers')}
          className="px-4 py-2 rounded-md bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
