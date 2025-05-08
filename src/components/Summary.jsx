import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Summary = () => {
  const navigate = useNavigate()
  const [menuData, setMenuData] = useState(null)
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    // Carica i dati del menu dal localStorage
    const storedMenu = JSON.parse(localStorage.getItem('currentMenu') || '{}')
    setMenuData(storedMenu)

    // Formatta la data in formato italiano (GG/MM/AAAA)
    if (storedMenu && storedMenu.date) {
      const [year, month, day] = storedMenu.date.split('-')
      setFormattedDate(`${day}/${month}/${year}`)
    }
  }, [])

  const handleBack = () => {
    navigate('/')
  }

  const handleSend = () => {
    navigate('/send')
  }

  if (!menuData || Object.keys(menuData).length === 0) {
    return (
      <div className='summary-container'>
        <h1>Menu non disponibile</h1>
        <p>
          Non sono stati trovati dati del menu. Torna alla pagina di
          composizione.
        </p>
        <button onClick={handleBack} className='back-btn'>
          Torna alla composizione
        </button>
      </div>
    )
  }

  return (
    <div className='summary-container'>
      <h1>Riepilogo Menu del {formattedDate}</h1>

      <div className='menu-summary'>
        <div className='menu-section'>
          <h2>Primi Piatti</h2>
          {menuData.primi && menuData.primi.length > 0 ? (
            <ul>
              {menuData.primi.map((dish, index) => (
                <li key={index}>{dish}</li>
              ))}
            </ul>
          ) : (
            <p>Nessun primo piatto inserito</p>
          )}
        </div>

        <div className='menu-section'>
          <h2>Secondi Piatti</h2>
          {menuData.secondi && menuData.secondi.length > 0 ? (
            <ul>
              {menuData.secondi.map((dish, index) => (
                <li key={index}>{dish}</li>
              ))}
            </ul>
          ) : (
            <p>Nessun secondo piatto inserito</p>
          )}
        </div>

        <div className='menu-section'>
          <h2>Contorni</h2>
          {menuData.contorni && menuData.contorni.length > 0 ? (
            <ul>
              {menuData.contorni.map((dish, index) => (
                <li key={index}>{dish}</li>
              ))}
            </ul>
          ) : (
            <p>Nessun contorno inserito</p>
          )}
        </div>
      </div>

      <div className='summary-actions'>
        <button onClick={handleBack} className='back-btn'>
          Modifica Menu
        </button>
        <button onClick={handleSend} className='send-btn'>
          Invia Menu
        </button>
      </div>
    </div>
  )
}

export default Summary
