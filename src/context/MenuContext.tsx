/**
 * Menu Context
 *
 * [DesignPattern: Context] This module implements the React Context pattern
 * to provide centralized menu state management across the application,
 * eliminating prop drilling and improving component isolation.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react'
import type { MenuData, DishCategory } from '../types'
import { storageAdapter, STORAGE_KEYS } from '../utils/storage'
import { dateUtils } from '../utils/dates'

// #region Context Type
/**
 * Shape of the menu context
 */
interface MenuContextType {
  // Menu state
  primi: string[]
  secondi: string[]
  contorni: string[]
  menuDate: string

  // State setters
  setPrimi: React.Dispatch<React.SetStateAction<string[]>>
  setSecondi: React.Dispatch<React.SetStateAction<string[]>>
  setContorni: React.Dispatch<React.SetStateAction<string[]>>
  setMenuDate: React.Dispatch<React.SetStateAction<string>>

  // Actions
  loadMenu: () => MenuData
  saveMenu: () => MenuData
  resetMenu: () => void
  addToMenu: (category: DishCategory, dishes: string[]) => void
  getFormattedDate: () => string
}

/**
 * Provider props
 */
interface MenuProviderProps {
  children: ReactNode
}
// #endregion

// #region Context Creation
// Create the context with a default undefined value
const MenuContext = createContext<MenuContextType | undefined>(undefined)

/**
 * Menu Provider component for wrapping the application
 *
 * @param children - Child components to be wrapped
 */
export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  // #region State Management
  const [primi, setPrimi] = useState<string[]>([])
  const [secondi, setSecondi] = useState<string[]>([])
  const [contorni, setContorni] = useState<string[]>([])
  const [menuDate, setMenuDate] = useState<string>('')

  // Load menu from localStorage on component mount
  useEffect(() => {
    loadMenu()
  }, [])
  // #endregion

  // #region Actions
  /**
   * Loads the current menu from localStorage
   *
   * [DesignPattern: Repository] Implements data retrieval from the storage layer
   * @returns The loaded menu data
   */
  const loadMenu = (): MenuData => {
    const currentMenu = storageAdapter.get<MenuData>(
      STORAGE_KEYS.CURRENT_MENU,
      {} as MenuData
    )

    if (currentMenu && Object.keys(currentMenu).length > 0) {
      setPrimi(currentMenu.primi ? [...currentMenu.primi].sort() : [])
      setSecondi(currentMenu.secondi ? [...currentMenu.secondi].sort() : [])
      setContorni(currentMenu.contorni ? [...currentMenu.contorni].sort() : [])

      // Use saved date if available
      if (currentMenu.date) {
        setMenuDate(currentMenu.date)
      } else {
        // Otherwise set today's date as default
        setMenuDate(dateUtils.today())
      }
    } else {
      // Set today's date as default if there's no saved menu
      setMenuDate(dateUtils.today())
    }

    return currentMenu
  }

  /**
   * Saves the menu to localStorage and updates the suggestion lists
   *
   * [DesignPattern: Repository] Implements data persistence to the storage layer
   * @returns The saved menu data
   */
  const saveMenu = (): MenuData => {
    // Load saved suggestions
    const savedPrimi = storageAdapter.get<string[]>(STORAGE_KEYS.PRIMI, [])
    const savedSecondi = storageAdapter.get<string[]>(STORAGE_KEYS.SECONDI, [])
    const savedContorni = storageAdapter.get<string[]>(
      STORAGE_KEYS.CONTORNI,
      []
    )

    // Save new dishes to localStorage, removing duplicates and sorting alphabetically
    const updatedPrimi = [...new Set([...savedPrimi, ...primi])].sort()
    const updatedSecondi = [...new Set([...savedSecondi, ...secondi])].sort()
    const updatedContorni = [...new Set([...savedContorni, ...contorni])].sort()

    storageAdapter.set(STORAGE_KEYS.PRIMI, updatedPrimi)
    storageAdapter.set(STORAGE_KEYS.SECONDI, updatedSecondi)
    storageAdapter.set(STORAGE_KEYS.CONTORNI, updatedContorni)

    // Save current menu for summary (sorted alphabetically)
    const menuData: MenuData = {
      date: menuDate,
      primi: [...primi].sort(),
      secondi: [...secondi].sort(),
      contorni: [...contorni].sort(),
    }

    storageAdapter.set(STORAGE_KEYS.CURRENT_MENU, menuData)

    return menuData
  }

  /**
   * Adds dishes to the current menu by category
   *
   * [DesignPattern: Command] Implements a command pattern to add dishes to specific categories
   * @param category - The category to add dishes to (primi, secondi, contorni)
   * @param dishes - Array of dish names to add
   */
  const addToMenu = (category: DishCategory, dishes: string[]): void => {
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
  const resetMenu = (): void => {
    setPrimi([])
    setSecondi([])
    setContorni([])
    storageAdapter.remove(STORAGE_KEYS.CURRENT_MENU)
  }

  /**
   * Formats the date in Italian format (DD/MM/YYYY)
   *
   * @returns The formatted date string
   */
  const getFormattedDate = (): string => {
    return dateUtils.toItalianFormat(menuDate)
  }
  // #endregion

  // Create memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
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
    }),
    [primi, secondi, contorni, menuDate]
  )

  return (
    <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
  )
}
// #endregion

// #region Context Hook
/**
 * Custom hook to use the menu context
 *
 * @returns The menu context value
 * @throws Error if used outside of MenuProvider
 */
export const useMenuContext = (): MenuContextType => {
  const context = useContext(MenuContext)

  if (context === undefined) {
    throw new Error('useMenuContext must be used within a MenuProvider')
  }

  return context
}
// #endregion
