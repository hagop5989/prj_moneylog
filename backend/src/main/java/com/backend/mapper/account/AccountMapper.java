package com.backend.mapper.account;

import com.backend.domain.account.Account;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AccountMapper {

    @Insert("""
            INSERT INTO account
                (bank,memberId, account_number, account_name, account_money, etc_info)
            VALUES
                (#{account.bank},#{memberId}, #{account.accountNumber}, #{account.accountName}, #{account.accountMoney}, #{account.etcInfo})
            """)
    void insert(Account account, Integer memberId);

    @Select("""
            SELECT * FROM account
            WHERE memberId = #{memberId}
            """)
    List<Account> list(Integer memberId);


    @Select("""
            SELECT * FROM account
            WHERE id = #{accountId}
            """)
    Account select(Integer accountId);

    @Update("""
            UPDATE account
            SET bank = #{bank}, account_number = #{accountNumber}, account_name = #{accountName}, account_money = #{accountMoney}, etc_info = #{etcInfo}
            WHERE id = #{id}
            """)
    void update(Account account);

    @Delete("""
            DELETE FROM account
            WHERE id = #{id}
            """)
    void delete(Integer id);

}
