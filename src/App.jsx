import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import MenuForm from './components/MenuForm'
import Summary from './components/Summary'
import SendMenu from './components/SendMenu'
import ManageSuggestions from './components/ManageSuggestions'

function App() {
  return (
    <Router>
      <div className='app-container'>
        <header className='app-header'>
          <h1>Gestione Menu Mensa</h1>
        </header>

        <main className='app-content'>
          <Routes>
            <Route path='/' element={<MenuForm />} />
            <Route path='/summary' element={<Summary />} />
            <Route path='/send' element={<SendMenu />} />
            <Route path='/suggestions' element={<ManageSuggestions />} />
          </Routes>
        </main>

        <footer className='app-footer'>
          <p>
            &copy; {new Date().getFullYear()} - Applicazione Gestione Menu Mensa
          </p>
        </footer>
      </div>
    </Router>
  )
}

export default App
