/**
 * useMenu - Custom hook for menu state management
 *
 * [DesignPattern: Repository] This hook implements the Repository pattern by abstracting
 * the data storage and retrieval operations for menu items, providing a clean API
 * for menu manipulation while handling the localStorage persistence.
 *
 * [DesignPattern: Observer] Uses React's useState and useEffect to observe and
 * react to changes in menu data.
 */

// #region Imports
import { useState, useEffect } from 'react'
// #endregion

/**
 * Custom hook for managing the current menu state and operations
 * @returns {Object} Functions and state variables for menu management
 */
const useMenu = () => {
  // #region State Management
  // State for current dishes in each category
  const [primi, setPrimi] = useState([])
  const [secondi, setSecondi] = useState([])
  const [contorni, setContorni] = useState([])
  const [menuDate, setMenuDate] = useState('')

  // Load menu from localStorage on component mount
  useEffect(() => {
    loadMenu()
  }, [])
  // #endregion

  // #region Data Access Methods
  /**
   * Loads the current menu from localStorage
   *
   * [DesignPattern: Repository] Implements data retrieval from the storage layer
   * @returns {Object} The loaded menu data
   */
  const loadMenu = () => {
    const currentMenu = JSON.parse(localStorage.getItem('currentMenu') || '{}')

    if (currentMenu && Object.keys(currentMenu).length > 0) {
      setPrimi(currentMenu.primi ? [...currentMenu.primi].sort() : [])
      setSecondi(currentMenu.secondi ? [...currentMenu.secondi].sort() : [])
      setContorni(currentMenu.contorni ? [...currentMenu.contorni].sort() : [])

      // Use saved date if available
      if (currentMenu.date) {
        setMenuDate(currentMenu.date)
      } else {
        // Otherwise set today's date as default
        const today = new Date().toISOString().split('T')[0]
        setMenuDate(today)
      }
    } else {
      // Set today's date as default if there's no saved menu
      const today = new Date().toISOString().split('T')[0]
      setMenuDate(today)
    }

    return currentMenu
  }

  /**
   * Saves the menu to localStorage and updates the suggestion lists
   *
   * [DesignPattern: Repository] Implements data persistence to the storage layer
   * @returns {Object} The saved menu data
   */
  const saveMenu = () => {
    // Load saved suggestions
    const savedPrimi = JSON.parse(localStorage.getItem('primi') || '[]')
    const savedSecondi = JSON.parse(localStorage.getItem('secondi') || '[]')
    const savedContorni = JSON.parse(localStorage.getItem('contorni') || '[]')

    // Save new dishes to localStorage, removing duplicates and sorting alphabetically
    const updatedPrimi = [...new Set([...savedPrimi, ...primi])].sort()
    const updatedSecondi = [...new Set([...savedSecondi, ...secondi])].sort()
    const updatedContorni = [...new Set([...savedContorni, ...contorni])].sort()

    localStorage.setItem('primi', JSON.stringify(updatedPrimi))
    localStorage.setItem('secondi', JSON.stringify(updatedSecondi))
    localStorage.setItem('contorni', JSON.stringify(updatedContorni))

    // Save current menu for summary (sorted alphabetically)
    const menuData = {
      date: menuDate,
      primi: [...primi].sort(),
      secondi: [...secondi].sort(),
      contorni: [...contorni].sort(),
    }

    localStorage.setItem('currentMenu', JSON.stringify(menuData))

    return menuData
  }

  /**
   * Adds dishes to the current menu by category
   *
   * [DesignPattern: Command] Implements a command pattern to add dishes to specific categories
   * @param {string} category - The category to add dishes to (primi, secondi, contorni)
   * @param {Array} dishes - Array of dish names to add
   */
  const addToMenu = (category, dishes) => {
    if (category === 'primi') {
      setPrimi([...new Set([...primi, ...dishes])].sort())
    } else if (category === 'secondi') {
      setSecondi([...new Set([...secondi, ...dishes])].sort())
    } else if (category === 'contorni') {
      setContorni([...new Set([...contorni, ...dishes])].sort())
    }
  }

  /**
   * Resets the current menu to empty state and removes from localStorage
   *
   * [DesignPattern: Command] Implements a command pattern for menu reset operation
   */
  const resetMenu = () => {
    setPrimi([])
    setSecondi([])
    setContorni([])
    localStorage.removeItem('currentMenu')
  }

  /**
   * Formats the date in Italian format (DD/MM/YYYY)
   *
   * @returns {string} The formatted date string
   */
  const getFormattedDate = () => {
    if (!menuDate) return ''
    const [year, month, day] = menuDate.split('-')
    return `${day}/${month}/${year}`
  }
  // #endregion

  // #region Hook Return
  return {
    primi,
    setPrimi,
    secondi,
    setSecondi,
    contorni,
    setContorni,
    menuDate,
    setMenuDate,
    loadMenu,
    saveMenu,
    resetMenu,
    addToMenu,
    getFormattedDate,
  }
  // #endregion
}

export default useMenu
