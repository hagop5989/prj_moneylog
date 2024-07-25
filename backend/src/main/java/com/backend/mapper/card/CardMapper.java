package com.backend.mapper.card;

import com.backend.domain.card.Card;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

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

}
