import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="animate-spin w-8 h-8 border-4 border-ember border-t-transparent rounded-full"></div>
          <p className="text-sm text-slate-400 dark:text-slate-500">Redirecting to login...</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
