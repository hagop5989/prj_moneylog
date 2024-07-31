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

    public Card selectByCardId(Integer cardId) {
        return mapper.selectByCardId(cardId);
    }

    public void delete(List<Integer> cardIds) {
        cardIds.forEach((id) -> {
                    if (selectByCardId(id) != null) {
                        mapper.delete(id);
                    }
                }
        );
    }

    public Card select(Integer cardId) {
        return mapper.selectByCardId(cardId);
    }

    public void update(Card card) {
        mapper.update(card);

    }
}
