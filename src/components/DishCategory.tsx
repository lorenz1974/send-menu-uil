/**
 * DishCategory Component
 *
 * [DesignPattern: Presentational Component] This component implements the presentational
 * component pattern, focusing on UI rendering without managing complex state logic.
 */

// #region Imports
import React, { useState, useEffect } from 'react'
import { Card, Form, Button, ListGroup } from 'react-bootstrap'
import type { DishCategoryProps } from '../types'
// #endregion

/**
 * Component for managing a category of dishes with suggestions and add/remove functionality
 */
const DishCategory: React.FC<DishCategoryProps> = ({
  title,
  dishes,
  setDishes,
  savedDishes = [],
}) => {
  // #region State Management
  const [newDish, setNewDish] = useState<string>('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  // #endregion

  // #region Filter Suggestions Effect
  useEffect(() => {
    // Filter suggestions based on input and existing dishes
    const filteredSuggestions = (savedDishes || [])
      .filter(
        (suggestion) =>
          // Filter by input text (case insensitive)
          suggestion.toLowerCase().includes(newDish.toLowerCase()) &&
          // Exclude dishes already added
          !dishes.includes(suggestion)
      )
      // Limit to top 10 suggestions
      .slice(0, 10)

    setSuggestions(filteredSuggestions)
  }, [newDish, savedDishes, dishes])
  // #endregion

  // #region Handlers
  /**
   * Add a new dish to the category
   */
  const handleAddDish = (e?: React.FormEvent): void => {
    // Prevent form submission
    if (e) {
      e.preventDefault()
    }

    if (newDish.trim() !== '' && !dishes.includes(newDish)) {
      // Add the new dish and sort alphabetically
      setDishes([...dishes, newDish].sort())
      setNewDish('')
      setShowSuggestions(false)
    }
  }

  /**
   * Remove a dish from the category
   */
  const handleRemoveDish = (dishToRemove: string): void => {
    setDishes(dishes.filter((dish) => dish !== dishToRemove))
  }

  /**
   * Select a suggestion from the dropdown
   */
  const handleSelectSuggestion = (suggestion: string): void => {
    if (!dishes.includes(suggestion)) {
      // Add the selected suggestion and sort alphabetically
      setDishes([...dishes, suggestion].sort())
    }
    setNewDish('')
    setShowSuggestions(false)
  }
  // #endregion

  // #region Rendering
  return (
    <Card className='h-100 p-1 shadow'>
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
              onKeyDown={(e) => e.key === 'Enter' && handleAddDish(e)}
              aria-label={`Aggiungi ${title.toLowerCase()}`}
            />
            <Button
              size='sm'
              variant='primary'
              onClick={() => handleAddDish()}
              aria-label={`Aggiungi ${title.toLowerCase()}`}
            >
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

        <div className='mt-3'>
          {dishes.length > 0 ? (
            <ListGroup
              style={{
                maxHeight: '250px',
                overflowY: 'auto',
              }}
            >
              {dishes.map((dish, index) => (
                <ListGroup.Item
                  key={index}
                  className='d-flex justify-content-between align-items-center'
                >
                  <div className='dish-item'>{dish}</div>
                  <Button
                    variant='warning'
                    size='sm'
                    onClick={() => handleRemoveDish(dish)}
                    aria-label={`Rimuovi ${dish}`}
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
  // #endregion
}

export default DishCategory
