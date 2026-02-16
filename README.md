## 🛠️ Instalacija i Pokretanje

### 1. Preduvjeti
Provjerite imate li instalirane sljedece alate:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### 2. Backend Setup
Navigirajte u mapu ``forum/backend`` i instalirajte potrebne pakete:
```bash
npm install
```

### 3. Konfiguracija baze podataka
- **Instalacija**: [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
- **Lozinka**: Prilikom instalacije postavite lozinku za korisnika ``postgres``. Tu lozinku kasnije upisati u ``.env`` datoteku.
- **Environment Variables**: Kako biste koristili PostgreSQL iz terminala, dodajte putanju ``C:\Program Files\PostgreSQL\<verzija>\bin`` u sistemsku ``PATH`` varijablu (detaljne upute pogledajte u ovom [videu](https://www.youtube.com/watch?v=D3YzLLo34ZU&t=3s)).

### 4. Kreiranje baze:
- Otvorite pgAdmin4 i kreirajte novu bazu podataka pod nazivom ``forum``
- Unutar baze izvrsite prilozenu skriptu ``script.sql`` kako biste generirali tablice.

Nakon pokretanja, mozete se prijaviti s administratorskim racunom:
- E-mail: ``admin@admin.com``
- Lozinka: ``Admin123!``
- Kao administrator imate ovlasti kreirati nove obicne korisnike

### 5. Konfiguracija okruzenja (.env)
U mapi ``forum/backend`` kreirajte datoteku ``.env`` i prilagodite sljedece parametre:
```bash
SERVER_PORT=3000
DB_USERNAME=vas_username
DB_PASSWORD=vasa_lozinka
DB_DATABASE=forum
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=vasa_tajna_sifra (moze biti bilo koji string)
```

### 6. Pokretanje backend-a
Unutar mape forum/backend pokrenite posluzitelj:
```bash
npm run dev      # Pokretanje uz nodemon
node app.js      # Alternativno pokretanje ako prva naredba ne radi
```


### 6. Postavljanje Frontenda
Navigirajte u mapu ``forum/frontend``, instalirajte ovisnosti i pokrenite Angular aplikaciju:
```bash
npm install
ng serve
```

Aplikacija ce biti dostupna na adresi ``http://localhost:4200``.
