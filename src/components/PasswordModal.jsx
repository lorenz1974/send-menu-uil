import { useState } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'

/**
 * Modal per richiedere la password prima dell'invio del menu
 * @param {Object} props - Proprietà del componente
 * @returns {JSX.Element} Componente Modal per inserimento password
 */
// [DesignPattern: Presentation] Componente di presentazione per la richiesta della password
const PasswordModal = ({ show, onHide, onConfirm, error }) => {
  const [password, setPassword] = useState('')
  const [validated, setValidated] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    onConfirm(password)
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
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
            />
            <Form.Control.Feedback type='invalid'>
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
          <Button variant='secondary' onClick={onHide}>
            Annulla
          </Button>
          <Button variant='primary' type='submit'>
            Conferma
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default PasswordModal
