package com.backend.domain.account;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@EqualsAndHashCode
public class Account {
    private Integer id;
    private Integer memberId;
    private String bank;
    private String accountNumber;
    private String accountName;
    private String accountMoney;
    private String etcInfo;
}
