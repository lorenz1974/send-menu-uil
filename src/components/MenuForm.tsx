/**
 * Menu Form Component
 *
 * [DesignPattern: Container Component] This component implements the container
 * component pattern, managing state and business logic for the menu form.
 */

// #region Imports
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
import DishCategory from './DishCategory'
import { useMenuContext } from '../context/MenuContext'
import { useSuggestionsContext } from '../context/SuggestionsContext'
// #endregion

/**
 * Form for composing the daily menu with multiple dish categories
 */
const MenuForm: React.FC = () => {
  // #region Hooks & State
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
  } = useMenuContext()

  const { savedPrimi, savedSecondi, savedContorni, message, showMessage } =
    useSuggestionsContext()
  const [confirmMessage, setConfirmMessage] = useState<string>('')
  // #endregion

  // #region Handlers
  /**
   * Handle form submission - save and navigate to summary page
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    saveMenu()
    navigate('/summary')
  }

  /**
   * Reset the form to empty state
   */
  const handleReset = (): void => {
    resetMenu()
    setConfirmMessage('')
  }
  // #endregion

  // #region Rendering
  return (
    <Card className='shadow p-0'>
      <Card.Header className='bg-primary text-white'>
        <h2 className='mb-0'>Composizione Menu del Giorno</h2>
      </Card.Header>

      <Card.Body>
        {/* Date picker and manage suggestions link */}
        <Row className='mb-4'>
          <Col xs={12} sm={6} lg={4} className='mb-3 mb-md-0'>
            <InputGroup>
              <InputGroup.Text>Data del menu:</InputGroup.Text>
              <Form.Control
                type='date'
                value={menuDate}
                onChange={(e) => setMenuDate(e.target.value)}
                aria-label='Data del menu'
              />
            </InputGroup>
          </Col>
        </Row>

        <Form onSubmit={handleSubmit}>
          {/* Dish categories */}
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

          {/* Confirmation messages */}
          {confirmMessage && (
            <Alert variant='success' className='text-center mb-4'>
              {confirmMessage}
            </Alert>
          )}

          {showMessage && message && (
            <Alert variant='success' className='text-center mb-4'>
              {message}
            </Alert>
          )}

          {/* Form actions */}
          <div className='d-flex flex-column flex-md-row justify-content-between gap-2'>
            <Button
              variant='secondary'
              size='lg'
              onClick={handleReset}
              aria-label='Nuovo Menu'
            >
              Nuovo Menu
            </Button>
            <Button
              as={Link as any}
              to='/suggestions'
              variant='warning'
              size='lg'
              aria-label='Gestisci Suggerimenti'
            >
              Gestisci Suggerimenti
            </Button>
            <Button
              type='submit'
              variant='primary'
              size='lg'
              aria-label='Anteprima e Invio'
            >
              Anteprima e Invio
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
  // #endregion
}

export default MenuForm
