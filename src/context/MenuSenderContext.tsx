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
import { STORAGE_KEYS } from '../utils/storage'

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
   */ const formatMenuForSending = (menuData: MenuData): string => {
    if (!menuData || !menuData.date) return ''

    // Format date in Italian format (DD.MM.YYYY)
    const [year, month, day] = menuData.date.split('-')
    const days = [
      'Domenica',
      'Lunedì',
      'Martedì',
      'Mercoledì',
      'Giovedì',
      'Venerdì',
      'Sabato',
    ]
    const date = new Date(`${year}-${month}-${day}`)
    const dayOfWeek = days[date.getDay()]
    const months = [
      'gennaio',
      'febbraio',
      'marzo',
      'aprile',
      'maggio',
      'giugno',
      'luglio',
      'agosto',
      'settembre',
      'ottobre',
      'novembre',
      'dicembre',
    ]
    const monthName = months[parseInt(month, 10) - 1]
    const formattedDate = `${dayOfWeek}, ${parseInt(
      day,
      10
    )} ${monthName} ${year}`

    // [DesignPattern: Strategy] Get phrases from localStorage
    const getRandomPhraseFromStorage = (
      key: string,
      defaultPhrase: string
    ): string => {
      try {
        const storedPhrases = localStorage.getItem(key)
        if (storedPhrases) {
          const phrases = JSON.parse(storedPhrases) as string[]
          if (phrases && phrases.length > 0) {
            return phrases[Math.floor(Math.random() * phrases.length)]
          }
        }
        return defaultPhrase
      } catch (error) {
        console.error(
          `Errore nel recupero frasi da localStorage (${key}):`,
          error
        )
        return defaultPhrase
      }
    }

    // Get opening and closing phrases from localStorage
    const randomOpeningPhrase: string = getRandomPhraseFromStorage(
      STORAGE_KEYS.OPENING_PHRASES,
      'Ecco i piatti di oggi:'
    )

    const randomClosingPhrase: string = getRandomPhraseFromStorage(
      STORAGE_KEYS.CLOSING_PHRASES,
      'Buon appetito!'
    )

    // Create message style with customized selectors
    let text = '<style>\n'
    // Main title styles
    text +=
      '.menu-container {  width: fit-content; margin: auto; text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; }\n'
    text +=
      '.menu-title { color: #0963c3; font-size: 18px; font-weight: bold; margin: 10px 0; }\n'
    // Section styles
    text += '.menu-section { margin: 15px 0; }\n'
    // Section title styles
    text +=
      '.section-title { color: #FF0000; font-size: 18px; font-weight: bold; margin: 8px 0; }\n'
    // Dish item styles
    text +=
      '.menu-item { padding: 3px 0; margin: 0 0 0 20px; font-size: 14px; }\n'
    // Empty section message
    text +=
      '.empty-message { padding: 3px 0; margin: 0; font-style: italic; color: #666; }\n'
    // Footer styles
    text +=
      '.menu-footer { color: #0963c3; font-size: 18px; font-weight: bold; margin: 10px 0; }\n'
    text += '</style>\n\n'

    text += '<div class="menu-container">\n'
    // Create formatted menu text with custom classes
    text += `<h4 class="menu-title">🍽️ MENU DEL GIORNO - ${formattedDate}</h4>\n\n`

    text += `<p class="menu-opening">${randomOpeningPhrase}</p>\n\n`

    // Primi piatti section
    text += '<div class="menu-section primi-section">\n'
    text +=
      '<h5 class="section-title primi-title">🍝 <b>PRIMI PIATTI</b></h5>\n'
    if (menuData.primi && menuData.primi.length > 0) {
      menuData.primi.forEach((dish) => {
        text += `<p class="menu-item primi-item">- ${dish}</p>\n`
      })
    } else {
      text +=
        '<p class="empty-message">Nessun primo piatto disponibile oggi</p>\n'
    }
    text += '</div>\n'

    // Secondi piatti section
    text += '<div class="menu-section secondi-section">\n'
    text +=
      '<h5 class="section-title secondi-title">🍗 <b>SECONDI PIATTI</b></h5>\n'
    if (menuData.secondi && menuData.secondi.length > 0) {
      menuData.secondi.forEach((dish) => {
        text += `<p class="menu-item secondi-item">- ${dish}</p>\n`
      })
    } else {
      text +=
        '<p class="empty-message">Nessun secondo piatto disponibile oggi</p>\n'
    }
    text += '</div>\n'

    // Contorni section
    text += '<div class="menu-section contorni-section">\n'
    text += '<h5 class="section-title contorni-title">🥗 <b>CONTORNI</b></h5>\n'
    if (menuData.contorni && menuData.contorni.length > 0) {
      menuData.contorni.forEach((dish) => {
        text += `<p class="menu-item contorni-item">- ${dish}</p>\n`
      })
    } else {
      text += '<p class="empty-message">Nessun contorno disponibile oggi</p>\n'
    }
    text += '</div>\n'

    // footer section
    text += `<h4  class="menu-footer">${randomClosingPhrase}</h4>\n`
    text += '</div>\n' // Close menu container

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
