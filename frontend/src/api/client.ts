import { ApiResponse } from '../types/api';

/**
 * A strongly typed fetch wrapper that automatically handles
 * JSON parsing, error throwing, and returns the successful payload.
 */
export async function apiRequest<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    // Ensure all API calls are correctly prefixed.
    const endpoint = url.startsWith('/api') ? url : `/api${url.startsWith('/') ? url : `/${url}`}`;

    const response = await fetch(endpoint, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    // If 204 No Content, return null successfully immediately
    if (response.status === 204) {
        return null as unknown as T;
    }

    // Attempt to parse strictly typed JSON regardless of HTTP status
    let responseData: ApiResponse<T>;
    try {
        responseData = await response.json();
    } catch (parseError) {
        throw new Error(`Failed to parse response: ${response.statusText}`);
    }

    // Handle explicit API errors where success is false
    if (!responseData.success) {
        throw new Error(responseData.error || 'Unknown API Error');
    }

    // If success is true, extract and return inner data
    return responseData.data;
}
