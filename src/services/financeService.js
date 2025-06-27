import { apiService } from "./api.js";

export class FinanceService {
	async getAccounts() {
		return apiService.get("/accounts");
	}

	async createAccount(accountData) {
		return apiService.post("/accounts", accountData);
	}

	async updateAccount(accountData) {
		return apiService.put(`/accounts/${accountData.account_id}`, accountData);
	}

	async deleteAccount(accountId) {
		return apiService.delete(`/accounts/${accountId}`);
	}

	async getAccountBalanceHistory(accountId, days = 30) {
		return apiService.get(
			`/accounts/${accountId}/balance-history?days=${days}`
		);
	}

	// Enhanced transaction methods
	async getTransactions(filters = {}) {
		const queryParams = new URLSearchParams();

		// Filter out empty values and format properly
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				queryParams.append(key, value);
			}
		});

		const queryString = queryParams.toString();
		const response = await apiService.get(
			`/transactions${queryString ? "?" + queryString : ""}`
		);

		// Handle both paginated and non-paginated responses
		return response.transactions || response;
	}

	async getTransaction(transactionId) {
		return apiService.get(`/transactions/${transactionId}`);
	}

	async createTransaction(transactionData) {
		// Validate required fields
		const requiredFields = [
			"account_id",
			"description",
			"amount",
			"transaction_date",
			"transaction_type",
		];
		for (const field of requiredFields) {
			if (!transactionData[field]) {
				throw new Error(`Missing required field: ${field}`);
			}
		}

		// Format data for API
		const apiData = {
			account_id: transactionData.account_id,
			description: transactionData.description.trim(),
			amount: parseFloat(transactionData.amount),
			transaction_date: transactionData.transaction_date,
			transaction_type: transactionData.transaction_type,
			category_id: transactionData.category_id || null,
			tag_id: transactionData.tag_id || null,
			memo: transactionData.memo?.trim() || null,
			transfer_account_id: transactionData.transfer_account_id || null,
		};

		return apiService.post("/transactions", apiData);
	}

	async updateTransaction(transactionId, transactionData) {
		// Validate required fields
		const requiredFields = [
			"account_id",
			"description",
			"amount",
			"transaction_date",
			"transaction_type",
		];
		for (const field of requiredFields) {
			if (!transactionData[field]) {
				throw new Error(`Missing required field: ${field}`);
			}
		}

		// Format data for API
		const apiData = {
			account_id: transactionData.account_id,
			description: transactionData.description.trim(),
			amount: parseFloat(transactionData.amount),
			transaction_date: transactionData.transaction_date,
			transaction_type: transactionData.transaction_type,
			category_id: transactionData.category_id || null,
			tag_id: transactionData.tag_id || null,
			memo: transactionData.memo?.trim() || null,
			transfer_account_id: transactionData.transfer_account_id || null,
		};

		return apiService.put(`/transactions/${transactionId}`, apiData);
	}

	async deleteTransaction(transactionId) {
		return apiService.delete(`/transactions/${transactionId}`);
	}

	async bulkDeleteTransactions(transactionIds) {
		// Since the API doesn't have a bulk delete endpoint, we'll delete one by one
		const deletePromises = transactionIds.map((id) =>
			this.deleteTransaction(id)
		);
		return Promise.all(deletePromises);
	}

	async getTransactionStats(filters = {}) {
		const queryParams = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				queryParams.append(key, value);
			}
		});

		return apiService.get(`/transactions/stats/summary?${queryParams}`);
	}

	// Category methods
	async getCategories() {
		return apiService.get("/categories");
	}

	async createCategory(categoryData) {
		const apiData = {
			name: categoryData.name.trim(),
			description: categoryData.description?.trim() || null,
			parent_category_id: categoryData.parent_category_id || null,
			icon: categoryData.icon || null,
			color: categoryData.color || null,
		};

		return apiService.post("/categories", apiData);
	}

	// Tag methods
	async getTags() {
		return apiService.get("/tags");
	}

	async createTag(tagData) {
		const apiData = {
			name: tagData.name.trim(),
			description: tagData.description?.trim() || null,
			color: tagData.color || null,
		};

		return apiService.post("/tags", apiData);
	}

	async updateTag(tagId, tagData) {
		const apiData = {
			name: tagData.name.trim(),
			description: tagData.description?.trim() || null,
			color: tagData.color || null,
		};

		return apiService.put(`/tags/${tagId}`, apiData);
	}

	async deleteTag(tagId) {
		return apiService.delete(`/tags/${tagId}`);
	}

	// Budget methods
	async getBudgets() {
		return apiService.get("/budgets");
	}

	async createBudget(budgetData) {
		return apiService.post("/budgets", budgetData);
	}

	async getBudgetProgress(budgetId) {
		return apiService.get(`/budgets/${budgetId}/progress`);
	}

	// Scheduled transaction methods
	async getScheduledTransactions() {
		return apiService.get("/scheduled-transactions");
	}

	async createScheduledTransaction(scheduledData) {
		return apiService.post("/scheduled-transactions", scheduledData);
	}

	async updateScheduledTransaction(scheduledId, scheduledData) {
		return apiService.put(
			`/scheduled-transactions/${scheduledId}`,
			scheduledData
		);
	}

	async deleteScheduledTransaction(scheduledId) {
		return apiService.delete(`/scheduled-transactions/${scheduledId}`);
	}

	async toggleScheduledTransaction(scheduledId) {
		return apiService.patch(`/scheduled-transactions/${scheduledId}/toggle`);
	}

	// Report methods
	async getIncomeExpenseReport(filters = {}) {
		const queryParams = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				queryParams.append(key, value);
			}
		});

		return apiService.get(`/reports/income-expense?${queryParams}`);
	}

	async getExpenseByCategoryReport(filters = {}) {
		const queryParams = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				queryParams.append(key, value);
			}
		});

		return apiService.get(`/reports/expense-by-category?${queryParams}`);
	}

	async getAccountBalancesReport() {
		return apiService.get("/reports/account-balances");
	}

	async getMonthlyTrends(months = 12) {
		return apiService.get(`/reports/monthly-trends?months=${months}`);
	}

	async getBudgetPerformance() {
		return apiService.get("/reports/budget-performance");
	}

	// Import/Export methods
	async importTransactions(file) {
		const formData = new FormData();
		formData.append("file", file);
		return apiService.uploadFile(
			"/import-export/import/transactions",
			formData
		);
	}

	async exportTransactions(filters = {}, format = "csv") {
		const queryParams = new URLSearchParams({
			...filters,
			format,
		});
		return apiService.downloadFile(
			`/import-export/export/transactions?${queryParams}`
		);
	}

	async exportBudgetReport() {
		return apiService.downloadFile("/import-export/export/budget-report");
	}

	// Dashboard method
	async getDashboard() {
		return apiService.get("/dashboard");
	}
}

export const financeService = new FinanceService();
