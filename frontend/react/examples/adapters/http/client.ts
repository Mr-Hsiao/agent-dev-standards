import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';

export interface HttpClientOptions {
  baseURL?: string;
  timeout?: number;
  getAccessToken?: () => string | undefined;
}

export function createHttpClient(
  options: HttpClientOptions = {},
): AxiosInstance {
  const client = axios.create({
    baseURL: options.baseURL ?? import.meta.env.VITE_API_BASE_URL,
    timeout: options.timeout ?? 15_000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use((config) => {
    const token = options.getAccessToken?.();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return client;
}

export type HttpRequestConfig = AxiosRequestConfig;
