import { apiService } from "./api.js";

export class BudgetService {
  async getBudget(data) {
    if (!data || !data.month || !data.year) {
      throw new Error("Month and year are required to fetch budget data.");
    }
    try {
      console.log("Fetching budgets with data:", data);
      const params = new URLSearchParams(data).toString();
      const response = await apiService.get(`/budgets?${params}`);
      console.log("Budget data fetched successfully:", response);
      return response;
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  }

  async addBudget(data) {
    try {
      console.log("Adding budget with data:", data);
      const response = await apiService.post("/budgets", data);
      return response;
    } catch (error) {
      throw new Error(error.message || "Thêm ngân sách thất bại");
    }
  }

  async editBudget(data) {
    try {
      const { budget_id, categoryName, groupName, ...rest } = data;
      console.log("334", rest);
      const response = await apiService.put(`/budgets/${budget_id}`, rest);
      return response;
    } catch (error) {
      throw new Error(error.message || "Cập nhật ngân sách thất bại");
    }
  }

  async deleteBudget(budget_id) {
    if (!budget_id) throw new Error("Thiếu budget_id để xoá ngân sách.");
    try {
      const response = await apiService.delete(`/budgets/${budget_id}`);
      return response;
    } catch (error) {
      throw new Error(error.message || "Xoá ngân sách thất bại");
    }
  }

  async addCategory(data) {
    console.log("Adding category with data:", data);
    try {
      const response = await apiService.post("/categories", data);
      return response;
    } catch (error) {
      throw new Error(error.message || "Thêm danh mục thất bại");
    }
  }

  async editCategory(category_id, data) {
    console.log("alo", data);
    if (!category_id)
      throw new Error("Thiếu category_id để cập nhật danh mục.");
    try {
      const response = await apiService.put(`/categories/${category_id}`, data);
      return response;
    } catch (error) {
      throw new Error(error.message || "Cập nhật danh mục thất bại");
    }
  }

  async deleteCategory(category_id) {
    if (!category_id) throw new Error("Thiếu category_id để xoá danh mục.");
    try {
      const response = await apiService.delete(`/categories/${category_id}`);
      return response;
    } catch (error) {
      throw new Error(error.message || "Xoá danh mục thất bại");
    }
  }
  async getAccount(userId) {
    try {
      const response = await apiService.get(`/accounts/${userId}`);
      console.log("Account data fetched successfully:", response);
      return response;
    } catch (error) {
      throw new Error(error.message || "Lấy thông tin tài khoản thất bại");
    }
  }
}

export const budgetService = new BudgetService();
