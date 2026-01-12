--
-- PostgreSQL database dump
--

\restrict 0g2Q3fobFfP5vLmVB5tlWjsSuwbjNm8VeRRyMHbc23WhXDA2Vl7UBbCytC8Tykv

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: comments_mediatype_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.comments_mediatype_enum AS ENUM (
    'IMAGE',
    'VIDEO'
);


--
-- Name: routes_grade_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.routes_grade_enum AS ENUM (
    'Débutant', --niveau vert clair
    'Débutant+', --niveau vert foncé
    'Intermédiaire-', --niveau bleu clair
    'Intermédiaire', --niveau bleu foncé
    'Intermédiaire+', --niveau violet
    'Confirmé-', --niveau rose
    'Confirmé', --niveau rouge
    'Confirmé+', --niveau orange
    'Avancé', --niveau jaune
    'Avancé+', --niveau blanc
    'Expert', --niveau gris
    'Expert+' --niveau noir
);


--
-- Name: routes_holdcolorcategory_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.routes_holdcolorcategory_enum AS ENUM (
    'red',
    'blue',
    'green',
    'yellow',
    'orange',
    'purple',
    'pink',
    'black',
    'white',
    'grey'
);


--
-- Name: routes_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.routes_status_enum AS ENUM (
    'PENDING',
    'ACTIVE',
    'ARCHIVED'
);


--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.users_role_enum AS ENUM (
    'CLIMBER',
    'OPENER',
    'ADMIN'
);


--
-- Name: validations_attemptstatus_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.validations_attemptstatus_enum AS ENUM (
    'WORKING',
    'ATTEMPT_2',
    'ATTEMPT_3',
    'ATTEMPT_5',
    'COMPLETED',
    'FLASHED',
    'FAVORITE'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analyses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analyses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "videoId" uuid NOT NULL,
    "routeId" uuid NOT NULL,
    "poseData" jsonb NOT NULL,
    "globalScore" double precision NOT NULL,
    "detailScores" jsonb NOT NULL,
    suggestions jsonb NOT NULL,
    highlights jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    content text NOT NULL,
    "userId" uuid NOT NULL,
    "routeId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "mediaUrl" character varying,
    "mediaType" public.comments_mediatype_enum
);


--
-- Name: gym_layouts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gym_layouts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "svgContent" text NOT NULL,
    "sectorMappings" jsonb,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: routes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.routes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    sector character varying NOT NULL,
    description text,
    tips text,
    "openerId" uuid NOT NULL,
    "mainPhoto" character varying NOT NULL,
    "openingVideo" character varying,
    status public.routes_status_enum DEFAULT 'PENDING'::public.routes_status_enum NOT NULL,
    "openedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "closedAt" timestamp without time zone,
    "holdMapping" jsonb,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "routeTypes" jsonb,
    "holdColorHex" character varying NOT NULL,
    "holdColorCategory" public.routes_holdcolorcategory_enum NOT NULL,
    grade public.routes_grade_enum NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    name character varying NOT NULL,
    role public.users_role_enum DEFAULT 'CLIMBER'::public.users_role_enum NOT NULL,
    avatar character varying,
    bio text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "firstName" character varying,
    "lastName" character varying,
    age integer,
    height integer,
    wingspan integer,
    "profilePhoto" character varying,
    "additionalPhotos" jsonb
);


--
-- Name: validations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.validations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    "routeId" uuid NOT NULL,
    "validatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "personalNote" text,
    "attemptStatus" public.validations_attemptstatus_enum DEFAULT 'COMPLETED'::public.validations_attemptstatus_enum NOT NULL
);


--
-- Name: videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.videos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    url character varying NOT NULL,
    "thumbnailUrl" character varying NOT NULL,
    "userId" uuid NOT NULL,
    "routeId" uuid NOT NULL,
    "uploadedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: routes PK_76100511cdfa1d013c859f01d8b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT "PK_76100511cdfa1d013c859f01d8b" PRIMARY KEY (id);


--
-- Name: comments PK_8bf68bc960f2b69e818bdb90dcb; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY (id);


--
-- Name: analyses PK_91421900ca225ed9865d016a940; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT "PK_91421900ca225ed9865d016a940" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: validations PK_d523bd8c24ea354126be8cff546; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validations
    ADD CONSTRAINT "PK_d523bd8c24ea354126be8cff546" PRIMARY KEY (id);


--
-- Name: gym_layouts PK_e1f9a86dd9802219fc0839b9556; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gym_layouts
    ADD CONSTRAINT "PK_e1f9a86dd9802219fc0839b9556" PRIMARY KEY (id);


--
-- Name: videos PK_e4c86c0cf95aff16e9fb8220f6b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY (id);


--
-- Name: analyses UQ_5632bbc577d651044db46bb60f3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT "UQ_5632bbc577d651044db46bb60f3" UNIQUE ("videoId");


--
-- Name: gym_layouts UQ_6c17786330fa10db8279ff6e15b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gym_layouts
    ADD CONSTRAINT "UQ_6c17786330fa10db8279ff6e15b" UNIQUE (name);


--
-- Name: validations UQ_7e3825db2333695a867214fbf53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validations
    ADD CONSTRAINT "UQ_7e3825db2333695a867214fbf53" UNIQUE ("userId", "routeId");


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: validations FK_16bb5b642d7774d1d4b45825df3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validations
    ADD CONSTRAINT "FK_16bb5b642d7774d1d4b45825df3" FOREIGN KEY ("routeId") REFERENCES public.routes(id);


--
-- Name: validations FK_3a7e5a4eeb3ca2b3b88316b0782; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validations
    ADD CONSTRAINT "FK_3a7e5a4eeb3ca2b3b88316b0782" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: analyses FK_5632bbc577d651044db46bb60f3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT "FK_5632bbc577d651044db46bb60f3" FOREIGN KEY ("videoId") REFERENCES public.videos(id);


--
-- Name: routes FK_6e1558441adfdd403c967fa567a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT "FK_6e1558441adfdd403c967fa567a" FOREIGN KEY ("openerId") REFERENCES public.users(id);


--
-- Name: comments FK_7b7c41ff1ee9d45ef9af6be4544; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "FK_7b7c41ff1ee9d45ef9af6be4544" FOREIGN KEY ("routeId") REFERENCES public.routes(id);


--
-- Name: comments FK_7e8d7c49f218ebb14314fdb3749; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: videos FK_9003d36fcc646f797c42074d82b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT "FK_9003d36fcc646f797c42074d82b" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: analyses FK_f7b2139adf701dae89bccc10d88; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT "FK_f7b2139adf701dae89bccc10d88" FOREIGN KEY ("routeId") REFERENCES public.routes(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 0g2Q3fobFfP5vLmVB5tlWjsSuwbjNm8VeRRyMHbc23WhXDA2Vl7UBbCytC8Tykv

