import React, {
	createContext,
	useContext,
	useReducer,
	useMemo,
	useCallback,
} from "react";
import { financeService } from "../services/financeService.js";

const FinanceContext = createContext();

const initialState = {
	accounts: [],
	transactions: [],
	categories: [],
	tags: [],
	budgets: [],
	scheduledTransactions: [],
	dashboardData: null,
	loading: {
		accounts: false,
		transactions: false,
		categories: false,
		tags: false,
		budgets: false,
		scheduledTransactions: false,
		dashboard: false,
	},
	error: null,
	filters: {
		transactions: {
			account_id: "",
			category_id: "",
			transaction_type: "",
			start_date: "",
			end_date: "",
			search: "",
			page: 1,
			limit: 50,
		},
	},
};

function financeReducer(state, action) {
	switch (action.type) {
		case "SET_LOADING":
			return {
				...state,
				loading: {
					...state.loading,
					[action.payload.type]: action.payload.value,
				},
			};

		case "SET_ERROR":
			return {
				...state,
				error: action.payload,
			};

		case "SET_ACCOUNTS":
			return {
				...state,
				accounts: action.payload,
				loading: { ...state.loading, accounts: false },
			};

		case "ADD_ACCOUNT":
			return {
				...state,
				accounts: [...state.accounts, action.payload],
			};

		case "UPDATE_ACCOUNT":
			return {
				...state,
				accounts: state.accounts.map((account) =>
					account.account_id === action.payload.account_id
						? action.payload
						: account
				),
			};

		case "DELETE_ACCOUNT":
			return {
				...state,
				accounts: state.accounts.filter(
					(account) => account.account_id !== action.payload
				),
			};

		case "SET_TRANSACTIONS":
			return {
				...state,
				transactions: action.payload,
				loading: { ...state.loading, transactions: false },
			};

		case "ADD_TRANSACTION":
			return {
				...state,
				transactions: [action.payload, ...state.transactions],
			};

		case "UPDATE_TRANSACTION":
			return {
				...state,
				transactions: state.transactions.map((transaction) =>
					transaction.transaction_id === action.payload.transaction_id
						? action.payload
						: transaction
				),
			};

		case "DELETE_TRANSACTION":
			return {
				...state,
				transactions: state.transactions.filter(
					(transaction) => transaction.transaction_id !== action.payload
				),
			};

		case "SET_CATEGORIES":
			return {
				...state,
				categories: action.payload,
				loading: { ...state.loading, categories: false },
			};

		case "ADD_CATEGORY":
			return {
				...state,
				categories: [...state.categories, action.payload],
			};

		case "UPDATE_CATEGORY":
			return {
				...state,
				categories: state.categories.map((category) =>
					category.category_id === action.payload.category_id
						? action.payload
						: category
				),
			};

		case "DELETE_CATEGORY":
			return {
				...state,
				categories: state.categories.filter(
					(category) => category.category_id !== action.payload
				),
			};

		case "SET_TAGS":
			return {
				...state,
				tags: action.payload,
				loading: { ...state.loading, tags: false },
			};

		case "ADD_TAG":
			return {
				...state,
				tags: [...state.tags, action.payload],
			};

		case "UPDATE_TAG":
			return {
				...state,
				tags: state.tags.map((tag) =>
					tag.tag_id === action.payload.tag_id ? action.payload : tag
				),
			};

		case "DELETE_TAG":
			return {
				...state,
				tags: state.tags.filter((tag) => tag.tag_id !== action.payload),
			};

		case "SET_BUDGETS":
			return {
				...state,
				budgets: action.payload,
				loading: { ...state.loading, budgets: false },
			};

		case "ADD_BUDGET":
			return {
				...state,
				budgets: [...state.budgets, action.payload],
			};

		case "UPDATE_BUDGET":
			return {
				...state,
				budgets: state.budgets.map((budget) =>
					budget.budget_id === action.payload.budget_id
						? action.payload
						: budget
				),
			};

		case "DELETE_BUDGET":
			return {
				...state,
				budgets: state.budgets.filter(
					(budget) => budget.budget_id !== action.payload
				),
			};

		case "SET_SCHEDULED_TRANSACTIONS":
			return {
				...state,
				scheduledTransactions: action.payload,
				loading: { ...state.loading, scheduledTransactions: false },
			};

		case "ADD_SCHEDULED_TRANSACTION":
			return {
				...state,
				scheduledTransactions: [...state.scheduledTransactions, action.payload],
			};

		case "UPDATE_SCHEDULED_TRANSACTION":
			return {
				...state,
				scheduledTransactions: state.scheduledTransactions.map((scheduled) =>
					scheduled.scheduled_id === action.payload.scheduled_id
						? action.payload
						: scheduled
				),
			};

		case "DELETE_SCHEDULED_TRANSACTION":
			return {
				...state,
				scheduledTransactions: state.scheduledTransactions.filter(
					(scheduled) => scheduled.scheduled_id !== action.payload
				),
			};

		case "SET_DASHBOARD":
			return {
				...state,
				dashboardData: action.payload,
				loading: { ...state.loading, dashboard: false },
			};

		case "SET_TRANSACTION_FILTERS":
			return {
				...state,
				filters: {
					...state.filters,
					transactions: {
						...state.filters.transactions,
						...action.payload,
					},
				},
			};

		case "RESET_TRANSACTION_FILTERS":
			return {
				...state,
				filters: {
					...state.filters,
					transactions: initialState.filters.transactions,
				},
			};

		default:
			return state;
	}
}

export function FinanceProvider({ children }) {
	const [state, dispatch] = useReducer(financeReducer, initialState);

	const setLoading = useCallback((type, value) => {
		dispatch({ type: "SET_LOADING", payload: { type, value } });
	}, []);

	const setError = useCallback((error) => {
		dispatch({ type: "SET_ERROR", payload: error });
	}, []);

	const loadAccounts = useCallback(async () => {
		try {
			setLoading("accounts", true);
			const accounts = await financeService.getAccounts();
			dispatch({ type: "SET_ACCOUNTS", payload: accounts });
		} catch (error) {
			setError(error.message);
			setLoading("accounts", false);
		}
	}, [setLoading, setError]);

	const createAccount = useCallback(
		async (accountData) => {
			try {
				const newAccount = await financeService.createAccount(accountData);
				dispatch({ type: "ADD_ACCOUNT", payload: newAccount });
				return newAccount;
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const updateAccount = useCallback(
		async (accountId, accountData) => {
			try {
				const updatedAccount = await financeService.updateAccount(
					accountId,
					accountData
				);
				dispatch({ type: "UPDATE_ACCOUNT", payload: updatedAccount });
				return updatedAccount;
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const deleteAccount = useCallback(
		async (accountId) => {
			try {
				await financeService.deleteAccount(accountId);
				dispatch({ type: "DELETE_ACCOUNT", payload: accountId });
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const loadTransactions = useCallback(
		async (filters = {}) => {
			try {
				setLoading("transactions", true);
				const response = await financeService.getTransactions(filters);
				dispatch({
					type: "SET_TRANSACTIONS",
					payload: response.transactions || response,
				});
			} catch (error) {
				setError(error.message);
				setLoading("transactions", false);
			}
		},
		[setLoading, setError]
	);

	const createTransaction = useCallback(
		async (transactionData) => {
			try {
				const newTransaction = await financeService.createTransaction(
					transactionData
				);
				dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });
				await loadAccounts();
				return newTransaction;
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError, loadAccounts]
	);

	const updateTransaction = useCallback(
		async (transactionId, transactionData) => {
			try {
				const updatedTransaction = await financeService.updateTransaction(
					transactionId,
					transactionData
				);
				dispatch({ type: "UPDATE_TRANSACTION", payload: updatedTransaction });
				await loadAccounts();
				return updatedTransaction;
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError, loadAccounts]
	);

	const deleteTransaction = useCallback(
		async (transactionId) => {
			try {
				await financeService.deleteTransaction(transactionId);
				dispatch({ type: "DELETE_TRANSACTION", payload: transactionId });
				await loadAccounts();
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError, loadAccounts]
	);

	const loadCategories = useCallback(async () => {
		try {
			setLoading("categories", true);
			const categories = await financeService.getCategories();
			dispatch({ type: "SET_CATEGORIES", payload: categories });
		} catch (error) {
			setError(error.message);
			setLoading("categories", false);
		}
	}, [setLoading, setError]);

	const createCategory = useCallback(
		async (categoryData) => {
			try {
				const newCategory = await financeService.createCategory(categoryData);
				dispatch({ type: "ADD_CATEGORY", payload: newCategory });
				return newCategory;
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const updateCategory = useCallback(
		async (categoryId, categoryData) => {
			try {
				const updatedCategory = await financeService.updateCategory(
					categoryId,
					categoryData
				);
				dispatch({ type: "UPDATE_CATEGORY", payload: updatedCategory });
				return updatedCategory;
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const deleteCategory = useCallback(
		async (categoryId) => {
			try {
				await financeService.deleteCategory(categoryId);
				dispatch({ type: "DELETE_CATEGORY", payload: categoryId });
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const loadTags = useCallback(async () => {
		try {
			setLoading("tags", true);
			const tags = await financeService.getTags();
			dispatch({ type: "SET_TAGS", payload: tags });
		} catch (error) {
			setError(error.message);
			setLoading("tags", false);
		}
	}, [setLoading, setError]);

	const createTag = useCallback(
		async (tagData) => {
			try {
				const newTag = await financeService.createTag(tagData);
				dispatch({ type: "ADD_TAG", payload: newTag });
				return newTag;
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const updateTag = useCallback(
		async (tagId, tagData) => {
			try {
				const updatedTag = await financeService.updateTag(tagId, tagData);
				dispatch({ type: "UPDATE_TAG", payload: updatedTag });
				return updatedTag;
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const deleteTag = useCallback(
		async (tagId) => {
			try {
				await financeService.deleteTag(tagId);
				dispatch({ type: "DELETE_TAG", payload: tagId });
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const loadBudgets = useCallback(async (filters = {}) => {
		try {
			setLoading("budgets", true);
			const budgets = await financeService.getBudgets(filters);
			dispatch({ type: "SET_BUDGETS", payload: budgets });
		} catch (error) {
			setError(error.message);
			setLoading("budgets", false);
		}
	}, [setLoading, setError]);

	const createBudget = useCallback(
		async (budgetData) => {
			try {
				const newBudget = await financeService.createBudget(budgetData);
				dispatch({ type: "ADD_BUDGET", payload: newBudget });
				return newBudget;
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const updateBudget = useCallback(
		async (budgetId, budgetData) => {
			try {
				const updatedBudget = await financeService.updateBudget(
					budgetId,
					budgetData
				);
				dispatch({ type: "UPDATE_BUDGET", payload: updatedBudget });
				return updatedBudget;
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const deleteBudget = useCallback(
		async (budgetId) => {
			try {
				await financeService.deleteBudget(budgetId);
				dispatch({ type: "DELETE_BUDGET", payload: budgetId });
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const loadScheduledTransactions = useCallback(async () => {
		try {
			setLoading("scheduledTransactions", true);
			const scheduledTransactions =
				await financeService.getScheduledTransactions();
			dispatch({
				type: "SET_SCHEDULED_TRANSACTIONS",
				payload: scheduledTransactions,
			});
		} catch (error) {
			setError(error.message);
			setLoading("scheduledTransactions", false);
		}
	}, [setLoading, setError]);

	const createScheduledTransaction = useCallback(
		async (scheduledData) => {
			try {
				const newScheduled = await financeService.createScheduledTransaction(
					scheduledData
				);
				dispatch({ type: "ADD_SCHEDULED_TRANSACTION", payload: newScheduled });
				return newScheduled;
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const updateScheduledTransaction = useCallback(
		async (scheduledId, scheduledData) => {
			try {
				const updatedScheduled = await financeService.updateScheduledTransaction(
					scheduledId,
					scheduledData
				);
				dispatch({
					type: "UPDATE_SCHEDULED_TRANSACTION",
					payload: updatedScheduled,
				});
				return updatedScheduled;
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const deleteScheduledTransaction = useCallback(
		async (scheduledId) => {
			try {
				await financeService.deleteScheduledTransaction(scheduledId);
				dispatch({
					type: "DELETE_SCHEDULED_TRANSACTION",
					payload: scheduledId,
				});
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const toggleScheduledTransaction = useCallback(
		async (scheduledId) => {
			try {
				const updatedScheduled =
					await financeService.toggleScheduledTransaction(scheduledId);
				dispatch({
					type: "UPDATE_SCHEDULED_TRANSACTION",
					payload: updatedScheduled,
				});
				return updatedScheduled;
			} catch (error) {
				setError(error.message);
				throw error;
			}
		},
		[setError]
	);

	const loadDashboard = useCallback(async () => {
		try {
			setLoading("dashboard", true);
			const dashboardData = await financeService.getDashboard();
			dispatch({ type: "SET_DASHBOARD", payload: dashboardData });
		} catch (error) {
			setError(error.message);
			setLoading("dashboard", false);
		}
	}, [setLoading, setError]);

	const setTransactionFilters = useCallback((filters) => {
		dispatch({ type: "SET_TRANSACTION_FILTERS", payload: filters });
	}, []);

	const resetTransactionFilters = useCallback(() => {
		dispatch({ type: "RESET_TRANSACTION_FILTERS" });
	}, []);

	const value = useMemo(
		() => ({
			...state,
			loadAccounts,
			createAccount,
			updateAccount,
			deleteAccount,
			loadTransactions,
			createTransaction,
			updateTransaction,
			deleteTransaction,
			loadCategories,
			createCategory,
			updateCategory,
			deleteCategory,
			loadTags,
			createTag,
			updateTag,
			deleteTag,
			loadBudgets,
			createBudget,
			updateBudget,
			deleteBudget,
			loadScheduledTransactions,
			createScheduledTransaction,
			updateScheduledTransaction,
			deleteScheduledTransaction,
			toggleScheduledTransaction,
			loadDashboard,
			setTransactionFilters,
			resetTransactionFilters,
			setError,
		}),
		[state, loadAccounts, createAccount, updateAccount, deleteAccount, loadTransactions, createTransaction, updateTransaction, deleteTransaction, loadCategories, createCategory, updateCategory, deleteCategory, loadTags, createTag, updateTag, deleteTag, loadBudgets, createBudget, updateBudget, deleteBudget, loadScheduledTransactions, createScheduledTransaction, updateScheduledTransaction, deleteScheduledTransaction, toggleScheduledTransaction, loadDashboard, setTransactionFilters, resetTransactionFilters, setError]
	);

	return (
		<FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
	);
}

export function useFinance() {
	const context = useContext(FinanceContext);
	if (context === undefined) {
		throw new Error("useFinance must be used within a FinanceProvider");
	}
	return context;
}