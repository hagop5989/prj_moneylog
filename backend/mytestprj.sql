USE mytestprj0527;

CREATE TABLE board
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    date       VARCHAR(30)   NOT NULL,
    income     INT(100)      NOT NULL,
    expense    INT(100)      NOT NULL,
    categories VARCHAR(100)  NOT NULL,
    how        VARCHAR(1000) NOT NULL
);



DELETE
FROM board
WHERE id BETWEEN 1 AND 1;

ALTER TABLE board
    MODIFY COLUMN date DATE;

SELECT *
FROM board;

ALTER TABLE board
    ADD COLUMN rowSum INT(100) NOT NULL;


DROP TABLE member;
CREATE TABLE member
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    nick_name VARCHAR(30) NOT NULL UNIQUE,
    email     VARCHAR(30) NOT NULL UNIQUE,
    password  VARCHAR(30) NOT NULL

);

UPDATE board
SET rowSum = income - expense;

# 권한 테이블
CREATE TABLE authority
(
    member_id      INT         NOT NULL REFERENCES member (id),
    authority_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (member_id, authority_name)
);

SELECT *
FROM authority;

SELECT *
FROM member;


INSERT INTO authority (member_id, authority_name)
VALUES (6, 'admin');

ALTER TABLE member
    MODIFY COLUMN password VARCHAR(100) NOT NULL;

DROP TABLE modal;
CREATE TABLE modal
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    nick_name VARCHAR(30)  NOT NULL REFERENCES member (nick_name),
    text      VARCHAR(200) NOT NULL,
    board_id  INT          NOT NULL REFERENCES board (id)
);
SELECT *
FROM modal;

ALTER TABLE modal
    ADD COLUMN like_state BOOLEAN NOT NULL;


DROP TABLE modal_like;
CREATE TABLE modal_like
(
    board_id   INT REFERENCES board (id),
    id         INT REFERENCES modal (id),
    member_id  INT REFERENCES member (id),
    like_state BOOLEAN NOT NULL,
    like_num   INT,
    PRIMARY KEY (board_id, id, member_id)
);


CREATE TABLE modal_file
(
    modal_id INT          NOT NULL REFERENCES modal (id),
    name     VARCHAR(500) NOT NULL,
    PRIMARY KEY (modal_id, name)
);

SELECT *
FROM modal_file;