// types/global.d.ts (Crea questo file se non esiste)
interface Window {
    __mediaQueryListeners?: { [key: string]: (e: MediaQueryListEvent) => void };
  }