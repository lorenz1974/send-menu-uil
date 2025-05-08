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
- **React Router DOM** (v7)
- **React Bootstrap** e **Bootstrap** (v5)
- **Vite** (per sviluppo e build)
- **Axios** (per chiamate HTTP, pronto per integrazione API)
- **ESLint** (linting del codice)
- **localStorage** (persistenza dati lato client)

## Struttura del progetto

```
send-menu-uil/
├── public/
├── src/
│   ├── components/
│   │   ├── DishCategory.jsx
│   │   ├── ManageSuggestions.jsx
│   │   ├── MenuForm.jsx
│   │   ├── SendMenu.jsx
│   │   └── Summary.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Installazione e avvio

1. **Clona il repository**

   ```bash
   git clone <URL_DEL_REPO>
   cd send-menu-uil
   ```

2. **Installa le dipendenze**

   ```bash
   npm install
   ```

3. **Avvia l'applicazione in sviluppo**

   ```bash
   npm run dev
   ```

   L'app sarà disponibile su `http://localhost:5173` (o porta indicata da Vite).

4. **Build di produzione**

   ```bash
   npm run build
   ```

5. **Lint del codice**
   ```bash
   npm run lint
   ```

## Modalità d'uso

1. **Componi il menu**: Inserisci la data, aggiungi piatti nelle varie categorie. I piatti nuovi vengono salvati come suggerimenti.
2. **Gestisci suggerimenti**: Accedi alla pagina "Gestisci Suggerimenti" per eliminare piatti o categorie.
3. **Riepilogo**: Visualizza il menu completo e torna indietro per modifiche se necessario.
4. **Invio**: Scegli se inviare via Teams, Email o entrambi. L'invio è simulato (integrazione API pronta).
5. **Nuovo menu**: Dopo l'invio puoi iniziare una nuova composizione.

## Possibili sviluppi futuri

- Integrazione reale con API Azure per l'invio tramite Teams/Email.
- Salvataggio storico dei menu.
- Esportazione menu in PDF/CSV.
- Gestione menu settimanali/mensili.
- Autenticazione utenti.
- Internazionalizzazione (multi-lingua).
- Test automatici.

## Autore

Applicazione sviluppata da Lorenzo Lione.

---

**Nota:** Per pubblicare la modifica su GitHub, esegui questi comandi dalla root del progetto:

```bash
git add README.md
git commit -m "Aggiorna README con descrizione dettagliata in italiano"
git push
```
