USE mytestprj0527;

DROP TABLE card;
CREATE TABLE card
(
    id               INT AUTO_INCREMENT PRIMARY KEY,
    member_id        INT          NOT NULL REFERENCES member (id),
    bank             VARCHAR(20)  NOT NULL,
    card_limit       INT          NOT NULL,
    card_name        VARCHAR(30)  NOT NULL,
    card_payment_day INT          NOT NULL,
    etc_info         VARCHAR(100) NOT NULL DEFAULT ''
);

TRUNCATE card;