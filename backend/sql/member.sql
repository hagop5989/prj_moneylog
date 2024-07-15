create table member
(
    id        int auto_increment primary key,
    nick_name varchar(30)  not null,
    email     varchar(30)  not null,
    password  varchar(100) not null,
    constraint email
        unique (email),
    constraint nick_name
        unique (nick_name)
);

