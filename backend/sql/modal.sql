create table modal
(
    id         int auto_increment primary key,
    nick_name  varchar(30)  not null,
    text       varchar(200) not null,
    board_id   int          not null,
    like_state tinyint(1)   not null,
    constraint modal_ibfk_1
        foreign key (nick_name) references member (nick_name),
    constraint modal_ibfk_2
        foreign key (board_id) references board (id)
);

create index board_id
    on modal (board_id);

create index nick_name
    on modal (nick_name);

