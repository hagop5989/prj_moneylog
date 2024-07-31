package com.backend.service.account;

import com.backend.domain.account.Account;
import com.backend.mapper.account.AccountMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class AccountService {
    private final AccountMapper mapper;


    public void insert(Account account, Integer memberId) {
        mapper.insert(account, memberId);
    }

    public List<Account> list(Integer memberId) {
        return mapper.list(memberId);

    }

    public Account select(Integer accountId) {
        return mapper.select(accountId);
    }


    public void update(Account account) {
        mapper.update(account);
    }

    public void delete(List<Integer> accountIds) {
        accountIds.forEach((id) -> {
                    if (select(id) != null) {
                        mapper.delete(id);
                    }
                }
        );

    }
}
