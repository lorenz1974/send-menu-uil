/**
 * Core application types and interfaces
 *
 * This file contains all the shared types used throughout the application,
 * providing a centralized type system for better consistency and maintainability.
 */

// #region Menu Types

/**
 * Represents a menu with categories of dishes and a date
 */
export interface MenuData {
  date: string;
  primi: string[];
  secondi: string[];
  contorni: string[];
}

/**
 * Valid category names for dishes
 */
export type DishCategory = 'primi' | 'secondi' | 'contorni';

/**
 * Dish categories with corresponding label for display
 */
export interface CategoryDisplay {
  key: DishCategory;
  label: string;
}

// #endregion

// #region API Types

/**
 * Response from the menu sending API
 */
export interface MenuSendResponse {
  success: boolean;
  message?: string;
  nutritionalAdvice?: string;
  error?: any;
}

/**
 * Options for sending the menu
 */
export interface MenuSendOptions {
  sendTeams: boolean;
  sendEmail: boolean;
}

// #endregion

// #region UI Component Props

/**
 * Props for the DishCategory component
 */
export interface DishCategoryProps {
  title: string;
  dishes: string[];
  setDishes: React.Dispatch<React.SetStateAction<string[]>>;
  savedDishes?: string[];
}

/**
 * Props for the PasswordModal component
 */
export interface PasswordModalProps {
  show: boolean;
  onConfirm: (password: string) => void;
  onClose: () => void;
  error?: string;
}

// #endregion
