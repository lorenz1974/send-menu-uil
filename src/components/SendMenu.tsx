/**
 * Send Menu Component
 *
 * [DesignPattern: Container Component] This component implements the container
 * component pattern, managing the send process for the menu.
 */

// #region Imports
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Form, Alert, Col, Row } from 'react-bootstrap'
import { useMenuContext } from '../context/MenuContext'
import { useMenuSenderContext } from '../context/MenuSenderContext'
import PasswordModal from './PasswordModal'
import type { MenuData } from '../types'
// #endregion

/**
 * Component for configuring and sending the menu via multiple channels
 */
const SendMenu: React.FC = () => {
  // #region Hooks & State
  const navigate = useNavigate()
  const { loadMenu, resetMenu, getFormattedDate } = useMenuContext()

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
  } = useMenuSenderContext()

  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [formattedText, setFormattedText] = useState<string>('')

  // Load menu data when component mounts
  useEffect(() => {
    const currentMenu = loadMenu()
    setMenuData(currentMenu)

    if (currentMenu && currentMenu.date) {
      // Format HTML text for sending
      const text = formatMenuForSending(currentMenu)
      setFormattedText(text)
    }
  }, [])
  // #endregion

  // #region Handlers
  /**
   * Navigate back to summary page
   */
  const handleBack = (): void => {
    navigate('/summary')
  }

  /**
   * Handle sending the menu with selected options
   */
  const handleSend = async (): Promise<void> => {
    if (!sendTeams && !sendEmail) {
      return // Error is handled internally by useMenuSender
    }

    if (menuData) {
      await sendMenu(formattedText, menuData)
    }
  }

  /**
   * Reset menu and navigate to composition page
   */
  const handleNewMenu = (): void => {
    resetMenu()
    navigate('/')
  }
  // #endregion

  // #region Rendering
  // If menu data is not available, show error message
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
          <Button
            variant='primary'
            size='lg'
            onClick={() => navigate('/')}
            aria-label='Torna alla composizione del menu'
          >
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
        onClose={handleClosePasswordModal}
        onConfirm={handlePasswordConfirm}
        error={passwordError}
      />

      <Card className='text-center shadow'>
        <Card.Header className='bg-primary text-white'>
          <h2 className='mb-0'>Invio Menu del {formattedDate}</h2>
        </Card.Header>

        <Card.Body>
          {/* Menu Preview */}
          <Card className='mb-4'>
            <Card.Header className='bg-light'>
              <h3 className='mb-0'>Anteprima del messaggio</h3>
            </Card.Header>
            <Card.Body>
              <div
                dangerouslySetInnerHTML={{ __html: formattedText }}
                aria-label='Anteprima del menu'
              />
            </Card.Body>
          </Card>

          {/* Send Options */}
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
                    aria-label='Invia tramite Teams'
                  />

                  <Form.Check
                    type='checkbox'
                    id='email'
                    label='Invia tramite Email'
                    checked={sendEmail}
                    onChange={() => setSendEmail(!sendEmail)}
                    aria-label='Invia tramite Email'
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Result Messages */}
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

          {/* Actions */}
          <div className='d-flex flex-column flex-md-row justify-content-between gap-2'>
            <Button
              variant='secondary'
              size='lg'
              onClick={handleBack}
              disabled={sending}
              aria-label='Torna indietro'
            >
              Indietro
            </Button>
            <Button
              variant='primary'
              size='lg'
              onClick={handleSend}
              disabled={sending || (!sendTeams && !sendEmail)}
              aria-label='Invia menu'
            >
              {sending ? 'Invio in corso...' : 'Invia Menu'}
            </Button>
            {result.status === 'success' && (
              <Button
                variant='success'
                size='lg'
                onClick={handleNewMenu}
                aria-label='Crea nuovo menu'
              >
                Nuovo Menu
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  )
  // #endregion
}

export default SendMenu
