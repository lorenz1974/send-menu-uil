import React, { useState, useEffect } from 'react'

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
    <div className='dish-category'>
      <h2>{title}</h2>
      <div className='dish-input-container'>
        <div className='input-wrapper'>
          <input
            type='text'
            value={newDish}
            onChange={(e) => {
              setNewDish(e.target.value)
              setShowSuggestions(true)
            }}
            placeholder={`Aggiungi ${title.toLowerCase()}`}
            onKeyPress={(e) => e.key === 'Enter' && handleAddDish(e)}
          />
          <button type='button' onClick={handleAddDish}>
            Aggiungi
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <ul className='suggestions'>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className='dishes-list'>
        {dishes.map((dish, index) => (
          <li key={index}>
            {dish}
            <button type='button' onClick={() => handleRemoveDish(dish)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DishCategory
