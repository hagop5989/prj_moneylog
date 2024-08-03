use prj2;
DROP TABLE account;
CREATE TABLE account
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    memberId       INT          NOT NULL REFERENCES member (id),
    bank           VARCHAR(10)  NOT NULL,
    account_number VARCHAR(20)  NOT NULL,
    account_name   VARCHAR(20)  NOT NULL,
    account_money  INT          NOT NULL,
    etc_info       VARCHAR(100) NOT NULL
);