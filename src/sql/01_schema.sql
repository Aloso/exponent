drop table if exists level_votes;
drop table if exists levels;
drop table if exists active_sessions;
drop table if exists users;

create table users (
    `user_id` integer primary key autoincrement,
    `display_name` text not null,
    `name` text not null,
    `family_name` text,
    `picture` text,
    `email` text not null,
    `google_id` text unique,
    `reported` integer default 0,
    `notice` text
);
create index idx_users_google_id on users (google_id);

create table active_sessions (
    `session_id` text primary key,
    `user_id` integer not null
);

create table levels (
    `level_id` integer primary key autoincrement,
    `name` text not null,
    `desc` text,
    `author_id` integer not null,
    `created` integer not null,
    `votes` integer not null,
    `difficulty` integer,
    `data` text not null
);
create index idx_levels_author on levels (author_id);

create table level_votes (
    `level_id` integer not null,
    `user_id` integer not null,
    `vote` integer not null,
    `created` integer not null
);
create index idx_levels_votes_user on level_votes (user_id);

create table user_reports (
    `user_id` integer not null,
    `reporter_id` integer not null,
    `created` integer not null,
    `reason` text
);
create index idx_user_reports_user on user_reports (user_id);
