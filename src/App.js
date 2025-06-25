import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { FinanceProvider } from './context/FinanceContext.js';
import { Layout } from './components/layout/Layout.js';
import { Login } from './pages/Auth/Login.js';
import { Register } from './pages/Auth/Register.js';
import { Dashboard } from './pages/Dashboard/Dashboard.js';
import { Transactions } from './pages/Transactions/Transactions.jsx';
import { Accounts } from './pages/Accounts/Accounts.js';
import { Budget } from './pages/Budget/Budget.jsx';
import { Reports } from './pages/Reports/Reports.js';
import { Settings } from './pages/Settings/Settings.js';
import { LoadingSpinner } from './components/ui/Loading/LoadingSpinner.js';
import { DatabaseSeeder } from './components/DatabaseSeeder.jsx';
import { financeService } from './services/financeService.js';

function DatabaseChecker({ children }) {
    const [checkingDatabase, setCheckingDatabase] = useState(true);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        const checkDatabaseData = async () => {
            try {
                // Check if we have any accounts (indicates if database has been set up)
                const accounts = await financeService.getAccounts();
                setHasData(accounts.length > 0);
            } catch (error) {
                console.error('Error checking database:', error);
                setHasData(false);
            } finally {
                setCheckingDatabase(false);
            }
        };

        checkDatabaseData();
    }, []);

    if (checkingDatabase) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Checking database...</p>
                </div>
            </div>
        );
    }

    if (!hasData) {
        return <DatabaseSeeder />;
    }

    return children;
}

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <DatabaseChecker>
            {children}
        </DatabaseChecker>
    );
}

function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
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