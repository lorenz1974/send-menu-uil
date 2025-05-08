import React, { useState, useEffect } from 'react'
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

const MenuForm = () => {
  const navigate = useNavigate()

  // Stato per i piatti correnti
  const [primi, setPrimi] = useState([])
  const [secondi, setSecondi] = useState([])
  const [contorni, setContorni] = useState([])

  // Stato per i piatti salvati nel localStorage
  const [savedPrimi, setSavedPrimi] = useState([])
  const [savedSecondi, setSavedSecondi] = useState([])
  const [savedContorni, setSavedContorni] = useState([])

  const [menuDate, setMenuDate] = useState('')
  const [confirmMessage, setConfirmMessage] = useState('')

  // Carica i piatti salvati dal localStorage
  useEffect(() => {
    const storedPrimi = JSON.parse(localStorage.getItem('primi') || '[]')
    const storedSecondi = JSON.parse(localStorage.getItem('secondi') || '[]')
    const storedContorni = JSON.parse(localStorage.getItem('contorni') || '[]')

    setSavedPrimi(storedPrimi)
    setSavedSecondi(storedSecondi)
    setSavedContorni(storedContorni)

    // Carica il menu corrente (se esiste)
    const currentMenu = JSON.parse(localStorage.getItem('currentMenu') || '{}')
    if (currentMenu && Object.keys(currentMenu).length > 0) {
      setPrimi(currentMenu.primi || [])
      setSecondi(currentMenu.secondi || [])
      setContorni(currentMenu.contorni || [])

      // Se c'è una data salvata, usala
      if (currentMenu.date) {
        setMenuDate(currentMenu.date)
      } else {
        // Altrimenti imposta la data di oggi come default
        const today = new Date().toISOString().split('T')[0]
        setMenuDate(today)
      }
    } else {
      // Imposta la data di oggi come default se non c'è un menu salvato
      const today = new Date().toISOString().split('T')[0]
      setMenuDate(today)
    }
  }, [])

  // Funzione per salvare il menu nel localStorage
  const saveMenu = () => {
    // Salva i nuovi piatti nel localStorage
    const updatedPrimi = [...new Set([...savedPrimi, ...primi])]
    const updatedSecondi = [...new Set([...savedSecondi, ...secondi])]
    const updatedContorni = [...new Set([...savedContorni, ...contorni])]

    localStorage.setItem('primi', JSON.stringify(updatedPrimi))
    localStorage.setItem('secondi', JSON.stringify(updatedSecondi))
    localStorage.setItem('contorni', JSON.stringify(updatedContorni))

    // Salva il menu corrente per il riepilogo
    const menuData = {
      date: menuDate,
      primi,
      secondi,
      contorni,
    }

    localStorage.setItem('currentMenu', JSON.stringify(menuData))

    return menuData
  }

  // Gestisce il click su "Anteprima e Invio" - salva e naviga alla pagina di riepilogo
  const handleSubmit = (e) => {
    e.preventDefault()
    saveMenu()
    navigate('/summary')
  }

  // Aggiunge un reset del form
  const handleReset = () => {
    setPrimi([])
    setSecondi([])
    setContorni([])
    localStorage.removeItem('currentMenu')
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
          <Row>
            <Col md={4} className='mb-4'>
              <DishCategory
                title='Primi'
                dishes={primi}
                setDishes={setPrimi}
                savedDishes={savedPrimi}
              />
            </Col>

            <Col md={4} className='mb-4'>
              <DishCategory
                title='Secondi'
                dishes={secondi}
                setDishes={setSecondi}
                savedDishes={savedSecondi}
              />
            </Col>

            <Col md={4} className='mb-4'>
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
