const API_DISABLED_ERROR = "API is temporarily disabled";

class ApiClient {
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    // TODO: Re-enable API requests once the backend API is healthy again.
    void path;
    void options;
    throw new Error(API_DISABLED_ERROR);
  }

  get<T>(path: string) {
    return this.request<T>(path, { method: "GET" });
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" });
  }

  clearToken() {
    // TODO: Restore cached JWT clearing when API requests are re-enabled.
  }
}

export const api = new ApiClient();
