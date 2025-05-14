/**
 * Password Modal Component
 *
 * [DesignPattern: Presentational Component] This component implements the presentational
 * component pattern, focusing on UI rendering with minimal state management.
 */

// #region Imports
import React, { useState } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import type { PasswordModalProps } from '../types'
// #endregion

/**
 * Modal for requesting password before sending the menu
 */
const PasswordModal: React.FC<PasswordModalProps> = ({
  show,
  onClose,
  onConfirm,
  error,
}) => {
  // #region State Management
  const [password, setPassword] = useState<string>('')
  const [validated, setValidated] = useState<boolean>(false)
  // #endregion

  // #region Handlers
  /**
   * Handle form submission with validation
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    onConfirm(password)
    setPassword('') // Reset password for security
  }

  /**
   * Handle modal close with cleanup
   */
  const handleClose = (): void => {
    setPassword('') // Reset password for security
    setValidated(false)
    onClose()
  }
  // #endregion

  // #region Rendering
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Inserisci Password</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <p>Per inviare il menu è necessario inserire la password:</p>
          <Form.Group className='mb-3'>
            <Form.Control
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              aria-label='Password'
              aria-describedby='password-validation'
            />
            <Form.Control.Feedback type='invalid' id='password-validation'>
              Inserisci la password per continuare.
            </Form.Control.Feedback>
          </Form.Group>
          {error && (
            <Alert variant='danger' className='mt-3 mb-0'>
              {error}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Annulla
          </Button>
          <Button variant='primary' type='submit'>
            Conferma
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
  // #endregion
}

export default PasswordModal
