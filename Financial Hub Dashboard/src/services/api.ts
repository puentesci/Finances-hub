const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

interface Account {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  latestEntry?: AccountEntry;
  netWorth?: number;
  entries?: AccountEntry[];
}

interface AccountEntry {
  id: number;
  account_id: number;
  entry_date: string;
  cash: number;
  investments: number;
  debt: number;
  created_at: string;
}

class ApiService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Auth endpoints
  async register(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Account endpoints
  async getAccounts(): Promise<Account[]> {
    const response = await fetch(`${API_URL}/accounts`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }

    return response.json();
  }

  async getAccount(id: number): Promise<Account> {
    const response = await fetch(`${API_URL}/accounts/${id}`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch account');
    }

    return response.json();
  }

  async createAccount(name: string): Promise<Account> {
    const response = await fetch(`${API_URL}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create account');
    }

    return response.json();
  }

  async updateAccount(id: number, name: string): Promise<Account> {
    const response = await fetch(`${API_URL}/accounts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to update account');
    }

    return response.json();
  }

  async deleteAccount(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/accounts/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete account');
    }
  }

  // Entry endpoints
  async createEntry(
    accountId: number,
    entry_date: string,
    cash: number,
    investments: number,
    debt: number
  ): Promise<AccountEntry> {
    const response = await fetch(`${API_URL}/accounts/${accountId}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ entry_date, cash, investments, debt }),
    });

    if (!response.ok) {
      throw new Error('Failed to create entry');
    }

    return response.json();
  }

  async updateEntry(
    accountId: number,
    entryId: number,
    entry_date: string,
    cash: number,
    investments: number,
    debt: number
  ): Promise<AccountEntry> {
    const response = await fetch(`${API_URL}/accounts/${accountId}/entries/${entryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ entry_date, cash, investments, debt }),
    });

    if (!response.ok) {
      throw new Error('Failed to update entry');
    }

    return response.json();
  }

  async deleteEntry(accountId: number, entryId: number): Promise<void> {
    const response = await fetch(`${API_URL}/accounts/${accountId}/entries/${entryId}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete entry');
    }
  }
}

export const api = new ApiService();
export type { Account, AccountEntry };

