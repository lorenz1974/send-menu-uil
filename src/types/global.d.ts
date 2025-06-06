/**
 * Type declaration extensions
 */

// Additional environment variable type declaration for Vite
declare global {
  interface ImportMeta {
    env: {
      VITE_APP_BASENAME?: string;
      VITE_URL_API_AZURE?: string;
      [key: string]: string | undefined;
    };
  }
}

export {}; // This empty export makes TypeScript treat this file as a module
