/**
 * Summary Component
 *
 * [DesignPattern: Presentational Component] This component implements the presentational
 * component pattern, showing a summary view of the menu before sending.
 */

// #region Imports
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Row, Col, ListGroup } from 'react-bootstrap'
import { useMenuContext } from '../context/MenuContext'
import type { MenuData } from '../types'
// #endregion

/**
 * Component for displaying a summary of the menu before sending
 */
const Summary: React.FC = () => {
  // #region Hooks & State
  const navigate = useNavigate()
  const { loadMenu, getFormattedDate } = useMenuContext()
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [formattedDate, setFormattedDate] = useState<string>('')

  // Load the menu once when the component mounts
  useEffect(() => {
    const menu = loadMenu()
    setMenuData(menu)
    setFormattedDate(getFormattedDate())
  }, [])
  // #endregion

  // #region Handlers
  /**
   * Navigate back to menu composition
   */
  const handleBack = (): void => {
    navigate('/')
  }

  /**
   * Navigate to send menu page
   */
  const handleSend = (): void => {
    navigate('/send')
  }
  // #endregion

  // #region Rendering
  // If menu data is not available, show error message
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
          <Button
            variant='primary'
            size='lg'
            onClick={handleBack}
            aria-label='Torna alla composizione del menu'
          >
            Torna alla composizione
          </Button>
        </Card.Body>
      </Card>
    )
  }

  // Render menu summary
  return (
    <Card className='shadow'>
      <Card.Header className='bg-primary text-white'>
        <h2 className='mb-0'>Riepilogo Menu del {formattedDate}</h2>
      </Card.Header>

      <Card.Body>
        <Row>
          {/* Primi Piatti */}
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

          {/* Secondi Piatti */}
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

          {/* Contorni */}
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

        {/* Actions */}
        <div className='d-flex flex-column flex-md-row justify-content-between gap-2 mt-4'>
          <Button
            variant='secondary'
            size='lg'
            onClick={handleBack}
            aria-label='Modifica Menu'
          >
            Modifica Menu
          </Button>
          <Button
            variant='primary'
            size='lg'
            onClick={handleSend}
            aria-label='Invia Menu'
          >
            Invia Menu
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
  // #endregion
}

export default Summary
