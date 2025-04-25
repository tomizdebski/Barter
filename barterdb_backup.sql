--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12 (Debian 15.12-1.pgdg120+1)
-- Dumped by pg_dump version 16.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: BarterStatus; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."BarterStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED'
);


ALTER TYPE public."BarterStatus" OWNER TO admin;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Barters; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Barters" (
    id integer NOT NULL,
    "lessonId" integer NOT NULL,
    "offeredLessonId" integer NOT NULL,
    "proposerId" integer NOT NULL,
    message text,
    status public."BarterStatus" DEFAULT 'PENDING'::public."BarterStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Barters" OWNER TO admin;

--
-- Name: Barters_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Barters_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Barters_id_seq" OWNER TO admin;

--
-- Name: Barters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Barters_id_seq" OWNED BY public."Barters".id;


--
-- Name: Categories; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Categories" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Categories" OWNER TO admin;

--
-- Name: Categories_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Categories_id_seq" OWNER TO admin;

--
-- Name: Categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Categories_id_seq" OWNED BY public."Categories".id;


--
-- Name: Lessons; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Lessons" (
    id integer NOT NULL,
    name text NOT NULL,
    content text NOT NULL,
    photo text,
    video text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "instructorId" integer NOT NULL,
    "studentId" integer,
    "categoryId" integer NOT NULL,
    "localizationId" integer
);


ALTER TABLE public."Lessons" OWNER TO admin;

--
-- Name: Lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Lessons_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Lessons_id_seq" OWNER TO admin;

--
-- Name: Lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Lessons_id_seq" OWNED BY public."Lessons".id;


--
-- Name: Localizations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Localizations" (
    id integer NOT NULL,
    city text NOT NULL,
    street text NOT NULL,
    zip text NOT NULL,
    province text NOT NULL
);


ALTER TABLE public."Localizations" OWNER TO admin;

--
-- Name: Localizations_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Localizations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Localizations_id_seq" OWNER TO admin;

--
-- Name: Localizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Localizations_id_seq" OWNED BY public."Localizations".id;


--
-- Name: Scores; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Scores" (
    id integer NOT NULL,
    value integer NOT NULL,
    "lessonId" integer NOT NULL
);


ALTER TABLE public."Scores" OWNER TO admin;

--
-- Name: Scores_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Scores_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Scores_id_seq" OWNER TO admin;

--
-- Name: Scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Scores_id_seq" OWNED BY public."Scores".id;


--
-- Name: Skills; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Skills" (
    id integer NOT NULL,
    name text NOT NULL,
    level integer NOT NULL
);


ALTER TABLE public."Skills" OWNER TO admin;

--
-- Name: Skills_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Skills_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Skills_id_seq" OWNER TO admin;

--
-- Name: Skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Skills_id_seq" OWNED BY public."Skills".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    "firstName" text,
    "lastName" text,
    password text NOT NULL,
    email text NOT NULL,
    avatar text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Users" OWNER TO admin;

--
-- Name: UsersSkills; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."UsersSkills" (
    "userId" integer NOT NULL,
    "skillId" integer NOT NULL
);


ALTER TABLE public."UsersSkills" OWNER TO admin;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO admin;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO admin;

--
-- Name: Barters id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Barters" ALTER COLUMN id SET DEFAULT nextval('public."Barters_id_seq"'::regclass);


--
-- Name: Categories id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Categories" ALTER COLUMN id SET DEFAULT nextval('public."Categories_id_seq"'::regclass);


--
-- Name: Lessons id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Lessons" ALTER COLUMN id SET DEFAULT nextval('public."Lessons_id_seq"'::regclass);


--
-- Name: Localizations id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Localizations" ALTER COLUMN id SET DEFAULT nextval('public."Localizations_id_seq"'::regclass);


--
-- Name: Scores id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Scores" ALTER COLUMN id SET DEFAULT nextval('public."Scores_id_seq"'::regclass);


--
-- Name: Skills id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Skills" ALTER COLUMN id SET DEFAULT nextval('public."Skills_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Barters; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Barters" (id, "lessonId", "offeredLessonId", "proposerId", message, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Categories" (id, name) FROM stdin;
1	Python
2	Linux
3	JS
4	Network
5	HTML
6	GIT
7	DevOps
8	DB
9	CSS
10	Cloud
11	Agile
12	Testing
13	Regex
14	Security
15	Sql
\.


--
-- Data for Name: Lessons; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Lessons" (id, name, content, photo, video, "createdAt", "instructorId", "studentId", "categoryId", "localizationId") FROM stdin;
12	sadasd	sdadasdASDASDD	uploads/photo-1744481560811-532381159.jpeg	uploads/video-1744481560813-411284157.webm	2025-04-12 18:12:40.82	2	\N	9	\N
13	lekcja  gita	lekcjaxsaxsax	uploads/photo-1744485375097-71610657.svg	uploads/video-1744485375100-949817933.webm	2025-04-12 19:16:15.121	2	\N	6	\N
14	Nauczę Pythona	Mam duże doświadczenie z Pythonem. Naucze wszystkiego co tżeba	uploads/photo-1745326938438-242800463.png	uploads/video-1745326938542-146992284.webm	2025-04-22 13:02:18.59	2	\N	1	\N
15	JS za Python	Lekcja Js za Python	uploads/photo-1745328071404-17214803.webp	uploads/video-1745328071407-500354209.webm	2025-04-22 13:21:11.449	4	\N	1	\N
\.


--
-- Data for Name: Localizations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Localizations" (id, city, street, zip, province) FROM stdin;
\.


--
-- Data for Name: Scores; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Scores" (id, value, "lessonId") FROM stdin;
\.


--
-- Data for Name: Skills; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Skills" (id, name, level) FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Users" (id, "firstName", "lastName", password, email, avatar, role, "createdAt") FROM stdin;
7	t1	t2	$2b$10$FDJB2PHu77LZT18sX11uE.6NsdN8t7Sz5IdaSs8naOvcIW1Gnkihq	t1@ap.pl	uploads/1744231675261-Screenshot_20250407_215846-1.png	USER	2025-04-09 20:47:55.412
5	piotr	nowak	$2b$10$jN.vUg6oxn8obKV5UMmbNOTIZsGEP4UmRDlmZo7FSRN7Y9XxIQs3q	piotrnowk@gmail.com	uploads/1744230596219-Screenshot_20250407_215846.png	USER	2025-04-09 20:29:56.363
4	tom	tom	$2b$10$2Gkt6.LK8ZpPdgmUky9BQ.6APLAG.p1LHvCauMUa22WK2cTmqqzXS	2tom@tom.pl	uploads/1744230079497-Screenshot_20250407_215846.png	USER	2025-04-09 20:21:19.633
3	test	test	$2b$10$8OBfE70XMG7.5OCAJ5h7D.NSPJhWK.G/upoGIIMUJddj538AvYW0.	test@tom.pl	uploads/1744229547290-Screenshot_20250407_215846-1.png	USER	2025-04-09 20:12:27.393
6	dad	tomas	$2b$10$w0phXU3mofz9oE0x.sJ0MelU.6FHZ8INT6xgDvxnibAz.n0l.4Zz2	tomas@wp.pl	uploads/1744231115228-Screenshot_20250407_215846-1.png	USER	2025-04-09 20:38:35.374
9	111	111	$2b$10$bPqlnf.L06kN7QAVg.oK..9R0tr/PI7QhOpoj8WVjHLc3/ivXkT5i	111@wp.pl	uploads/1744318998894-comment.svg	USER	2025-04-10 21:03:18.97
10	Tomcio	Paluch	$2b$10$6e7WLdaWaIWaDSpUEboJ3.EJ4NQd0sTCCJSfBrmV2hkXJsDE5R9T.	tomciop@wp.pl	uploads/1744320528789-avatar.jpg	USER	2025-04-10 21:28:48.867
11	tom	lasttom	$2b$10$aAHrWfgOKp8PgC3Wlm29heu8rWX133ERtab147od6kcOlxbby0hKe	lasttom@gmail.com	uploads/1744481158941-avatar.png	USER	2025-04-12 18:05:59.017
12	tom	tom	$2b$10$Mgdes78eVzXihN7NS8rnsuHfm2d/OOgwOxEZSA2GPvMt5VLAHd33C	tm@wp.pl	uploads/1745260089344-avatar.png	USER	2025-04-21 18:28:09.59
13	tomass	tomsss	$2b$10$2H2xzBCRlfPqRkN9MNcvieu1Gwo/yowp/VF7eQCcy79v6Zj/efEoS	tm@wp.pls	uploads/1745260423981-avatar.png	USER	2025-04-21 18:33:44.157
2	pio	pio	$2b$10$bNPkydfcD0un/2Qkx0Be0uLITe/ak6yIM6gvBS9txUyKoTNWa/z9e	tom@tom.pl	uploads/1744229194811-Screenshot_20250407_215846-1.png	USER	2025-04-09 20:06:34.962
14	Tomek	Izdebski	$2b$10$0vt3Cp521koF/2LCzJ8HTO9nm3.1UiqWQjqE/rNyebCXQggWhQ.4u	afd@fdsdhcdfghdxh.com	\N	USER	2025-04-23 19:13:29.945
\.


--
-- Data for Name: UsersSkills; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."UsersSkills" ("userId", "skillId") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
88a4f210-9759-4f3b-9781-4d0797cfe931	8cde6e4555b41ab028caea6c8e4e7d32098e1eed49b9fd686b17840dc7322f06	2025-03-08 16:27:24.966809+00	20250308162724_init	\N	\N	2025-03-08 16:27:24.902438+00	1
\.


--
-- Name: Barters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Barters_id_seq"', 1, false);


--
-- Name: Categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Categories_id_seq"', 16, true);


--
-- Name: Lessons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Lessons_id_seq"', 15, true);


--
-- Name: Localizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Localizations_id_seq"', 1, false);


--
-- Name: Scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Scores_id_seq"', 1, false);


--
-- Name: Skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Skills_id_seq"', 1, false);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Users_id_seq"', 14, true);


--
-- Name: Barters Barters_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Barters"
    ADD CONSTRAINT "Barters_pkey" PRIMARY KEY (id);


--
-- Name: Categories Categories_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY (id);


--
-- Name: Lessons Lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_pkey" PRIMARY KEY (id);


--
-- Name: Localizations Localizations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Localizations"
    ADD CONSTRAINT "Localizations_pkey" PRIMARY KEY (id);


--
-- Name: Scores Scores_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Scores"
    ADD CONSTRAINT "Scores_pkey" PRIMARY KEY (id);


--
-- Name: Skills Skills_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Skills"
    ADD CONSTRAINT "Skills_pkey" PRIMARY KEY (id);


--
-- Name: UsersSkills UsersSkills_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UsersSkills"
    ADD CONSTRAINT "UsersSkills_pkey" PRIMARY KEY ("userId", "skillId");


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Categories_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "Categories_name_key" ON public."Categories" USING btree (name);


--
-- Name: Lessons_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "Lessons_name_key" ON public."Lessons" USING btree (name);


--
-- Name: Users_email_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "Users_email_key" ON public."Users" USING btree (email);


--
-- Name: Barters Barters_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Barters"
    ADD CONSTRAINT "Barters_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lessons"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Barters Barters_offeredLessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Barters"
    ADD CONSTRAINT "Barters_offeredLessonId_fkey" FOREIGN KEY ("offeredLessonId") REFERENCES public."Lessons"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Barters Barters_proposerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Barters"
    ADD CONSTRAINT "Barters_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lessons Lessons_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lessons Lessons_instructorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lessons Lessons_localizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_localizationId_fkey" FOREIGN KEY ("localizationId") REFERENCES public."Localizations"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Lessons Lessons_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Scores Scores_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Scores"
    ADD CONSTRAINT "Scores_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lessons"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UsersSkills UsersSkills_skillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UsersSkills"
    ADD CONSTRAINT "UsersSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES public."Skills"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UsersSkills UsersSkills_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UsersSkills"
    ADD CONSTRAINT "UsersSkills_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

