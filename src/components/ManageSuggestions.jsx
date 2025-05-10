import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Alert, Row, Col, ListGroup, Form } from 'react-bootstrap'
import useSuggestions from '@hooks/useSuggestions'

const ManageSuggestions = () => {
  const navigate = useNavigate()
  const {
    savedPrimi,
    savedSecondi,
    savedContorni,
    message,
    hasSavedDishes,
    loadDefaultSuggestions,
    removeDish,
    clearCategory,
    clearAllSuggestions,
    addSelectedToMenu,
  } = useSuggestions()

  // Stato per le selezioni
  const [selectedDishes, setSelectedDishes] = useState({
    primi: [],
    secondi: [],
    contorni: [],
  })

  // Stato per controllare se ci sono elementi selezionati
  const [hasSelectedDishes, setHasSelectedDishes] = useState(false)

  // Verifica se ci sono piatti selezionati ogni volta che cambia la selezione
  const handleSelectDish = (category, dish) => {
    setSelectedDishes((prev) => {
      const updatedCategory = prev[category].includes(dish)
        ? prev[category].filter((item) => item !== dish) // Rimuove il piatto se già selezionato
        : [...prev[category], dish] // Aggiunge il piatto se non è già selezionato

      const updatedSelection = {
        ...prev,
        [category]: updatedCategory,
      }

      // Verifica se ci sono selezioni attive
      const anySelected =
        updatedSelection.primi.length > 0 ||
        updatedSelection.secondi.length > 0 ||
        updatedSelection.contorni.length > 0

      setHasSelectedDishes(anySelected)

      return updatedSelection
    })
  }

  // Funzione per inserire i piatti selezionati nel menu attuale e tornare alla pagina principale
  const handleAddToMenu = () => {
    addSelectedToMenu(selectedDishes)

    // Torna alla pagina principale dopo un breve ritardo
    setTimeout(() => {
      navigate('/')
    }, 1000)
  }

  // Ritorna al form del menu
  const handleBack = () => {
    navigate('/')
  }

  return (
    <Card className='shadow p-0'>
      <Card.Header className='bg-info text-white'>
        <h2 className='mb-0'>Gestione Suggerimenti</h2>
      </Card.Header>

      <Card.Body>
        {message && (
          <Alert variant='success' className='mb-4'>
            {message}
          </Alert>
        )}

        <Row xs={1} md={2} lg={3}>
          <Col className='mb-4'>
            <Card className='h-100'>
              <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                <h3 className='mb-0'>Primi Piatti ({savedPrimi.length})</h3>
                {savedPrimi.length > 0 && (
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => clearCategory('primi')}
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
                            onChange={() => {}} // onChange vuoto perché gestito già dal click sull'item
                            onClick={(e) => e.stopPropagation()} // Evita doppio toggle quando si clicca direttamente sul checkbox
                            className='me-2'
                          />
                          <div className='dish-item'>{dish}</div>
                        </div>
                        <div
                          className='btn btn-danger btn-sm'
                          onClick={(e) => {
                            e.stopPropagation() // Previene il trigger del ListGroup.Item
                            removeDish('primi', dish)
                          }}
                        >
                          &times;
                        </div>
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

          <Col className='mb-4'>
            <Card className='h-100'>
              <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                <h3 className='mb-0'>Secondi Piatti ({savedSecondi.length})</h3>
                {savedSecondi.length > 0 && (
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => clearCategory('secondi')}
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
                            onChange={() => {}} // onChange vuoto perché gestito già dal click sull'item
                            onClick={(e) => e.stopPropagation()} // Evita doppio toggle quando si clicca direttamente sul checkbox
                            className='me-2'
                          />
                          <div className='dish-item'>{dish}</div>
                        </div>
                        <div
                          className='btn btn-danger btn-sm'
                          onClick={(e) => {
                            e.stopPropagation() // Previene il trigger del ListGroup.Item
                            removeDish('secondi', dish)
                          }}
                        >
                          &times;
                        </div>
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

          <Col className='mb-4'>
            <Card className='h-100'>
              <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                <h3 className='mb-0'>Contorni ({savedContorni.length})</h3>
                {savedContorni.length > 0 && (
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => clearCategory('contorni')}
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
                            onChange={() => {}} // onChange vuoto perché gestito già dal click sull'item
                            onClick={(e) => e.stopPropagation()} // Evita doppio toggle quando si clicca direttamente sul checkbox
                            className='me-2'
                          />
                          <div className='dish-item'>{dish}</div>
                        </div>
                        <div
                          className='btn btn-danger btn-sm'
                          onClick={(e) => {
                            e.stopPropagation() // Previene il trigger del ListGroup.Item
                            removeDish('contorni', dish)
                          }}
                        >
                          &times;
                        </div>
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

        <div className='d-flex flex-column flex-md-row justify-content-between gap-2 mt-4'>
          {hasSavedDishes && (
            <Button variant='danger' size='lg' onClick={clearAllSuggestions}>
              Rimuovi tutti i suggerimenti
            </Button>
          )}
          <div className='d-flex gap-2'>
            <Button variant='secondary' size='lg' onClick={handleBack}>
              Torna al menu
            </Button>
            {hasSelectedDishes && (
              <Button variant='success' size='lg' onClick={handleAddToMenu}>
                Inserisci nel menù
              </Button>
            )}
          </div>
          {!hasSavedDishes && (
            <Button
              variant='primary'
              size='lg'
              onClick={loadDefaultSuggestions}
            >
              Carica suggerimenti predefiniti
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default ManageSuggestions
