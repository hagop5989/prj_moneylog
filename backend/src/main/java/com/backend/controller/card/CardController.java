package com.backend.controller.card;

import com.backend.config.AuthId;
import com.backend.domain.card.Card;
import com.backend.service.card.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/card")
public class CardController {
    private final CardService service;

    @PostMapping("")
    public void insert(@RequestBody Card card, @AuthId Integer memberId) {
        System.out.println("memberId = " + memberId);
        service.insert(card, memberId);
    }

    @GetMapping("")
    public List<Card> list(@AuthId Integer memberId) {
        List<Card> list = service.list(memberId);
        System.out.println("list = " + list);
        return list;
    }
}
