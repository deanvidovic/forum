CREATE TYPE USER_ROLE AS ENUM('user', 'moderator', 'admin');

CREATE TABLE USERS (
	ID SERIAL PRIMARY KEY,
	USERNAME VARCHAR(50) UNIQUE NOT NULL,
	EMAIL VARCHAR(100) UNIQUE NOT NULL,
	PASSWORD_HASH TEXT NOT NULL,
	ROLE USER_ROLE DEFAULT 'user',
	AVATAR_URL TEXT DEFAULT 'default_avatar.png',
	BIO TEXT,
	SIGNATURE VARCHAR(100),
	POST_COUNT INTEGER DEFAULT 0,
	CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	-- last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IDX_USERS_USERNAME ON USERS (USERNAME);

CREATE INDEX IDX_USERS_EMAIL ON USERS (EMAIL);

CREATE TABLE CATEGORIES (
	ID SERIAL PRIMARY KEY,
	NAME VARCHAR(50) NOT NULL,
	DESCRIPTION TEXT NOT NULL
);

INSERT INTO
	CATEGORIES (NAME, DESCRIPTION)
VALUES
	(
		'Angular',
		'Razvoj modernih SPA (Single Page Applications) koristeći Angular framework i TypeScript.'
	),
	(
		'PostgreSQL',
		'Napredno upravljanje relacijskim bazama podataka, optimizacija upita i dizajn shema.'
	),
	(
		'DevOps & Docker',
		'Kontejnerizacija aplikacija, CI/CD procesi i upravljanje infrastrukturom.'
	),
	(
		'React',
		'Izrada korisničkih sučelja pomoću komponenti i hooks arhitekture.'
	),
	(
		'Python & Data Science',
		'Analiza podataka, strojno učenje i automatizacija koristeći Python.'
	),
	(
		'Cybersecurity',
		'Sigurnost web aplikacija, penetracijsko testiranje i zaštita podataka.'
	),
	(
		'Mobile App Dev',
		'Razvoj mobilnih aplikacija za iOS i Android koristeći Flutter ili React Native.'
	),
	(
		'Cloud Computing',
		'Rad s AWS, Azure i Google Cloud platformama te serverless arhitektura.'
	),
	(
		'Java Spring Boot',
		'Izrada robusnih enterprise backend sustava baziranih na Java jeziku.'
	),
	(
		'UI/UX Design',
		'Principi dizajna sučelja, korisničko iskustvo i rad u alatima poput Figme.'
	);

CREATE TABLE THREADS (
	ID SERIAL PRIMARY KEY,
	TITLE VARCHAR(50) NOT NULL,
	CONTENT TEXT NOT NULL,
	USER_ID INTEGER REFERENCES USERS (ID) ON DELETE CASCADE,
	CATEGORY_ID INTEGER REFERENCES CATEGORIES (ID) ON DELETE CASCADE,
	CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO threads (title, content, user_id, category_id) VALUES 
('Express.js Error Handling praksa', 'Kako hendlate greške u asinkronim rutama? Koristite li express-async-handler ili vlastiti wrapper?', 4, 1),
('Angular Signals u produkciji', 'Iskustva s migracijom na signale? Primijetio sam osjetno bolji performance na velikim listama.', 4, 2);

INSERT INTO threads (title, content, user_id, category_id) VALUES 
('PostgreSQL Particioniranje tablica', 'Imam log tablicu koja raste 1GB dnevno. Je li bolje particionirati po datumu ili koristiti TimescaleDB?', 5, 3);

INSERT INTO threads (title, content, user_id, category_id) VALUES 
('CI/CD za monorepo strukturu', 'Kako podesiti GitHub Actions da pokreće testove samo za promijenjene pakete u monorepu?', 6, 4);

INSERT INTO threads (title, content, user_id, category_id) VALUES 
('Zustand vs Redux Toolkit', 'Prešao sam na Zustand i ne okrećem se više. Puno manje boilerplate koda, a radi savršeno.', 7, 5);

INSERT INTO threads (title, content, user_id, category_id) VALUES 
('FastAPI i Dependency Injection', 'Tražim najbolje prakse za organizaciju dependencies u većim projektima. Savjeti?', 8, 6);

INSERT INTO threads (title, content, user_id, category_id) VALUES 
('DDoS zaštita za male API-je', 'Je li Cloudflare free plan dovoljan za zaštitu od bazičnih botnet napada?', 9, 7);

INSERT INTO threads (title, content, user_id, category_id) VALUES 
('SwiftUI navigacija je noćna mora', 'Pokušavam složiti kompleksan flow, ali NavigationStack se ponaša jako čudno na iOS 17.', 10, 8);

INSERT INTO threads (title, content, user_id, category_id) VALUES 
('Serverless hladni startovi', 'Kako smanjiti cold start na AWS Lambda funkcijama koje koriste Javu? Trenutno traje i do 3 sekunde.', 11, 9);

INSERT INTO threads (title, content, user_id, category_id) VALUES 
('Dizajn sustavi u Figmi', 'Kako hendlate "spacing tokens" u Figmi da budu konzistentni s Tailwind konfiguracijom?', 12, 11);

INSERT INTO threads (title, content, user_id, category_id) VALUES 
('Virtual Threads u Javi 21', 'Jeste li primijetili poboljšanje u throughputu pri radu s blokirajućim I/O operacijama?', 12, 10);


CREATE TABLE COMMENTS (
	ID SERIAL PRIMARY KEY,
	CONTENT TEXT NOT NULL,
	USER_ID INTEGER REFERENCES USERS (ID) ON DELETE CASCADE,
	THREAD_ID INTEGER REFERENCES THREADS (ID) ON DELETE CASCADE,
	CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LIKES (
	ID SERIAL PRIMARY KEY,
	USER_ID INTEGER REFERENCES USERS (ID) ON DELETE CASCADE,
	THREAD_ID INTEGER REFERENCES THREADS (ID) ON DELETE CASCADE,
	CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);