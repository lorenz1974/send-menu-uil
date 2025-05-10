import { useState, useEffect } from 'react'

/**
 * Hook per la gestione del menu corrente
 * @returns {Object} Funzioni e stati per gestire il menu
 */
const useMenu = () => {
  // Stato per i piatti correnti
  const [primi, setPrimi] = useState([])
  const [secondi, setSecondi] = useState([])
  const [contorni, setContorni] = useState([])
  const [menuDate, setMenuDate] = useState('')

  // Carica il menu dal localStorage all'avvio
  useEffect(() => {
    loadMenu()
  }, [])

  // Carica il menu corrente dal localStorage
  const loadMenu = () => {
    const currentMenu = JSON.parse(localStorage.getItem('currentMenu') || '{}')

    if (currentMenu && Object.keys(currentMenu).length > 0) {
      setPrimi(currentMenu.primi ? [...currentMenu.primi].sort() : [])
      setSecondi(currentMenu.secondi ? [...currentMenu.secondi].sort() : [])
      setContorni(currentMenu.contorni ? [...currentMenu.contorni].sort() : [])

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

    return currentMenu
  }

  // Salva il menu nel localStorage
  const saveMenu = () => {
    // Carica i suggerimenti salvati
    const savedPrimi = JSON.parse(localStorage.getItem('primi') || '[]')
    const savedSecondi = JSON.parse(localStorage.getItem('secondi') || '[]')
    const savedContorni = JSON.parse(localStorage.getItem('contorni') || '[]')

    // Salva i nuovi piatti nel localStorage, eliminando duplicati e ordinando alfabeticamente
    const updatedPrimi = [...new Set([...savedPrimi, ...primi])].sort()
    const updatedSecondi = [...new Set([...savedSecondi, ...secondi])].sort()
    const updatedContorni = [...new Set([...savedContorni, ...contorni])].sort()

    localStorage.setItem('primi', JSON.stringify(updatedPrimi))
    localStorage.setItem('secondi', JSON.stringify(updatedSecondi))
    localStorage.setItem('contorni', JSON.stringify(updatedContorni))

    // Salva il menu corrente per il riepilogo (ordinato alfabeticamente)
    const menuData = {
      date: menuDate,
      primi: [...primi].sort(),
      secondi: [...secondi].sort(),
      contorni: [...contorni].sort(),
    }

    localStorage.setItem('currentMenu', JSON.stringify(menuData))

    return menuData
  }

  // Aggiunge piatti al menu corrente
  const addToMenu = (category, dishes) => {
    if (category === 'primi') {
      setPrimi([...new Set([...primi, ...dishes])].sort())
    } else if (category === 'secondi') {
      setSecondi([...new Set([...secondi, ...dishes])].sort())
    } else if (category === 'contorni') {
      setContorni([...new Set([...contorni, ...dishes])].sort())
    }
  }

  // Reset del menu corrente
  const resetMenu = () => {
    setPrimi([])
    setSecondi([])
    setContorni([])
    localStorage.removeItem('currentMenu')
  }

  // Formatta la data in formato italiano (GG/MM/AAAA)
  const getFormattedDate = () => {
    if (!menuDate) return ''
    const [year, month, day] = menuDate.split('-')
    return `${day}/${month}/${year}`
  }

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
}

export default useMenu
