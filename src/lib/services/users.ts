import { API_ENDPOINTS, getAuthHeaders } from '@/lib/config/api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  organization?: number;
  is_active: boolean;
  date_joined: string;
  created_at: string;
  updated_at: string;
}

export interface UserUpdateData {
  username?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
}

export const usersService = {
  /**
   * Get all users
   */
  async getAll(): Promise<User[]> {
    const response = await fetch(API_ENDPOINTS.USERS.LIST, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    // Handle paginated response - extract results array
    return data.results || data;
  },

  /**
   * Get a single user
   */
  async getById(id: number): Promise<User> {
    const response = await fetch(API_ENDPOINTS.USERS.DETAIL(id), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return await response.json();
  },

  /**
   * Update a user
   */
  async update(id: number, data: UserUpdateData): Promise<User> {
    const response = await fetch(API_ENDPOINTS.USERS.UPDATE(id), {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    return await response.json();
  },

  /**
   * Delete a user
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(API_ENDPOINTS.USERS.DELETE(id), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  },
};

