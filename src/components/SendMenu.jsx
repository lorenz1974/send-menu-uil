import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Form, Alert, Col, Row } from 'react-bootstrap'
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
  const URL_API_AZURE = import.meta.env.VITE_URL_API_AZURE || ''

  useEffect(() => {
    // Carica i dati del menu dal localStorage
    const storedMenu = JSON.parse(localStorage.getItem('currentMenu') || '{}')
    setMenuData(storedMenu)

    if (storedMenu && storedMenu.date) {
      // Formatta la data in formato italiano (GG/MM/AAAA)s
      const [year, month, day] = storedMenu.date.split('-')
      const formattedDateStr = `${day}.${month}.${year}`
      setFormattedDate(formattedDateStr)

      // Crea lo stile del messaggio
      let text = '<style>\n'
      text += 'h4 { color: #0963c3; }\n'
      text += 'h5 { color: #FF0000; }\n'
      text += 'p { padding: 0; margin: 0;}\n'
      text += 'div { text-align: center; }\n'
      text += '</style>\n\n'

      text += '<div>\n'
      // Crea il testo formattato del menu
      text += `<h4>MENU DEL GIORNO ${formattedDateStr}</h4>\n\n`

      text += '<br /><h5><b>PRIMI PIATTI</b></h5>\n'
      if (storedMenu.primi && storedMenu.primi.length > 0) {
        storedMenu.primi.forEach((dish) => {
          text += `<p>${dish}</p>\n`
        })
      } else {
        text += '<p>Nessun primo piatto disponibile oggi</p>\n'
      }

      text += '\n<br /><h5><b>SECONDI PIATTI</b></h5>\n'
      if (storedMenu.secondi && storedMenu.secondi.length > 0) {
        storedMenu.secondi.forEach((dish) => {
          text += `<p>${dish}</p>\n`
        })
      } else {
        text += '<p>Nessun secondo piatto disponibile oggi</p>\n'
      }

      text += '\n<br /><h5><b>CONTORNI</b></h5>\n'
      if (storedMenu.contorni && storedMenu.contorni.length > 0) {
        storedMenu.contorni.forEach((dish) => {
          text += `<p>${dish}</p>\n`
        })
      } else {
        text += '<p>Nessun contorno disponibile oggi</p>\n'
      }

      text += '\n<br /><h4>Buon appetito!</h4>\n'
      text += '</div>\n'
      setFormattedText(text)
    }
  }, [])

  const handleBack = () => {
    navigate('/summary')
  }

  const handleSend = async () => {
    if (!sendTeams && !sendEmail) {
      setResult({
        status: 'error',
        message: 'Seleziona almeno una modalità di invio (Teams o Email).',
      })
      return
    }
    setSending(true)
    setResult({ status: '', message: '' })

    try {
      const response = await axios.post(URL_API_AZURE, {
        menuText: formattedText,
        sendTeams: sendTeams,
        sendEmail: sendEmail,
        date: menuData.date,
      })

      // Simula la risposta dell'API (rimuovi se non serve più)
      // await new Promise((resolve) => setTimeout(resolve, 1500))

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
        // Rimuovi il menu corrente dal localStorage dopo l'invio
        // localStorage.removeItem('currentMenu')
      } else {
        setResult({
          status: 'error',
          message:
            response.data && response.data.message
              ? response.data.message
              : "Si è verificato un errore durante l'invio del menu. Riprova più tardi.",
        })
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
            <div dangerouslySetInnerHTML={{ __html: formattedText }} />
          </Card.Body>
        </Card>

        <Card className='mb-4'>
          <Card.Header className='bg-light'>
            <h3 className='mb-0'>Modalità di invio</h3>
          </Card.Header>
          <Card.Body>
            <Row
              xs={1}
              md={2}
              lg={4}
              className='align-items-center justify-content-center'
            >
              <Col className='text-center'>
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
              </Col>
            </Row>
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

        {result.nutritionalAdvice && (
          <Alert variant={'warning'} className='mb-4'>
            <h5 className='mb-1'>Consigli nutrizionali</h5>
            <p className='mb-0'>{result.nutritionalAdvice}</p>
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
