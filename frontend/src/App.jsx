import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import NewResearch from './pages/NewResearch';
import ResearchResult from './pages/ResearchResult';
import History from './pages/History';
import AdminPanel from './pages/AdminPanel';
import WatchlistPage from './pages/WatchlistPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Auth />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/research" element={<NewResearch />} />
            <Route path="/research/:id" element={<ResearchResult />} />
            <Route path="/history" element={<History />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
