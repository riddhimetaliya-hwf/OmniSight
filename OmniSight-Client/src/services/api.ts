/**
 * Centralized API Service
 * All API endpoints and HTTP methods are defined here
 */

// Base API configuration
const API_BASE_URL = import.meta.env?.VITE_API_URL || "https://localhost:7104";

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Workflow Templates
  WORKFLOW_TEMPLATES: "/api/workflow-templates",

  // Workflows
  WORKFLOWS: {
    CREATE_AND_EXECUTE: "/api/workflows/create-and-execute",
  },

  // Credentials
  CREDENTIALS: {
    TYPES_FROM_WORKFLOW: "/api/credentials/types-from-workflow",
    TYPES: "/api/credentials/types",
    TYPE_DETAILS: (credentialType: string) =>
      `/api/credentials/types/${encodeURIComponent(credentialType)}`,
  },

  // Executions
  EXECUTIONS: {
    STATUS: (executionId: string | number) => `/api/executions/${executionId}`,
  },

  // Overview
  OVERVIEW: {
    ALL: "/api/overview/all",
  },

  // N8N Auth
  N8N_AUTH: {
    AUTH_TOKEN: "/api/n8nauth/auth-token",
    WORKFLOW: (workflowId: string | number) =>
      `/api/n8nauth/workflow/${workflowId}`,
    CREATE_WORKFLOW: "/api/n8nauth/create-workflow",
  },

  // Node Metadata
  NODE_METADATA: {
    BY_TYPE: (nodeType: string) =>
      `/api/node-metadata/${encodeURIComponent(nodeType)}`,
  },

  // Templates (legacy - if still used)
  TEMPLATES: {
    ALL: "/api/templates",
    BY_ID: (id: string) => `/api/templates/${id}`,
    BY_WORKFLOW_ID: (workflowId: string) =>
      `/api/templates/workflow/${workflowId}`,
  },
} as const;

/**
 * HTTP Methods
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Request options
 */
export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

/**
 * Base API Client Class
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Get default headers
   */
  private getDefaultHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * Build full URL from endpoint
   */
  private buildUrl(endpoint: string): string {
    // If endpoint already includes the base URL, use it as-is
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      return endpoint;
    }

    // Remove leading slash if baseURL already has trailing slash
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const cleanBaseURL = this.baseURL.endsWith("/")
      ? this.baseURL.slice(0, -1)
      : this.baseURL;

    return `${cleanBaseURL}${cleanEndpoint}`;
  }

  /**
   * Make HTTP request
   */
  async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      headers = {},
      body,
      credentials = "include",
      signal,
    } = options;

    const url = this.buildUrl(endpoint);
    const requestHeaders = {
      ...this.getDefaultHeaders(),
      ...headers,
    };

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials,
      signal,
    };

    // Only add body if it exists and method is not GET
    if (body && method !== "GET") {
      requestOptions.body =
        typeof body === "string" ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestOptions);
      const responseText = await response.text();

      // Try to parse JSON, fallback to text
      let data: T;
      try {
        data = responseText ? JSON.parse(responseText) : ({} as T);
      } catch {
        data = responseText as unknown as T;
      }

      if (!response.ok) {
        const errorMessage =
          (data as { message?: string; error?: string; detail?: string })
            ?.message ||
          (data as { message?: string; error?: string; detail?: string })
            ?.error ||
          (data as { message?: string; error?: string; detail?: string })
            ?.detail ||
          response.statusText ||
          "Request failed";

        return {
          success: false,
          error: errorMessage,
          status: response.status,
        };
      }

      // Handle wrapped responses (e.g., { data: {...} })
      const finalData = (data as { data?: T })?.data ?? data;

      return {
        success: true,
        data: finalData as T,
        status: response.status,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Network error occurred";

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export default for convenience
export default apiClient;
