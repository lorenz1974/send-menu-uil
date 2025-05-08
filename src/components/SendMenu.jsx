import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Form, Alert } from 'react-bootstrap'
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
      <Card className='shadow'>
        <Card.Header className='bg-danger text-white'>
          <h2 className='mb-0'>Menu non disponibile</h2>
        </Card.Header>
        <Card.Body className='text-center p-5'>
          <p className='lead mb-4'>
            Non sono stati trovati dati del menu. Torna alla pagina di
            composizione.
          </p>
          <Button variant='primary' size='lg' onClick={() => navigate('/')}>
            Torna alla composizione
          </Button>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className='shadow'>
      <Card.Header className='bg-primary text-white'>
        <h2 className='mb-0'>Invio Menu del {formattedDate}</h2>
      </Card.Header>

      <Card.Body>
        <Card className='mb-4'>
          <Card.Header className='bg-light'>
            <h3 className='mb-0'>Anteprima del messaggio</h3>
          </Card.Header>
          <Card.Body>
            <pre
              className='bg-light p-3 border rounded'
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {formattedText}
            </pre>
          </Card.Body>
        </Card>

        <Card className='mb-4'>
          <Card.Header className='bg-light'>
            <h3 className='mb-0'>Modalità di invio</h3>
          </Card.Header>
          <Card.Body>
            <Form.Check
              className='mb-2'
              type='checkbox'
              id='teams'
              label='Invia tramite Teams'
              checked={sendTeams}
              onChange={() => setSendTeams(!sendTeams)}
            />

            <Form.Check
              type='checkbox'
              id='email'
              label='Invia tramite Email'
              checked={sendEmail}
              onChange={() => setSendEmail(!sendEmail)}
            />
          </Card.Body>
        </Card>

        {result.status && (
          <Alert
            variant={result.status === 'success' ? 'success' : 'danger'}
            className='mb-4'
          >
            {result.message}
          </Alert>
        )}

        <div className='d-flex flex-column flex-md-row justify-content-between gap-2'>
          <Button
            variant='secondary'
            size='lg'
            onClick={handleBack}
            disabled={sending}
          >
            Indietro
          </Button>
          <Button
            variant='primary'
            size='lg'
            onClick={handleSend}
            disabled={sending || (!sendTeams && !sendEmail)}
          >
            {sending ? 'Invio in corso...' : 'Invia Menu'}
          </Button>
          {result.status === 'success' && (
            <Button variant='success' size='lg' onClick={handleNewMenu}>
              Nuovo Menu
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default SendMenu
