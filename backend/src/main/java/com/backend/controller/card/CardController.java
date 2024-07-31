package com.backend.controller.card;

import com.backend.config.AuthId;
import com.backend.domain.card.Card;
import com.backend.service.card.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/card")
public class CardController {
    private final CardService service;

    @PostMapping("")
    public void insert(Card card, @RequestParam(value = "files", required = false) MultipartFile file, @AuthId Integer memberId) {
        System.out.println("file = " + file);
        service.insert(card, memberId);
    }

    @GetMapping("")
    public List<Card> list(@AuthId Integer memberId) {
        List<Card> list = service.list(memberId);
        return list;
    }

    @GetMapping("select")
    public Card select(@RequestParam Integer cardId) {
        return service.select(cardId);
    }

    @PostMapping("delete")
    public void delete(@RequestBody List<Integer> cardIds) {
        service.delete(cardIds);
    }

    @PutMapping
    public void update(@RequestBody Card card) {
        service.update(card);
    }
}
