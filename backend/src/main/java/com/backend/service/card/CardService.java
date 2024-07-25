package com.backend.service.card;

import com.backend.domain.card.Card;
import com.backend.mapper.card.CardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class CardService {
    private final CardMapper mapper;

    public void insert(Card card, Integer memberId) {
        card.setMemberId(memberId);
        mapper.insert(card);
    }

    public List<Card> list(Integer memberId) {
        return mapper.list(memberId);
    }
}
