-- Adminer 4.7.2 PostgreSQL dump

DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS users_id_seq;
DROP SEQUENCE IF EXISTS matches_id_seq;
DROP SEQUENCE IF EXISTS likes_id_seq;
DROP SEQUENCE IF EXISTS notifications_id_seq;
DROP SEQUENCE IF EXISTS blocks_id_seq;
DROP SEQUENCE IF EXISTS reports_id_seq;
CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 501 CACHE 1;
CREATE SEQUENCE matches_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;
CREATE SEQUENCE likes_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;
CREATE SEQUENCE blocks_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;
CREATE SEQUENCE reports_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;
CREATE SEQUENCE messages_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('users_id_seq'),
    "firstname" character varying,
    "lastname" character varying,
    "gender" smallint DEFAULT '1',
    "age" character varying,
    "avatar" character varying [],
    "tags" character varying [],
    "login" character varying,
    "email" character varying,
    "password" character varying,
    "perimeter" smallint DEFAULT '100',
    "minage" smallint DEFAULT '18',
    "maxage" smallint DEFAULT '100',
    "orientation" smallint DEFAULT '3',
    "city" character varying DEFAULT null,
    "latitude" double precision DEFAULT null,
    "longitude" double precision DEFAULT null,
    "is_complete" boolean DEFAULT false,
    "score" smallint DEFAULT '500',
    "bio" character varying,
    "logged" boolean DEFAULT false,
    "lastconnection" character varying,
    "key" character varying,
    "auth" boolean DEFAULT false,
    "palette" character varying DEFAULT '#ffffff',
    CONSTRAINT "users_id" PRIMARY KEY ("id")
) WITH (oids = false);

DROP TABLE IF EXISTS "matches";
CREATE TABLE "public"."matches" (
    "id" integer DEFAULT nextval('matches_id_seq'),
    "id_user1" integer,
    "id_user2" integer,
    "timestamp" date,
    CONSTRAINT "matches_id" PRIMARY KEY ("id")
) WITH (oids = false);

DROP TABLE IF EXISTS "likes";
CREATE TABLE "public"."likes" (
    "id" integer DEFAULT nextval('likes_id_seq'),
    "liked_user_id" smallint,
    "interested" boolean,
    "match_id" smallint,
    "user_id" smallint,
    CONSTRAINT "likes_id" PRIMARY KEY ("id"),
    CONSTRAINT "likes_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) NOT DEFERRABLE,
    CONSTRAINT "likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) NOT DEFERRABLE
) WITH (oids = false);

DROP TABLE IF EXISTS "notifications";
CREATE TABLE "public"."notifications" (
    "uuid" uuid DEFAULT uuid_generate_v4 (),
    "type" smallint,
    "visited_id" integer,
    "visitor_firstname" character varying,
    "unread" boolean DEFAULT true,
    "timestamp" character varying,
    CONSTRAINT "notifications_id" PRIMARY KEY ("uuid")
) WITH (oids = false);

DROP TABLE IF EXISTS "blocks";
CREATE TABLE "public"."blocks" (
    "id" integer DEFAULT nextval('blocks_id_seq'),
    "blocker_id" integer,
    "blocked_id" integer,
    CONSTRAINT "blocks_id" PRIMARY KEY ("id")
) WITH (oids = false);

DROP TABLE IF EXISTS "reports";
CREATE TABLE "public"."reports" (
    "id" integer DEFAULT nextval('reports_id_seq'),
    "reporter_id" integer,
    "reported_id" integer,
    CONSTRAINT "reports_id" PRIMARY KEY ("id")
) WITH (oids = false);

DROP TABLE IF EXISTS "messages";
CREATE TABLE "public"."messages" (
    "id" integer DEFAULT nextval('messages_id_seq'),
    "sender" integer,
    "receiver" integer,
    "match_id" integer,
    "content" character varying,
    "timestamp" timestamp,
    "unread" boolean DEFAULT true,
    CONSTRAINT "messages_id" PRIMARY KEY ("id"),
    CONSTRAINT "messages_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) NOT DEFERRABLE
) WITH (oids = false);
