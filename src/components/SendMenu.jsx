import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SendMenu = () => {
  const navigate = useNavigate()
  const [menuData, setMenuData] = useState(null)
  const [formattedDate, setFormattedDate] = useState('')
  const [formattedText, setFormattedText] = useState('')
  const [sendTeams, setSendTeams] = useState(true)
  const [sendEmail, setSendEmail] = useState(true)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState({ status: '', message: '' })

  useEffect(() => {
    // Carica i dati del menu dal localStorage
    const storedMenu = JSON.parse(localStorage.getItem('currentMenu') || '{}')
    setMenuData(storedMenu)

    if (storedMenu && storedMenu.date) {
      // Formatta la data in formato italiano (GG/MM/AAAA)
      const [year, month, day] = storedMenu.date.split('-')
      const formattedDateStr = `${day}/${month}/${year}`
      setFormattedDate(formattedDateStr)

      // Crea il testo formattato del menu
      let text = `MENU DEL GIORNO ${formattedDateStr}\n\n`

      text += 'PRIMI PIATTI:\n'
      if (storedMenu.primi && storedMenu.primi.length > 0) {
        storedMenu.primi.forEach((dish) => {
          text += `- ${dish}\n`
        })
      } else {
        text += 'Nessun primo piatto disponibile oggi\n'
      }

      text += '\nSECONDI PIATTI:\n'
      if (storedMenu.secondi && storedMenu.secondi.length > 0) {
        storedMenu.secondi.forEach((dish) => {
          text += `- ${dish}\n`
        })
      } else {
        text += 'Nessun secondo piatto disponibile oggi\n'
      }

      text += '\nCONTORNI:\n'
      if (storedMenu.contorni && storedMenu.contorni.length > 0) {
        storedMenu.contorni.forEach((dish) => {
          text += `- ${dish}\n`
        })
      } else {
        text += 'Nessun contorno disponibile oggi\n'
      }

      text += '\nBuon appetito!'
      setFormattedText(text)
    }
  }, [])

  const handleBack = () => {
    navigate('/summary')
  }

  const handleSend = async () => {
    setSending(true)
    setResult({ status: '', message: '' })

    try {
      // Qui implementeresti la chiamata all'API Azure
      // const response = await axios.post('URL_API_AZURE', {
      //   menuText: formattedText,
      //   sendTeams: sendTeams,
      //   sendEmail: sendEmail,
      //   date: menuData.date
      // });

      // Simula la risposta dell'API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setResult({
        status: 'success',
        message: `Menu inviato con successo ${sendEmail ? 'via email' : ''}${
          sendEmail && sendTeams ? ' e ' : ''
        }${sendTeams ? 'via Teams' : ''}.`,
      })

      // Opzionale: rimuovi il menu corrente dal localStorage dopo l'invio
      // localStorage.removeItem('currentMenu');
    } catch (error) {
      console.error("Errore durante l'invio del menu:", error)
      setResult({
        status: 'error',
        message:
          "Si è verificato un errore durante l'invio del menu. Riprova più tardi.",
      })
    } finally {
      setSending(false)
    }
  }

  const handleNewMenu = () => {
    localStorage.removeItem('currentMenu')
    navigate('/')
  }

  if (!menuData || Object.keys(menuData).length === 0) {
    return (
      <div className='send-container'>
        <h1>Menu non disponibile</h1>
        <p>
          Non sono stati trovati dati del menu. Torna alla pagina di
          composizione.
        </p>
        <button onClick={() => navigate('/')} className='back-btn'>
          Torna alla composizione
        </button>
      </div>
    )
  }

  return (
    <div className='send-container'>
      <h1>Invio Menu del {formattedDate}</h1>

      <div className='preview-container'>
        <h3>Anteprima del messaggio</h3>
        <div className='menu-preview'>{formattedText}</div>
      </div>

      <div className='send-options'>
        <h3>Modalità di invio</h3>
        <div className='option'>
          <input
            type='checkbox'
            id='teams'
            checked={sendTeams}
            onChange={() => setSendTeams(!sendTeams)}
          />
          <label htmlFor='teams'>Invia tramite Teams</label>
        </div>

        <div className='option'>
          <input
            type='checkbox'
            id='email'
            checked={sendEmail}
            onChange={() => setSendEmail(!sendEmail)}
          />
          <label htmlFor='email'>Invia tramite Email</label>
        </div>
      </div>

      {result.status && (
        <div className={`send-result ${result.status}`}>{result.message}</div>
      )}

      <div className='send-actions'>
        <button onClick={handleBack} className='back-btn' disabled={sending}>
          Indietro
        </button>
        <button
          onClick={handleSend}
          className='send-btn'
          disabled={sending || (!sendTeams && !sendEmail)}
        >
          {sending ? 'Invio in corso...' : 'Invia Menu'}
        </button>
        {result.status === 'success' && (
          <button onClick={handleNewMenu} className='reset-btn'>
            Nuovo Menu
          </button>
        )}
      </div>
    </div>
  )
}

export default SendMenu
