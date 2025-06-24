import { apiService } from './api.js';

export class FinanceService {
    async getAccounts() {
        return apiService.get('/accounts');
    }

    async createAccount(accountData) {
        return apiService.post('/accounts', accountData);
    }

    async updateAccount(accountId, accountData) {
        return apiService.put(`/accounts/${accountId}`, accountData);
    }

    async deleteAccount(accountId) {
        return apiService.delete(`/accounts/${accountId}`);
    }

    async getAccountBalanceHistory(accountId, days = 30) {
        return apiService.get(`/accounts/${accountId}/balance-history?days=${days}`);
    }

    async getTransactions(filters = {}) {
        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        });

        const queryString = queryParams.toString();
        return apiService.get(`/transactions${queryString ? '?' + queryString : ''}`);
    }

    async createTransaction(transactionData) {
        return apiService.post('/transactions', transactionData);
    }

    async updateTransaction(transactionId, transactionData) {
        return apiService.put(`/transactions/${transactionId}`, transactionData);
    }

    async deleteTransaction(transactionId) {
        return apiService.delete(`/transactions/${transactionId}`);
    }

    async getTransactionStats(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return apiService.get(`/transactions/stats/summary?${queryParams}`);
    }

    async getCategories() {
        return apiService.get('/categories');
    }

    async createCategory(categoryData) {
        return apiService.post('/categories', categoryData);
    }

    async getTags() {
        return apiService.get('/tags');
    }

    async createTag(tagData) {
        return apiService.post('/tags', tagData);
    }

    async updateTag(tagId, tagData) {
        return apiService.put(`/tags/${tagId}`, tagData);
    }

    async deleteTag(tagId) {
        return apiService.delete(`/tags/${tagId}`);
    }

    async getBudgets() {
        return apiService.get('/budgets');
    }

    async createBudget(budgetData) {
        return apiService.post('/budgets', budgetData);
    }

    async getBudgetProgress(budgetId) {
        return apiService.get(`/budgets/${budgetId}/progress`);
    }

    async getScheduledTransactions() {
        return apiService.get('/scheduled-transactions');
    }

    async createScheduledTransaction(scheduledData) {
        return apiService.post('/scheduled-transactions', scheduledData);
    }

    async updateScheduledTransaction(scheduledId, scheduledData) {
        return apiService.put(`/scheduled-transactions/${scheduledId}`, scheduledData);
    }

    async deleteScheduledTransaction(scheduledId) {
        return apiService.delete(`/scheduled-transactions/${scheduledId}`);
    }

    async toggleScheduledTransaction(scheduledId) {
        return apiService.patch(`/scheduled-transactions/${scheduledId}/toggle`);
    }

    async getIncomeExpenseReport(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return apiService.get(`/reports/income-expense?${queryParams}`);
    }

    async getExpenseByCategoryReport(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return apiService.get(`/reports/expense-by-category?${queryParams}`);
    }

    async getAccountBalancesReport() {
        return apiService.get('/reports/account-balances');
    }

    async getMonthlyTrends(months = 12) {
        return apiService.get(`/reports/monthly-trends?months=${months}`);
    }

    async getBudgetPerformance() {
        return apiService.get('/reports/budget-performance');
    }

    async importTransactions(file) {
        const formData = new FormData();
        formData.append('file', file);
        return apiService.uploadFile('/import-export/import/transactions', formData);
    }

    async exportTransactions(filters = {}, format = 'csv') {
        const queryParams = new URLSearchParams({
            ...filters,
            format
        });
        return apiService.downloadFile(`/import-export/export/transactions?${queryParams}`);
    }

    async exportBudgetReport() {
        return apiService.downloadFile('/import-export/export/budget-report');
    }

    async getDashboard() {
        return apiService.get('/dashboard');
    }
}

export const financeService = new FinanceService();