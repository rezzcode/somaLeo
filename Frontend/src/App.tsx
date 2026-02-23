import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppContent from './components/AppContent';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { authApi } from './services/api';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return authApi.isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <AppContent />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
