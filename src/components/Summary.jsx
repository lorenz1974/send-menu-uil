import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Row, Col, ListGroup } from 'react-bootstrap'

const Summary = () => {
  const navigate = useNavigate()
  const [menuData, setMenuData] = useState(null)
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    // Carica i dati del menu dal localStorage
    const storedMenu = JSON.parse(localStorage.getItem('currentMenu') || '{}')
    setMenuData(storedMenu)

    // Formatta la data in formato italiano (GG/MM/AAAA)
    if (storedMenu && storedMenu.date) {
      const [year, month, day] = storedMenu.date.split('-')
      setFormattedDate(`${day}/${month}/${year}`)
    }
  }, [])

  const handleBack = () => {
    navigate('/')
  }

  const handleSend = () => {
    navigate('/send')
  }

  if (!menuData || Object.keys(menuData).length === 0) {
    return (
      <Card className='shadow'>
        <Card.Header className='bg-danger text-white'>
          <h2 className='mb-0'>Menu non disponibile</h2>
        </Card.Header>
        <Card.Body className='text-center p-5'>
          <p className='lead mb-4'>
            Non sono stati trovati dati del menu. Torna alla pagina di
            composizione.
          </p>
          <Button variant='primary' size='lg' onClick={handleBack}>
            Torna alla composizione
          </Button>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className='shadow'>
      <Card.Header className='bg-primary text-white'>
        <h2 className='mb-0'>Riepilogo Menu del {formattedDate}</h2>
      </Card.Header>

      <Card.Body>
        <Row>
          <Col md={4} className='mb-4'>
            <Card className='h-100'>
              <Card.Header className='bg-light'>
                <h3 className='mb-0'>Primi Piatti</h3>
              </Card.Header>
              <Card.Body>
                {menuData.primi && menuData.primi.length > 0 ? (
                  <ListGroup>
                    {menuData.primi.map((dish, index) => (
                      <ListGroup.Item key={index}>{dish}</ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className='text-muted text-center py-3'>
                    Nessun primo piatto inserito
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className='mb-4'>
            <Card className='h-100'>
              <Card.Header className='bg-light'>
                <h3 className='mb-0'>Secondi Piatti</h3>
              </Card.Header>
              <Card.Body>
                {menuData.secondi && menuData.secondi.length > 0 ? (
                  <ListGroup>
                    {menuData.secondi.map((dish, index) => (
                      <ListGroup.Item key={index}>{dish}</ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className='text-muted text-center py-3'>
                    Nessun secondo piatto inserito
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className='mb-4'>
            <Card className='h-100'>
              <Card.Header className='bg-light'>
                <h3 className='mb-0'>Contorni</h3>
              </Card.Header>
              <Card.Body>
                {menuData.contorni && menuData.contorni.length > 0 ? (
                  <ListGroup>
                    {menuData.contorni.map((dish, index) => (
                      <ListGroup.Item key={index}>{dish}</ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className='text-muted text-center py-3'>
                    Nessun contorno inserito
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className='d-flex flex-column flex-md-row justify-content-between gap-2 mt-4'>
          <Button variant='secondary' size='lg' onClick={handleBack}>
            Modifica Menu
          </Button>
          <Button variant='primary' size='lg' onClick={handleSend}>
            Invia Menu
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default Summary
