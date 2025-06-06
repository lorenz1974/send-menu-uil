/**
 * Main Application Component
 *
 * [DesignPattern: Composite] The App component serves as the root component that composes
 * all other components into a complete application structure.
 *
 * [DesignPattern: Router] Uses React Router for declarative routing to define navigation
 * and render different components based on the URL.
 *
 * [DesignPattern: Provider] Implements the Provider pattern to supply context to the component tree.
 */

// #region Imports
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container, Navbar } from 'react-bootstrap'
import {
  MenuForm,
  Summary,
  SendMenu,
  ManageSuggestions,
  ManagePhrases,
} from './components'
import { AppProvider } from './context'
import packageJson from '../package.json'
// #endregion

/**
 * Main application component that provides routing and layout for the entire application
 */
const App: React.FC = () => {
  // #region Configuration
  // [DesignPattern: Configuration] Load environment variables
  const basename = import.meta.env.VITE_APP_BASENAME || '/'

  // Get application version from package.json
  const appVersion = packageJson.version
  // #endregion
  // #region Component Rendering
  return (
    <AppProvider>
      <Router basename={basename}>
        <div className='d-flex flex-column min-vh-100'>
          {/* Header */}
          <Navbar bg='dark' data-bs-theme='dark' className='py-3 mb-4'>
            <Container>
              <Navbar.Brand className='w-100 text-center'>
                <h1 className='mb-0'>Gestione Menu Mensa</h1>
              </Navbar.Brand>
            </Container>
          </Navbar>

          {/* Main Content with Routes */}
          <Container fluid className='flex-grow-1 mb-4 w-100 p-0'>
            <Routes>
              <Route path='/' element={<MenuForm />} />
              <Route path='/summary' element={<Summary />} />
              <Route path='/send' element={<SendMenu />} />
              <Route path='/suggestions' element={<ManageSuggestions />} />
              <Route path='/phrases' element={<ManagePhrases />} />
            </Routes>
          </Container>

          {/* Footer */}
          <Navbar
            bg='dark'
            data-bs-theme='dark'
            className='py-3 text-center mt-auto'
          >
            <Container>
              <Navbar.Text className='w-100'>
                &copy; {new Date().getFullYear()} - Applicazione Gestione Menu
                Mensa - v{appVersion}
              </Navbar.Text>
            </Container>
          </Navbar>
        </div>
      </Router>
    </AppProvider>
  )
  // #endregion
}

export default App
