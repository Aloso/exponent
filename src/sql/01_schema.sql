drop table if exists levels;
drop table if exists active_sessions;
drop table if exists users;

create table users (
    `user_id` integer primary key autoincrement,
    `name` text not null,
    `given_name` text,
    `family_name` text,
    `picture` text,
    `email` text not null,
    `google_id` text unique
);

create table active_sessions (
    `session_id` text primary key,
    `user_id` integer not null
);

create table levels (
    `id` integer primary key autoincrement,
    `name` text not null,
    `author_id` integer not null,
    `pos` text not null,
    `goal_number` number,
    `mode` text not null,
    `hidden` boolean not null
);