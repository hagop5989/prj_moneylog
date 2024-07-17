package com.backend.mapper.board;

import com.backend.domain.board.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO board
            (member_id, date, income, expense, categories, how)
            VALUES(
                #{board.memberId},
                #{board.date},
                 #{board.income},
                 #{board.expense},
                 #{categoriesToString},
                 #{board.how}
                 )
            """)
    int addRow(Board board, String categoriesToString);

    @Select("""
            SELECT b.*, b.categories AS stringCategories
            FROM board b
            ORDER BY date DESC
            """)
    List<Board> findAllBoardList();

    @Delete("""
            DELETE FROM board
            WHERE id=#{id}
            """)
    int deleteRowById(Integer id);

    @Update("""
            UPDATE board
            SET
                date=#{board.date},
                income=#{board.income},
                expense=#{board.expense},
                how=#{board.how},
                categories = #{categoriesToString}
                WHERE id=#{board.id}
            """)
    int updateRow(Board board, String categoriesToString);
}
