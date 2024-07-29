package com.backend.mapper.card;

import com.backend.domain.card.Card;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CardMapper {

    @Insert("""
            INSERT INTO card
            (member_id,bank, card_limit, card_name, card_payment_day,etc_info)
            VALUES
            (#{memberId},#{bank},#{cardLimit},#{cardName},#{cardPaymentDay},#{etcInfo})
            """)
    void insert(Card card);


    @Select("""
            SELECT * FROM card
            WHERE member_id = #{memberId}
            """)
    List<Card> list(Integer memberId);

    @Delete("""
            DELETE FROM card
            WHERE id = #{cardId}
            """)
    void delete(Integer cardId);


    @Select("""
            SELECT * FROM card
            WHERE id = #{cardId}
            """)
    Card selectByCardId(Integer cardId);

    @Update("""
            UPDATE card
            SET
                bank = #{bank},
                card_limit = #{cardLimit},
                card_name = #{cardName},
                card_payment_day = #{cardPaymentDay},
                etc_info = #{etcInfo}
                WHERE id = #{id}
            """)
    void update(Card card);

}
