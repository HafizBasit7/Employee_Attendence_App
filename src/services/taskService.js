import api from './api';

export const taskService = {
  // Get my tasks with pagination and filters
  getMyTasks: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/tasks/my?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get tasks' };
    }
  },

  // Update task progress
  updateTaskProgress: async (taskId, progress) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/progress`, { progress });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update task progress' };
    }
  },

  // Mark task as completed
  markTaskCompleted: async (taskId) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to complete task' };
    }
  }
};
