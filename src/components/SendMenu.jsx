import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Form, Alert, Col, Row } from 'react-bootstrap'
import useMenu from '@hooks/useMenu'
import useMenuSender from '@hooks/useMenuSender'
import PasswordModal from './PasswordModal'

const SendMenu = () => {
  const navigate = useNavigate()
  const { loadMenu, resetMenu, getFormattedDate } = useMenu()
  const {
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
  } = useMenuSender()

  const [menuData, setMenuData] = useState(null)
  const [formattedText, setFormattedText] = useState('')

  useEffect(() => {
    // Carica i dati del menu dal localStorage
    const currentMenu = loadMenu()
    setMenuData(currentMenu)

    if (currentMenu && currentMenu.date) {
      // Formatta il testo HTML per l'invio
      const text = formatMenuForSending(currentMenu)
      setFormattedText(text)
    }
  }, []) // Array vuoto: l'effetto viene eseguito solo al mount del componente

  const handleBack = () => {
    navigate('/summary')
  }

  const handleSend = async () => {
    if (!sendTeams && !sendEmail) {
      return // L'errore è gestito internamente da useMenuSender
    }

    await sendMenu(formattedText, menuData)
  }

  const handleNewMenu = () => {
    resetMenu()
    navigate('/')
  }

  if (!menuData || Object.keys(menuData).length === 0) {
    return (
      <Card className='shadow text-center'>
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

  const formattedDate = getFormattedDate()

  return (
    <>
      <PasswordModal
        show={showPasswordModal}
        onHide={handleClosePasswordModal}
        onConfirm={handlePasswordConfirm}
        error={passwordError}
      />

      <Card className='text-center shadow'>
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
                xs={2}
                md={3}
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
    </>
  )
}

export default SendMenu
