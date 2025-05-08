import React, { useState, useEffect } from 'react'
import { Card, Form, Button, ListGroup } from 'react-bootstrap'

const DishCategory = ({ title, dishes, setDishes, savedDishes }) => {
  const [newDish, setNewDish] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (newDish.trim() !== '') {
      const filteredSuggestions = savedDishes.filter(
        (dish) =>
          dish.toLowerCase().includes(newDish.toLowerCase()) &&
          !dishes.includes(dish)
      )
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }, [newDish, savedDishes, dishes])

  const handleAddDish = (e) => {
    // Previene l'invio del form quando si preme il bottone Aggiungi
    if (e) {
      e.preventDefault()
    }

    if (newDish.trim() !== '' && !dishes.includes(newDish)) {
      setDishes([...dishes, newDish])
      setNewDish('')
      setShowSuggestions(false)
    }
  }

  const handleRemoveDish = (dishToRemove) => {
    setDishes(dishes.filter((dish) => dish !== dishToRemove))
  }

  const handleSelectSuggestion = (suggestion) => {
    if (!dishes.includes(suggestion)) {
      setDishes([...dishes, suggestion])
    }
    setNewDish('')
    setShowSuggestions(false)
  }

  return (
    <Card className='h-100'>
      <Card.Header className='bg-light'>
        <h3 className='mb-0'>{title}</h3>
      </Card.Header>
      <Card.Body>
        <div className='position-relative mb-3'>
          <div className='input-group'>
            <Form.Control
              type='text'
              value={newDish}
              onChange={(e) => {
                setNewDish(e.target.value)
                setShowSuggestions(true)
              }}
              placeholder={`Aggiungi ${title.toLowerCase()}`}
              onKeyPress={(e) => e.key === 'Enter' && handleAddDish(e)}
            />
            <Button variant='primary' onClick={handleAddDish}>
              Aggiungi
            </Button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <ListGroup
              className='position-absolute w-100 mt-1 shadow-sm'
              style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
            >
              {suggestions.map((suggestion, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  onClick={() => handleSelectSuggestion(suggestion)}
                  style={{ cursor: 'pointer' }}
                >
                  {suggestion}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>

        <div className='dish-list mt-3'>
          {dishes.length > 0 ? (
            <ListGroup style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {dishes.map((dish, index) => (
                <ListGroup.Item
                  key={index}
                  className='d-flex justify-content-between align-items-center'
                >
                  {dish}
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => handleRemoveDish(dish)}
                  >
                    &times;
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className='text-muted text-center'>Nessun piatto aggiunto</p>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default DishCategory
