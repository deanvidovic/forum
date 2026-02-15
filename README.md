## 🛠️ Instalacija i Pokretanje

### 1. Preduvjeti
Provjerite imate li instalirane:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### 2. Backend Setup
Na putanji ``forum/backend``:
```bash
npm install
```


### 3. Kreirajte bazu
- [pgAdmin4](https://www.pgadmin.org/download/)

Instalirajte pgAdmin4 s navedenog izvora.
Nakon instalacije kreirajte bazu naziva ``forum`` te pokrenete ``export.sql``.

Jedini user u tom export-u je admin: 
- email: ``admin@admin.com``
- password: ``Admin123!``
- nakon login-a s admin account-om imate mogucnost kreiranja obicnog user-a

### 4. kreirajte .env datoteku
```bash
SERVER_PORT=3000
DB_USERNAME=vas_username
DB_PASSWORD=vasa_lozinka
DB_DATABASE=forum
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=vasa_tajna_sifra (moze biti bilo koji string)
```

### 5. Pokrenite backend
```bash
npm run dev (ako je podesen nodemon)
node app.js (ako prva komanda ne radi)
```


### 6. Frontend setup
Na putanji ``forum/frontend``:
```bash
npm install
ng serve
```
