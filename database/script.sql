CREATE TYPE public.user_role AS ENUM ('user', 'admin');

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role public.user_role DEFAULT 'user',
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE public.threads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    thread_id INTEGER REFERENCES public.threads(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    thread_id INTEGER REFERENCES public.threads(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.users (id, username, email, password_hash, role)
VALUES (
    1,
    'admin',
    'admin@admin.com',
    '$2a$12$QmoF03s3GfX67YUASlQ7JOAVhpxv3GpPGV1/AkcZrz4QhDG9l3suy',
    'admin'
);


INSERT INTO public.categories (id, name, description) VALUES
(1, 'Express.js', 'Programiranje web aplikacija u Express.js'),
(2, 'Angular', 'Razvoj modernih SPA aplikacija koristeći Angular i TypeScript'),
(3, 'PostgreSQL', 'Napredno upravljanje relacijskim bazama podataka'),
(4, 'DevOps & Docker', 'Kontejnerizacija, CI/CD i infrastruktura'),
(5, 'React', 'Izrada korisničkih sučelja pomoću komponenti i hookova'),
(6, 'Python & Data Science', 'Analiza podataka i strojno učenje'),
(7, 'Cybersecurity', 'Sigurnost web aplikacija i zaštita podataka'),
(8, 'Mobile App Dev', 'Razvoj mobilnih aplikacija (Flutter, React Native)'),
(9, 'Cloud Computing', 'AWS, Azure, Google Cloud i serverless'),
(10, 'Java Spring Boot', 'Enterprise backend sustavi u Javi'),
(11, 'UI/UX Design', 'Dizajn sučelja i korisničko iskustvo');


SELECT setval('public.users_id_seq', 1, true);
SELECT setval('public.categories_id_seq', 11, true);
