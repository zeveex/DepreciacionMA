import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import DashboardPage from './pages/DashboardPage';
import Activos from './pages/Activos';
import Cuenta from './pages/Cuenta';
import Tecnologia from './pages/Tecnologia';
import Vehiculos from './pages/Vehiculos';
import Edificios from './pages/Edificios';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

          {/* Activos y sus categorías */}
          <Route path="/activos" element={<ProtectedRoute><Activos /></ProtectedRoute>} />
          <Route path="/activos/tecnologia" element={<ProtectedRoute><Tecnologia /></ProtectedRoute>} />
          <Route path="/activos/vehiculos" element={<ProtectedRoute><Vehiculos /></ProtectedRoute>} />
          <Route path="/activos/edificios" element={<ProtectedRoute><Edificios /></ProtectedRoute>} />

          <Route path="/cuenta" element={<ProtectedRoute><Cuenta /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}