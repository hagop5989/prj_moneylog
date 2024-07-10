package com.springmytestprj0527.domain.member;

import lombok.Data;

@Data
public class Member {
    private Integer id;
    private String nickName;
    private String email;
    private String password;
    private String authority;
}
