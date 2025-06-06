# Gestione Menu Mensa

## Descrizione

Questa applicazione web consente la composizione, la gestione e l'invio del menu giornaliero di una mensa. L'obiettivo è semplificare la creazione del menu, velocizzare l'inserimento dei piatti tramite suggerimenti automatici, e permettere l'invio del menu tramite Teams ed Email.

## Funzionalità principali

- **Composizione Menu**: Inserimento di primi, secondi e contorni per una data specifica.
- **Suggerimenti automatici**: I piatti inseriti vengono salvati e suggeriti nelle composizioni future.
- **Gestione suggerimenti**: Possibilità di visualizzare, eliminare singoli piatti o intere categorie di suggerimenti.
- **Riepilogo**: Anteprima del menu prima dell'invio.
- **Invio menu**: Scelta dei canali (Teams, Email) e simulazione di invio.
- **Persistenza locale**: Tutti i dati sono salvati nel localStorage del browser.
- **Navigazione semplice**: Interfaccia intuitiva e responsive grazie a React Bootstrap.

## Tecnologie utilizzate

- **React** (v19)
- **TypeScript** (supporto completo ai tipi)
- **React Router DOM** (v7)
- **React Bootstrap** e **Bootstrap** (v5)
- **React Context API** (per la gestione centralizzata dello stato)
- **Vite** (per sviluppo e build)
- **Axios** (per chiamate HTTP, pronto per integrazione API)
- **ESLint** (linting del codice)
- **localStorage** (persistenza dati lato client)

## Struttura del progetto dettagliata

```
send-menu-uil/
├── public/                      # File statici accessibili direttamente
│   ├── data/                    # Dati pubblici accessibili via URL
│   │   └── menu-suggestions.json  # File JSON con suggerimenti predefiniti per menu
│   └── [file vari]              # Asset pubblici (icone, manifest, configurazioni)
├── src/
│   ├── assets/                  # Asset dell'applicazione
│   │   └── data/                # Dati statici dell'applicazione
│   │       └── menu-suggestions.json  # Copia dei suggerimenti (da non usare, usare public/data/)
│   ├── components/              # Componenti UI React
│   │   ├── DishCategory.tsx     # Componente per visualizzare e gestire una categoria di piatti
│   │   ├── ManageSuggestions.tsx  # Schermata per gestire i suggerimenti salvati
│   │   ├── MenuForm.tsx         # Form principale per la composizione del menu
│   │   ├── PasswordModal.tsx    # Modal per protezione con password
│   │   ├── SendMenu.tsx         # Schermata per inviare il menu compilato
│   │   ├── Summary.tsx          # Schermata di riepilogo del menu
│   │   └── index.ts             # Esportazione centralizzata dei componenti
│   ├── context/                 # Contesti React per la gestione dello stato
│   │   ├── MenuContext.tsx      # Gestisce lo stato del menu (piatti e data)
│   │   ├── MenuSenderContext.tsx  # Gestisce la logica di invio del menu
│   │   ├── SuggestionsContext.tsx  # Gestisce i suggerimenti per i piatti
│   │   └── index.tsx            # Combinazione dei contesti e implementazione del pattern Facade
│   ├── services/                # Servizi per la comunicazione con API esterne
│   │   ├── menuApi.ts           # Client API per operazioni relative al menu
│   │   └── index.ts             # Esportazione centralizzata dei servizi
│   ├── types/                   # Definizioni di tipi TypeScript
│   │   ├── global.d.ts          # Dichiarazioni globali di tipi
│   │   └── index.ts             # Esportazione centralizzata dei tipi
│   ├── utils/                   # Utility e funzioni di supporto
│   │   ├── dates.ts             # Funzioni per la manipolazione delle date (formato italiano)
│   │   ├── errors.ts            # Gestione centralizzata degli errori
│   │   ├── storage.ts           # Adapter per localStorage (pattern Adapter)
│   │   └── index.ts             # Esportazione centralizzata delle utility
│   ├── App.tsx                  # Componente principale e setup router
│   ├── index.css                # Stili globali CSS
│   └── main.tsx                 # Punto di ingresso dell'applicazione React
├── eslint.config.js             # Configurazione ESLint
├── index.html                   # HTML entry point
├── package.json                 # Dipendenze e script npm
├── tsconfig.json                # Configurazione TypeScript
├── tsconfig.node.json           # Configurazione TypeScript per Node
├── vite.config.ts               # Configurazione Vite
└── README.md                    # Questo file
```

## Relazioni tra i componenti e i file

### Flusso dati dell'applicazione

1. **Componenti UI → Context → Storage**:

   - I componenti utilizzano gli hook dei contesti (`useMenuContext`, `useSuggestionsContext`, ecc.)
   - I contesti gestiscono lo stato e la logica, utilizzando utility come `dates.ts` e `storage.ts`
   - I dati persistenti vengono salvati in localStorage tramite l'adapter in `storage.ts`

2. **Gestione delle date**:

   - `dates.ts` fornisce utilities per la conversione e formattazione delle date in formato italiano (DD/MM/YYYY)
   - Garantisce zero-padding corretto per giorni e mesi (es. "01/05/2025" invece di "1/5/2025")
   - Usate da `MenuContext` per gestire e formattare la data del menu

3. **Gestione dei suggerimenti**:

   - `ManageSuggestions.tsx` consente di visualizzare/modificare i suggerimenti
   - `SuggestionsContext.tsx` fornisce i metodi per manipolare lo stato dei suggerimenti
   - `storage.ts` salva i suggerimenti in localStorage
   - `menu-suggestions.json` in `/public/data/` fornisce i suggerimenti predefiniti

4. **Composizione del menu**:

   - `MenuForm.tsx` è il componente principale per comporre il menu
   - Utilizza `DishCategory.tsx` per ciascuna categoria di piatti
   - Si integra con `SuggestionsContext` per i suggerimenti
   - Salva i dati tramite `MenuContext`

5. **Invio del menu**:
   - `Summary.tsx` mostra un riepilogo del menu prima dell'invio
   - `SendMenu.tsx` gestisce le opzioni di invio e l'invio stesso
   - `MenuSenderContext` implementa la logica di invio (attualmente simulata)
   - `menuApi.ts` contiene la struttura per future integrazioni API reali

## Architettura e Pattern di Design

L'applicazione è stata progettata seguendo i principi delle moderne applicazioni React con TypeScript:

### Pattern di Design Implementati

- **Context API**: Gestione centralizzata dello stato dell'applicazione tramite React Context.

  - `MenuContext`: Gestisce lo stato del menu corrente (data e piatti)
  - `MenuSenderContext`: Gestisce la funzionalità di invio del menu
  - `SuggestionsContext`: Gestisce i suggerimenti per i piatti

- **Repository Pattern**: Implementato nel layer di servizi per l'accesso ai dati.

- **Adapter Pattern**: Utilizzato nel modulo `storage.ts` per fornire un'interfaccia unificata al localStorage.

- **Facade Pattern**: Implementato negli export centralizzati dei moduli per semplificare l'API esposta.

- **Provider Pattern**: Combinato con Context API per fornire lo stato ai componenti.

- **Strategy Pattern**: Utilizzato nel MenuSenderContext per implementare diverse strategie di invio.

- **Container-Presenter Pattern**: Divisione dei componenti in container (logica) e presenter (UI).

### Modifiche recenti

- **Formattazione Date**: Le date sono ora visualizzate correttamente in formato italiano (DD/MM/YYYY) con zero-padding adeguato.

  - Implementato in `utils/dates.ts` con le funzioni `toItalianFormat`, `toISOFormat` e `today`.

- **Gestione Errori**: Gli errori vengono ora visualizzati correttamente con il colore rosso (variante 'danger' di Bootstrap).

  - Migliorato in `ManageSuggestions.tsx` per avere messaggi d'errore visivamente distinti.

- **Caricamento Suggerimenti**: Corretto il percorso per caricare i suggerimenti predefiniti usando il `BASE_URL` di Vite.
  - I suggerimenti vengono ora caricati correttamente da `/public/data/menu-suggestions.json`.

## Organizzazione del Codice

- **Separazione delle Responsabilità**: Componenti, contesti, servizi, e utilità sono chiaramente separati.

- **Type Safety**: Implementazione completa di TypeScript con interfacce ben definite.

- **Modularità**: Codice organizzato in moduli coesi con responsabilità ben definite.

- **Region Tags**: Utilizzo di tag di regione (// #region) per migliorare la leggibilità e l'organizzazione del codice.

## Sviluppi futuri

- Integrazione reale con API Azure per l'invio tramite Teams/Email.
- Salvataggio storico dei menu.
- Esportazione menu in PDF/CSV.
- Gestione menu settimanali/mensili.
- Autenticazione utenti.
- Internazionalizzazione (multi-lingua).
- Test automatici.

## Autore

Applicazione sviluppata da Lorenzo Lione.
