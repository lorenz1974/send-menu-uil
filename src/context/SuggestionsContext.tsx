/**
 * Suggestions Context
 *
 * [DesignPattern: Context] This module implements the React Context pattern
 * to provide centralized suggestion management across the application.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react'
import { storageAdapter, STORAGE_KEYS } from '../utils/storage'

// #region Context Type
/**
 * Shape of the suggestions context
 */
interface SuggestionsContextType {
  // Suggestion lists
  savedPrimi: string[]
  savedSecondi: string[]
  savedContorni: string[]
  savedOpeningPhrases: string[]
  savedClosingPhrases: string[]
  // UI state
  message: string
  showMessage: boolean

  // Actions
  loadSuggestions: () => void
  updateSuggestions: (category: string, suggestions: string[]) => void
  setMessage: React.Dispatch<React.SetStateAction<string>>
  setShowMessage: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Provider props
 */
interface SuggestionsProviderProps {
  children: ReactNode
}
// #endregion

// #region Context Creation
// Create the context with a default undefined value
const SuggestionsContext = createContext<SuggestionsContextType | undefined>(
  undefined
)

/**
 * Suggestions Provider component for wrapping the application
 *
 * @param children - Child components to be wrapped
 */
export const SuggestionsProvider: React.FC<SuggestionsProviderProps> = ({
  children,
}) => {
  // #region State Management
  const [savedPrimi, setSavedPrimi] = useState<string[]>([])
  const [savedSecondi, setSavedSecondi] = useState<string[]>([])
  const [savedContorni, setSavedContorni] = useState<string[]>([])
  const [savedOpeningPhrases, setSavedOpeningPhrases] = useState<string[]>([])
  const [savedClosingPhrases, setSavedClosingPhrases] = useState<string[]>([])
  const [message, setMessage] = useState<string>('')
  const [showMessage, setShowMessage] = useState<boolean>(false)

  // Load suggestions from localStorage on component mount
  useEffect(() => {
    loadSuggestions()
  }, [])
  // #endregion

  // #region Actions
  /**
   * Load all suggestion lists from storage
   */
  const loadSuggestions = (): void => {
    // Load saved categories from localStorage
    setSavedPrimi(storageAdapter.get<string[]>(STORAGE_KEYS.PRIMI, []).sort())
    setSavedSecondi(
      storageAdapter.get<string[]>(STORAGE_KEYS.SECONDI, []).sort()
    )
    setSavedContorni(
      storageAdapter.get<string[]>(STORAGE_KEYS.CONTORNI, []).sort()
    )
    setSavedOpeningPhrases(
      storageAdapter.get<string[]>(STORAGE_KEYS.OPENING_PHRASES, []).sort()
    )
    setSavedClosingPhrases(
      storageAdapter.get<string[]>(STORAGE_KEYS.CLOSING_PHRASES, []).sort()
    )
  }

  /**
   * Update suggestions for a specific category
   *
   * @param category - The category to update ('primi', 'secondi', 'contorni')
   * @param suggestions - New list of suggestions
   */
  const updateSuggestions = (category: string, suggestions: string[]): void => {
    // Sort suggestions alphabetically
    const sortedSuggestions = [...suggestions].sort()

    // Update the appropriate category
    switch (category) {
      case 'primi':
        setSavedPrimi(sortedSuggestions)
        storageAdapter.set(STORAGE_KEYS.PRIMI, sortedSuggestions)
        break
      case 'secondi':
        setSavedSecondi(sortedSuggestions)
        storageAdapter.set(STORAGE_KEYS.SECONDI, sortedSuggestions)
        break
      case 'contorni':
        setSavedContorni(sortedSuggestions)
        storageAdapter.set(STORAGE_KEYS.CONTORNI, sortedSuggestions)
        break
      case 'openingPhrases':
        setSavedOpeningPhrases(sortedSuggestions)
        storageAdapter.set(STORAGE_KEYS.OPENING_PHRASES, sortedSuggestions)
        break
      case 'closingPhrases':
        setSavedClosingPhrases(sortedSuggestions)
        storageAdapter.set(STORAGE_KEYS.CLOSING_PHRASES, sortedSuggestions)
        break
      default:
        console.warn(`Unknown category: ${category}`)
        return
    }

    // Show success message
    setMessage('Elenco suggerimenti aggiornato con successo')
    setShowMessage(true)

    // Hide message after 3 seconds
    setTimeout(() => {
      setShowMessage(false)
    }, 3000)
  }
  // #endregion

  // Create memoized context value
  const contextValue = useMemo(
    () => ({
      savedPrimi,
      savedSecondi,
      savedContorni,
      savedOpeningPhrases,
      savedClosingPhrases,
      message,
      showMessage,
      loadSuggestions,
      updateSuggestions,
      setMessage,
      setShowMessage,
    }),
    [
      savedPrimi,
      savedSecondi,
      savedContorni,
      savedOpeningPhrases,
      savedClosingPhrases,
      message,
      showMessage,
    ]
  )

  return (
    <SuggestionsContext.Provider value={contextValue}>
      {children}
    </SuggestionsContext.Provider>
  )
}
// #endregion

// #region Context Hook
/**
 * Custom hook to use the suggestions context
 *
 * @returns The suggestions context value
 * @throws Error if used outside of SuggestionsProvider
 */
export const useSuggestionsContext = (): SuggestionsContextType => {
  const context = useContext(SuggestionsContext)

  if (context === undefined) {
    throw new Error(
      'useSuggestionsContext must be used within a SuggestionsProvider'
    )
  }

  return context
}
// #endregion
