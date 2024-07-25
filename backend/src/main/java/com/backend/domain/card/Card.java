package com.backend.domain.card;

import lombok.Data;

@Data
public class Card {
    private Integer id;
    private Integer memberId; // fk(member.id)
    private String bank;
    private Integer cardLimit;
    private String cardName;
    private Integer cardPaymentDay;
    private String etcInfo;
}
