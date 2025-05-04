import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { IdleTimerProvider } from 'react-idle-timer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SignIn from '@/features/auth/SignIn';
import SignUp from '@/features/auth/SignUp';
import Home from '@/pages/home/Home';
import Dashboard from '@/pages/dashboard/Dashboard';
import Settings from '@/features/account/Settings';
import ProtectedRoute from '@/components/ProtectedRoute';
import queryClient from '@/api/queryClient';
import { useAuth } from '@/hooks/useAuth';


function IdleHandler({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();

  return (
    <IdleTimerProvider
      timeout={1000 * 60 * 10}
      onIdle={() => {
        signOut();
        window.location.href = '/signin';
      }}
      debounce={500}
    >
      {children}
    </IdleTimerProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IdleHandler>
        
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        
      </IdleHandler>
      <ToastContainer position="top-right" autoClose={5000} />
      
    </QueryClientProvider>
    
  );
}

export default App;