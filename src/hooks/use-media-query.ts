import { create } from "zustand";

interface MediaQueryState {
  queries: Record<string, boolean>; // Contiene tutte le media query come chiavi dinamiche
  registerQuery: (query: string) => void;
  unregisterQuery: (query: string) => void;
}

export const useMediaQuery = create<MediaQueryState>((set) => ({
  queries: {}, // Stato iniziale vuoto per le media query
  registerQuery: (query) => {
    const mediaQueryList = window.matchMedia(query);

    // Callback per aggiornare lo stato in base alla media query
    const handleChange = (event: MediaQueryListEvent) => {
      set((state) => ({
        ...state,
        queries: {
          ...state.queries,
          [query]: event.matches,
        },
      }));
    };

    // Imposta lo stato iniziale per la media query
    set((state) => ({
      ...state,
      queries: {
        ...state.queries,
        [query]: mediaQueryList.matches,
      },
    }));

    // Aggiunge il listener per monitorare i cambiamenti della media query
    mediaQueryList.addEventListener("change", handleChange);

    // Memorizza il listener su window per eventuale rimozione futura
    window.__mediaQueryListeners = window.__mediaQueryListeners || {};
    window.__mediaQueryListeners[query] = handleChange;
  },
  unregisterQuery: (query) => {
    const mediaQueryList = window.matchMedia(query);

    // Rimuove il listener se è stato registrato
    if (window.__mediaQueryListeners && window.__mediaQueryListeners[query]) {
      mediaQueryList.removeEventListener(
        "change",
        window.__mediaQueryListeners[query],
      );
      delete window.__mediaQueryListeners[query];
    }
  },
}));