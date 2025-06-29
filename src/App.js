import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import { FinanceProvider } from "./context/FinanceContext.js";
import { Layout } from "./components/layout/Layout.js";
import { Login } from "./pages/Auth/Login.jsx";
import { Register } from "./pages/Auth/Register.js";
import { Dashboard } from "./pages/Dashboard/Dashboard.jsx";
import { Transactions } from "./pages/Transactions/Transactions.jsx";
import { Accounts } from "./pages/Accounts/Accounts.jsx";
import { Budget } from "./pages/Budget/Budget.jsx";
import { Reports } from "./pages/Reports/Reports.jsx";
import { Settings } from "./pages/Settings/Settings.jsx";
import { LoadingSpinner } from "./components/ui/Loading/LoadingSpinner.js";
import { UserProvider } from "./context/UserContext";

function ProtectedRoute({ children }) {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return <LoadingSpinner />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <UserProvider>{children}</UserProvider>;
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
										<Route
											path="/"
											element={<Navigate to="/dashboard" replace />}
										/>
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
