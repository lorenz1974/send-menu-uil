import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ManageSuggestions = () => {
  const navigate = useNavigate()
  const [savedPrimi, setSavedPrimi] = useState([])
  const [savedSecondi, setSavedSecondi] = useState([])
  const [savedContorni, setSavedContorni] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Carica i piatti salvati dal localStorage
    loadSavedDishes()
  }, [])

  // Funzione per caricare i piatti salvati dal localStorage
  const loadSavedDishes = () => {
    const storedPrimi = JSON.parse(localStorage.getItem('primi') || '[]')
    const storedSecondi = JSON.parse(localStorage.getItem('secondi') || '[]')
    const storedContorni = JSON.parse(localStorage.getItem('contorni') || '[]')

    setSavedPrimi(storedPrimi)
    setSavedSecondi(storedSecondi)
    setSavedContorni(storedContorni)
  }

  // Funzione per rimuovere un piatto dalla lista
  const handleRemoveDish = (category, dishToRemove) => {
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
    setMessage(`${dishToRemove} rimosso dai suggerimenti`)

    // Rimuovi il messaggio dopo 3 secondi
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  // Funzione per pulire una categoria intera
  const handleClearCategory = (category) => {
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
    setMessage(`Tutti i ${category} sono stati rimossi dai suggerimenti`)

    // Rimuovi il messaggio dopo 3 secondi
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  // Funzione per pulire tutti i suggerimenti
  const handleClearAll = () => {
    setSavedPrimi([])
    setSavedSecondi([])
    setSavedContorni([])

    localStorage.setItem('primi', JSON.stringify([]))
    localStorage.setItem('secondi', JSON.stringify([]))
    localStorage.setItem('contorni', JSON.stringify([]))

    // Mostra messaggio di conferma
    setMessage('Tutti i suggerimenti sono stati rimossi')

    // Rimuovi il messaggio dopo 3 secondi
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  // Ritorna al form del menu
  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className='manage-suggestions-container'>
      <h1>Gestione Suggerimenti</h1>

      {message && <div className='confirmation-message'>{message}</div>}

      <div className='suggestions-categories'>
        <div className='suggestion-category'>
          <div className='category-header'>
            <h2>Primi Piatti ({savedPrimi.length})</h2>
            {savedPrimi.length > 0 && (
              <button
                className='clear-btn'
                onClick={() => handleClearCategory('primi')}
              >
                Rimuovi tutti
              </button>
            )}
          </div>

          {savedPrimi.length > 0 ? (
            <ul className='suggestions-list'>
              {savedPrimi.map((dish, index) => (
                <li key={index}>
                  {dish}
                  <button onClick={() => handleRemoveDish('primi', dish)}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className='empty-message'>Nessun suggerimento salvato</p>
          )}
        </div>

        <div className='suggestion-category'>
          <div className='category-header'>
            <h2>Secondi Piatti ({savedSecondi.length})</h2>
            {savedSecondi.length > 0 && (
              <button
                className='clear-btn'
                onClick={() => handleClearCategory('secondi')}
              >
                Rimuovi tutti
              </button>
            )}
          </div>

          {savedSecondi.length > 0 ? (
            <ul className='suggestions-list'>
              {savedSecondi.map((dish, index) => (
                <li key={index}>
                  {dish}
                  <button onClick={() => handleRemoveDish('secondi', dish)}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className='empty-message'>Nessun suggerimento salvato</p>
          )}
        </div>

        <div className='suggestion-category'>
          <div className='category-header'>
            <h2>Contorni ({savedContorni.length})</h2>
            {savedContorni.length > 0 && (
              <button
                className='clear-btn'
                onClick={() => handleClearCategory('contorni')}
              >
                Rimuovi tutti
              </button>
            )}
          </div>

          {savedContorni.length > 0 ? (
            <ul className='suggestions-list'>
              {savedContorni.map((dish, index) => (
                <li key={index}>
                  {dish}
                  <button onClick={() => handleRemoveDish('contorni', dish)}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className='empty-message'>Nessun suggerimento salvato</p>
          )}
        </div>
      </div>

      <div className='manage-actions'>
        {(savedPrimi.length > 0 ||
          savedSecondi.length > 0 ||
          savedContorni.length > 0) && (
          <button className='clear-all-btn' onClick={handleClearAll}>
            Rimuovi tutti i suggerimenti
          </button>
        )}
        <button className='back-btn' onClick={handleBack}>
          Torna al menu
        </button>
      </div>
    </div>
  )
}

export default ManageSuggestions
