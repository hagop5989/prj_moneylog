package com.backend.controller.account;

import com.backend.config.AuthId;
import com.backend.domain.account.Account;
import com.backend.service.account.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/account")
@Slf4j
public class AccountController {
    private final AccountService service;

    @PostMapping
    public void insert(@RequestBody Account account, @AuthId Integer memberId) {
        service.insert(account, memberId);
    }

    @GetMapping
    public List<Account> list(@AuthId Integer memberId) {
        List<Account> list = service.list(memberId);
        return list;
    }

    @GetMapping("select")
    public Account select(@RequestParam Integer accountId) {
        return service.select(accountId);
    }

    @PutMapping
    public void update(@RequestBody Account account) {
        service.update(account);
    }

    @PostMapping("delete")
    public void delete(@RequestBody List<Integer> accountIds) {
        service.delete(accountIds);
    }
}

