create table board
(
    id         int auto_increment
        primary key,
    date       varchar(30)   not null,
    income     int(100)      not null,
    expense    int(100)      not null,
    categories varchar(100)  not null,
    how        varchar(1000) not null,
    member_id  int           not null,
    constraint board_ibfk_1
        foreign key (member_id) references member (id)
);

create index member_id
    on board (member_id);

