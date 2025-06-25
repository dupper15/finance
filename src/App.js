import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { FinanceProvider } from './context/FinanceContext.js';
import { Layout } from './components/layout/Layout.js';
import { Login } from './pages/Auth/Login.js';
import { Register } from './pages/Auth/Register.js';
import { Dashboard } from './pages/Dashboard/Dashboard.js';
import { Transactions } from './pages/Transactions/Transactions.jsx';
import { Accounts } from './pages/Accounts/Accounts.js';
import { Budget } from './pages/Budget/Budget.js';
import { Reports } from './pages/Reports/Reports.js';
import { Settings } from './pages/Settings/Settings.js';
import { LoadingSpinner } from './components/ui/Loading/LoadingSpinner.js';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <FinanceProvider>
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        <Route path="/transactions" element={<Transactions />} />
                                        <Route path="/accounts" element={<Accounts />} />
                                        <Route path="/budget" element={<Budget />} />
                                        <Route path="/reports" element={<Reports />} />
                                        <Route path="/settings" element={<Settings />} />
                                    </Routes>
                                </Layout>
                            </FinanceProvider>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <AppRoutes />
            </div>
        </AuthProvider>
    );
}

export default App;