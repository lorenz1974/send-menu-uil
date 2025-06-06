/**
 * Date utilities for consistent date handling
 *
 * [DesignPattern: Utility] This module provides reusable date manipulation functions
 * to centralize date-related operations across the application.
 */

// #region Date Functions
/**
 * Date utility functions for common date operations
 */
export const dateUtils = {
  /**
   * Convert ISO date string (YYYY-MM-DD) to Italian format (DD/MM/YYYY)
   *
   * @param isoDate - Date in ISO format (YYYY-MM-DD)
   * @returns Date in Italian format (DD/MM/YYYY) or empty string if invalid
   */
  toItalianFormat: (isoDate: string): string => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    if (!day || !month || !year) return '';

    // Assicuriamo che giorno e mese siano sempre a due cifre
    const paddedDay = day.padStart(2, '0');
    const paddedMonth = month.padStart(2, '0');

    return `${paddedDay}/${paddedMonth}/${year}`;
  },
  /**
   * Convert Italian date format (DD/MM/YYYY) to ISO format (YYYY-MM-DD)
   *
   * @param italianDate - Date in Italian format (DD/MM/YYYY)
   * @returns Date in ISO format (YYYY-MM-DD) or empty string if invalid
   */
  toISOFormat: (italianDate: string): string => {
    if (!italianDate) return '';
    const [day, month, year] = italianDate.split('/');
    if (!day || !month || !year) return '';

    // Assicuriamo che giorno e mese siano sempre a due cifre
    const paddedDay = day.padStart(2, '0');
    const paddedMonth = month.padStart(2, '0');

    return `${year}-${paddedMonth}-${paddedDay}`;
  },
  /**
   * Get today's date in ISO format (YYYY-MM-DD)
   *
   * @returns Today's date in ISO format
   */
  today: (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() è 0-based
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
};
// #endregion
