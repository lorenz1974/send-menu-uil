/**
 * useMenuSender - Custom hook for sending menu data
 *
 * [DesignPattern: Strategy] Implements different strategies (email/Teams) for sending the menu
 * through a unified interface while isolating the implementation details.
 *
 * [DesignPattern: Promise] Uses Promise pattern for handling asynchronous password confirmation
 * and API requests with proper separation of concerns.
 */

// #region Imports
import { useState, useRef } from 'react'
import axios from 'axios'
// #endregion

/**
 * Custom hook for managing menu sending operations
 * @returns {Object} Functions and state for handling menu sending
 */
const useMenuSender = () => {
  // #region State Management
  const [sendTeams, setSendTeams] = useState(true)
  const [sendEmail, setSendEmail] = useState(true)
  const [sending, setSending] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [result, setResult] = useState({ status: '', message: '' })

  // [DesignPattern: Ref] Using useRef to store the Promise resolve function
  const resolvePasswordRef = useRef(null)

  // Get API URL from environment variables
  const URL_API_AZURE = import.meta.env.VITE_URL_API_AZURE || ''
  // #endregion

  // #region Formatter Methods
  /**
   * Formats the menu for sending
   *
   * [DesignPattern: Builder] Implements a builder pattern to construct
   * the HTML representation of the menu step by step
   *
   * @param {Object} menuData - Menu data object with date and dish arrays
   * @returns {string} Formatted HTML for the menu
   */
  const formatMenuForSending = (menuData) => {
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
   * @returns {Promise<string|null>} Promise resolving to password or null if canceled
   */
  const requestPasswordConfirmation = () => {
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
   * @param {string} password - The password entered by the user
   */
  const handlePasswordConfirm = (password) => {
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
  const handleClosePasswordModal = () => {
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
   * [DesignPattern: Adapter] Adapts the menu data to the format required by the API
   *
   * @param {string} formattedText - Formatted HTML menu text
   * @param {Object} menuData - Menu data object
   * @returns {Promise<Object>} Result of the send operation
   */
  const sendMenu = async (formattedText, menuData) => {
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
      // Send request to API
      const response = await axios.post(URL_API_AZURE, {
        menuText: formattedText,
        sendTeams: sendTeams,
        sendEmail: sendEmail,
        date: menuData.date,
        password: password,
      })

      if (response.data && response.data.success) {
        setResult({
          status: 'success',
          message:
            response.data && response.data.message
              ? response.data.message
              : `Menu inviato con successo${sendEmail ? ' via email' : ''}${
                  sendEmail && sendTeams ? ' e' : ''
                }${sendTeams ? ' via Teams' : ''}.`,
          nutritionalAdvice:
            response.data && response.data.nutritionalAdvice
              ? response.data.nutritionalAdvice
              : 'Nessun consiglio nutrizionale disponibile.',
        })
        return { success: true }
      } else {
        setResult({
          status: 'error',
          message:
            response.data && response.data.message
              ? response.data.message
              : "Si è verificato un errore durante l'invio del menu. Riprova più tardi.",
        })
        return { success: false }
      }
    } catch (error) {
      console.error("Errore durante l'invio del menu:", error)
      setResult({
        status: 'error',
        message:
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Si è verificato un errore durante l'invio del menu. Riprova più tardi.",
      })
      return { success: false, error }
    } finally {
      setSending(false)
    }
  }
  // #endregion

  // #region Hook Return
  return {
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
  }
  // #endregion
}

export default useMenuSender
