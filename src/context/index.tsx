/**
 * Index file for context exports
 * 
 * [DesignPattern: Facade] This module implements the Facade pattern to provide
 * a simplified interface to the React contexts subsystem.
 */

// Context exports
export { MenuProvider, useMenuContext } from './MenuContext';
export { MenuSenderProvider, useMenuSenderContext } from './MenuSenderContext';
export { SuggestionsProvider, useSuggestionsContext } from './SuggestionsContext';

// Providers for the entire app
import React, { ReactNode } from 'react';
import { MenuProvider } from './MenuContext';
import { MenuSenderProvider } from './MenuSenderContext';
import { SuggestionsProvider } from './SuggestionsContext';

/**
 * Props for the root AppProvider component
 */
interface AppProviderProps {
  children: ReactNode;
}

/**
 * [DesignPattern: Composite] Combines all context providers into a single
 * provider tree component to simplify usage at the application root level.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <MenuProvider>
    <MenuSenderProvider>
      <SuggestionsProvider>
        {children}
      </SuggestionsProvider>
    </MenuSenderProvider>
  </MenuProvider>
);
