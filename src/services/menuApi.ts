/**
 * Menu API Service
 *
 * [DesignPattern: Service] This module implements the Service pattern to isolate
 * API interaction logic from the rest of the application.
 */

import axios from 'axios';
import type { MenuData, MenuSendOptions, MenuSendResponse } from '../types';

// #region API Client
/**
 * Menu API client for server interactions
 */
export const menuApiService = {
  /**
   * Send menu data to the server
   *
   * @param formattedText - HTML formatted menu text
   * @param menuData - Menu data object
   * @param password - Authentication password
   * @param options - Send options (email/Teams)
   * @returns Promise with send operation result
   */
  sendMenu: async (
    formattedText: string,
    menuData: MenuData,
    password: string,
    options: MenuSendOptions
  ): Promise<MenuSendResponse> => {
    try {
      const URL_API_AZURE = import.meta.env.VITE_URL_API_AZURE || '';

      const response = await axios.post(URL_API_AZURE, {
        menuText: formattedText,
        sendTeams: options.sendTeams,
        sendEmail: options.sendEmail,
        date: menuData.date,
        password
      });

      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.message ||
            `Menu inviato con successo${options.sendEmail ? ' via email' : ''}${
              options.sendEmail && options.sendTeams ? ' e' : ''
            }${options.sendTeams ? ' via Teams' : ''}.`,
          nutritionalAdvice: response.data.nutritionalAdvice ||
            'Nessun consiglio nutrizionale disponibile.'
        };
      } else {
        return {
          success: false,
          message: response.data?.message ||
            "Si è verificato un errore durante l'invio del menu. Riprova più tardi."
        };
      }
    } catch (error) {
      console.error("Errore durante l'invio del menu:", error);

      return {
        success: false,
        message: axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Si è verificato un errore durante l'invio del menu. Riprova più tardi.",
        error
      };
    }
  }
};
// #endregion
