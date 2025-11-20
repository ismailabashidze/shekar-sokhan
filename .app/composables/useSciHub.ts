type QueryParams = Record<string, string | number | boolean | undefined | null>;

export interface SciHubPaperMetadata {
  title?: string;
  authors?: string[];
  doi?: string;
  journal?: string;
  publicationDate?: string;
  source?: string;
  url?: string;
  abstract?: string;
  pdfUrl?: string;
  [key: string]: unknown;
}

export interface SciHubSearchResponse {
  query: string;
  limit?: number;
  total?: number;
  results?: SciHubPaperMetadata[];
  raw?: unknown;
}

export interface SciHubSearchOptions {
  limit?: number;
  signal?: AbortSignal;
  headers?: HeadersInit;
}

export type SciHubDownloadResponseType = 'arrayBuffer' | 'blob' | 'text';

export interface SciHubDownloadOptions {
  convert?: boolean;
  responseType?: SciHubDownloadResponseType;
  signal?: AbortSignal;
  headers?: HeadersInit;
}

export interface SciHubDownloadResult<TData = Blob | ArrayBuffer | string> {
  data: TData;
  contentType: string | null;
  filename: string | null;
}

export function useSciHub() {
  const config = useRuntimeConfig();
  const baseUrl = (config.public?.scihubApiBaseUrl as string | undefined) || 'http://localhost:8000';

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');

  const buildUrl = (endpoint: string, query?: QueryParams) => {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const searchParams = new URLSearchParams();
    Object.entries(query || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      searchParams.append(key, String(value));
    });

    const queryString = searchParams.toString();

    return queryString
      ? `${normalizedBaseUrl}${normalizedEndpoint}?${queryString}`
      : `${normalizedBaseUrl}${normalizedEndpoint}`;
  };

  const executeGet = async <T>(
    endpoint: string,
    options?: {
      query?: QueryParams;
      headers?: HeadersInit;
      signal?: AbortSignal;
    },
  ) => {
    const url = buildUrl(endpoint, options?.query);

    return await $fetch<T>(url, {
      method: 'GET',
      headers: options?.headers,
      signal: options?.signal,
    });
  };

  const executeDownload = async (
    endpoint: string,
    options?: {
      query?: QueryParams;
      headers?: HeadersInit;
      signal?: AbortSignal;
    },
  ) => {
    const url = buildUrl(endpoint, options?.query);

    return (await $fetch.raw(url, {
      method: 'GET',
      headers: options?.headers,
      signal: options?.signal,
    })) as Response;
  };

  const extractFilename = (response: Response) => {
    const contentDisposition = response.headers.get('content-disposition');

    if (!contentDisposition) {
      return null;
    }

    const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);

    return filenameMatch?.[1] || null;
  };

  const searchPapers = async (query: string, options: SciHubSearchOptions = {}): Promise<SciHubSearchResponse> => {
    if (!query?.trim()) {
      throw new Error('عبارت جستجو نمی‌تواند خالی باشد.');
    }

    try {
      const response = await executeGet<any>('/search', {
        query: {
          query,
          limit: options.limit ?? undefined,
        },
        headers: options.headers,
        signal: options.signal,
      });

      // Log raw response for debugging
      console.log('Raw SciHub response:', response);

      // Normalize response structure
      if (Array.isArray(response)) {
        return {
          query,
          limit: options.limit,
          results: response,
        };
      }
      if (response?.papers && Array.isArray(response.papers)) {
        return {
          query,
          limit: options.limit,
          results: response.papers,
        };
      }
      if (response?.results && Array.isArray(response.results)) {
        return {
          query,
          limit: options.limit,
          results: response.results,
          total: response.total,
        };
      }
      if (response?.data && Array.isArray(response.data)) {
        return {
          query,
          limit: options.limit,
          results: response.data,
        };
      }

      // Return response as-is if it already matches SciHubSearchResponse structure
      return {
        query,
        limit: options.limit,
        results: response.results || [],
        total: response.total,
        raw: response,
      };
    } catch (error: any) {
      console.error('SciHub search error:', error);
      throw error;
    }
  };

  const downloadPaper = async <TData = Blob | ArrayBuffer | string>(
    identifier: string,
    options: SciHubDownloadOptions = {},
  ): Promise<SciHubDownloadResult<TData>> => {
    const normalizedIdentifier = identifier?.trim().replace(/^\/+/, '');

    if (!normalizedIdentifier) {
      throw new Error('شناسه مقاله الزامی است.');
    }

    const url = buildUrl(`download/${normalizedIdentifier}`, {
      convert: options.convert ? 'true' : undefined,
    });

    const responseType: SciHubDownloadResponseType = options.responseType || (options.convert ? 'text' : 'blob');

    // Extract filename and content type before reading body
    let contentType: string | null = null;
    let filename: string | null = null;

    // For text responses, use $fetch directly to avoid body stream issues
    if (responseType === 'text') {
      try {
        const textData = await $fetch<string>(url, {
          method: 'GET',
          headers: options.headers,
          signal: options.signal,
        });

        return {
          data: textData as TData,
          contentType: 'text/plain',
          filename: null,
        };
      } catch (error: any) {
        console.error('Error downloading paper as text:', error);
        throw error;
      }
    }

    // For blob/arrayBuffer, use $fetch.raw
    try {
      const response = await $fetch.raw(url, {
        method: 'GET',
        headers: options.headers,
        signal: options.signal,
      });

      // Extract metadata before reading body
      contentType = response.headers.get('content-type');
      filename = extractFilename(response);

      let data: Blob | ArrayBuffer | string;

      switch (responseType) {
        case 'arrayBuffer':
          data = await response.arrayBuffer();
          break;
        case 'blob':
        default:
          data = await response.blob();
          break;
      }

      return {
        data: data as TData,
        contentType,
        filename,
      };
    } catch (error: any) {
      console.error('Error downloading paper:', error);
      throw error;
    }
  };

  return {
    baseUrl: normalizedBaseUrl,
    searchPapers,
    downloadPaper,
  };
}
