/**
 * Error handling utilities
 *
 * [DesignPattern: Facade] This module implements the Facade pattern to provide
 * a simplified interface for error handling operations.
 */

import { useState, useCallback } from 'react';
import axios from 'axios';

// #region Error Handler Hook
/**
 * Custom hook for centralized error handling
 *
 * @returns Object with error state and handler functions
 */
export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);

  /**
   * Process and handle errors in a consistent way
   *
   * @param error - The error object to handle
   */
  const handleError = useCallback((error: unknown): void => {
    console.error('Error occurred:', error);

    if (axios.isAxiosError(error)) {
      // Handle Axios HTTP errors
      setError(
        error.response?.data?.message ||
        `Error ${error.response?.status}: ${error.message}` ||
        'Communication error with the server'
      );
    } else if (error instanceof Error) {
      // Handle standard JS errors
      setError(error.message || 'An unexpected error occurred');
    } else {
      // Handle unknown error types
      setError('An unexpected error occurred');
    }
  }, []);

  /**
   * Clear the current error
   */
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return { error, setError, handleError, clearError };
};
// #endregion
