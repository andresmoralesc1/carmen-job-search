/**
 * API client for communicating with API Bridge
 */

// API Bridge URL - configure via environment variable
const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'http://localhost:3001';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

// Custom error for session expiration - should trigger redirect to login
export class SessionExpiredError extends Error {
  constructor(message = 'Session expired. Please login again.') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

// Utility function for exponential backoff with jitter
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const calculateRetryDelay = (attempt: number): number => {
  // Exponential backoff: 1s, 2s, 4s, 8s...
  const exponentialDelay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
  // Add jitter to prevent thundering herd problem
  const jitter = Math.random() * 1000;
  return exponentialDelay + jitter;
};

// Check if error is retryable
const isRetryable = (error: unknown, response?: Response): boolean => {
  if (response && RETRYABLE_STATUS_CODES.includes(response.status)) {
    return true;
  }
  // Network errors are retryable
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }
  return false;
};

// Fetch with retry logic
const fetchWithRetry = async (
  url: string,
  options?: RequestInit,
  attempt = 0
): Promise<Response> => {
  try {
    const response = await fetch(url, options);

    // If response is ok or not retryable, return as is
    if (response.ok || !isRetryable(null, response)) {
      return response;
    }

    // If we've reached max retries, return the error response
    if (attempt >= MAX_RETRIES) {
      return response;
    }

    // Wait with exponential backoff
    const delay = calculateRetryDelay(attempt);
    await sleep(delay);

    // Retry
    return fetchWithRetry(url, options, attempt + 1);
  } catch (error) {
    // If we've reached max retries or error is not retryable, throw
    if (attempt >= MAX_RETRIES || !isRetryable(error)) {
      throw error;
    }

    // Wait with exponential backoff
    const delay = calculateRetryDelay(attempt);
    await sleep(delay);

    // Retry
    return fetchWithRetry(url, options, attempt + 1);
  }
};

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

// API wrapper with automatic token refresh and retry logic
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    // Prepend API bridge URL if url starts with /api/
    const fullUrl = url.startsWith('/api/') ? `${API_BRIDGE_URL}${url}` : url;

    let response = await fetchWithRetry(fullUrl, {
      ...options,
      credentials: 'include', // Include httpOnly cookies
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
        response = await fetchWithRetry(fullUrl, {
          ...options,
          credentials: 'include', // Include httpOnly cookies
          headers: {
            ...options?.headers,
            ...getAuthHeaders()
          }
        });
      } else {
        // Throw SessionExpiredError so caller can handle redirect
        throw new SessionExpiredError();
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
        return fetchWithRetry(fullUrl, {
          ...options,
          credentials: 'include', // Include httpOnly cookies
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

  create: async (data: { name: string, careerPageUrl: string, jobBoardUrl?: string }) => {
    return apiFetch<{ company: any }>('/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  delete: async (id: string, userId: string) => {
    return apiFetch<{ company: any }>(`/api/companies/${id}`, {
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
    jobTitles: string[]; locations?: string[]; experienceLevel?: string; remoteOnly?: boolean
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

// Email Schedule API
export const scheduleApi = {
  getSchedule: async () => {
    return apiFetch<{ schedule: any }>('/api/schedule/me');
  },

  upsertSchedule: async (data: { timezone: string; preferredTimes: string[]; frequency: string }) => {
    return apiFetch<{ schedule: any }>('/api/schedule/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  updateSchedule: async (data: { timezone?: string; preferredTimes?: string[]; frequency?: string; active?: boolean }) => {
    return apiFetch<{ schedule: any }>('/api/schedule/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  deleteSchedule: async () => {
    return apiFetch<{ message: string }>('/api/schedule/me', {
      method: 'DELETE'
    });
  }
};

// Search Frequency API
export const searchFrequencyApi = {
  getFrequency: async () => {
    return apiFetch<{ searchFrequency: string }>('/api/users/search-frequency');
  },

  updateFrequency: async (frequency: string) => {
    return apiFetch<{ searchFrequency: string }>('/api/users/search-frequency', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchFrequency: frequency })
    });
  }
};
