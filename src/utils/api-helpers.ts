import { API_CONFIG } from '../config/api';

/**
 * Helper function to decide whether to use mock data or real API
 * @param mockData The mock data to return
 * @param apiCall The API call function to execute
 * @returns Promise resolving to either mock data or API response
 */
export const useMockOrApi = async <T>(mockData: T, apiCall: () => Promise<T>): Promise<T> => {
  // If mock data is enabled, return the mock data
  if (API_CONFIG.ENABLE_MOCK_DATA) {
    if (API_CONFIG.DEBUG) {
      console.info('🧪 Using mock data');
    }
    return Promise.resolve(mockData);
  }
  
  // Otherwise, make the real API call
  return apiCall();
};

/**
 * Helper to simulate API latency in development mode
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the specified delay
 */
export const simulateApiLatency = (ms: number = 300): Promise<void> => {
  if (!API_CONFIG.ENABLE_MOCK_DATA || API_CONFIG.IS_PROD) {
    return Promise.resolve();
  }
  
  return new Promise(resolve => setTimeout(resolve, ms));
};
