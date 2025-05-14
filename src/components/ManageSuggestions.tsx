/**
 * Manage Suggestions Component
 *
 * [DesignPattern: Container Component] This component implements the container
 * component pattern, managing the suggestions data and providing UI for manipulation.
 */

// #region Imports
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Alert, Row, Col, ListGroup, Form } from 'react-bootstrap'
import { useSuggestionsContext } from '../context/SuggestionsContext'
import { useMenuContext } from '../context/MenuContext'
import type { DishCategory } from '../types'
// #endregion

/**
 * Type for selected dishes state
 */
interface SelectedDishes {
  primi: string[]
  secondi: string[]
  contorni: string[]
}

/**
 * Component for managing dish suggestions
 */
const ManageSuggestions: React.FC = () => {
  // #region Hooks & State
  const navigate = useNavigate()
  const {
    savedPrimi,
    savedSecondi,
    savedContorni,
    message,
    showMessage,
    updateSuggestions,
    setMessage,
    setShowMessage,
  } = useSuggestionsContext()

  // Local state for error messages
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showError, setShowError] = useState<boolean>(false)

  const { addToMenu } = useMenuContext()

  // State for dish selections
  const [selectedDishes, setSelectedDishes] = useState<SelectedDishes>({
    primi: [],
    secondi: [],
    contorni: [],
  })

  // State to check if there are selected items
  const [hasSelectedDishes, setHasSelectedDishes] = useState<boolean>(false)

  // Computed property for checking if there are any saved dishes
  const hasSavedDishes =
    savedPrimi.length > 0 || savedSecondi.length > 0 || savedContorni.length > 0
  // #endregion

  // #region Handlers
  /**
   * Toggle selection of a dish in a category
   */
  const handleSelectDish = (category: DishCategory, dish: string): void => {
    setSelectedDishes((prev) => {
      const updatedCategory = prev[category].includes(dish)
        ? prev[category].filter((item) => item !== dish) // Remove dish if already selected
        : [...prev[category], dish] // Add dish if not already selected

      const updatedSelection = {
        ...prev,
        [category]: updatedCategory,
      }

      // Check if there are any active selections
      const anySelected =
        updatedSelection.primi.length > 0 ||
        updatedSelection.secondi.length > 0 ||
        updatedSelection.contorni.length > 0

      setHasSelectedDishes(anySelected)

      return updatedSelection
    })
  }

  /**
   * Add selected dishes to the current menu and navigate to menu form
   */
  const handleAddToMenu = (): void => {
    // Add selected dishes to each category
    if (selectedDishes.primi.length > 0) {
      addToMenu('primi', selectedDishes.primi)
    }

    if (selectedDishes.secondi.length > 0) {
      addToMenu('secondi', selectedDishes.secondi)
    }

    if (selectedDishes.contorni.length > 0) {
      addToMenu('contorni', selectedDishes.contorni)
    } // Show success message
    setMessage('Piatti aggiunti al menu con successo')
    setShowMessage(true)

    // Hide message after 3 seconds (in parallel with navigation)
    setTimeout(() => {
      setShowMessage(false)
    }, 3000)

    // Navigate back to main page after a short delay
    setTimeout(() => {
      navigate('/')
    }, 1000)
  }

  /**
   * Navigate back to menu form
   */
  const handleBack = (): void => {
    navigate('/')
  }

  /**
   * Remove a dish from suggestions
   */
  const removeDish = (category: DishCategory, dish: string): void => {
    // Remove from selection if selected
    if (selectedDishes[category].includes(dish)) {
      handleSelectDish(category, dish)
    }

    // Remove from saved dishes
    switch (category) {
      case 'primi':
        updateSuggestions(
          'primi',
          savedPrimi.filter((item) => item !== dish)
        )
        break
      case 'secondi':
        updateSuggestions(
          'secondi',
          savedSecondi.filter((item) => item !== dish)
        )
        break
      case 'contorni':
        updateSuggestions(
          'contorni',
          savedContorni.filter((item) => item !== dish)
        )
        break
    }
  }

  /**
   * Clear all suggestions in a category
   */
  const clearCategory = (category: DishCategory): void => {
    updateSuggestions(category, [])

    // Clear selections for this category
    setSelectedDishes((prev) => ({
      ...prev,
      [category]: [],
    }))

    // Update hasSelectedDishes state
    setHasSelectedDishes(
      category === 'primi'
        ? selectedDishes.secondi.length > 0 ||
            selectedDishes.contorni.length > 0
        : category === 'secondi'
        ? selectedDishes.primi.length > 0 || selectedDishes.contorni.length > 0
        : selectedDishes.primi.length > 0 || selectedDishes.secondi.length > 0
    )
  }

  /**
   * Clear all suggestions from all categories
   */
  const clearAllSuggestions = (): void => {
    updateSuggestions('primi', [])
    updateSuggestions('secondi', [])
    updateSuggestions('contorni', [])

    // Clear all selections
    setSelectedDishes({
      primi: [],
      secondi: [],
      contorni: [],
    })

    setHasSelectedDishes(false)
  }
  /**
   * Load default suggestions from data file
   */
  const loadDefaultSuggestions = async (): Promise<void> => {
    try {
      // Fetch default suggestions from assets using relative path or import.meta.env.BASE_URL
      // import.meta.env.BASE_URL è il percorso base dell'applicazione configurato in vite
      const basePath = import.meta.env.BASE_URL || '/'
      const response = await fetch(`${basePath}data/menu-suggestions.json`)
      const defaultSuggestions = await response.json()

      // Update each category with defaults
      if (defaultSuggestions.primi) {
        updateSuggestions('primi', defaultSuggestions.primi)
      }

      if (defaultSuggestions.secondi) {
        updateSuggestions('secondi', defaultSuggestions.secondi)
      }

      if (defaultSuggestions.contorni) {
        updateSuggestions('contorni', defaultSuggestions.contorni)
      }
      setMessage('Suggerimenti predefiniti caricati con successo')
      setShowMessage(true)
    } catch (error) {
      console.error(
        'Errore nel caricamento dei suggerimenti predefiniti:',
        error
      )

      // Uso Alert variant danger per l'errore
      const errorMsg = `Errore nel caricamento dei suggerimenti predefiniti: ${
        error instanceof Error ? error.message : String(error)
      }`
      setMessage(errorMsg)
      setShowMessage(true)

      // Nascondi il messaggio dopo 5 secondi
      setTimeout(() => {
        setShowMessage(false)
      }, 5000)
    }
  }
  // #endregion

  // #region Rendering
  return (
    <Card className='shadow p-0'>
      <Card.Header className='bg-info text-white'>
        <h2 className='mb-0'>Gestione Suggerimenti</h2>
      </Card.Header>

      <Card.Body>
        {' '}
        {showMessage && message && (
          <Alert
            variant={message.includes('Errore') ? 'danger' : 'success'}
            className='mb-4'
          >
            {message}
          </Alert>
        )}
        <Row xs={1} md={2} lg={3}>
          {/* Primi Piatti */}
          <Col className='mb-4'>
            <Card className='h-100'>
              <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                <h3 className='mb-0'>Primi Piatti ({savedPrimi.length})</h3>
                {savedPrimi.length > 0 && (
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => clearCategory('primi')}
                    aria-label='Rimuovi tutti i primi piatti'
                  >
                    Rimuovi tutti
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                {savedPrimi.length > 0 ? (
                  <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {savedPrimi.map((dish, index) => (
                      <ListGroup.Item
                        key={index}
                        className='d-flex justify-content-between align-items-center'
                        action
                        active={selectedDishes.primi.includes(dish)}
                        onClick={() => handleSelectDish('primi', dish)}
                      >
                        <div className='d-flex justify-content-start align-content-center'>
                          <Form.Check
                            type='checkbox'
                            checked={selectedDishes.primi.includes(dish)}
                            onChange={() => {}} // Handled by ListGroup.Item click
                            onClick={(e: React.MouseEvent) =>
                              e.stopPropagation()
                            } // Prevent double toggle
                            className='me-2'
                            aria-label={`Seleziona ${dish}`}
                          />
                          <div className='dish-item'>{dish}</div>
                        </div>
                        <Button
                          variant='danger'
                          size='sm'
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation() // Prevent ListGroup.Item click
                            removeDish('primi', dish)
                          }}
                          aria-label={`Rimuovi ${dish}`}
                        >
                          &times;
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className='text-muted text-center py-3'>
                    Nessun suggerimento salvato
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Secondi Piatti */}
          <Col className='mb-4'>
            <Card className='h-100'>
              <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                <h3 className='mb-0'>Secondi Piatti ({savedSecondi.length})</h3>
                {savedSecondi.length > 0 && (
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => clearCategory('secondi')}
                    aria-label='Rimuovi tutti i secondi piatti'
                  >
                    Rimuovi tutti
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                {savedSecondi.length > 0 ? (
                  <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {savedSecondi.map((dish, index) => (
                      <ListGroup.Item
                        key={index}
                        className='d-flex justify-content-between align-items-center'
                        action
                        active={selectedDishes.secondi.includes(dish)}
                        onClick={() => handleSelectDish('secondi', dish)}
                      >
                        <div className='d-flex justify-content-start align-content-center'>
                          <Form.Check
                            type='checkbox'
                            checked={selectedDishes.secondi.includes(dish)}
                            onChange={() => {}} // Handled by ListGroup.Item click
                            onClick={(e: React.MouseEvent) =>
                              e.stopPropagation()
                            } // Prevent double toggle
                            className='me-2'
                            aria-label={`Seleziona ${dish}`}
                          />
                          <div className='dish-item'>{dish}</div>
                        </div>
                        <Button
                          variant='danger'
                          size='sm'
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation() // Prevent ListGroup.Item click
                            removeDish('secondi', dish)
                          }}
                          aria-label={`Rimuovi ${dish}`}
                        >
                          &times;
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className='text-muted text-center py-3'>
                    Nessun suggerimento salvato
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Contorni */}
          <Col className='mb-4'>
            <Card className='h-100'>
              <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                <h3 className='mb-0'>Contorni ({savedContorni.length})</h3>
                {savedContorni.length > 0 && (
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => clearCategory('contorni')}
                    aria-label='Rimuovi tutti i contorni'
                  >
                    Rimuovi tutti
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                {savedContorni.length > 0 ? (
                  <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {savedContorni.map((dish, index) => (
                      <ListGroup.Item
                        key={index}
                        className='d-flex justify-content-between align-items-center'
                        action
                        active={selectedDishes.contorni.includes(dish)}
                        onClick={() => handleSelectDish('contorni', dish)}
                      >
                        <div className='d-flex justify-content-start align-content-center'>
                          <Form.Check
                            type='checkbox'
                            checked={selectedDishes.contorni.includes(dish)}
                            onChange={() => {}} // Handled by ListGroup.Item click
                            onClick={(e: React.MouseEvent) =>
                              e.stopPropagation()
                            } // Prevent double toggle
                            className='me-2'
                            aria-label={`Seleziona ${dish}`}
                          />
                          <div className='dish-item'>{dish}</div>
                        </div>
                        <Button
                          variant='danger'
                          size='sm'
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation() // Prevent ListGroup.Item click
                            removeDish('contorni', dish)
                          }}
                          aria-label={`Rimuovi ${dish}`}
                        >
                          &times;
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className='text-muted text-center py-3'>
                    Nessun suggerimento salvato
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* Actions */}
        <div className='d-flex flex-column flex-md-row justify-content-between gap-2 mt-4'>
          {hasSavedDishes && (
            <Button
              variant='danger'
              size='lg'
              onClick={clearAllSuggestions}
              aria-label='Rimuovi tutti i suggerimenti'
            >
              Rimuovi tutti i suggerimenti
            </Button>
          )}
          <div className='d-flex gap-2'>
            <Button
              variant='secondary'
              size='lg'
              onClick={handleBack}
              aria-label='Torna al menu'
            >
              Torna al menu
            </Button>
            {hasSelectedDishes && (
              <Button
                variant='success'
                size='lg'
                onClick={handleAddToMenu}
                aria-label='Inserisci nel menù'
              >
                Inserisci nel menù
              </Button>
            )}
          </div>
          {!hasSavedDishes && (
            <Button
              variant='primary'
              size='lg'
              onClick={loadDefaultSuggestions}
              aria-label='Carica suggerimenti predefiniti'
            >
              Carica suggerimenti predefiniti
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  )
  // #endregion
}

export default ManageSuggestions
