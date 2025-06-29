import { apiService } from "./api.js";

export class ReportService {
  async getTransactionByAccount(data) {
    const { accountId } = data;
    try {
      const response = await apiService.get(`/transactions?${accountId}`);
      return response.transactions;
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  }
  async getTransactionByAccountIds(data) {
    const { accountIds, month, year } = data;
    try {
      const response = await apiService.post(`/transactions/accountIds`, {
        accountIds: accountIds,
        month: month,
        year: year,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  }
}

export const reportService = new ReportService();
