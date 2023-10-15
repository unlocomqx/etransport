--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Homebrew)
-- Dumped by pg_dump version 14.8 (Homebrew)

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
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.locations (id, id_user, latitude, longitude, "timestamp", mode)
VALUES ('1', 'my-user', 35.7746, 10.823, '2023-10-15 10:28:32+01', 'bus');
INSERT INTO public.locations (id, id_user, latitude, longitude, "timestamp", mode)
VALUES ('2', 'my-user', 35.774532, 10.821254, '2023-10-15 10:30:04+01', 'bus');


--
-- Data for Name: reactions; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: users_reputation; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- PostgreSQL database dump complete
--

