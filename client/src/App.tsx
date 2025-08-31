import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Tickets } from './pages/Tickets';
import { TicketDetail } from './pages/TicketDetail';
import { Users } from './pages/Users';
import { Profile } from './pages/Profile';
import { Toaster } from './components/ui/Toaster';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/tickets" element={
                <PrivateRoute>
                  <Tickets />
                </PrivateRoute>
              } />
              <Route path="/tickets/:id" element={
                <PrivateRoute>
                  <TicketDetail />
                </PrivateRoute>
              } />
              <Route path="/users" element={
                <PrivateRoute>
                  <Users />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            
            {/* Global Toast notifications */}
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
