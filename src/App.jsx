import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container, Navbar } from 'react-bootstrap'
import './App.css'
import MenuForm from './components/MenuForm'
import Summary from './components/Summary'
import SendMenu from './components/SendMenu'
import ManageSuggestions from './components/ManageSuggestions'

function App() {
  return (
    <Router>
      <div className='d-flex flex-column min-vh-100'>
        <Navbar bg='dark' variant='dark' className='py-3 mb-4'>
          <Container>
            <Navbar.Brand className='w-100 text-center'>
              <h1 className='mb-0'>Gestione Menu Mensa</h1>
            </Navbar.Brand>
          </Container>
        </Navbar>

        <Container className='flex-grow-1 mb-4'>
          <Routes>
            <Route path='/' element={<MenuForm />} />
            <Route path='/summary' element={<Summary />} />
            <Route path='/send' element={<SendMenu />} />
            <Route path='/suggestions' element={<ManageSuggestions />} />
          </Routes>
        </Container>

        <Navbar bg='dark' variant='dark' className='py-3 text-center mt-auto'>
          <Container>
            <Navbar.Text className='w-100'>
              &copy; {new Date().getFullYear()} - Applicazione Gestione Menu
              Mensa
            </Navbar.Text>
          </Container>
        </Navbar>
      </div>
    </Router>
  )
}

export default App
