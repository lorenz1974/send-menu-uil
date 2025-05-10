import { useState, useEffect } from 'react'
import menuSuggestions from '../menu-suggestions.json'

/**
 * Hook per la gestione dei suggerimenti dei piatti
 * @returns {Object} Funzioni e stati per gestire i suggerimenti
 */
const useSuggestions = () => {
  const [savedPrimi, setSavedPrimi] = useState([])
  const [savedSecondi, setSavedSecondi] = useState([])
  const [savedContorni, setSavedContorni] = useState([])
  const [message, setMessage] = useState('')
  const [hasSavedDishes, setHasSavedDishes] = useState(false)

  // Carica i suggerimenti al primo render
  useEffect(() => {
    loadSavedDishes()
  }, [])

  // Carica i piatti salvati dal localStorage
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

    return {
      primi: storedPrimi,
      secondi: storedSecondi,
      contorni: storedContorni,
    }
  }

  // Carica i suggerimenti predefiniti dal file JSON
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
    showMessage('Suggerimenti predefiniti caricati correttamente')
  }

  // Mostra un messaggio temporaneo
  const showMessage = (msg, duration = 3000) => {
    setMessage(msg)
    setTimeout(() => {
      setMessage('')
    }, duration)
  }

  // Rimuove un piatto dai suggerimenti
  const removeDish = (category, dishToRemove) => {
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
    showMessage(`${dishToRemove} rimosso dai suggerimenti`)
  }

  // Pulisce tutti i suggerimenti di una categoria
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

    // Mostra messaggio di conferma
    showMessage(`Tutti i ${category} sono stati rimossi dai suggerimenti`)
  }

  // Pulisce tutti i suggerimenti
  const clearAllSuggestions = () => {
    setSavedPrimi([])
    setSavedSecondi([])
    setSavedContorni([])

    localStorage.setItem('primi', JSON.stringify([]))
    localStorage.setItem('secondi', JSON.stringify([]))
    localStorage.setItem('contorni', JSON.stringify([]))

    // Aggiorna il flag
    setHasSavedDishes(false)

    // Mostra messaggio di conferma
    showMessage('Tutti i suggerimenti sono stati rimossi')
  }

  // Filtra suggerimenti in base a input dell'utente
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

  // Aggiungi piatti selezionati al menu corrente
  const addSelectedToMenu = (selectedDishes) => {
    // Recupera il menu attuale da localStorage
    const currentMenu = JSON.parse(localStorage.getItem('currentMenu') || '{}')

    // Prendi i piatti già presenti o inizializza array vuoti
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
