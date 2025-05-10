/**
 * useSuggestions - Custom hook for dish suggestions management
 *
 * [DesignPattern: Repository] Implements the Repository pattern for managing
 * dish suggestions with persistent storage operations.
 *
 * [DesignPattern: Observer] Uses React's useState and useEffect to observe
 * and react to changes in suggestion data.
 */

// #region Imports
import { useState, useEffect } from 'react'
import menuSuggestions from '../assets/data/menu-suggestions.json'
// #endregion

/**
 * Custom hook for managing dish suggestions
 * @returns {Object} Functions and state variables for managing suggestions
 */
const useSuggestions = () => {
  // #region State Management
  const [savedPrimi, setSavedPrimi] = useState([])
  const [savedSecondi, setSavedSecondi] = useState([])
  const [savedContorni, setSavedContorni] = useState([])
  const [message, setMessage] = useState('')
  const [hasSavedDishes, setHasSavedDishes] = useState(false)

  // Load suggestions on first render
  useEffect(() => {
    loadSavedDishes()
  }, [])
  // #endregion

  // #region Data Access Methods
  /**
   * Loads saved dishes from localStorage
   *
   * [DesignPattern: Repository] Implements data retrieval from the storage layer
   * @returns {Object} Object containing arrays of stored dishes by category
   */
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

    // Check if there are any saved dishes
    setHasSavedDishes(
      storedPrimi.length > 0 ||
        storedSecondi.length > 0 ||
        storedContorni.length > 0
    )

    return {
      primi: storedPrimi,
      secondi: storedSecondi,
      contorni: storedContorni,
    }
  }

  /**
   * Loads default suggestions from JSON file
   *
   * [DesignPattern: Factory] Acts as a factory for creating initial suggestion data
   * by merging default suggestions with existing ones
   */
  const loadDefaultSuggestions = () => {
    // Merge predefined suggestions with existing ones in localStorage
    const updatedPrimi = [
      ...new Set([...savedPrimi, ...menuSuggestions.primi]),
    ].sort()
    const updatedSecondi = [
      ...new Set([...savedSecondi, ...menuSuggestions.secondi]),
    ].sort()
    const updatedContorni = [
      ...new Set([...savedContorni, ...menuSuggestions.contorni]),
    ].sort()

    // Update state and localStorage
    setSavedPrimi(updatedPrimi)
    setSavedSecondi(updatedSecondi)
    setSavedContorni(updatedContorni)

    localStorage.setItem('primi', JSON.stringify(updatedPrimi))
    localStorage.setItem('secondi', JSON.stringify(updatedSecondi))
    localStorage.setItem('contorni', JSON.stringify(updatedContorni))

    // Update flag
    setHasSavedDishes(true)

    // Show confirmation message
    showMessage('Suggerimenti predefiniti caricati correttamente')
  }

  /**
   * Shows a temporary message
   *
   * [DesignPattern: Command] Implements a command to display and auto-dismiss notifications
   *
   * @param {string} msg - Message to display
   * @param {number} duration - Duration in milliseconds
   */
  const showMessage = (msg, duration = 3000) => {
    setMessage(msg)
    setTimeout(() => {
      setMessage('')
    }, duration)
  }

  // #region Suggestion Management Methods
  /**
   * Removes a dish from suggestions
   *
   * [DesignPattern: Command] Implements a command pattern for dish removal operation
   *
   * @param {string} category - Category of the dish to remove
   * @param {string} dishToRemove - Name of the dish to remove
   */
  const removeDish = (category, dishToRemove) => {
    let updatedList = []
    let storageKey = ''

    // Identify category and prepare updated list
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

    // Update localStorage
    localStorage.setItem(storageKey, JSON.stringify(updatedList))

    // Show confirmation message
    showMessage(`${dishToRemove} rimosso dai suggerimenti`)
  }

  /**
   * Clears all suggestions in a category
   *
   * [DesignPattern: Command] Implements a command pattern for category clearing operation
   *
   * @param {string} category - Category to clear
   */
  const clearCategory = (category) => {
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

    // Show confirmation message
    showMessage(`Tutti i ${category} sono stati rimossi dai suggerimenti`)
  }

  /**
   * Clears all suggestions across all categories
   *
   * [DesignPattern: Command] Implements a command pattern for full reset operation
   */
  const clearAllSuggestions = () => {
    setSavedPrimi([])
    setSavedSecondi([])
    setSavedContorni([])

    localStorage.setItem('primi', JSON.stringify([]))
    localStorage.setItem('secondi', JSON.stringify([]))
    localStorage.setItem('contorni', JSON.stringify([]))

    // Update flag
    setHasSavedDishes(false)

    // Show confirmation message
    showMessage('Tutti i suggerimenti sono stati rimossi')
  }

  /**
   * Filters suggestions based on user input
   *
   * [DesignPattern: Strategy] Implements different filtering strategies based on category
   *
   * @param {string} category - Category to filter
   * @param {string} input - User input to filter by
   * @param {Array} currentDishes - Current dishes to exclude from results
   * @returns {Array} Filtered suggestions
   */
  const filterSuggestions = (category, input, currentDishes) => {
    let suggestions = []

    if (input.trim() !== '') {
      if (category === 'primi') {
        suggestions = savedPrimi.filter(
          (dish) =>
            dish.toLowerCase().includes(input.toLowerCase()) &&
            !currentDishes.includes(dish)
        )
      } else if (category === 'secondi') {
        suggestions = savedSecondi.filter(
          (dish) =>
            dish.toLowerCase().includes(input.toLowerCase()) &&
            !currentDishes.includes(dish)
        )
      } else if (category === 'contorni') {
        suggestions = savedContorni.filter(
          (dish) =>
            dish.toLowerCase().includes(input.toLowerCase()) &&
            !currentDishes.includes(dish)
        )
      }
    }

    return suggestions
  }

  /**
   * Adds selected dishes to current menu
   *
   * [DesignPattern: Command] Implements a command pattern for menu update operation
   *
   * @param {Object} selectedDishes - Object with arrays of dishes to add by category
   * @returns {Object} Updated menu data
   */
  const addSelectedToMenu = (selectedDishes) => {
    // Retrieve current menu from localStorage
    const currentMenu = JSON.parse(localStorage.getItem('currentMenu') || '{}')

    // Get existing dishes or initialize empty arrays
    const currentPrimi = currentMenu.primi || []
    const currentSecondi = currentMenu.secondi || []
    const currentContorni = currentMenu.contorni || []

    // Aggiungi i piatti selezionati al menu attuale, eliminando i duplicati con Set
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

    // Mostra messaggio di conferma
    showMessage('Piatti aggiunti al menù con successo')

    return updatedMenu
  }

  return {
    savedPrimi,
    savedSecondi,
    savedContorni,
    message,
    hasSavedDishes,
    loadSavedDishes,
    loadDefaultSuggestions,
    removeDish,
    clearCategory,
    clearAllSuggestions,
    filterSuggestions,
    addSelectedToMenu,
    showMessage,
  }
}

export default useSuggestions
