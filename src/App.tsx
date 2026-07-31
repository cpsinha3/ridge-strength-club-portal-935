import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import AppShell from "@/components/AppShell";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Schedule from "@/pages/Schedule";
import MyActivity from "@/pages/MyActivity";
import StaffDashboard from "@/pages/StaffDashboard";
import Customers from "@/pages/Customers";
import CustomerList from "@/pages/CustomerList";
import AddCustomer from "@/pages/AddCustomer";
import EditCustomer from "@/pages/EditCustomer";
import NotFound from "@/pages/NotFound";
import { PageSkeleton } from "@/components/LoadingSkeleton";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="max-w-6xl mx-auto px-4 py-6"><PageSkeleton /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="max-w-6xl mx-auto px-4 py-6"><PageSkeleton /></div>;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-center" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={
              <PublicOnly>
                <Navigate to="/login" replace />
              </PublicOnly>
            } />
            <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
            <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
              <Route path="/" element={<Schedule />} />
              <Route path="/my-activity" element={<MyActivity />} />
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/list" element={<CustomerList />} />
              <Route path="/customer/add" element={<AddCustomer />} />
              <Route path="/customer/:id/edit" element={<EditCustomer />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
