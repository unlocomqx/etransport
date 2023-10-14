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
VALUES ('0', 'PYwPZC1G0epbM1G6fF1OX', 35.76777, 10.811203, '2023-10-14 11:08:51.995+01', 'train');
INSERT INTO public.locations (id, id_user, latitude, longitude, "timestamp", mode)
VALUES ('1', 'bjsDohw2POydmkKlk5PIF', 35.767895, 10.805522, '2023-10-14 09:51:38.112+01', 'bus');
INSERT INTO public.locations (id, id_user, latitude, longitude, "timestamp", mode)
VALUES ('2', 'CWSl4XeOMDfb-kN_HzufG', 35.756725, 10.810583, '2023-10-14 10:32:19.316+01', 'train');
INSERT INTO public.locations (id, id_user, latitude, longitude, "timestamp", mode)
VALUES ('3', 'TSeT5nsFi1jJmvOnjYTYv', 35.771465, 10.812426, '2023-10-14 11:16:16.048+01', 'train');
INSERT INTO public.locations (id, id_user, latitude, longitude, "timestamp", mode)
VALUES ('4', 'sVXKYl_VNEYCtIsfjxlzL', 35.762337, 10.808539, '2023-10-14 10:07:53.582+01', 'bus');
INSERT INTO public.locations (id, id_user, latitude, longitude, "timestamp", mode)
VALUES ('5', 'J3Tsdktl8lcSMrzO0Y4_B', 35.768673, 10.812278, '2023-10-14 10:05:39.96+01', 'bus');
INSERT INTO public.locations (id, id_user, latitude, longitude, "timestamp", mode)
VALUES ('6', 'bdSGuRDbQh1Q2F0BNO-HA', 35.760235, 10.803655, '2023-10-14 10:25:46.06+01', 'bus');
INSERT INTO public.locations (id, id_user, latitude, longitude, "timestamp", mode)
VALUES ('7', 'rp9FgFW4_TN2FWWVnJqo_', 35.76175, 10.812157, '2023-10-14 10:18:03.532+01', 'train');
INSERT INTO public.locations (id, id_user, latitude, longitude, "timestamp", mode)
VALUES ('8', 'ppW-f2rGTEjrbl142i6fi', 35.76832, 10.810262, '2023-10-14 10:16:40.357+01', 'bus');
INSERT INTO public.locations (id, id_user, latitude, longitude, "timestamp", mode)
VALUES ('9', 'x5Uics4122zaDAuVw2cUd', 35.765285, 10.809438, '2023-10-14 11:28:32.349+01', 'train');

INSERT INTO public.users_reputation (id_user, reputation, create_date, update_date)
VALUES ('new-user', 1, '2023-10-14 16:42:52.431837 +00:00', '2023-10-14 16:42:52.431837 +00:00');


--
-- PostgreSQL database dump complete
--

