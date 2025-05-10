import { useState, useRef } from 'react'
import axios from 'axios'

/**
 * Hook per gestire l'invio del menu
 * @returns {Object} Funzioni e stati per gestire l'invio del menu
 */
// [DesignPattern: Hook] Custom hook per la gestione dell'invio del menu
const useMenuSender = () => {
  const [sendTeams, setSendTeams] = useState(true)
  const [sendEmail, setSendEmail] = useState(true)
  const [sending, setSending] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [result, setResult] = useState({ status: '', message: '' })

  // [DesignPattern: Ref] Utilizzo di useRef per memorizzare la funzione resolve della Promise
  const resolvePasswordRef = useRef(null)

  const URL_API_AZURE = import.meta.env.VITE_URL_API_AZURE || ''

  // Formatta il menu per l'invio
  const formatMenuForSending = (menuData) => {
    if (!menuData || !menuData.date) return ''

    // Formatta la data in formato italiano (GG.MM.AAAA)
    const [year, month, day] = menuData.date.split('-')
    const formattedDate = `${day}.${month}.${year}`

    // Crea lo stile del messaggio
    let text = '<style>\n'
    text += 'h4 { color: #0963c3; }\n'
    text += 'h5 { color: #FF0000; }\n'
    text += 'p { padding: 0; margin: 0;}\n'
    text += '</style>\n\n'

    text += '<div>\n'
    // Crea il testo formattato del menu
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

  // Richiede conferma tramite password
  const requestPasswordConfirmation = () => {
    setShowPasswordModal(true)
    setPasswordError('')
    return new Promise((resolve) => {
      // Questa promise viene risolta dal metodo handlePasswordConfirm
      resolvePasswordRef.current = resolve
    })
  }

  // Gestisce la conferma della password
  const handlePasswordConfirm = (password) => {
    // Risolve la promise con la password
    if (resolvePasswordRef.current) {
      resolvePasswordRef.current(password)
      resolvePasswordRef.current = null
    }
    setShowPasswordModal(false)
  }

  // Gestisce la chiusura del modale senza conferma
  const handleClosePasswordModal = () => {
    // Risolve la promise con null (indicando cancellazione)
    if (resolvePasswordRef.current) {
      resolvePasswordRef.current(null)
      resolvePasswordRef.current = null
    }
    setShowPasswordModal(false)
  }

  // Invia il menu
  const sendMenu = async (formattedText, menuData) => {
    if (!sendTeams && !sendEmail) {
      setResult({
        status: 'error',
        message: 'Seleziona almeno una modalità di invio (Teams o Email).',
      })
      return { success: false, message: 'Nessun canale di invio selezionato' }
    }

    // Richiedi la password prima di procedere
    const password = await requestPasswordConfirmation()

    // Se l'utente ha annullato l'operazione
    if (password === null) {
      return { success: false, message: 'Invio annullato' }
    }

    setSending(true)
    setResult({ status: '', message: '' })
    setPasswordError('')

    try {
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
}

export default useMenuSender
