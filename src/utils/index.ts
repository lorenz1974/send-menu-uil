/**
 * Index file for utility exports
 *
 * [DesignPattern: Facade] This module implements the Facade pattern to provide
 * a simplified interface to the utility functions.
 */

// Export storage utilities
export { storageAdapter, STORAGE_KEYS } from './storage';

// Export date utilities
export { dateUtils } from './dates';

// Export error handling utilities
export { useErrorHandler } from './errors';
