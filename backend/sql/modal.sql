create table modal
(
    id         int auto_increment
        primary key,
    text       varchar(200) not null,
    board_id   int          not null,
    like_state tinyint(1)   not null
);

create index board_id
    on modal (board_id);


ALTER TABLE modal
    MODIFY member_id int NOT NULL;
