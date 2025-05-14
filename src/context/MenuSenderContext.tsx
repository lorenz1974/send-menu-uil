/**
 * Menu Sender Context
 *
 * [DesignPattern: Context] This module implements the React Context pattern
 * to provide centralized menu sending functionality across the application.
 *
 * [DesignPattern: Strategy] Combines with the Strategy pattern to provide
 * different sending methods (email/Teams) through a unified interface.
 */

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  ReactNode,
} from 'react'
import type { MenuData } from '../types'
import { menuApiService } from '../services/menuApi'

// #region Context Type

/**
 * Result of a menu send operation
 */
interface SendResult {
  status: '' | 'success' | 'error'
  message: string
  nutritionalAdvice?: string
}

/**
 * Shape of the menu sender context
 */
interface MenuSenderContextType {
  // State
  sendTeams: boolean
  sendEmail: boolean
  sending: boolean
  showPasswordModal: boolean
  passwordError: string
  result: SendResult

  // State setters
  setSendTeams: React.Dispatch<React.SetStateAction<boolean>>
  setSendEmail: React.Dispatch<React.SetStateAction<boolean>>
  setPasswordError: React.Dispatch<React.SetStateAction<string>>

  // Actions
  formatMenuForSending: (menuData: MenuData) => string
  sendMenu: (
    formattedText: string,
    menuData: MenuData
  ) => Promise<{ success: boolean; message?: string }>
  handlePasswordConfirm: (password: string) => void
  handleClosePasswordModal: () => void
}

/**
 * Provider props
 */
interface MenuSenderProviderProps {
  children: ReactNode
}
// #endregion

// #region Context Creation
// Create the context with a default undefined value
const MenuSenderContext = createContext<MenuSenderContextType | undefined>(
  undefined
)

/**
 * Menu Sender Provider component for wrapping the application
 *
 * @param children - Child components to be wrapped
 */
export const MenuSenderProvider: React.FC<MenuSenderProviderProps> = ({
  children,
}) => {
  // #region State Management
  const [sendTeams, setSendTeams] = useState<boolean>(true)
  const [sendEmail, setSendEmail] = useState<boolean>(true)
  const [sending, setSending] = useState<boolean>(false)
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<string>('')
  const [result, setResult] = useState<SendResult>({ status: '', message: '' })

  // [DesignPattern: Ref] Using useRef to store the Promise resolve function
  const resolvePasswordRef = useRef<((password: string | null) => void) | null>(
    null
  )
  // #endregion

  // #region Formatter Methods
  /**
   * Formats the menu for sending
   *
   * [DesignPattern: Builder] Implements a builder pattern to construct
   * the HTML representation of the menu step by step
   *
   * @param menuData - Menu data object with date and dish arrays
   * @returns Formatted HTML for the menu
   */
  const formatMenuForSending = (menuData: MenuData): string => {
    if (!menuData || !menuData.date) return ''

    // Format date in Italian format (DD.MM.YYYY)
    const [year, month, day] = menuData.date.split('-')
    const formattedDate = `${day}.${month}.${year}`

    // Create message style
    let text = '<style>\n'
    text += 'h4 { color: #0963c3; }\n'
    text += 'h5 { color: #FF0000; }\n'
    text += 'p { padding: 0; margin: 0;}\n'
    text += '</style>\n\n'

    text += '<div>\n'
    // Create formatted menu text
    text += `<h4>MENU DEL GIORNO ${formattedDate}</h4>\n\n`

    text += '<br /><h5><b>PRIMI PIATTI</b></h5>\n'
    if (menuData.primi && menuData.primi.length > 0) {
      menuData.primi.forEach((dish) => {
        text += `<p>${dish}</p>\n`
      })
    } else {
      text += '<p>Nessun primo piatto disponibile oggi</p>\n'
    }

    text += '\n<br /><h5><b>SECONDI PIATTI</b></h5>\n'
    if (menuData.secondi && menuData.secondi.length > 0) {
      menuData.secondi.forEach((dish) => {
        text += `<p>${dish}</p>\n`
      })
    } else {
      text += '<p>Nessun secondo piatto disponibile oggi</p>\n'
    }

    text += '\n<br /><h5><b>CONTORNI</b></h5>\n'
    if (menuData.contorni && menuData.contorni.length > 0) {
      menuData.contorni.forEach((dish) => {
        text += `<p>${dish}</p>\n`
      })
    } else {
      text += '<p>Nessun contorno disponibile oggi</p>\n'
    }

    text += '\n<br /><h4>Buon appetito!</h4>\n'
    text += '</div>\n'

    return text
  }
  // #endregion

  // #region Password Confirmation
  /**
   * Requests password confirmation via modal dialog
   *
   * [DesignPattern: Promise] Creates a Promise that will be resolved
   * when the user confirms or cancels the password entry
   *
   * @returns Promise resolving to password or null if canceled
   */
  const requestPasswordConfirmation = (): Promise<string | null> => {
    setShowPasswordModal(true)
    setPasswordError('')
    return new Promise((resolve) => {
      // This promise is resolved by handlePasswordConfirm method
      resolvePasswordRef.current = resolve
    })
  }

  /**
   * Handles password confirmation from the modal
   *
   * @param password - The password entered by the user
   */
  const handlePasswordConfirm = (password: string): void => {
    // Resolve the promise with the password
    if (resolvePasswordRef.current) {
      resolvePasswordRef.current(password)
      resolvePasswordRef.current = null
    }
    setShowPasswordModal(false)
  }

  /**
   * Handles closing the modal without confirmation
   */
  const handleClosePasswordModal = (): void => {
    // Resolve the promise with null (indicating cancellation)
    if (resolvePasswordRef.current) {
      resolvePasswordRef.current(null)
      resolvePasswordRef.current = null
    }
    setShowPasswordModal(false)
  }
  // #endregion

  // #region Menu Sending
  /**
   * Sends the menu via selected channels (email and/or Teams)
   *
   * [DesignPattern: Strategy] Implements a strategy pattern by choosing
   * different sending methods based on user selection
   *
   * @param formattedText - Formatted HTML menu text
   * @param menuData - Menu data object
   * @returns Promise with the result of the send operation
   */
  const sendMenu = async (
    formattedText: string,
    menuData: MenuData
  ): Promise<{ success: boolean; message?: string }> => {
    // Validate that at least one sending method is selected
    if (!sendTeams && !sendEmail) {
      setResult({
        status: 'error',
        message: 'Seleziona almeno una modalità di invio (Teams o Email).',
      })
      return { success: false, message: 'Nessun canale di invio selezionato' }
    }

    // Request password confirmation before proceeding
    const password = await requestPasswordConfirmation()

    // If user canceled the operation
    if (password === null) {
      return { success: false, message: 'Invio annullato' }
    }

    setSending(true)
    setResult({ status: '', message: '' })
    setPasswordError('')

    try {
      // Send request using the API service
      const response = await menuApiService.sendMenu(
        formattedText,
        menuData,
        password,
        { sendTeams, sendEmail }
      )

      if (response.success) {
        setResult({
          status: 'success',
          message: response.message || `Menu inviato con successo`,
          nutritionalAdvice: response.nutritionalAdvice,
        })
        return { success: true }
      } else {
        setResult({
          status: 'error',
          message:
            response.message ||
            "Si è verificato un errore durante l'invio del menu. Riprova più tardi.",
        })
        return { success: false }
      }
    } catch (error) {
      console.error("Errore durante l'invio del menu:", error)
      setResult({
        status: 'error',
        message:
          "Si è verificato un errore durante l'invio del menu. Riprova più tardi.",
      })
      return { success: false, message: 'Errore imprevisto' }
    } finally {
      setSending(false)
    }
  }
  // #endregion

  // Create memoized context value
  const contextValue = useMemo(
    () => ({
      sendTeams,
      setSendTeams,
      sendEmail,
      setSendEmail,
      sending,
      result,
      formatMenuForSending,
      sendMenu,
      showPasswordModal,
      handlePasswordConfirm,
      handleClosePasswordModal,
      passwordError,
      setPasswordError,
    }),
    [sendTeams, sendEmail, sending, result, showPasswordModal, passwordError]
  )

  return (
    <MenuSenderContext.Provider value={contextValue}>
      {children}
    </MenuSenderContext.Provider>
  )
}
// #endregion

// #region Context Hook
/**
 * Custom hook to use the menu sender context
 *
 * @returns The menu sender context value
 * @throws Error if used outside of MenuSenderProvider
 */
export const useMenuSenderContext = (): MenuSenderContextType => {
  const context = useContext(MenuSenderContext)

  if (context === undefined) {
    throw new Error(
      'useMenuSenderContext must be used within a MenuSenderProvider'
    )
  }

  return context
}
// #endregion
