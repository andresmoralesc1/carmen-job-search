/**
 * API client for communicating with API Bridge
 */

// API Bridge URL - configure via environment variable
const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'http://localhost:3001';

// Get authentication headers
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('No access token found. Please login again.');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

// Handle API responses
const handleResponse = async <T>(response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  return response.json() as T;
};

// Refresh token if expired
export const refreshToken = async (): Promise<boolean> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return false;
    }

    const response = await fetch(`${API_BRIDGE_URL}/api/users/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    return true;
  } catch {
    return false;
  }
};

// API wrapper with automatic token refresh
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    // Prepend API bridge URL if url starts with /api/
    const fullUrl = url.startsWith('/api/') ? `${API_BRIDGE_URL}${url}` : url;

    let response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...options?.headers,
        ...getAuthHeaders()
      }
    });

    // If 401 Unauthorized, try to refresh token
    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry the request with new token
        response = await fetch(fullUrl, {
          ...options,
          headers: {
            ...options?.headers,
            ...getAuthHeaders()
          }
        });
      } else {
        // Redirect to login if refresh fails
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Session expired. Please login again.');
      }
    }

    return handleResponse<T>(response);
  } catch (error) {
    // If token expired, refresh and retry
    if ((error as Error).message?.includes('Unauthorized') || (error as Error).message?.includes('401')) {
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry the request with new token
        const fullUrl = url.startsWith('/api/') ? `${API_BRIDGE_URL}${url}` : url;
        return fetch(fullUrl, {
          ...options,
          headers: {
            ...options?.headers,
            ...getAuthHeaders()
          }
        }).then(handleResponse<T>);
      }
    }

    throw error;
  }
}

// User API
export const userApi = {
  getProfile: async () => {
    return apiFetch<{ user: { id: string, name: string, email: string, createdAt: string } }>('/api/users/me');
  },

  getStats: async () => {
    return apiFetch<{ stats: Array<{
    label: string; value: number | string; icon: string; color: string; trend: string
  }>}>('/api/users/stats');
  },

  getActivity: async () => {
    return apiFetch<{ activity: Array<{
      id: string; title: string; companyName?: string; url?: string; time: string; isNew: boolean
  }>}>('/api/users/activity');
  }
};

// Company API
export const companyApi = {
  getAll: async () => {
    return apiFetch<{ companies: any[] }>('/api/companies');
  },

  create: async (data: { userId: string, name: string, careerPageUrl: string, jobBoardUrl?: string }) => {
    return apiFetch<{ company: any }>('/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  delete: async (id: string, userId: string) => {
    return apiFetch<{ company: any }>('/api/companies', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
  }
};

// Job API
export const jobApi = {
  getAll: async (limit?: number) => {
    return apiFetch<{ jobs: any[] }>(`/api/jobs${limit ? `?limit=${limit}` : ''}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Preferences API
export const preferencesApi = {
  get: async () => {
    return apiFetch<{ preferences: any }>('/api/preferences/me');
  },

  create: async (data: {
    userId: string; jobTitles: string[]; locations?: string[]; experienceLevel?: string; remoteOnly?: boolean
  }) => {
    return apiFetch<{ preferences: any }>('/api/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};

// Scrape API
export const scrapeApi = {
  manualScrape: async (userId: string) => {
    return apiFetch<{ jobsFound: number; jobsSaved: number; errors: string[] }>('/api/scrape/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
  }
};
