import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  Alert,
} from 'react-bootstrap'
import DishCategory from '@components/DishCategory'
import useMenu from '@hooks/useMenu'
import useSuggestions from '@hooks/useSuggestions'

const MenuForm = () => {
  const navigate = useNavigate()
  const {
    primi,
    setPrimi,
    secondi,
    setSecondi,
    contorni,
    setContorni,
    menuDate,
    setMenuDate,
    saveMenu,
    resetMenu,
  } = useMenu()

  const { savedPrimi, savedSecondi, savedContorni, message, showMessage } =
    useSuggestions()
  const [confirmMessage, setConfirmMessage] = useState('')

  // Gestisce il click su "Anteprima e Invio" - salva e naviga alla pagina di riepilogo
  const handleSubmit = (e) => {
    e.preventDefault()
    saveMenu()
    navigate('/summary')
  }

  // Aggiunge un reset del form
  const handleReset = () => {
    resetMenu()
    setConfirmMessage('')
  }

  return (
    <Card className='shadow p-0'>
      <Card.Header className='bg-primary text-white'>
        <h2 className='mb-0'>Composizione Menu del Giorno</h2>
      </Card.Header>

      <Card.Body>
        <Row className='mb-4'>
          <Col md={6} className='mb-3 mb-md-0'>
            <InputGroup>
              <InputGroup.Text>Data del menu:</InputGroup.Text>
              <Form.Control
                type='date'
                value={menuDate}
                onChange={(e) => setMenuDate(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6} className='d-flex justify-content-md-end'>
            <Link to='/suggestions' className='btn btn-info w-100 w-md-auto'>
              Gestisci Suggerimenti
            </Link>
          </Col>
        </Row>

        <Form onSubmit={handleSubmit}>
          <Row xs={1} md={2} lg={3}>
            <Col className='mb-4'>
              <DishCategory
                title='Primi'
                dishes={primi}
                setDishes={setPrimi}
                savedDishes={savedPrimi}
              />
            </Col>

            <Col className='mb-4'>
              <DishCategory
                title='Secondi'
                dishes={secondi}
                setDishes={setSecondi}
                savedDishes={savedSecondi}
              />
            </Col>

            <Col className='mb-4'>
              <DishCategory
                title='Contorni'
                dishes={contorni}
                setDishes={setContorni}
                savedDishes={savedContorni}
              />
            </Col>
          </Row>

          {confirmMessage && (
            <Alert variant='success' className='text-center mb-4'>
              {confirmMessage}
            </Alert>
          )}

          {message && (
            <Alert variant='success' className='text-center mb-4'>
              {message}
            </Alert>
          )}

          <div className='d-flex flex-column flex-md-row justify-content-between gap-2'>
            <Button variant='secondary' size='lg' onClick={handleReset}>
              Nuovo Menu
            </Button>
            <Button type='submit' variant='primary' size='lg'>
              Anteprima e Invio
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default MenuForm
