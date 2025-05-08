import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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

  // Gestisce il click su "Conferma menù" - salva senza navigare
  const handleConfirm = () => {
    saveMenu()
    setConfirmMessage('Menu salvato con successo!')

    // Nasconde il messaggio dopo 3 secondi
    setTimeout(() => {
      setConfirmMessage('')
    }, 3000)
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
    <div className='menu-form-container'>
      <h1>Composizione Menu del Giorno</h1>

      <div className='menu-header'>
        <div className='date-selector'>
          <label>Data del menu:</label>
          <input
            type='date'
            value={menuDate}
            onChange={(e) => setMenuDate(e.target.value)}
          />
        </div>

        <div className='suggestions-link'>
          <Link to='/suggestions' className='manage-suggestions-btn'>
            Gestisci Suggerimenti
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='categories-container'>
          <DishCategory
            title='Primi'
            dishes={primi}
            setDishes={setPrimi}
            savedDishes={savedPrimi}
          />

          <DishCategory
            title='Secondi'
            dishes={secondi}
            setDishes={setSecondi}
            savedDishes={savedSecondi}
          />

          <DishCategory
            title='Contorni'
            dishes={contorni}
            setDishes={setContorni}
            savedDishes={savedContorni}
          />
        </div>

        {confirmMessage && (
          <div className='confirmation-message'>{confirmMessage}</div>
        )}

        <div className='form-actions'>
          <button type='button' className='reset-btn' onClick={handleReset}>
            Nuovo Menu
          </button>
          <button type='button' className='confirm-btn' onClick={handleConfirm}>
            Conferma Menù
          </button>
          <button type='submit' className='submit-btn'>
            Anteprima e Invio
          </button>
        </div>
      </form>
    </div>
  )
}

export default MenuForm
