import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Alert, Row, Col, ListGroup } from 'react-bootstrap'

const ManageSuggestions = () => {
  const navigate = useNavigate()
  const [savedPrimi, setSavedPrimi] = useState([])
  const [savedSecondi, setSavedSecondi] = useState([])
  const [savedContorni, setSavedContorni] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Carica i piatti salvati dal localStorage
    loadSavedDishes()
  }, [])

  // Funzione per caricare i piatti salvati dal localStorage
  const loadSavedDishes = () => {
    const storedPrimi = JSON.parse(localStorage.getItem('primi') || '[]')
    const storedSecondi = JSON.parse(localStorage.getItem('secondi') || '[]')
    const storedContorni = JSON.parse(localStorage.getItem('contorni') || '[]')

    setSavedPrimi(storedPrimi)
    setSavedSecondi(storedSecondi)
    setSavedContorni(storedContorni)
  }

  // Funzione per rimuovere un piatto dalla lista
  const handleRemoveDish = (category, dishToRemove) => {
    let updatedList = []
    let storageKey = ''

    // Identifica la categoria e prepara la lista aggiornata
    if (category === 'primi') {
      updatedList = savedPrimi.filter((dish) => dish !== dishToRemove)
      setSavedPrimi(updatedList)
      storageKey = 'primi'
    } else if (category === 'secondi') {
      updatedList = savedSecondi.filter((dish) => dish !== dishToRemove)
      setSavedSecondi(updatedList)
      storageKey = 'secondi'
    } else if (category === 'contorni') {
      updatedList = savedContorni.filter((dish) => dish !== dishToRemove)
      setSavedContorni(updatedList)
      storageKey = 'contorni'
    }

    // Aggiorna il localStorage
    localStorage.setItem(storageKey, JSON.stringify(updatedList))

    // Mostra messaggio di conferma
    setMessage(`${dishToRemove} rimosso dai suggerimenti`)

    // Rimuovi il messaggio dopo 3 secondi
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  // Funzione per pulire una categoria intera
  const handleClearCategory = (category) => {
    if (category === 'primi') {
      setSavedPrimi([])
      localStorage.setItem('primi', JSON.stringify([]))
    } else if (category === 'secondi') {
      setSavedSecondi([])
      localStorage.setItem('secondi', JSON.stringify([]))
    } else if (category === 'contorni') {
      setSavedContorni([])
      localStorage.setItem('contorni', JSON.stringify([]))
    }

    // Mostra messaggio di conferma
    setMessage(`Tutti i ${category} sono stati rimossi dai suggerimenti`)

    // Rimuovi il messaggio dopo 3 secondi
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  // Funzione per pulire tutti i suggerimenti
  const handleClearAll = () => {
    setSavedPrimi([])
    setSavedSecondi([])
    setSavedContorni([])

    localStorage.setItem('primi', JSON.stringify([]))
    localStorage.setItem('secondi', JSON.stringify([]))
    localStorage.setItem('contorni', JSON.stringify([]))

    // Mostra messaggio di conferma
    setMessage('Tutti i suggerimenti sono stati rimossi')

    // Rimuovi il messaggio dopo 3 secondi
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  // Ritorna al form del menu
  const handleBack = () => {
    navigate('/')
  }

  return (
    <Card className='shadow'>
      <Card.Header className='bg-info text-white'>
        <h2 className='mb-0'>Gestione Suggerimenti</h2>
      </Card.Header>

      <Card.Body>
        {message && (
          <Alert variant='success' className='mb-4'>
            {message}
          </Alert>
        )}

        <Row>
          <Col md={4} className='mb-4'>
            <Card className='h-100'>
              <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                <h3 className='mb-0'>Primi Piatti ({savedPrimi.length})</h3>
                {savedPrimi.length > 0 && (
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => handleClearCategory('primi')}
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
                      >
                        {dish}
                        <Button
                          variant='danger'
                          size='sm'
                          onClick={() => handleRemoveDish('primi', dish)}
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

          <Col md={4} className='mb-4'>
            <Card className='h-100'>
              <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                <h3 className='mb-0'>Secondi Piatti ({savedSecondi.length})</h3>
                {savedSecondi.length > 0 && (
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => handleClearCategory('secondi')}
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
                      >
                        {dish}
                        <Button
                          variant='danger'
                          size='sm'
                          onClick={() => handleRemoveDish('secondi', dish)}
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

          <Col md={4} className='mb-4'>
            <Card className='h-100'>
              <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                <h3 className='mb-0'>Contorni ({savedContorni.length})</h3>
                {savedContorni.length > 0 && (
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => handleClearCategory('contorni')}
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
                      >
                        {dish}
                        <Button
                          variant='danger'
                          size='sm'
                          onClick={() => handleRemoveDish('contorni', dish)}
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

        <div className='d-flex flex-column flex-md-row justify-content-between gap-2 mt-4'>
          {(savedPrimi.length > 0 ||
            savedSecondi.length > 0 ||
            savedContorni.length > 0) && (
            <Button variant='danger' size='lg' onClick={handleClearAll}>
              Rimuovi tutti i suggerimenti
            </Button>
          )}
          <Button variant='secondary' size='lg' onClick={handleBack}>
            Torna al menu
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ManageSuggestions
