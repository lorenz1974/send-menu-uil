/**
 * Manage Phrases Component
 *
 * [DesignPattern: Container Component] This component implements the container
 * component pattern, managing opening and closing phrases.
 */

// #region Imports
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Alert,
  ListGroup,
  Form,
  Tab,
  Tabs,
} from 'react-bootstrap'
import { useSuggestionsContext } from '../context/SuggestionsContext'
// #endregion

/**
 * Component for managing opening and closing phrases
 */
const ManagePhrases: React.FC = () => {
  // #region Hooks & State
  const navigate = useNavigate()
  const {
    savedOpeningPhrases,
    savedClosingPhrases,
    message,
    showMessage,
    updateSuggestions,
    setMessage,
    setShowMessage,
  } = useSuggestionsContext()

  // State for new phrases
  const [newOpeningPhrase, setNewOpeningPhrase] = useState<string>('')
  const [newClosingPhrase, setNewClosingPhrase] = useState<string>('')

  // State to manage tabs
  const [activeTab, setActiveTab] = useState<string>('opening')
  // #endregion

  // #region Handlers
  /**
   * Add a new opening phrase
   */
  const handleAddOpeningPhrase = (): void => {
    if (!newOpeningPhrase.trim()) return

    const updatedPhrases = [...savedOpeningPhrases, newOpeningPhrase.trim()]
    updateSuggestions('openingPhrases', updatedPhrases)
    setNewOpeningPhrase('')
  }

  /**
   * Add a new closing phrase
   */
  const handleAddClosingPhrase = (): void => {
    if (!newClosingPhrase.trim()) return

    const updatedPhrases = [...savedClosingPhrases, newClosingPhrase.trim()]
    updateSuggestions('closingPhrases', updatedPhrases)
    setNewClosingPhrase('')
  }

  /**
   * Remove a phrase from either category
   */
  const removePhrase = (
    category: 'openingPhrases' | 'closingPhrases',
    phrase: string
  ): void => {
    const currentPhrases =
      category === 'openingPhrases' ? savedOpeningPhrases : savedClosingPhrases

    const updatedPhrases = currentPhrases.filter((item) => item !== phrase)
    updateSuggestions(category, updatedPhrases)
  }

  /**
   * Clear all phrases in a category
   */
  const clearCategory = (
    category: 'openingPhrases' | 'closingPhrases'
  ): void => {
    updateSuggestions(category, [])
  }

  /**
   * Navigate back to previous page
   */
  const handleBack = (): void => {
    navigate(-1)
  }

  /**
   * Load default phrases from data file
   */
  const loadDefaultPhrases = async (): Promise<void> => {
    try {
      const basePath = import.meta.env.BASE_URL || '/'
      const response = await fetch(`${basePath}data/menu-suggestions.json`)
      const defaultSuggestions = await response.json()

      // Update each category with defaults
      if (defaultSuggestions.openingPhrases) {
        updateSuggestions('openingPhrases', defaultSuggestions.openingPhrases)
      }

      if (defaultSuggestions.closingPhrases) {
        updateSuggestions('closingPhrases', defaultSuggestions.closingPhrases)
      }

      setMessage('Frasi predefinite caricate con successo')
      setShowMessage(true)

      // Hide message after 3 seconds
      setTimeout(() => {
        setShowMessage(false)
      }, 3000)
    } catch (error) {
      console.error('Errore nel caricamento delle frasi predefinite:', error)

      const errorMsg = `Errore nel caricamento delle frasi predefinite: ${
        error instanceof Error ? error.message : String(error)
      }`
      setMessage(errorMsg)
      setShowMessage(true)

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
        <h2 className='mb-0'>Gestione Frasi</h2>
      </Card.Header>

      <Card.Body>
        {showMessage && message && (
          <Alert
            variant={message.includes('Errore') ? 'danger' : 'success'}
            className='mb-4'
          >
            {message}
          </Alert>
        )}

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || 'opening')}
          className='mb-4'
        >
          <Tab eventKey='opening' title='Frasi di Apertura'>
            {/* Opening Phrases Tab */}
            <Card className='mb-4'>
              <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                <h3 className='mb-0'>
                  Frasi di Apertura ({savedOpeningPhrases.length})
                </h3>
                {savedOpeningPhrases.length > 0 && (
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => clearCategory('openingPhrases')}
                    aria-label='Rimuovi tutte le frasi di apertura'
                  >
                    Rimuovi tutti
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                <Form className='mb-3'>
                  <Form.Group className='d-flex'>
                    <Form.Control
                      type='text'
                      value={newOpeningPhrase}
                      onChange={(e) => setNewOpeningPhrase(e.target.value)}
                      placeholder='Nuova frase di apertura...'
                      className='mr-2'
                    />
                    <Button
                      variant='primary'
                      onClick={handleAddOpeningPhrase}
                      disabled={!newOpeningPhrase.trim()}
                      className='ms-2'
                    >
                      Aggiungi
                    </Button>
                  </Form.Group>
                </Form>

                {savedOpeningPhrases.length > 0 ? (
                  <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {savedOpeningPhrases.map((phrase, index) => (
                      <ListGroup.Item
                        key={index}
                        className='d-flex justify-content-between align-items-center'
                      >
                        <div className='phrase-item'>{phrase}</div>
                        <Button
                          variant='outline-danger'
                          size='sm'
                          onClick={() => removePhrase('openingPhrases', phrase)}
                          aria-label={`Rimuovi ${phrase}`}
                        >
                          &times;
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <div className='text-center text-muted p-3'>
                    Nessuna frase di apertura salvata
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey='closing' title='Frasi di Chiusura'>
            {/* Closing Phrases Tab */}
            <Card className='mb-4'>
              <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                <h3 className='mb-0'>
                  Frasi di Chiusura ({savedClosingPhrases.length})
                </h3>
                {savedClosingPhrases.length > 0 && (
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => clearCategory('closingPhrases')}
                    aria-label='Rimuovi tutte le frasi di chiusura'
                  >
                    Rimuovi tutti
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                <Form className='mb-3'>
                  <Form.Group className='d-flex'>
                    <Form.Control
                      type='text'
                      value={newClosingPhrase}
                      onChange={(e) => setNewClosingPhrase(e.target.value)}
                      placeholder='Nuova frase di chiusura...'
                      className='mr-2'
                    />
                    <Button
                      variant='primary'
                      onClick={handleAddClosingPhrase}
                      disabled={!newClosingPhrase.trim()}
                      className='ms-2'
                    >
                      Aggiungi
                    </Button>
                  </Form.Group>
                </Form>

                {savedClosingPhrases.length > 0 ? (
                  <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {savedClosingPhrases.map((phrase, index) => (
                      <ListGroup.Item
                        key={index}
                        className='d-flex justify-content-between align-items-center'
                      >
                        <div className='phrase-item'>{phrase}</div>
                        <Button
                          variant='outline-danger'
                          size='sm'
                          onClick={() => removePhrase('closingPhrases', phrase)}
                          aria-label={`Rimuovi ${phrase}`}
                        >
                          &times;
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <div className='text-center text-muted p-3'>
                    Nessuna frase di chiusura salvata
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        <div className='d-flex justify-content-between mt-4'>
          <Button variant='secondary' onClick={handleBack}>
            Indietro
          </Button>
          <Button variant='success' onClick={loadDefaultPhrases}>
            Carica Frasi Predefinite
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ManagePhrases
