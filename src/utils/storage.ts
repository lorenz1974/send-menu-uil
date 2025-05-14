/**
 * Storage utilities for local data persistence
 *
 * [DesignPattern: Adapter] This module implements the Adapter pattern to provide
 * a standardized interface for local storage operations with type safety and error handling.
 */

// #region Storage Adapter

/**
 * Storage adapter for consistent, type-safe access to localStorage
 */
export const storageAdapter = {
  /**
   * Get a value from storage with proper type conversion and error handling
   *
   * @param key - The storage key to retrieve
   * @param defaultValue - Default value to return if key doesn't exist or on error
   * @returns The retrieved value or the default value
   */
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) as T : defaultValue;
    } catch (error) {
      console.error(`Error retrieving ${key} from storage:`, error);
      return defaultValue;
    }
  },

  /**
   * Set a value in storage with proper serialization and error handling
   *
   * @param key - The storage key to set
   * @param value - The value to store
   * @returns True if successful, false otherwise
   */
  set: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
      return false;
    }
  },

  /**
   * Remove a key from storage with error handling
   *
   * @param key - The storage key to remove
   * @returns True if successful, false otherwise
   */
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  }
};
// #endregion

// #region Storage Keys
/**
 * Constants for storage keys to prevent typos and improve consistency
 */
export const STORAGE_KEYS = {
  CURRENT_MENU: 'currentMenu',
  PRIMI: 'primi',
  SECONDI: 'secondi',
  CONTORNI: 'contorni'
};
// #endregion
