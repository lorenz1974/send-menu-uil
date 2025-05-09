import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Alert, Row, Col, ListGroup, Form } from 'react-bootstrap'
import menuSuggestions from '../menu-suggestions.json'

const ManageSuggestions = () => {
  const navigate = useNavigate()
  const [savedPrimi, setSavedPrimi] = useState([])
  const [savedSecondi, setSavedSecondi] = useState([])
  const [savedContorni, setSavedContorni] = useState([])
  const [message, setMessage] = useState('')
  const [hasSavedDishes, setHasSavedDishes] = useState(false)

  // Stato per le selezioni
  const [selectedDishes, setSelectedDishes] = useState({
    primi: [],
    secondi: [],
    contorni: [],
  })

  // Stato per controllare se ci sono elementi selezionati
  const [hasSelectedDishes, setHasSelectedDishes] = useState(false)

  useEffect(() => {
    // Carica i piatti salvati dal localStorage
    loadSavedDishes()
  }, [])

  // Verifica se ci sono piatti selezionati ogni volta che cambia la selezione
  useEffect(() => {
    const anySelected =
      selectedDishes.primi.length > 0 ||
      selectedDishes.secondi.length > 0 ||
      selectedDishes.contorni.length > 0

    setHasSelectedDishes(anySelected)
  }, [selectedDishes])

  // Funzione per caricare i piatti salvati dal localStorage
  const loadSavedDishes = () => {
    const storedPrimi = JSON.parse(localStorage.getItem('primi') || '[]').sort()
    const storedSecondi = JSON.parse(
      localStorage.getItem('secondi') || '[]'
    ).sort()
    const storedContorni = JSON.parse(
      localStorage.getItem('contorni') || '[]'
    ).sort()

    setSavedPrimi(storedPrimi)
    setSavedSecondi(storedSecondi)
    setSavedContorni(storedContorni)

    // Controlla se ci sono piatti salvati
    setHasSavedDishes(
      storedPrimi.length > 0 ||
        storedSecondi.length > 0 ||
        storedContorni.length > 0
    )
  }

  // Funzione per caricare i suggerimenti preimpostati
  const loadDefaultSuggestions = () => {
    // Unione dei suggerimenti preimpostati con quelli già esistenti nel localStorage
    const updatedPrimi = [
      ...new Set([...savedPrimi, ...menuSuggestions.primi]),
    ].sort()
    const updatedSecondi = [
      ...new Set([...savedSecondi, ...menuSuggestions.secondi]),
    ].sort()
    const updatedContorni = [
      ...new Set([...savedContorni, ...menuSuggestions.contorni]),
    ].sort()

    // Aggiorna lo stato e il localStorage
    setSavedPrimi(updatedPrimi)
    setSavedSecondi(updatedSecondi)
    setSavedContorni(updatedContorni)

    localStorage.setItem('primi', JSON.stringify(updatedPrimi))
    localStorage.setItem('secondi', JSON.stringify(updatedSecondi))
    localStorage.setItem('contorni', JSON.stringify(updatedContorni))

    // Aggiorna il flag
    setHasSavedDishes(true)

    // Mostra messaggio di conferma
    setMessage('Suggerimenti predefiniti caricati correttamente')

    // Rimuovi il messaggio dopo 3 secondi
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  // Funzione per gestire la selezione di un piatto
  const handleSelectDish = (category, dish) => {
    setSelectedDishes((prev) => {
      const updatedCategory = prev[category].includes(dish)
        ? prev[category].filter((item) => item !== dish) // Rimuove il piatto se già selezionato
        : [...prev[category], dish] // Aggiunge il piatto se non è già selezionato

      return {
        ...prev,
        [category]: updatedCategory,
      }
    })
  }

  // Funzione per inserire i piatti selezionati nel menu attuale e tornare alla pagina principale
  const handleAddToMenu = () => {
    // Recupera il menu attuale da localStorage
    const currentMenu = JSON.parse(localStorage.getItem('currentMenu') || '{}')

    // Prendi i piatti già presenti o inizializza array vuoti
    const currentPrimi = currentMenu.primi || []
    const currentSecondi = currentMenu.secondi || []
    const currentContorni = currentMenu.contorni || []

    // Aggiungi i piatti selezionati al menu attuale, eliminando i duplicati con Set e ordinando alfabeticamente
    const updatedPrimi = [
      ...new Set([...currentPrimi, ...selectedDishes.primi]),
    ].sort()
    const updatedSecondi = [
      ...new Set([...currentSecondi, ...selectedDishes.secondi]),
    ].sort()
    const updatedContorni = [
      ...new Set([...currentContorni, ...selectedDishes.contorni]),
    ].sort()

    // Crea l'oggetto menu aggiornato
    const updatedMenu = {
      ...currentMenu,
      primi: updatedPrimi,
      secondi: updatedSecondi,
      contorni: updatedContorni,
    }

    // Salva il menu aggiornato in localStorage
    localStorage.setItem('currentMenu', JSON.stringify(updatedMenu))

    // Visualizza un messaggio di conferma
    setMessage('Piatti aggiunti al menù con successo')

    // Torna alla pagina principale dopo un breve ritardo
    setTimeout(() => {
      navigate('/')
    }, 1000)
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
                          {dish}
                        </div>
                        <div
                          className='btn btn-danger btn-sm'
                          onClick={(e) => {
                            e.stopPropagation() // Previene il trigger del ListGroup.Item
                            handleRemoveDish('primi', dish)
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
                          {dish}
                        </div>
                        <div
                          className='btn btn-danger btn-sm'
                          onClick={(e) => {
                            e.stopPropagation() // Previene il trigger del ListGroup.Item
                            handleRemoveDish('secondi', dish)
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
                          {dish}
                        </div>
                        <div
                          className='btn btn-danger btn-sm'
                          onClick={(e) => {
                            e.stopPropagation() // Previene il trigger del ListGroup.Item
                            handleRemoveDish('contorni', dish)
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
          {(savedPrimi.length > 0 ||
            savedSecondi.length > 0 ||
            savedContorni.length > 0) && (
            <Button variant='danger' size='lg' onClick={handleClearAll}>
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
