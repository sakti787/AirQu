// Utility functions for API calls with retry mechanism
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export async function retryFetch<T>(
  fetchFn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fetchFn();
      return result;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt}/${maxRetries} failed:`, lastError.message);
      
      if (attempt < maxRetries) {
        await delay(delayMs * attempt); // Exponential backoff
      }
    }
  }
  
  throw lastError!;
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('fetch') || 
           error.message.includes('network') ||
           error.message.includes('Failed to fetch') ||
           error.name === 'TypeError';
  }
  return false;
}